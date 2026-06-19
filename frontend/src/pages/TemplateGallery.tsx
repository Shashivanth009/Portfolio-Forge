import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/store';
import { TEMPLATE_REGISTRY } from '../templates/registry';
import { Search, Filter, X } from 'lucide-react';
import { PreviewFrame } from '../components/PreviewFrame';

export const TemplateGallery: React.FC = () => {
  const navigate = useNavigate();
  const setPortfolio = useStore((state) => state.setPortfolio);

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('ALL');
  const [selectedStyle, setSelectedStyle] = React.useState<string>('ALL');
  const [previewTemplateId, setPreviewTemplateId] = React.useState<string | null>(null);

  const templates = Object.values(TEMPLATE_REGISTRY);

  // Filter systems
  const filteredTemplates = templates.filter((tpl) => {
    const matchesSearch =
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'ALL' || tpl.category === selectedCategory;

    const matchesStyle =
      selectedStyle === 'ALL' || tpl.style === selectedStyle;

    return matchesSearch && matchesCategory && matchesStyle;
  });

  const categories = [
    { value: 'ALL', label: 'All Categories' },
    { value: 'DEVELOPER', label: 'Developers' },
    { value: 'CYBERSECURITY', label: 'Cybersecurity' },
    { value: 'STUDENT', label: 'Students' },
    { value: 'DESIGNER', label: 'Designers' },
    { value: 'CORPORATE', label: 'Corporate' },
    { value: 'FREELANCER', label: 'Freelancers' },
  ];

  const styles = ['ALL', 'MINIMAL', 'MODERN', 'DARK', 'LIGHT', 'PREMIUM'];

  // Handle template selection
  const handleSelectTemplate = (id: string) => {
    setPortfolio({ templateId: id });
    navigate('/builder');
  };

  // Mock data for previewing template in modal
  const mockPreviewData = {
    title: 'Preview Portfolio',
    slug: 'preview',
    templateId: previewTemplateId || 'codecraft',
    personalInfo: {
      fullName: 'Jane Doe',
      email: 'jane.doe@example.com',
      phone: '+1 (555) 019-2834',
      location: 'New York, NY',
      bio: 'Innovative software architect with 5+ years of experience designing robust distributed engines and reactive user dashboards.',
      avatarUrl: '',
    },
    socials: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      portfolio: '',
      twitter: '',
    },
    education: [
      { degree: 'M.S. in Computer Science', college: 'State University', year: '2022', grade: '3.9' }
    ],
    experience: [
      { company: 'Tech Solutions Inc.', role: 'Senior Systems Architect', duration: '2022 - Present', description: 'Spearheaded migration to microservices, boosting throughput by 40%.' }
    ],
    projects: [
      { title: 'DataFlow Pipeline', description: 'Streamlined real-time ingestion parser converting terabytes of logging structures.', technologies: ['Go', 'Kafka', 'InfluxDB'], githubLink: 'https://github.com', liveLink: '' }
    ],
    skills: [
      { name: 'Go / TypeScript', category: 'technical' as const, level: 5 },
      { name: 'System Design', category: 'technical' as const, level: 5 }
    ],
    certifications: [],
    achievements: [],
    themeConfig: {
      primaryColor: '#3b82f6',
      secondaryColor: '#10b981',
      accentColor: '#fbbf24',
      backgroundColor: '#0f172a',
      fontFamily: 'sans',
      borderRadius: '8px',
    },
    sectionsOrder: ['hero', 'about', 'skills', 'projects', 'experience', 'contact'],
    seoConfig: { metaTitle: '', metaDescription: '', keywords: [] }
  };

  const getGradientForCategory = (cat: string) => {
    if (cat === 'CYBERSECURITY') return 'from-red-950 via-slate-900 to-black border-red-900/40';
    if (cat === 'DESIGNER') return 'from-pink-950 via-violet-950 to-slate-950 border-pink-900/40';
    if (cat === 'DEVELOPER') return 'from-indigo-950 via-slate-900 to-slate-950 border-indigo-950';
    return 'from-slate-900 to-slate-950 border-gray-800';
  };

  return (
    <div className="bg-[#030712] min-h-screen text-gray-100 p-6 sm:p-12 relative">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-900 pb-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black font-display text-white">Portfolio Marketplace</h1>
            <p className="text-xs text-gray-400">Select and preview our collection of 15 premium templates</p>
          </div>
          <button 
            type="button" 
            onClick={() => navigate('/builder')} 
            className="text-xs bg-gray-900 hover:bg-gray-800 border border-gray-800 px-4 py-2 rounded-lg font-bold transition"
          >
            Open Builder
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch bg-gray-950/40 p-4 border border-gray-900 rounded-xl">
          {/* Search bar */}
          <div className="flex items-center bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 flex-grow max-w-md">
            <Search size={16} className="text-gray-500 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates (e.g. Cybersecurity, Minimalist)..."
              className="bg-transparent border-none outline-none text-xs text-gray-200 w-full placeholder-gray-500"
            />
          </div>

          {/* Style Filters */}
          <div className="flex items-center space-x-2 overflow-x-auto shrink-0 py-1">
            <Filter size={14} className="text-gray-500 shrink-0 mr-1" />
            {styles.map((style) => (
              <button
                key={style}
                onClick={() => setSelectedStyle(style)}
                className={`text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-md transition shrink-0 ${
                  selectedStyle === style
                    ? 'bg-amber-400 text-black'
                    : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex space-x-2 overflow-x-auto pb-2 border-b border-gray-900/60">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`text-xs px-4 py-2 rounded-full whitespace-nowrap transition ${
                selectedCategory === cat.value
                  ? 'bg-white text-black font-semibold'
                  : 'text-gray-400 hover:text-white bg-gray-900/30 border border-gray-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Template Gallery Grids */}
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-20 border border-gray-900 rounded-xl bg-gray-950/20 space-y-3">
            <p className="text-sm text-gray-400">No templates found matching your search options.</p>
            <button type="button" onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); setSelectedStyle('ALL'); }} className="text-xs text-amber-400 hover:underline">Reset Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {filteredTemplates.map((tpl) => (
              <div 
                key={tpl.id}
                className={`border p-6 rounded-2xl flex flex-col justify-between hover:scale-[1.01] hover:border-gray-700 transition duration-300 bg-gradient-to-b ${getGradientForCategory(tpl.category)}`}
              >
                {/* Mock Card Preview Image/Placeholder */}
                <div className="bg-gray-950/80 rounded-xl h-44 border border-gray-850 flex items-center justify-center mb-6 overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent z-10"></div>
                  <span className="text-2xl font-black font-display tracking-widest text-gray-800 uppercase group-hover:scale-110 transition duration-300 z-0">
                    {tpl.name}
                  </span>
                  
                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition duration-300 z-20">
                    <button
                      type="button"
                      onClick={() => setPreviewTemplateId(tpl.id)}
                      className="bg-white text-black text-xs font-bold px-4 py-2 rounded-lg hover:scale-105 transition"
                    >
                      Quick Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectTemplate(tpl.id)}
                      className="bg-amber-400 text-black text-xs font-bold px-4 py-2 rounded-lg hover:scale-105 transition"
                    >
                      Use Template
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{tpl.category}</span>
                    <span className="text-[9px] font-mono bg-gray-900 border px-2 py-0.5 rounded text-gray-400">{tpl.style}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{tpl.name}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed mt-1">{tpl.description}</p>
                  </div>
                </div>

                <div className="flex space-x-3 pt-6 mt-6 border-t border-gray-900">
                  <button
                    type="button"
                    onClick={() => setPreviewTemplateId(tpl.id)}
                    className="w-1/2 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-white text-xs font-bold py-2.5 rounded-lg transition"
                  >
                    Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectTemplate(tpl.id)}
                    className="w-1/2 bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold py-2.5 rounded-lg transition"
                  >
                    Select
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Preview Modal Frame */}
      {previewTemplateId && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur z-50 flex items-center justify-center p-4">
          <div className="bg-gray-950 w-full max-w-5xl rounded-2xl overflow-hidden border border-gray-800 shadow-2xl flex flex-col h-[90vh]">
            <div className="bg-gray-900 px-6 py-4 border-b border-gray-800 flex justify-between items-center shrink-0">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-white">Previewing: {TEMPLATE_REGISTRY[previewTemplateId]?.name}</h3>
                <p className="text-[10px] text-gray-400">Responsive simulated view with sample profile details</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => handleSelectTemplate(previewTemplateId)}
                  className="bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold px-4 py-2 rounded-lg transition"
                >
                  Apply Template
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTemplateId(null)}
                  className="text-gray-500 hover:text-white p-2 rounded transition"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Simulated Live Viewport */}
            <div className="flex-grow overflow-auto p-4 bg-gray-900/20">
              <PreviewFrame data={mockPreviewData} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
