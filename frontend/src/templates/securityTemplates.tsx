import React from 'react';
import { PortfolioData } from '../context/store';
import { ShieldAlert, Terminal as TermIcon, Shield, Server, FileText, ChevronRight } from 'lucide-react';

interface TemplateProps {
  data: PortfolioData;
}

function getFontClass(font: string) {
  if (font === 'mono') return 'font-mono';
  if (font === 'display') return 'font-display';
  return 'font-sans';
}

/* ============================================================================
   4. REDTEAM TEMPLATE
   ============================================================================ */
export const RedTeam: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, socials, education, experience, projects, skills, certifications, themeConfig, sectionsOrder } = data;

  const dynamicStyles = {
    '--primary': themeConfig.primaryColor || '#ef4444', // Red-500
    '--secondary': themeConfig.secondaryColor || '#b91c1c', // Red-700
    '--bg': themeConfig.backgroundColor || '#0a0505',
    '--radius': themeConfig.borderRadius || '4px',
  } as React.CSSProperties;

  return (
    <div 
      style={dynamicStyles}
      className={`min-h-screen text-gray-200 ${getFontClass(themeConfig.fontFamily)} bg-[#0a0505]`}
    >
      <style>{`
        .cyber-border { border: 1px solid var(--primary); box-shadow: 0 0 10px rgba(239, 68, 68, 0.15); border-radius: var(--radius); }
        .text-cyber { color: var(--primary); text-shadow: 0 0 5px rgba(239, 68, 68, 0.4); }
        .bg-cyber { background-color: var(--primary); }
      `}</style>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        {/* Banner header */}
        <header className="cyber-border p-6 bg-black/60 relative overflow-hidden">
          <div className="absolute right-4 top-4 text-cyber opacity-15">
            <ShieldAlert size={120} />
          </div>
          <div className="space-y-3 relative z-10">
            <span className="text-[10px] uppercase font-mono tracking-widest text-red-500 bg-red-950/40 border border-red-900 px-2 py-0.5 rounded">SECURE PROTOCOL ACTIVE</span>
            <h1 className="text-3xl font-extrabold tracking-wider uppercase text-white font-mono">{personalInfo.fullName || 'Operator'}</h1>
            <p className="text-sm text-cyber font-mono font-semibold">ROLE: Cybersecurity Professional // {personalInfo.location || 'Unknown location'}</p>
            <p className="text-xs text-gray-400 max-w-xl font-mono">{personalInfo.bio}</p>
          </div>
        </header>

        {sectionsOrder.map((section) => {
          if (section === 'skills') {
            return (
              <section key="skills" className="cyber-border p-6 bg-black/60 space-y-4">
                <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-cyber flex items-center">
                  <Shield size={16} className="mr-2" /> [SYSTEM_CAPABILITIES]
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
                  {skills.map((skill, i) => (
                    <div key={i} className="bg-red-950/10 border border-red-950 p-3 rounded flex flex-col justify-between">
                      <span className="text-xs font-semibold text-white">{skill.name}</span>
                      <span className="text-[10px] text-cyber mt-2">SYS_LVL: {skill.level}/5</span>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (section === 'projects') {
            return (
              <section key="projects" className="space-y-4">
                <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-cyber px-2">
                  [RECONNAISSANCE_AND_EXPLOITS]
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {projects.map((proj, i) => (
                    <div key={i} className="cyber-border p-5 bg-black/60 flex flex-col justify-between font-mono">
                      <div>
                        <h3 className="text-sm font-bold text-white mb-1 uppercase tracking-wider">{proj.title}</h3>
                        <p className="text-[11px] text-gray-400 mb-3 leading-relaxed">{proj.description}</p>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {proj.technologies.map((t, idx) => (
                            <span key={idx} className="text-[9px] bg-red-950/20 text-red-400 border border-red-950/60 px-2 py-0.5">{t}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-4 text-[10px] border-t border-red-950/40 pt-2 font-semibold">
                        {proj.githubLink && <a href={proj.githubLink} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white">REPOS_URL</a>}
                        {proj.liveLink && <a href={proj.liveLink} target="_blank" rel="noreferrer" className="text-cyber hover:underline">LIVE_LINK</a>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (section === 'experience') {
            return (
              <section key="experience" className="cyber-border p-6 bg-black/60 space-y-4 font-mono">
                <h2 className="text-sm font-bold uppercase tracking-widest text-cyber flex items-center">
                  <Server size={16} className="mr-2" /> [SECURITY_ENGAGEMENTS]
                </h2>
                <div className="space-y-6">
                  {experience.map((exp, i) => (
                    <div key={i} className="border-l border-red-900 pl-4 space-y-1 relative">
                      <span className="absolute left-[-3px] top-1.5 w-1.5 h-1.5 bg-cyber rounded-full"></span>
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-white uppercase">{exp.role}</span>
                        <span className="text-[10px] text-gray-400 bg-red-950/20 border border-red-950 px-2 rounded">{exp.duration}</span>
                      </div>
                      <p className="text-[11px] text-cyber font-semibold">{exp.company}</p>
                      <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (section === 'about' && certifications && certifications.length > 0) {
            return (
              <section key="certs" className="cyber-border p-6 bg-black/60 space-y-4 font-mono">
                <h2 className="text-sm font-bold uppercase tracking-widest text-cyber flex items-center">
                  <ShieldAlert size={16} className="mr-2" /> [CREDENTIALS_AND_CERTS]
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {certifications.map((cert, i) => (
                    <div key={i} className="bg-red-950/5 border border-red-950/40 p-3 flex justify-between items-center text-xs">
                      <div>
                        <h4 className="font-bold text-white">{cert.name}</h4>
                        <p className="text-[10px] text-gray-400">{cert.issuer} ({cert.date})</p>
                      </div>
                      {cert.url && (
                        <a href={cert.url} target="_blank" rel="noreferrer" className="text-cyber hover:underline text-[10px]">VERIFY</a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (section === 'contact') {
            return (
              <section key="contact" className="cyber-border p-6 bg-black/60 space-y-4 font-mono">
                <h2 className="text-sm font-bold uppercase tracking-widest text-cyber">
                  [SECURE_COMMS_CHANNELS]
                </h2>
                <div className="text-xs space-y-3 text-gray-400">
                  <p>Send a secure signal. Encrypted pathways established.</p>
                  <div className="space-y-1.5 text-white">
                    <p>SECURE_MAIL: <a href={`mailto:${personalInfo.email}`} className="text-cyber hover:underline">{personalInfo.email || 'operator@redteam.sh'}</a></p>
                    {personalInfo.phone && <p>SECURE_PHONE: {personalInfo.phone}</p>}
                    {socials.github && <p>GITHUB_COMMS: <a href={socials.github} className="text-cyber hover:underline">{socials.github}</a></p>}
                    {socials.linkedin && <p>LINKEDIN_SYS: <a href={socials.linkedin} className="text-cyber hover:underline">{socials.linkedin}</a></p>}
                  </div>
                </div>
              </section>
            );
          }
          return null;
        })}

        <footer className="text-center font-mono text-[10px] text-gray-600">
          SECURE LOGOUT // PortfolioForge REDTEAM
        </footer>
      </div>
    </div>
  );
};

/* ============================================================================
   5. TERMINAL TEMPLATE
   ============================================================================ */
export const Terminal: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, socials, education, experience, projects, skills, certifications } = data;
  const [history, setHistory] = React.useState<string[]>(['Type "help" to see available commands.']);
  const [inputValue, setInputValue] = React.useState('');

  const executeCommand = (cmd: string) => {
    const cleanCmd = cmd.trim().toLowerCase();
    const newHistory = [...history, `$ ${cmd}`];

    if (cleanCmd === 'help') {
      newHistory.push(
        'Available commands:',
        '  bio          - Read operator biography',
        '  skills       - List technical capabilities',
        '  experience   - Display professional experience log',
        '  projects     - List reconnaissance logs / dev projects',
        '  contact      - Display communication channels',
        '  clear        - Clear console history'
      );
    } else if (cleanCmd === 'bio') {
      newHistory.push(personalInfo.bio || 'No bio configured.');
      if (education && education.length > 0) {
        newHistory.push('Education:');
        education.forEach((edu) => {
          newHistory.push(`  - ${edu.degree} from ${edu.college} (${edu.year})`);
        });
      }
    } else if (cleanCmd === 'skills') {
      newHistory.push('Technical capabilities loaded:');
      skills.forEach((sk) => {
        newHistory.push(`  - ${sk.name} [Level: ${sk.level}/5] (${sk.category})`);
      });
    } else if (cleanCmd === 'experience') {
      if (experience.length === 0) {
        newHistory.push('No work experience logged.');
      } else {
        experience.forEach((exp) => {
          newHistory.push(
            `Company: ${exp.company}`,
            `  Role: ${exp.role} (${exp.duration})`,
            `  Description: ${exp.description}`,
            ''
          );
        });
      }
    } else if (cleanCmd === 'projects') {
      if (projects.length === 0) {
        newHistory.push('No projects found.');
      } else {
        projects.forEach((proj) => {
          newHistory.push(
            `Project: ${proj.title}`,
            `  Description: ${proj.description}`,
            `  Tech: ${proj.technologies.join(', ')}`,
            proj.githubLink ? `  Source: ${proj.githubLink}` : '',
            proj.liveLink ? `  Live: ${proj.liveLink}` : '',
            ''
          );
        });
      }
    } else if (cleanCmd === 'contact') {
      newHistory.push(
        'Communication channels:',
        `  Email: ${personalInfo.email || 'not provided'}`,
        `  Phone: ${personalInfo.phone || 'not provided'}`,
        socials.github ? `  Github: ${socials.github}` : '',
        socials.linkedin ? `  LinkedIn: ${socials.linkedin}` : ''
      );
    } else if (cleanCmd === 'clear') {
      setHistory([]);
      setInputValue('');
      return;
    } else if (cleanCmd === '') {
      // Do nothing
    } else {
      newHistory.push(`shell: command not found: ${cmd}. Type "help" for a list of valid commands.`);
    }

    setHistory(newHistory);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(inputValue);
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-4 sm:p-8 flex flex-col justify-between selection:bg-green-500 selection:text-black">
      <div className="max-w-4xl mx-auto w-full flex-grow flex flex-col">
        {/* Terminal Header */}
        <div className="border-b border-green-900 pb-4 mb-6">
          <p className="text-xs text-green-700">PORTFOLIO PROTOCOL TERMINAL v1.0.4</p>
          <p className="text-xs text-green-700">SYSTEM READY: {new Date().toISOString()}</p>
          <p className="text-sm font-bold mt-2 text-white">OPERATOR: {personalInfo.fullName || 'UNKNOWN'}</p>
        </div>

        {/* History Area */}
        <div className="flex-grow space-y-2 text-sm overflow-y-auto mb-6 pr-2 max-h-[60vh] min-h-[400px]">
          {history.map((line, idx) => (
            <div key={idx} className="whitespace-pre-wrap leading-relaxed">
              {line}
            </div>
          ))}
        </div>

        {/* Prompt Input */}
        <div className="flex items-center text-sm border-t border-green-900 pt-4">
          <ChevronRight size={16} className="text-green-500 shrink-0" />
          <span className="text-green-500 mr-2">guest@pf-shell:~$</span>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-grow bg-transparent border-none outline-none text-green-500 caret-green-500 w-full"
            autoFocus
            placeholder="type command..."
          />
        </div>
      </div>

      <div className="text-center text-[10px] text-green-900 mt-8">
        PortfolioForge terminal engine &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
};

/* ============================================================================
   6. MATRIX TEMPLATE
   ============================================================================ */
export const Matrix: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, socials, education, experience, projects, skills, certifications } = data;

  return (
    <div className="min-h-screen bg-black text-[#00ff41] font-mono p-6 sm:p-12 space-y-12">
      <style>{`
        .matrix-card { border: 1px solid #00ff41; background: rgba(0,0,0,0.85); box-shadow: 0 0 15px rgba(0, 255, 65, 0.1); }
        .matrix-title { border-bottom: 1px solid #00ff41; }
      `}</style>

      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Banner */}
        <header className="matrix-card p-6 sm:p-8 space-y-4">
          <div className="flex justify-between items-center text-xs text-[#008f11] border-b border-[#00ff41]/30 pb-2">
            <span>SECURE LINK: SECURE_STATUS_ONLINE</span>
            <span>NODE_ID: M-3091</span>
          </div>
          <h1 className="text-3xl font-bold uppercase text-white font-mono tracking-widest">{personalInfo.fullName || 'Neo'}</h1>
          <p className="text-xs leading-relaxed max-w-2xl">{personalInfo.bio || 'Wake up, Neo... The portfolio has you.'}</p>
        </header>

        {/* Core items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Bio/About */}
            <div className="matrix-card p-5 space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider matrix-title pb-1 flex items-center">
                <FileText size={14} className="mr-2" /> 0x01 // IDENTITY
              </h2>
              <div className="text-xs space-y-1.5 text-gray-300">
                <p>NAME: {personalInfo.fullName}</p>
                <p>LOC: {personalInfo.location || 'N/A'}</p>
                <p>EMAIL: {personalInfo.email || 'N/A'}</p>
                {education && education.map((edu, idx) => (
                  <div key={idx} className="mt-2 pt-2 border-t border-[#00ff41]/20">
                    <p className="font-semibold text-white">EDU: {edu.degree}</p>
                    <p className="text-[10px] text-[#008f11]">{edu.college} ({edu.year})</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="matrix-card p-5 space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider matrix-title pb-1 flex items-center">
                <Shield size={14} className="mr-2" /> 0x02 // INTRUSION_SKILLS
              </h2>
              <div className="space-y-3">
                {skills.map((skill, idx) => (
                  <div key={idx} className="text-xs">
                    <div className="flex justify-between mb-1">
                      <span>{skill.name}</span>
                      <span>{skill.level}/5</span>
                    </div>
                    <div className="w-full bg-[#002200] h-1 border border-[#00ff41]/50">
                      <div className="bg-[#00ff41] h-full" style={{ width: `${(skill.level / 5) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Projects */}
            <div className="matrix-card p-5 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider matrix-title pb-1 flex items-center">
                <TermIcon size={14} className="mr-2" /> 0x03 // EXPLOITS
              </h2>
              <div className="space-y-4">
                {projects.map((proj, idx) => (
                  <div key={idx} className="border border-[#00ff41]/30 p-3 bg-black space-y-1.5 text-xs">
                    <h3 className="font-bold text-white uppercase">{proj.title}</h3>
                    <p className="text-gray-400 text-[11px] leading-relaxed">{proj.description}</p>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-[10px] text-[#008f11]">{proj.technologies.join(', ')}</span>
                      {proj.liveLink && <a href={proj.liveLink} className="hover:underline font-bold text-[10px]">EXECUTE</a>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="matrix-card p-5 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider matrix-title pb-1 flex items-center">
                <Server size={14} className="mr-2" /> 0x04 // TIMELINE
              </h2>
              <div className="space-y-4">
                {experience.map((exp, idx) => (
                  <div key={idx} className="text-xs border-l border-[#00ff41] pl-3 space-y-1">
                    <div className="flex justify-between font-bold text-white">
                      <span>{exp.role}</span>
                      <span className="text-[10px] text-gray-400">{exp.duration}</span>
                    </div>
                    <p className="text-[#008f11] font-semibold">{exp.company}</p>
                    <p className="text-[10px] text-gray-400 leading-normal">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contact/Comms */}
        <div className="matrix-card p-6 text-center text-xs">
          <p className="mb-3">SECURE TRANSMISSION NODE</p>
          <div className="flex justify-center space-x-6">
            {personalInfo.email && <a href={`mailto:${personalInfo.email}`} className="hover:underline">EMAIL</a>}
            {socials.github && <a href={socials.github} className="hover:underline">GITHUB</a>}
            {socials.linkedin && <a href={socials.linkedin} className="hover:underline">LINKEDIN</a>}
          </div>
        </div>
      </div>
    </div>
  );
};
