import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useStore, PortfolioData } from '../context/store';
import { PreviewFrame } from '../components/PreviewFrame';
import { DragDropSections } from '../components/DragDropSections';
import { HealthScore } from '../components/HealthScore';
import { generatePortfolioZip } from '../utils/zipGenerator';
import { 
  Sparkles, UploadCloud, Plus, Trash2, Download, AlertCircle,
  Github, Layout, Paintbrush, Globe, Info, Settings2, FileCode
} from 'lucide-react';

const asText = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

const asArray = <T,>(value: unknown): T[] => (Array.isArray(value) ? value.filter(Boolean) as T[] : []);

const toSlug = (value: string) =>
  (value || 'my-portfolio')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'my-portfolio';

const normalizeUrl = (value: unknown, host: string) => {
  const text = asText(value);
  if (!text) return '';
  if (text.startsWith('http')) return text;
  if (host && text.includes(host)) return `https://${text.replace(/^\/+/, '')}`;
  return text;
};

const normalizeParsedPortfolio = (parsedData: any, current: PortfolioData): Partial<PortfolioData> => {
  const personalInfo = {
    fullName: asText(parsedData?.personalInfo?.fullName).replace(/^your name$/i, ''),
    email: asText(parsedData?.personalInfo?.email),
    phone: asText(parsedData?.personalInfo?.phone),
    location: asText(parsedData?.personalInfo?.location),
    bio: asText(parsedData?.personalInfo?.bio),
    avatarUrl: asText(parsedData?.personalInfo?.avatarUrl),
  };

  const education = asArray<any>(parsedData?.education)
    .map((item) => ({
      degree: asText(item?.degree),
      college: asText(item?.college).replace(/^institution(?: name)?$/i, ''),
      year: asText(item?.year),
      grade: asText(item?.grade),
    }))
    .map((item) => ({
      ...item,
      college: item.college === item.degree ? '' : item.college,
    }))
    .filter((item) => (item.degree || item.college || item.year || item.grade) && !/^ba?d$/i.test(item.degree));

  const experience = asArray<any>(parsedData?.experience)
    .map((item) => ({
      company: asText(item?.company).replace(/^company(?: name)?$/i, ''),
      role: asText(item?.role).replace(/^professional role$/i, ''),
      duration: asText(item?.duration),
      description: asText(item?.description).replace(/^responsibilities and achievements\.?$/i, ''),
    }))
    .filter((item) => item.company || item.role || item.duration || item.description);

  const projects = asArray<any>(parsedData?.projects)
    .map((item) => ({
      title: asText(item?.title),
      description: asText(item?.description).replace(/^project built with modern technologies\.?$/i, ''),
      technologies: asArray<string>(item?.technologies).map((tech) => asText(tech)).filter(Boolean),
      githubLink: normalizeUrl(item?.githubLink, 'github.com'),
      liveLink: normalizeUrl(item?.liveLink, ''),
    }))
    .filter((item) => item.title || item.description || item.technologies.length);

  const skills = asArray<any>(parsedData?.skills)
    .map((item) => {
      if (typeof item === 'string') {
        return { name: item.trim(), category: 'technical' as const, level: 4 };
      }
      return {
        name: asText(item?.name),
        category: item?.category === 'soft' ? 'soft' as const : 'technical' as const,
        level: Number.isFinite(Number(item?.level)) ? Math.min(5, Math.max(1, Number(item.level))) : 4,
      };
    })
    .filter((item) => item.name);

  const certifications = asArray<any>(parsedData?.certifications)
    .map((item) => ({
      name: asText(item?.name),
      issuer: asText(item?.issuer),
      date: asText(item?.date),
      url: normalizeUrl(item?.url, ''),
    }))
    .filter((item) => item.name || item.issuer);

  const achievements = asArray<any>(parsedData?.achievements)
    .map((item) => ({
      title: asText(item?.title),
      description: asText(item?.description),
      date: asText(item?.date),
    }))
    .filter((item) => item.title || item.description);

  const fullName = personalInfo.fullName || 'My Portfolio';
  const skillKeywords = skills.map((skill) => skill.name).slice(0, 8);

  return {
    title: personalInfo.fullName ? `${personalInfo.fullName} | Portfolio` : current.title,
    slug: toSlug(fullName),
    templateId: current.templateId,
    personalInfo,
    socials: {
      github: normalizeUrl(parsedData?.socials?.github, 'github.com'),
      linkedin: normalizeUrl(parsedData?.socials?.linkedin, 'linkedin.com'),
      portfolio: normalizeUrl(parsedData?.socials?.portfolio, ''),
      twitter: normalizeUrl(parsedData?.socials?.twitter, 'twitter.com'),
    },
    education,
    experience,
    projects,
    skills,
    certifications,
    achievements,
    themeConfig: current.themeConfig,
    sectionsOrder: current.sectionsOrder,
    seoConfig: {
      metaTitle: personalInfo.fullName ? `${personalInfo.fullName} - Portfolio` : current.seoConfig.metaTitle,
      metaDescription: personalInfo.bio || current.seoConfig.metaDescription,
      keywords: [...new Set(['portfolio', 'resume', ...skillKeywords])],
    },
  };
};

export const PortfolioBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { portfolio, setPortfolio, setSectionsOrder } = useStore();

  const [activeTab, setActiveTab] = React.useState<string>('upload');
  const [file, setFile] = React.useState<File | null>(null);
  const [parsing, setParsing] = React.useState(false);
  const [aiLoading, setAiLoading] = React.useState(false);
  const [githubUsername, setGithubUsername] = React.useState('');
  const [githubSyncing, setGithubSyncing] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [downloading, setDownloading] = React.useState(false);

  // Tabs layout configuration
  const tabs = [
    { id: 'upload', label: 'Resume Import', icon: <UploadCloud size={14} /> },
    { id: 'details', label: 'Basic Info', icon: <Info size={14} /> },
    { id: 'experience', label: 'Experience', icon: <Settings2 size={14} /> },
    { id: 'projects', label: 'Projects', icon: <FileCode size={14} /> },
    { id: 'skills', label: 'Skills', icon: <Paintbrush size={14} /> },
    { id: 'design', label: 'Theme & Layout', icon: <Layout size={14} /> },
    { id: 'seo', label: 'SEO Engine', icon: <Globe size={14} /> },
  ];

  // Show a message timer helper
  const showToast = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // 1. Resume Parser Call
  const handleUploadResume = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setParsing(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await axios.post('/api/resume/parse', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const parsedData = response.data?.data;
      if (parsedData) {
        const normalizedPortfolio = normalizeParsedPortfolio(parsedData, portfolio);
        setPortfolio(normalizedPortfolio);
        showToast('success', `Resume parsed! Found ${normalizedPortfolio.skills?.length || 0} skills, ${normalizedPortfolio.projects?.length || 0} projects, ${normalizedPortfolio.experience?.length || 0} jobs.`);
        setActiveTab('details');
      } else {
        throw new Error('Empty response from server');
      }
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || 'Failed to reach server';
      showToast('error', `Parse failed: ${msg}. Make sure the backend is running on port 5000.`);
    } finally {
      setParsing(false);
    }
  };

  // 2. Gemini AI Enhancers
  const handleAiImproveBio = async () => {
    if (!portfolio.personalInfo.bio) return;
    setAiLoading(true);

    try {
      const response = await axios.post('/api/portfolios/ai/improve-bio', {
        bio: portfolio.personalInfo.bio,
        targetRole: portfolio.personalInfo.fullName ? `${portfolio.personalInfo.fullName} targeting Developer Role` : 'Developer'
      });
      const improvedBio = response.data?.bio;
      if (improvedBio) {
        setPortfolio({ personalInfo: { ...portfolio.personalInfo, bio: improvedBio } });
        showToast('success', 'Bio enhanced using Google Gemini AI!');
      }
    } catch (err) {
      showToast('error', 'AI service unavailable. Please refine manually.');
    } finally {
      setAiLoading(false);
    }
  };

  // 3. GitHub Integration Sync
  const handleGithubSync = async () => {
    if (!githubUsername) return;
    setGithubSyncing(true);

    // Support extracting username from full URL or custom format
    let cleanedUsername = githubUsername.trim();
    if (cleanedUsername.includes('github.com/')) {
      const parts = cleanedUsername.split('github.com/');
      if (parts.length > 1) {
        cleanedUsername = parts[1].split('/')[0].split('?')[0];
      }
    } else if (cleanedUsername.startsWith('http')) {
      const parts = cleanedUsername.replace(/\/$/, '').split('/');
      cleanedUsername = parts[parts.length - 1];
    }

    try {
      const response = await axios.get(`/api/portfolios/github/repos/${cleanedUsername}`);
      const repos = response.data;
      if (repos && repos.length > 0) {
        // Map top 3 repos and append them to existing projects list
        const githubProjects = repos.slice(0, 3).map((repo: any) => ({
          title: repo.title,
          description: repo.description || 'Public GitHub repository.',
          technologies: repo.technologies || [],
          githubLink: repo.githubLink || `https://github.com/${cleanedUsername}/${repo.title}`,
          liveLink: repo.liveLink || ''
        }));

        setPortfolio({ projects: [...portfolio.projects, ...githubProjects] });
        showToast('success', `Synced ${githubProjects.length} public projects from GitHub!`);
        setGithubUsername('');
      } else {
        showToast('error', 'No repositories found for this user.');
      }
    } catch (err) {
      showToast('error', 'Failed to fetch repositories. Verify username and try again.');
    } finally {
      setGithubSyncing(false);
    }
  };

  // 4. Exporter compilation ZIP
  const handleExportZip = async () => {
    setDownloading(true);
    try {
      const blob = await generatePortfolioZip(portfolio);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${portfolio.slug || 'my'}-portfolio.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      showToast('success', 'Portfolio exported! Extract and run "npm install && npm run dev".');
    } catch (err) {
      showToast('error', 'Failed to generate package. Try again.');
    } finally {
      setDownloading(false);
    }
  };

  // Helper arrays update functions
  const addExperience = () => {
    const list = [...portfolio.experience, { company: '', role: '', duration: '', description: '' }];
    setPortfolio({ experience: list });
  };
  const removeExperience = (index: number) => {
    const list = portfolio.experience.filter((_, i) => i !== index);
    setPortfolio({ experience: list });
  };

  const addProject = () => {
    const list = [...portfolio.projects, { title: '', description: '', technologies: [], githubLink: '', liveLink: '' }];
    setPortfolio({ projects: list });
  };
  const removeProject = (index: number) => {
    const list = portfolio.projects.filter((_, i) => i !== index);
    setPortfolio({ projects: list });
  };

  const addSkill = () => {
    const list = [...portfolio.skills, { name: '', category: 'technical' as const, level: 4 }];
    setPortfolio({ skills: list });
  };
  const removeSkill = (index: number) => {
    const list = portfolio.skills.filter((_, i) => i !== index);
    setPortfolio({ skills: list });
  };

  return (
    <div className="bg-[#030712] min-h-screen text-gray-100 flex flex-col md:flex-row h-screen overflow-hidden">
      
      {/* Toast Alert */}
      {message && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl border flex items-center space-x-3 shadow-2xl max-w-sm ${
          message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
        }`}>
          <AlertCircle size={16} className="shrink-0" />
          <span className="text-xs font-semibold leading-relaxed">{message.text}</span>
        </div>
      )}

      {/* Editor Control Column */}
      <div className="w-full md:w-5/12 h-1/2 md:h-full flex flex-col border-r border-gray-900 bg-gray-950/20">
        {/* Navigation / Header toolbar */}
        <div className="p-4 border-b border-gray-900 flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <span className="text-lg font-black bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">PF Builder</span>
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => navigate('/templates')}
              className="text-xs bg-gray-900 border border-gray-800 hover:bg-gray-800 px-3 py-1.5 rounded-lg transition"
            >
              Gallery
            </button>
            <button
              type="button"
              disabled={downloading}
              onClick={handleExportZip}
              className="text-xs bg-amber-400 text-black hover:bg-amber-300 font-bold px-3 py-1.5 rounded-lg flex items-center transition"
            >
              <Download size={12} className="mr-1.5" /> {downloading ? 'Packing...' : 'Export ZIP'}
            </button>
          </div>
        </div>

        {/* Health Score Overview Panel */}
        <div className="p-4 border-b border-gray-900/40 shrink-0">
          <HealthScore data={portfolio} />
        </div>

        {/* Multi-Tabs bar */}
        <div className="flex border-b border-gray-900 overflow-x-auto shrink-0 bg-gray-950/60 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-xs font-semibold whitespace-nowrap flex items-center space-x-1.5 border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-amber-400 text-white bg-gray-900/10'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab.icon} <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Forms Container */}
        <div className="flex-grow overflow-y-auto p-5 space-y-6">
          {activeTab === 'upload' && (
            <form onSubmit={handleUploadResume} className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-sm font-bold text-gray-200">Import Resume File</h3>
                <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
                  Upload a PDF or DOCX resume to instantly parse education, skills, and projects using Gemini.
                </p>
              </div>

              {/* File Dropzone */}
              <div className="border-2 border-dashed border-gray-800 hover:border-amber-500/50 rounded-2xl p-8 flex flex-col items-center justify-center bg-gray-950/40 cursor-pointer transition">
                <input
                  type="file"
                  id="resume-upload"
                  accept=".pdf,.docx,.doc"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <label htmlFor="resume-upload" className="flex flex-col items-center cursor-pointer space-y-3 w-full">
                  <UploadCloud size={32} className="text-gray-500" />
                  <span className="text-xs font-semibold text-gray-300">
                    {file ? file.name : 'Choose PDF or DOCX resume'}
                  </span>
                  <span className="text-[10px] text-gray-500">Max size 10MB</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={parsing || !file}
                className="w-full bg-amber-400 text-black py-3 rounded-xl font-bold text-xs hover:bg-amber-300 disabled:opacity-50 transition flex justify-center items-center"
              >
                {parsing ? 'Extracting details...' : 'Parse Resume'}
              </button>
            </form>
          )}

          {activeTab === 'details' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-400 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={portfolio.personalInfo.fullName}
                    onChange={(e) => setPortfolio({ personalInfo: { ...portfolio.personalInfo, fullName: e.target.value } })}
                    className="w-full bg-gray-900 border border-gray-850 rounded-lg p-2.5 outline-none text-white focus:border-amber-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 block mb-1">Slug URL</label>
                  <input
                    type="text"
                    value={portfolio.slug}
                    onChange={(e) => setPortfolio({ slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                    className="w-full bg-gray-900 border border-gray-850 rounded-lg p-2.5 outline-none text-white focus:border-amber-500 font-mono"
                    placeholder="john-doe"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-400 block mb-1">Email</label>
                  <input
                    type="email"
                    value={portfolio.personalInfo.email}
                    onChange={(e) => setPortfolio({ personalInfo: { ...portfolio.personalInfo, email: e.target.value } })}
                    className="w-full bg-gray-900 border border-gray-850 rounded-lg p-2.5 outline-none text-white focus:border-amber-500"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 block mb-1">Location</label>
                  <input
                    type="text"
                    value={portfolio.personalInfo.location}
                    onChange={(e) => setPortfolio({ personalInfo: { ...portfolio.personalInfo, location: e.target.value } })}
                    className="w-full bg-gray-900 border border-gray-850 rounded-lg p-2.5 outline-none text-white focus:border-amber-500"
                    placeholder="San Francisco, CA"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-bold text-gray-400">Professional Bio</label>
                  <button
                    type="button"
                    onClick={handleAiImproveBio}
                    disabled={aiLoading || !portfolio.personalInfo.bio}
                    className="text-[10px] text-amber-400 font-bold hover:underline flex items-center space-x-1"
                  >
                    <Sparkles size={10} /> <span>{aiLoading ? 'Enhancing...' : 'Enhance with AI'}</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={portfolio.personalInfo.bio}
                  onChange={(e) => setPortfolio({ personalInfo: { ...portfolio.personalInfo, bio: e.target.value } })}
                  className="w-full bg-gray-900 border border-gray-850 rounded-lg p-2.5 outline-none text-white focus:border-amber-500 leading-relaxed"
                  placeholder="Tell recruiters about your expertise..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-gray-900 pt-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-400 block mb-1">GitHub URL</label>
                  <input
                    type="text"
                    value={portfolio.socials.github}
                    onChange={(e) => setPortfolio({ socials: { ...portfolio.socials, github: e.target.value } })}
                    className="w-full bg-gray-900 border border-gray-850 rounded-lg p-2.5 outline-none text-white focus:border-amber-500 font-mono"
                    placeholder="https://github.com/username"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 block mb-1">LinkedIn URL</label>
                  <input
                    type="text"
                    value={portfolio.socials.linkedin}
                    onChange={(e) => setPortfolio({ socials: { ...portfolio.socials, linkedin: e.target.value } })}
                    className="w-full bg-gray-900 border border-gray-850 rounded-lg p-2.5 outline-none text-white focus:border-amber-500 font-mono"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Experience List</h3>
                <button
                  type="button"
                  onClick={addExperience}
                  className="text-[10px] bg-gray-900 hover:bg-gray-800 border border-gray-800 text-white font-bold px-2.5 py-1.5 rounded flex items-center space-x-1 transition"
                >
                  <Plus size={10} /> <span>Add</span>
                </button>
              </div>

              {portfolio.experience.map((exp, idx) => (
                <div key={idx} className="bg-gray-950/40 p-4 border border-gray-900 rounded-xl space-y-3 relative text-xs">
                  <button
                    type="button"
                    onClick={() => removeExperience(idx)}
                    className="text-gray-500 hover:text-rose-400 absolute top-3 right-3 p-1"
                  >
                    <Trash2 size={12} />
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 block mb-0.5">Role / Title</label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => {
                          const list = [...portfolio.experience];
                          list[idx].role = e.target.value;
                          setPortfolio({ experience: list });
                        }}
                        className="w-full bg-gray-900 border border-gray-850 rounded p-2 outline-none text-white focus:border-amber-500"
                        placeholder="Software Engineer"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 block mb-0.5">Company</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => {
                          const list = [...portfolio.experience];
                          list[idx].company = e.target.value;
                          setPortfolio({ experience: list });
                        }}
                        className="w-full bg-gray-900 border border-gray-850 rounded p-2 outline-none text-white focus:border-amber-500"
                        placeholder="Acme Corp"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 block mb-0.5">Duration</label>
                      <input
                        type="text"
                        value={exp.duration}
                        onChange={(e) => {
                          const list = [...portfolio.experience];
                          list[idx].duration = e.target.value;
                          setPortfolio({ experience: list });
                        }}
                        className="w-full bg-gray-900 border border-gray-850 rounded p-2 outline-none text-white focus:border-amber-500"
                        placeholder="Jun 2023 - Present"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-500 block mb-0.5">Description</label>
                    <textarea
                      rows={2}
                      value={exp.description}
                      onChange={(e) => {
                        const list = [...portfolio.experience];
                        list[idx].description = e.target.value;
                        setPortfolio({ experience: list });
                      }}
                      className="w-full bg-gray-900 border border-gray-850 rounded p-2 outline-none text-white focus:border-amber-500 leading-normal"
                      placeholder="Duties, outcomes, and tech stacks used..."
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-6">
              {/* GitHub Fetch Sync Box */}
              <div className="bg-gray-950 p-4 border border-gray-900 rounded-xl space-y-3 text-xs">
                <label className="text-xs font-bold text-gray-200 flex items-center"><Github size={14} className="mr-1.5 text-gray-400" /> Sync from GitHub</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                    placeholder="Enter GitHub username..."
                    className="flex-grow bg-gray-900 border border-gray-850 rounded-lg px-3 py-2 outline-none text-xs text-white focus:border-amber-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleGithubSync}
                    disabled={githubSyncing || !githubUsername}
                    className="bg-gray-900 hover:bg-gray-850 border border-gray-800 text-white font-bold px-4 rounded-lg text-xs shrink-0 transition"
                  >
                    {githubSyncing ? 'Syncing...' : 'Sync'}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Projects List</h3>
                <button
                  type="button"
                  onClick={addProject}
                  className="text-[10px] bg-gray-900 hover:bg-gray-800 border border-gray-800 text-white font-bold px-2.5 py-1.5 rounded flex items-center space-x-1 transition"
                >
                  <Plus size={10} /> <span>Add</span>
                </button>
              </div>

              {portfolio.projects.map((proj, idx) => (
                <div key={idx} className="bg-gray-950/40 p-4 border border-gray-900 rounded-xl space-y-3 relative text-xs">
                  <button
                    type="button"
                    onClick={() => removeProject(idx)}
                    className="text-gray-500 hover:text-rose-400 absolute top-3 right-3 p-1"
                  >
                    <Trash2 size={12} />
                  </button>

                  <div>
                    <label className="text-[10px] font-bold text-gray-500 block mb-0.5">Project Title</label>
                    <input
                      type="text"
                      value={proj.title}
                      onChange={(e) => {
                        const list = [...portfolio.projects];
                        list[idx].title = e.target.value;
                        setPortfolio({ projects: list });
                      }}
                      className="w-full bg-gray-900 border border-gray-850 rounded p-2 outline-none text-white focus:border-amber-500"
                      placeholder="System Automation Tool"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-500 block mb-0.5">Description</label>
                    <textarea
                      rows={2}
                      value={proj.description}
                      onChange={(e) => {
                        const list = [...portfolio.projects];
                        list[idx].description = e.target.value;
                        setPortfolio({ projects: list });
                      }}
                      className="w-full bg-gray-900 border border-gray-850 rounded p-2 outline-none text-white focus:border-amber-500 leading-normal"
                      placeholder="Explain features and results achieved..."
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-500 block mb-0.5">Technologies (comma separated)</label>
                    <input
                      type="text"
                      value={proj.technologies.join(', ')}
                      onChange={(e) => {
                        const list = [...portfolio.projects];
                        list[idx].technologies = e.target.value.split(',').map((t) => t.trim());
                        setPortfolio({ projects: list });
                      }}
                      className="w-full bg-gray-900 border border-gray-850 rounded p-2 outline-none text-white focus:border-amber-500 font-mono"
                      placeholder="React, TypeScript, TailwindCSS"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Acquired Skills</h3>
                <button
                  type="button"
                  onClick={addSkill}
                  className="text-[10px] bg-gray-900 hover:bg-gray-800 border border-gray-800 text-white font-bold px-2.5 py-1.5 rounded flex items-center space-x-1 transition"
                >
                  <Plus size={10} /> <span>Add</span>
                </button>
              </div>

              {portfolio.skills.map((skill, idx) => (
                <div key={idx} className="bg-gray-950/40 p-4 border border-gray-900 rounded-xl flex items-center justify-between gap-4 relative text-xs">
                  <div className="flex-grow grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => {
                        const list = [...portfolio.skills];
                        list[idx].name = e.target.value;
                        setPortfolio({ skills: list });
                      }}
                      className="bg-gray-900 border border-gray-850 rounded p-2 outline-none text-white focus:border-amber-500"
                      placeholder="Python"
                    />
                    <select
                      value={skill.category}
                      onChange={(e) => {
                        const list = [...portfolio.skills];
                        list[idx].category = e.target.value as 'technical' | 'soft';
                        setPortfolio({ skills: list });
                      }}
                      className="bg-gray-900 border border-gray-850 rounded p-2 outline-none text-white focus:border-amber-500"
                    >
                      <option value="technical">Technical</option>
                      <option value="soft">Soft Skill</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <select
                      value={skill.level}
                      onChange={(e) => {
                        const list = [...portfolio.skills];
                        list[idx].level = parseInt(e.target.value);
                        setPortfolio({ skills: list });
                      }}
                      className="bg-gray-900 border border-gray-850 rounded p-2 outline-none text-white focus:border-amber-500 font-mono"
                    >
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <option key={lvl} value={lvl}>{lvl}/5</option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => removeSkill(idx)}
                      className="text-gray-500 hover:text-rose-400 p-1.5"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'design' && (
            <div className="space-y-6 text-xs">

              {/* Template Switcher */}
              <div className="bg-gray-950/40 p-4 border border-gray-900 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-gray-200">Active Template</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'viveportfolio', label: 'VivePortfolio', tag: 'Clean' },
                    { id: 'codecraft', label: 'CodeCraft', tag: 'Terminal' },
                    { id: 'devhub', label: 'DevHub', tag: 'Modern' },
                    { id: 'stackfolio', label: 'Stackfolio', tag: 'Minimal' },
                    { id: 'aurora', label: 'Aurora', tag: 'Designer' },
                    { id: 'neo', label: 'Neo', tag: 'Brutalist' },
                    { id: 'campus', label: 'Campus', tag: 'Student' },
                    { id: 'executive', label: 'Executive', tag: 'Corporate' },
                    { id: 'freshgrad', label: 'FreshGrad', tag: 'Graduate' },
                    { id: 'freelancerpro', label: 'Freelancer', tag: 'Freelance' },
                  ].map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => setPortfolio({ templateId: tpl.id })}
                      className={`px-3 py-2 rounded-lg border text-left transition ${
                        portfolio.templateId === tpl.id
                          ? 'border-amber-400 bg-amber-400/10 text-amber-300'
                          : 'border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-700 hover:text-gray-200'
                      }`}
                    >
                      <span className="block font-bold text-[11px]">{tpl.label}</span>
                      <span className="text-[9px] opacity-60">{tpl.tag}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4 bg-gray-950/40 p-4 border border-gray-900 rounded-xl">
                <h4 className="text-xs font-bold text-gray-200">Color Palette</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 block mb-1">Primary Color</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={portfolio.themeConfig.primaryColor}
                        onChange={(e) => setPortfolio({ themeConfig: { ...portfolio.themeConfig, primaryColor: e.target.value } })}
                        className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                      />
                      <span className="font-mono text-gray-400">{portfolio.themeConfig.primaryColor}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 block mb-1">Secondary Color</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={portfolio.themeConfig.secondaryColor}
                        onChange={(e) => setPortfolio({ themeConfig: { ...portfolio.themeConfig, secondaryColor: e.target.value } })}
                        className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                      />
                      <span className="font-mono text-gray-400">{portfolio.themeConfig.secondaryColor}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 block mb-1">Background Color</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={portfolio.themeConfig.backgroundColor}
                        onChange={(e) => setPortfolio({ themeConfig: { ...portfolio.themeConfig, backgroundColor: e.target.value } })}
                        className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                      />
                      <span className="font-mono text-gray-400">{portfolio.themeConfig.backgroundColor}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Typography */}
              <div className="grid grid-cols-2 gap-4 bg-gray-950/40 p-4 border border-gray-900 rounded-xl">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block mb-1">Font Family</label>
                  <select
                    value={portfolio.themeConfig.fontFamily}
                    onChange={(e) => setPortfolio({ themeConfig: { ...portfolio.themeConfig, fontFamily: e.target.value } })}
                    className="w-full bg-gray-900 border border-gray-850 rounded p-2 outline-none text-white text-xs focus:border-amber-500"
                  >
                    <option value="sans">Inter Sans-Serif</option>
                    <option value="mono">JetBrains Mono</option>
                    <option value="display">Outfit Display</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block mb-1">Border Radius</label>
                  <select
                    value={portfolio.themeConfig.borderRadius}
                    onChange={(e) => setPortfolio({ themeConfig: { ...portfolio.themeConfig, borderRadius: e.target.value } })}
                    className="w-full bg-gray-900 border border-gray-850 rounded p-2 outline-none text-white text-xs focus:border-amber-500"
                  >
                    <option value="0px">Sharp (0px)</option>
                    <option value="4px">Compact (4px)</option>
                    <option value="8px">Standard (8px)</option>
                    <option value="16px">Rounded (16px)</option>
                  </select>
                </div>
              </div>

              {/* Drag Drop Section reordering */}
              <div className="bg-gray-950/40 p-4 border border-gray-900 rounded-xl">
                <DragDropSections 
                  sections={portfolio.sectionsOrder} 
                  onChange={(order) => setSectionsOrder(order)} 
                />
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="text-[11px] font-bold text-gray-400 block mb-1">SEO Page Title</label>
                <input
                  type="text"
                  value={portfolio.seoConfig.metaTitle}
                  onChange={(e) => setPortfolio({ seoConfig: { ...portfolio.seoConfig, metaTitle: e.target.value } })}
                  className="w-full bg-gray-900 border border-gray-850 rounded-lg p-2.5 outline-none text-white focus:border-amber-500"
                  placeholder="John Doe - Senior Full Stack Engineer Portfolio"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 block mb-1">SEO Description</label>
                <textarea
                  rows={3}
                  value={portfolio.seoConfig.metaDescription}
                  onChange={(e) => setPortfolio({ seoConfig: { ...portfolio.seoConfig, metaDescription: e.target.value } })}
                  className="w-full bg-gray-900 border border-gray-850 rounded-lg p-2.5 outline-none text-white focus:border-amber-500 leading-normal"
                  placeholder="Welcome to my software engineering resume website containing active projects..."
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 block mb-1">SEO Keywords (comma separated)</label>
                <input
                  type="text"
                  value={portfolio.seoConfig.keywords.join(', ')}
                  onChange={(e) => setPortfolio({ seoConfig: { ...portfolio.seoConfig, keywords: e.target.value.split(',').map((k) => k.trim()) } })}
                  className="w-full bg-gray-900 border border-gray-850 rounded-lg p-2.5 outline-none text-white focus:border-amber-500 font-mono"
                  placeholder="react, portfolio, nextjs, engineer"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Live Preview Pane */}
      <div className="w-full md:w-7/12 h-1/2 md:h-full p-4 bg-gray-950 flex flex-col overflow-hidden">
        <PreviewFrame data={portfolio} />
      </div>
    </div>
  );
};
