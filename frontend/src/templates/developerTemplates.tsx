import React from 'react';
import { PortfolioData } from '../context/store';
import { Terminal, Code, Cpu, FolderGit2, Mail, ExternalLink, Calendar, GraduationCap, Award, ChevronRight, MapPin, Briefcase, Sparkles } from 'lucide-react';

interface TemplateProps {
  data: PortfolioData;
}

// Utility to apply active font family
function getFontClass(font: string) {
  if (font === 'mono') return 'font-mono';
  if (font === 'display') return 'font-display';
  return 'font-sans';
}

/* ============================================================================
   1. CODECRAFT TEMPLATE
   ============================================================================ */
export const CodeCraft: React.FC<TemplateProps> = ({ data }) => {
  const [activeTab, setActiveTab] = React.useState('about');
  const { personalInfo, socials, education, experience, projects, skills, certifications, themeConfig, sectionsOrder } = data;

  const dynamicStyles = {
    '--primary': themeConfig.primaryColor,
    '--secondary': themeConfig.secondaryColor,
    '--accent': themeConfig.accentColor,
    '--bg': themeConfig.backgroundColor,
    '--radius': themeConfig.borderRadius,
  } as React.CSSProperties;

  return (
    <div 
      style={dynamicStyles}
      className={`min-h-screen text-gray-100 p-4 sm:p-8 flex flex-col justify-between ${getFontClass(themeConfig.fontFamily)}`}
      target-bg="bg-var"
    >
      <style>{`
        [target-bg="bg-var"] { background-color: var(--bg); }
        .tab-btn-active { border-bottom: 2px solid var(--primary); color: var(--primary); }
        .text-accent-val { color: var(--accent); }
        .btn-custom { border-radius: var(--radius); background-color: var(--primary); }
        .btn-custom:hover { background-color: var(--secondary); }
        .card-custom { border-radius: var(--radius); border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02); }
      `}</style>

      {/* Header / Mock Terminal Header */}
      <header className="max-w-4xl mx-auto w-full card-custom overflow-hidden shadow-2xl mb-8">
        <div className="bg-gray-900 px-4 py-3 border-b border-gray-800 flex items-center justify-between">
          <div className="flex space-x-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
          </div>
          <span className="text-xs text-gray-400 font-mono flex items-center">
            <Terminal size={12} className="mr-1 text-accent-val" /> portfolio_shell
          </span>
          <div className="w-12"></div>
        </div>

        <div className="p-6 sm:p-8 font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-gray-400 text-sm"># Welcome to the shell of</p>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-1" style={{ color: 'var(--primary)' }}>
                {personalInfo.fullName || 'John Doe'}
              </h1>
              <p className="text-accent-val text-sm mt-1">~/ {personalInfo.location || 'San Francisco, CA'}</p>
            </div>
            {personalInfo.avatarUrl && (
              <img 
                src={personalInfo.avatarUrl} 
                alt="Avatar" 
                className="w-20 h-20 rounded-full border border-gray-700 object-cover" 
              />
            )}
          </div>
          <p className="mt-4 text-gray-300 leading-relaxed text-sm max-w-2xl">{personalInfo.bio || 'Your professional bio goes here.'}</p>
        </div>
      </header>

      {/* Main Tabs Navigation */}
      <main className="max-w-4xl mx-auto w-full flex-grow">
        <div className="flex border-b border-gray-800 mb-6 font-mono overflow-x-auto">
          {sectionsOrder.map((section) => (
            <button
              key={section}
              onClick={() => setActiveTab(section)}
              className={`px-4 py-2 text-sm capitalize whitespace-nowrap ${
                activeTab === section ? 'tab-btn-active' : 'text-gray-400 hover:text-white'
              }`}
            >
              {section === 'hero' ? 'Welcome' : section}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="font-mono space-y-6">
          {activeTab === 'hero' && (
            <div className="card-custom p-6 space-y-4">
              <h2 className="text-xl font-bold text-accent-val flex items-center">
                <Code size={18} className="mr-2" /> $ cat welcome.sh
              </h2>
              <div className="space-y-2 text-sm text-gray-300">
                <p><span className="text-blue-400">const</span> dev = {JSON.stringify({
                  name: personalInfo.fullName,
                  email: personalInfo.email,
                  phone: personalInfo.phone,
                  socials: socials
                }, null, 2)}</p>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="card-custom p-6 space-y-4">
              <h2 className="text-xl font-bold text-accent-val flex items-center">
                <Cpu size={18} className="mr-2" /> $ cat about_me.txt
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">{personalInfo.bio}</p>
              
              {/* Education section inside about */}
              {education && education.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center"><GraduationCap size={16} className="mr-2 text-var" style={{color: 'var(--primary)'}} /> Education</h3>
                  <div className="space-y-4">
                    {education.map((edu, idx) => (
                      <div key={idx} className="border-l-2 border-gray-800 pl-4 py-1">
                        <h4 className="text-sm font-semibold text-white">{edu.degree}</h4>
                        <p className="text-xs text-gray-400">{edu.college} ({edu.year})</p>
                        {edu.grade && <p className="text-xs text-accent-val">Score: {edu.grade}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="card-custom p-6 space-y-4">
              <h2 className="text-xl font-bold text-accent-val flex items-center">
                <Terminal size={18} className="mr-2" /> $ ls -la skills/
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {skills.map((skill, idx) => (
                  <div key={idx} className="bg-gray-950 p-3 rounded border border-gray-900">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-white">{skill.name}</span>
                      <span className="text-gray-400">{skill.category}</span>
                    </div>
                    <div className="w-full bg-gray-800 h-1.5 rounded overflow-hidden">
                      <div 
                        className="h-full" 
                        style={{ width: `${(skill.level / 5) * 100}%`, backgroundColor: 'var(--primary)' }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-accent-val flex items-center px-2">
                <FolderGit2 size={18} className="mr-2" /> $ git log --projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((proj, idx) => (
                  <div key={idx} className="card-custom p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">{proj.title}</h3>
                      <p className="text-xs text-gray-400 mb-4">{proj.description}</p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {proj.technologies.map((t, i) => (
                          <span key={i} className="text-[10px] bg-gray-900 px-2 py-1 rounded text-gray-300 border border-gray-800">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-3 text-xs pt-2">
                      {proj.githubLink && (
                        <a href={proj.githubLink} target="_blank" rel="noreferrer" className="flex items-center text-gray-400 hover:text-white transition">
                          Github <ExternalLink size={12} className="ml-1" />
                        </a>
                      )}
                      {proj.liveLink && (
                        <a href={proj.liveLink} target="_blank" rel="noreferrer" className="flex items-center text-var hover:underline" style={{color: 'var(--primary)'}}>
                          Live <ExternalLink size={12} className="ml-1" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="card-custom p-6 space-y-4">
              <h2 className="text-xl font-bold text-accent-val flex items-center">
                <Calendar size={18} className="mr-2" /> $ cat work_history.json
              </h2>
              <div className="space-y-6">
                {experience.map((exp, idx) => (
                  <div key={idx} className="relative pl-6 border-l-2 border-gray-800">
                    <span className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--primary)' }}></span>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <h3 className="text-base font-bold text-white">{exp.role}</h3>
                      <span className="text-xs text-gray-400">{exp.duration}</span>
                    </div>
                    <h4 className="text-sm text-accent-val mt-0.5">{exp.company}</h4>
                    <p className="text-xs text-gray-400 mt-2">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="card-custom p-6 space-y-4">
              <h2 className="text-xl font-bold text-accent-val flex items-center">
                <Mail size={18} className="mr-2" /> $ mail -s \"hello\"
              </h2>
              <div className="max-w-md space-y-4 text-sm text-gray-300">
                <p>Feel free to reach out to me for opportunities or collaboration.</p>
                <div className="space-y-2 font-mono">
                  <p>Email: <a href={`mailto:${personalInfo.email}`} className="text-var" style={{color: 'var(--primary)'}}>{personalInfo.email || 'not provided'}</a></p>
                  <p>Phone: {personalInfo.phone || 'not provided'}</p>
                  <p>Location: {personalInfo.location || 'not provided'}</p>
                </div>
                {/* Socials */}
                <div className="flex space-x-4 pt-2">
                  {socials.github && <a href={socials.github} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white">Github</a>}
                  {socials.linkedin && <a href={socials.linkedin} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white">LinkedIn</a>}
                  {socials.twitter && <a href={socials.twitter} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white">Twitter</a>}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="max-w-4xl mx-auto w-full text-center text-xs text-gray-600 font-mono mt-8 pt-4 border-t border-gray-900">
        Generated by PortfolioForge &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

/* ============================================================================
   2. DEVHUB TEMPLATE
   ============================================================================ */
export const DevHub: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, socials, education, experience, projects, skills, themeConfig, sectionsOrder } = data;

  const dynamicStyles = {
    '--primary': themeConfig.primaryColor,
    '--secondary': themeConfig.secondaryColor,
    '--bg': themeConfig.backgroundColor,
    '--radius': themeConfig.borderRadius,
  } as React.CSSProperties;

  return (
    <div 
      style={dynamicStyles}
      className={`min-h-screen text-gray-100 ${getFontClass(themeConfig.fontFamily)}`}
      target-bg="bg-var"
    >
      <style>{`
        [target-bg="bg-var"] { background-color: var(--bg); }
        .text-primary-val { color: var(--primary); }
        .bg-primary-val { background-color: var(--primary); }
        .border-primary-val { border-color: var(--primary); }
        .btn-dh { border-radius: var(--radius); background-color: var(--primary); color: white; }
        .btn-dh:hover { background-color: var(--secondary); }
        .card-dh { border-radius: var(--radius); background: rgba(30, 41, 59, 0.4); border: 1px solid rgba(255,255,255,0.05); }
      `}</style>

      {/* Nav */}
      <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <span className="text-lg font-bold font-display text-primary-val">{personalInfo.fullName?.split(' ')[0] || 'Dev'}.</span>
          <div className="flex space-x-6 text-sm">
            {sectionsOrder.map((section) => (
              <a key={section} href={`#${section}`} className="text-gray-400 hover:text-white capitalize transition">
                {section === 'hero' ? 'Home' : section}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Main layout wrapper */}
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-20">
        {/* Render sections based on sectionsOrder */}
        {sectionsOrder.map((section) => {
          if (section === 'hero') {
            return (
              <section key="hero" id="hero" className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 py-8">
                <div className="max-w-2xl space-y-6">
                  <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
                    Hi, I'm <span className="text-primary-val">{personalInfo.fullName || 'John Doe'}</span>
                  </h1>
                  <p className="text-lg text-gray-400 leading-relaxed">
                    {personalInfo.bio || 'A passionate software developer creating high-quality web applications.'}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <a href="#contact" className="btn-dh px-6 py-3 font-semibold text-sm transition text-center min-w-[120px]">
                      Contact Me
                    </a>
                    <a href="#projects" className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 font-semibold text-sm transition rounded text-center border border-gray-700 min-w-[120px]" style={{borderRadius: 'var(--radius)'}}>
                      View Work
                    </a>
                  </div>
                </div>
                {personalInfo.avatarUrl && (
                  <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-primary-val shadow-xl shrink-0">
                    <img src={personalInfo.avatarUrl} alt={personalInfo.fullName} className="w-full h-full object-cover" />
                  </div>
                )}
              </section>
            );
          }

          if (section === 'about') {
            return (
              <section key="about" id="about" className="space-y-6 scroll-mt-20">
                <h2 className="text-2xl sm:text-3xl font-bold border-b border-gray-800 pb-2">About Me</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-300 text-sm leading-relaxed">
                  <div className="space-y-4">
                    <p>{personalInfo.bio}</p>
                    <p>Location: {personalInfo.location || 'Not Specified'}</p>
                  </div>
                  {education && education.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-base font-bold text-white flex items-center">
                        <GraduationCap className="mr-2 text-primary-val" size={18} /> Education
                      </h3>
                      {education.map((edu, i) => (
                        <div key={i} className="card-dh p-4 bg-gray-900/20">
                          <h4 className="font-bold text-white text-xs">{edu.degree}</h4>
                          <p className="text-xs text-gray-400">{edu.college} ({edu.year})</p>
                          {edu.grade && <p className="text-xs text-primary-val mt-1">GPA: {edu.grade}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            );
          }

          if (section === 'skills') {
            return (
              <section key="skills" id="skills" className="space-y-6 scroll-mt-20">
                <h2 className="text-2xl sm:text-3xl font-bold border-b border-gray-800 pb-2">Technical Skills</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {skills.map((skill, i) => (
                    <div key={i} className="card-dh p-4 flex flex-col justify-between">
                      <span className="font-bold text-sm text-white mb-2">{skill.name}</span>
                      <div className="flex justify-between items-center text-[10px] text-gray-400">
                        <span>Level</span>
                        <span className="text-primary-val font-semibold">{skill.level}/5</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (section === 'projects') {
            return (
              <section key="projects" id="projects" className="space-y-6 scroll-mt-20">
                <h2 className="text-2xl sm:text-3xl font-bold border-b border-gray-800 pb-2">Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {projects.map((proj, i) => (
                    <div key={i} className="card-dh p-6 flex flex-col justify-between hover:border-gray-700 transition">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-2">{proj.title}</h3>
                        <p className="text-xs text-gray-400 line-clamp-3 mb-4">{proj.description}</p>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {proj.technologies.map((t, idx) => (
                            <span key={idx} className="text-[10px] bg-gray-900 border border-gray-800 text-gray-300 px-2 py-0.5 rounded">{t}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-4 text-xs font-semibold pt-2 border-t border-gray-800/50">
                        {proj.githubLink && (
                          <a href={proj.githubLink} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white flex items-center">
                            Code <ExternalLink size={12} className="ml-1" />
                          </a>
                        )}
                        {proj.liveLink && (
                          <a href={proj.liveLink} target="_blank" rel="noreferrer" className="text-primary-val hover:underline flex items-center">
                            Live Demo <ExternalLink size={12} className="ml-1" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (section === 'experience') {
            return (
              <section key="experience" id="experience" className="space-y-6 scroll-mt-20">
                <h2 className="text-2xl sm:text-3xl font-bold border-b border-gray-800 pb-2">Work Experience</h2>
                <div className="space-y-6">
                  {experience.map((exp, i) => (
                    <div key={i} className="card-dh p-6 hover:bg-gray-900/10 transition">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                        <h3 className="text-lg font-bold text-white">{exp.role}</h3>
                        <span className="text-xs bg-gray-800 px-2.5 py-1 rounded text-gray-400 border border-gray-700">{exp.duration}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-primary-val mb-4">{exp.company}</h4>
                      <p className="text-xs text-gray-400 leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (section === 'contact') {
            return (
              <section key="contact" id="contact" className="space-y-6 scroll-mt-20">
                <h2 className="text-2xl sm:text-3xl font-bold border-b border-gray-800 pb-2">Get In Touch</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4 text-sm text-gray-300">
                    <p>I am currently open to job offers, contract works, and freelance collaborations. Reach out using my direct socials or email.</p>
                    <div className="space-y-2 font-mono">
                      <p>Email: <a href={`mailto:${personalInfo.email}`} className="text-primary-val hover:underline">{personalInfo.email || 'info@devhub.com'}</a></p>
                      {personalInfo.phone && <p>Phone: {personalInfo.phone}</p>}
                    </div>
                    {/* Social links */}
                    <div className="flex space-x-4 pt-2">
                      {socials.github && <a href={socials.github} className="text-gray-400 hover:text-white">Github</a>}
                      {socials.linkedin && <a href={socials.linkedin} className="text-gray-400 hover:text-white">LinkedIn</a>}
                    </div>
                  </div>
                  
                  {/* Contact form mock */}
                  <form className="space-y-4 bg-gray-950 p-6 rounded border border-gray-800" style={{borderRadius: 'var(--radius)'}}>
                    <div>
                      <label className="text-xs font-semibold text-gray-400 block mb-1">Your Name</label>
                      <input type="text" className="w-full bg-gray-900 border border-gray-800 rounded px-3 py-2 text-xs focus:border-var text-white outline-none" style={{borderColor: 'rgba(255,255,255,0.08)'}} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-400 block mb-1">Email Address</label>
                      <input type="email" className="w-full bg-gray-900 border border-gray-800 rounded px-3 py-2 text-xs focus:border-var text-white outline-none" style={{borderColor: 'rgba(255,255,255,0.08)'}} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-400 block mb-1">Message</label>
                      <textarea rows={3} className="w-full bg-gray-900 border border-gray-800 rounded px-3 py-2 text-xs focus:border-var text-white outline-none" style={{borderColor: 'rgba(255,255,255,0.08)'}}></textarea>
                    </div>
                    <button type="button" className="btn-dh w-full py-2.5 font-bold text-xs transition">Send Message</button>
                  </form>
                </div>
              </section>
            );
          }
          return null;
        })}
      </div>
      
      <footer className="text-center text-xs text-gray-600 py-8 border-t border-gray-900 mt-20">
        &copy; {new Date().getFullYear()} {personalInfo.fullName || 'Developer'}. Built with PortfolioForge.
      </footer>
    </div>
  );
};

/* ============================================================================
   3. STACKFOLIO TEMPLATE
   ============================================================================ */
export const Stackfolio: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, socials, education, experience, projects, skills, themeConfig, sectionsOrder } = data;

  const dynamicStyles = {
    '--primary': themeConfig.primaryColor,
    '--secondary': themeConfig.secondaryColor,
    '--bg': themeConfig.backgroundColor || '#000000',
    '--radius': themeConfig.borderRadius || '0px',
  } as React.CSSProperties;

  return (
    <div 
      style={dynamicStyles}
      className={`min-h-screen text-gray-100 ${getFontClass(themeConfig.fontFamily)}`}
      target-bg="bg-var"
    >
      <style>{`
        [target-bg="bg-var"] { background-color: var(--bg); }
        .border-sf { border: 1px solid rgba(255, 255, 255, 0.15); border-radius: var(--radius); }
        .text-sf { color: var(--primary); }
        .bg-sf { background-color: var(--primary); }
      `}</style>

      <div className="max-w-3xl mx-auto px-6 py-20 space-y-16">
        
        {/* Render sections based on sectionsOrder */}
        {sectionsOrder.map((section) => {
          if (section === 'hero') {
            return (
              <header key="hero" className="space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-white">
                  {personalInfo.fullName || 'Your Name'}
                </h1>
                <p className="text-lg text-sf font-semibold">{personalInfo.location || 'Location'}</p>
                <p className="text-sm text-gray-400 max-w-xl leading-relaxed">{personalInfo.bio}</p>
                {/* Social row */}
                <div className="flex space-x-4 pt-2 text-xs">
                  {socials.github && <a href={socials.github} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white">Github</a>}
                  {socials.linkedin && <a href={socials.linkedin} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white">LinkedIn</a>}
                  {personalInfo.email && <a href={`mailto:${personalInfo.email}`} className="text-gray-400 hover:text-white">Email</a>}
                </div>
              </header>
            );
          }

          if (section === 'about') {
            return (
              <section key="about" className="space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">01 // ABOUT</h2>
                <p className="text-sm text-gray-400 leading-relaxed">{personalInfo.bio}</p>
                {education && education.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-800 space-y-2">
                    <h3 className="text-xs font-semibold text-white">Education:</h3>
                    {education.map((edu, i) => (
                      <div key={i} className="flex justify-between items-center text-xs">
                        <span className="text-gray-300 font-semibold">{edu.degree} &mdash; {edu.college}</span>
                        <span className="text-gray-500">{edu.year}</span>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            );
          }

          if (section === 'skills') {
            return (
              <section key="skills" className="space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">02 // CAPABILITIES</h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, i) => (
                    <span key={i} className="text-xs px-3 py-1.5 border-sf bg-gray-900/50 text-gray-300 font-mono">
                      {skill.name} <span className="text-sf font-bold ml-1">&#8226; {skill.level}</span>
                    </span>
                  ))}
                </div>
              </section>
            );
          }

          if (section === 'projects') {
            return (
              <section key="projects" className="space-y-6">
                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">03 // SELECTED WORK</h2>
                <div className="space-y-6">
                  {projects.map((proj, i) => (
                    <div key={i} className="border-sf p-5 space-y-3 bg-gray-950/20">
                      <div className="flex justify-between items-start">
                        <h3 className="text-base font-bold text-white">{proj.title}</h3>
                        <div className="flex space-x-2">
                          {proj.githubLink && <a href={proj.githubLink} target="_blank" rel="noreferrer" className="text-[10px] text-gray-400 hover:text-white">Source</a>}
                          {proj.liveLink && <a href={proj.liveLink} target="_blank" rel="noreferrer" className="text-[10px] text-sf hover:underline">Link</a>}
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">{proj.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {proj.technologies.map((t, idx) => (
                          <span key={idx} className="text-[10px] font-mono text-gray-500 mr-2">#{t}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (section === 'experience') {
            return (
              <section key="experience" className="space-y-6">
                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">04 // EXPERIENCE</h2>
                <div className="space-y-6">
                  {experience.map((exp, i) => (
                    <div key={i} className="flex flex-col sm:flex-row justify-between gap-2 border-b border-gray-900 pb-4">
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-white">{exp.role}</h3>
                        <p className="text-xs text-sf font-semibold">{exp.company}</p>
                        <p className="text-xs text-gray-400 max-w-md mt-1">{exp.description}</p>
                      </div>
                      <span className="text-xs text-gray-500 shrink-0">{exp.duration}</span>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (section === 'contact') {
            return (
              <section key="contact" className="space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">05 // ENGAGE</h2>
                <div className="border-sf p-6 bg-gray-950/40 text-sm space-y-4 text-gray-300">
                  <p>Open for roles, consulting tasks, and full time positions globally.</p>
                  <p>Drop a note: <a href={`mailto:${personalInfo.email}`} className="text-sf hover:underline font-semibold">{personalInfo.email || 'developer@stackfolio.com'}</a></p>
                </div>
              </section>
            );
          }
          return null;
        })}

        <footer className="text-xs text-gray-600 border-t border-gray-900 pt-6 flex justify-between font-mono">
          <span>&copy; {new Date().getFullYear()}</span>
          <span>SF // PORTFOLIOFORGE</span>
        </footer>
      </div>
    </div>
  );
};

/* ============================================================================
   16. VIVEPORTFOLIO TEMPLATE (PREMIUM)
   ============================================================================ */
export const VivePortfolio: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, socials, education, experience, projects, skills, certifications, achievements } = data;
  const [typedText, setTypedText] = React.useState('');
  
  // Custom typing animation matching the Netlify page
  React.useEffect(() => {
    const roles = ['Software Developer', 'Full Stack Developer', 'Problem Solver', 'CyberSecurity Enthusiast'];
    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let timer: any;
    
    const tick = () => {
      const currentRole = roles[roleIdx];
      if (!isDeleting) {
        setTypedText(currentRole.substring(0, charIdx + 1));
        charIdx++;
        if (charIdx === currentRole.length) {
          isDeleting = true;
          timer = setTimeout(tick, 1500);
        } else {
          timer = setTimeout(tick, 100);
        }
      } else {
        setTypedText(currentRole.substring(0, charIdx - 1));
        charIdx--;
        if (charIdx === 0) {
          isDeleting = false;
          roleIdx = (roleIdx + 1) % roles.length;
          timer = setTimeout(tick, 500);
        } else {
          timer = setTimeout(tick, 50);
        }
      }
    };
    
    timer = setTimeout(tick, 500);
    return () => clearTimeout(timer);
  }, []);

  const [initials] = React.useState(() => {
    if (!personalInfo.fullName) return 'PF';
    return personalInfo.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  });

  return (
    <div className="min-h-screen text-[#1a1a1a] bg-[#f8f7f4] font-sans selection:bg-[#c8502a] selection:text-white relative">
      <style>{`
        /* Local style injection for viveportfolio layout */
        .grid-overlay-vp {
          position: absolute; inset: 0;
          background-image:
              linear-gradient(#ddd9d1 1px, transparent 1px),
              linear-gradient(90deg, #ddd9d1 1px, transparent 1px);
          background-size: 48px 48px; opacity: 0.35;
        }
        .vp-card { background: #ffffff; border: 1px solid #ddd9d1; border-radius: 12px; transition: all 0.25s; }
        .vp-card:hover { border-color: #c8502a; box-shadow: 0 4px 20px rgba(200,80,42,0.08); }
        .vp-accent-text { color: #c8502a; }
        .vp-accent-bg { background-color: #c8502a; }
        .vp-accent-border { border-color: #c8502a; }
        
        /* Badges & Profile ring styling */
        .vp-profile-ring { border: 2.5px solid #ddd9d1; }
        .vp-profile-badge {
          position: absolute; width: 40px; height: 40px; border-radius: 10px;
          background: #ffffff; border: 1.5px solid #ddd9d1;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem; box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        }
        
        .vp-timeline::before {
          content: ''; position: absolute; left: 14px; top: 0; bottom: 0;
          width: 1.5px; background: #ddd9d1;
        }
        
        .vp-project-card::before {
          content: ''; position: absolute; top: 0; left: 0;
          width: 4px; height: 100%; background: #c8502a;
          transform: scaleY(0); transform-origin: bottom;
          transition: transform 0.3s ease;
        }
        .vp-project-card:hover::before { transform: scaleY(1); }
      `}</style>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-40 bg-[#f8f7f4]/90 backdrop-blur border-b border-[#ddd9d1] py-3.5 px-6 sm:px-12">
        <div className="max-w-5xl mx-auto flex justify-between items-center w-full">
          <a href="#home" className="font-mono font-bold text-sm text-[#1a1a1a] tracking-tight">
            &lt;{initials} /&gt;
          </a>
          <div className="flex items-center space-x-6 text-[13px] font-semibold text-[#4a4a4a]">
            <a href="#about" className="hover:text-black transition">About</a>
            <a href="#experience" className="hover:text-black transition">Experience</a>
            <a href="#projects" className="hover:text-black transition">Projects</a>
            <a href="#skills" className="hover:text-black transition font-bold vp-accent-text">Skills</a>
            <a href="#contact" className="hover:text-black transition">Contact</a>
          </div>
          {socials.github && (
            <a 
              href={socials.github} 
              target="_blank" 
              rel="noreferrer" 
              className="hidden sm:inline-block bg-[#1a1a1a] text-[#f8f7f4] hover:bg-[#c8502a] transition font-semibold text-[13px] px-4 py-1.5 rounded-lg shadow-sm"
            >
              GitHub
            </a>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen bg-white relative overflow-hidden flex items-center pt-16">
        <div className="grid-overlay-vp"></div>
        <div className="max-w-5xl mx-auto w-full px-6 sm:px-12 py-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Hero Left Content */}
          <div className="md:col-span-7 space-y-6">
            <p className="font-mono text-xs uppercase tracking-wider vp-accent-text font-bold flex items-center space-x-2">
              <Code size={14} /> <span>Hello World, I'm</span>
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#1a1a1a] leading-none font-display">
              {personalInfo.fullName ? personalInfo.fullName.split(' ')[0] : 'Jon'}<br />
              <span className="vp-accent-text">{personalInfo.fullName ? personalInfo.fullName.split(' ').slice(1).join(' ') : 'Doe'}</span>
            </h1>
            
            {/* Typing effect role box */}
            <div className="font-mono text-[13px] text-[#8a8a8a] bg-[#f0ede8] border-l-[3px] vp-accent-border inline-block px-3.5 py-2 rounded-md">
              <span className="text-[#4a4a4a]">const role = </span>
              <span className="text-black font-semibold">"{typedText}"</span>
              <span className="vp-accent-text font-bold animate-pulse-slow">|</span>
            </div>

            <p className="text-[#4a4a4a] text-sm leading-relaxed max-w-md">
              {personalInfo.bio || 'Software Developer passionate about building scalable web applications, solving complex problems, and writing clean, efficient code.'}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <a href="#projects" className="bg-[#1a1a1a] text-white hover:bg-[#c8502a] transition px-5 py-3 rounded-lg font-bold text-xs shadow-md shadow-stone-800/10 flex items-center space-x-1">
                <span>View Projects</span> <ChevronRight size={14} className="rotate-90" />
              </a>
              <a href="#contact" className="border border-[#ddd9d1] text-[#4a4a4a] hover:border-[#1a1a1a] hover:bg-[#f0ede8] hover:text-black transition px-5 py-3 rounded-lg font-bold text-xs">
                Hire Me
              </a>
            </div>

            {/* Social row */}
            <div className="flex space-x-3 pt-2">
              {personalInfo.email && (
                <a href={`mailto:${personalInfo.email}`} className="w-9 h-9 border border-[#ddd9d1] rounded-lg flex items-center justify-center text-[#8a8a8a] hover:border-[#1a1a1a] hover:text-black hover:bg-[#f0ede8] transition">
                  <Mail size={15} />
                </a>
              )}
              {socials.linkedin && (
                <a href={socials.linkedin} target="_blank" rel="noreferrer" className="w-9 h-9 border border-[#ddd9d1] rounded-lg flex items-center justify-center text-[#8a8a8a] hover:border-[#1a1a1a] hover:text-black hover:bg-[#f0ede8] transition">
                  <ExternalLink size={15} />
                </a>
              )}
              {socials.github && (
                <a href={socials.github} target="_blank" rel="noreferrer" className="w-9 h-9 border border-[#ddd9d1] rounded-lg flex items-center justify-center text-[#8a8a8a] hover:border-[#1a1a1a] hover:text-black hover:bg-[#f0ede8] transition">
                  <FolderGit2 size={15} />
                </a>
              )}
            </div>

            {/* Stats list */}
            <div className="flex items-center space-x-6 pt-4 border-t border-[#ddd9d1] max-w-sm">
              <div>
                <span className="block text-xl font-black text-black tracking-tight">{projects.length || '3+'}</span>
                <span className="text-[10px] text-[#8a8a8a] uppercase font-semibold">Projects Built</span>
              </div>
              <div className="w-[1px] h-8 bg-[#ddd9d1]"></div>
              <div>
                <span className="block text-xl font-black text-black tracking-tight">{skills.length || '12+'}</span>
                <span className="text-[10px] text-[#8a8a8a] uppercase font-semibold">Skills Logged</span>
              </div>
              {certifications && certifications.length > 0 && (
                <>
                  <div className="w-[1px] h-8 bg-[#ddd9d1]"></div>
                  <div>
                    <span className="block text-xl font-black text-black tracking-tight">{certifications.length}</span>
                    <span className="text-[10px] text-[#8a8a8a] uppercase font-semibold">Certifications</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Hero Right Image wrapper */}
          <div className="md:col-span-5 flex justify-center items-center">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72">
              <div className="absolute inset-[-6px] rounded-2xl vp-profile-ring"></div>
              <div className="w-full h-full rounded-2xl overflow-hidden border border-[#ddd9d1] bg-[#f0ede8]">
                {personalInfo.avatarUrl ? (
                  <img src={personalInfo.avatarUrl} alt={personalInfo.fullName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-black text-[#8a8a8a] bg-stone-100">
                    {initials}
                  </div>
                )}
              </div>
              {/* Badges decorations */}
              <div className="vp-profile-badge badge-1" style={{ top: '-12px', right: '15px', background: '#1a1a1a', color: '#f7df1e' }} title="JS"><Code size={18} /></div>
              <div className="vp-profile-badge badge-2" style={{ bottom: '15px', right: '-12px', color: '#68a063' }} title="Node"><Cpu size={18} /></div>
              <div className="vp-profile-badge badge-3" style={{ top: '15px', left: '-12px', color: '#f89820' }} title="Python"><Code size={18} /></div>
              <div className="vp-profile-badge badge-4" style={{ bottom: '-12px', left: '15px', color: '#c8502a' }} title="Fire"><Sparkles size={18} /></div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-[#f8f7f4] border-t border-[#ddd9d1]">
        <div className="max-w-5xl mx-auto px-6 sm:px-12">
          <div className="mb-12">
            <span className="font-mono text-xs uppercase tracking-widest vp-accent-text">// about me</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-black font-display">Who I Am</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div className="space-y-4 text-sm text-[#4a4a4a] leading-relaxed">
              <p>
                I'm a <span className="font-bold text-[#1a1a1a]">Software Developer</span> currently pursuing my academic roadmap. I focus on building efficient, scalable systems and responsive frontends.
              </p>
              <p>
                I specialize in full-stack web architectures, APIs integrations, and competitive problem solving. I write clean, documented code using TypeScript, React, and Node.
              </p>
              
              <div className="space-y-2 pt-4 border-t border-[#ddd9d1] font-semibold text-xs">
                <p className="flex items-center text-[#4a4a4a]"><MapPin size={14} className="mr-2 vp-accent-text" /> <span>{personalInfo.location || 'Hyderabad, India'}</span></p>
                {personalInfo.email && <p className="flex items-center text-[#4a4a4a]"><Mail size={14} className="mr-2 vp-accent-text" /> <a href={`mailto:${personalInfo.email}`} className="underline vp-accent-text">{personalInfo.email}</a></p>}
              </div>
            </div>

            {/* Education log cards */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-black uppercase tracking-wider mb-2">Education Roadmap</h3>
              {education.length > 0 ? (
                education.map((edu, idx) => (
                  <div key={idx} className="vp-card p-4 flex gap-4 items-center">
                    <div className="w-10 h-10 bg-[#f5e8e3] text-[#c8502a] rounded-lg flex items-center justify-center shrink-0"><GraduationCap size={18} /></div>
                    <div className="text-xs">
                      <h4 className="font-bold text-[#1a1a1a]">{edu.degree}</h4>
                      <p className="text-[#8a8a8a]">{edu.college}</p>
                      <div className="flex space-x-3 mt-1 text-[11px] font-semibold">
                        <span className="vp-accent-text font-mono">{edu.year}</span>
                        {edu.grade && <span className="text-[#2a7a4a]">Grade: {edu.grade}</span>}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#8a8a8a]">No education credentials configured.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-24 bg-white border-t border-[#ddd9d1]">
        <div className="max-w-4xl mx-auto px-6 sm:px-12">
          <div className="mb-12 text-center md:text-left">
            <span className="font-mono text-xs uppercase tracking-widest vp-accent-text">// experience</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-black font-display">Work History</h2>
          </div>

          <div className="vp-timeline relative space-y-8 max-w-2xl mx-auto md:mx-0">
            {experience.map((exp, idx) => (
              <div key={idx} className="relative pl-10">
                <span className="absolute left-[7px] top-6 w-4 h-4 rounded-full border-[3px] border-white bg-[#c8502a] shadow-sm"></span>
                <div className="vp-card p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5 border-b border-[#f0ede8] pb-2">
                    <div>
                      <h3 className="text-sm font-bold text-[#1a1a1a]">{exp.role}</h3>
                      <p className="text-[11px] text-[#8a8a8a] font-semibold flex items-center mt-0.5"><Briefcase size={12} className="mr-1" /> {exp.company}</p>
                    </div>
                    <span className="text-[10px] font-mono font-bold vp-accent-text bg-[#f5e8e3] px-2 py-0.5 rounded-md">{exp.duration}</span>
                  </div>
                  <p className="text-xs text-[#4a4a4a] leading-relaxed">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 bg-[#f8f7f4] border-t border-[#ddd9d1]">
        <div className="max-w-5xl mx-auto px-6 sm:px-12">
          <div className="mb-12">
            <span className="font-mono text-xs uppercase tracking-widest vp-accent-text">// projects</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-black font-display">Featured Projects</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {projects.map((proj, idx) => (
              <div key={idx} className="vp-card p-6 flex flex-col justify-between relative overflow-hidden vp-project-card">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="w-10 h-10 bg-[#f5e8e3] text-[#c8502a] rounded-lg flex items-center justify-center"><Code size={18} /></div>
                    <div className="flex space-x-2">
                      {proj.githubLink && (
                        <a href={proj.githubLink} target="_blank" rel="noreferrer" className="text-[#8a8a8a] hover:text-[#1a1a1a]">
                          <FolderGit2 size={16} />
                        </a>
                      )}
                      {proj.liveLink && (
                        <a href={proj.liveLink} target="_blank" rel="noreferrer" className="text-[#8a8a8a] hover:text-black">
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-black uppercase tracking-wide">{proj.title}</h3>
                    <p className="text-xs text-[#4a4a4a] line-clamp-3 leading-relaxed mt-2">{proj.description}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#f0ede8] flex flex-wrap gap-1">
                  {proj.technologies.slice(0, 3).map((t, idx2) => (
                    <span key={idx2} className="text-[9px] font-mono bg-[#f0ede8] border border-[#ddd9d1] text-[#4a4a4a] px-2 py-0.5 rounded">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24 bg-white border-t border-[#ddd9d1]">
        <div className="max-w-5xl mx-auto px-6 sm:px-12">
          <div className="mb-12">
            <span className="font-mono text-xs uppercase tracking-widest vp-accent-text">// skills</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-black font-display">Technical Skills</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Tech pills group card */}
            <div className="vp-card p-6 space-y-4">
              <h3 className="text-xs font-bold text-black uppercase tracking-wider border-b border-[#f0ede8] pb-2">Skills Inventory</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, idx) => (
                  <span key={idx} className="text-xs px-3 py-1.5 border border-[#ddd9d1] hover:border-[#c8502a] text-[#4a4a4a] bg-[#f8f7f4] rounded-lg transition font-mono">
                    {skill.name} <span className="vp-accent-text font-bold ml-1">&#8226; {skill.level}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Certifications and Code Profiles */}
            <div className="space-y-6">
              {certifications && certifications.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-black uppercase tracking-wider">Certifications</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {certifications.map((cert, idx) => (
                      <div key={idx} className="vp-card p-4 flex justify-between items-center text-xs">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded bg-[#f5e8e3] text-[#c8502a] flex items-center justify-center shrink-0"><Award size={16} /></div>
                          <div>
                            <h4 className="font-bold text-[#1a1a1a]">{cert.name}</h4>
                            <p className="text-[#8a8a8a] text-[10px]">{cert.issuer} ({cert.date})</p>
                          </div>
                        </div>
                        {cert.url && (
                          <a href={cert.url} target="_blank" rel="noreferrer" className="text-xs underline vp-accent-text font-bold">View</a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Achievements if list exists */}
              {achievements && achievements.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-black uppercase tracking-wider">Achievements</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {achievements.map((ach, idx) => (
                      <div key={idx} className="vp-card p-4 text-xs space-y-1">
                        <h4 className="font-bold text-[#1a1a1a]">{ach.title}</h4>
                        <p className="text-[#4a4a4a] text-[11px] leading-normal">{ach.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-[#f8f7f4] border-t border-[#ddd9d1]">
        <div className="max-w-5xl mx-auto px-6 sm:px-12">
          <div className="mb-12">
            <span className="font-mono text-xs uppercase tracking-widest vp-accent-text">// contact</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-black font-display">Get In Touch</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Left side details */}
            <div className="space-y-4">
              <p className="text-sm text-[#4a4a4a] leading-relaxed max-w-sm">
                I am currently open to internship offers, contract work, and entry level software roles. Reach out using my direct socials.
              </p>
              
              <div className="space-y-2.5 text-xs">
                {personalInfo.email && (
                  <div className="vp-card p-3.5 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded bg-[#f5e8e3] text-[#c8502a] flex items-center justify-center shrink-0"><Mail size={15} /></div>
                    <div>
                      <span className="text-[10px] text-[#8a8a8a] block">Email</span>
                      <a href={`mailto:${personalInfo.email}`} className="font-bold text-black hover:underline">{personalInfo.email}</a>
                    </div>
                  </div>
                )}
                {socials.linkedin && (
                  <div className="vp-card p-3.5 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded bg-[#f5e8e3] text-[#c8502a] flex items-center justify-center shrink-0"><ExternalLink size={15} /></div>
                    <div>
                      <span className="text-[10px] text-[#8a8a8a] block">LinkedIn</span>
                      <a href={socials.linkedin} target="_blank" rel="noreferrer" className="font-bold text-black hover:underline">LinkedIn Connect</a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right side form */}
            <form className="vp-card p-6 space-y-4 bg-white text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-[#8a8a8a] block mb-1 uppercase tracking-wider">Your Name</label>
                  <input type="text" className="w-full bg-[#f8f7f4] border border-[#ddd9d1] rounded-lg p-2.5 outline-none text-[#1a1a1a] focus:border-[#c8502a]" placeholder="Name" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#8a8a8a] block mb-1 uppercase tracking-wider">Your Email</label>
                  <input type="email" className="w-full bg-[#f8f7f4] border border-[#ddd9d1] rounded-lg p-2.5 outline-none text-[#1a1a1a] focus:border-[#c8502a]" placeholder="Email" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#8a8a8a] block mb-1 uppercase tracking-wider">Subject</label>
                <input type="text" className="w-full bg-[#f8f7f4] border border-[#ddd9d1] rounded-lg p-2.5 outline-none text-[#1a1a1a] focus:border-[#c8502a]" placeholder="Collaboration" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#8a8a8a] block mb-1 uppercase tracking-wider">Message</label>
                <textarea rows={4} className="w-full bg-[#f8f7f4] border border-[#ddd9d1] rounded-lg p-2.5 outline-none text-[#1a1a1a] focus:border-[#c8502a] leading-normal" placeholder="Hello..."></textarea>
              </div>
              <button type="button" className="w-full bg-[#1a1a1a] hover:bg-[#c8502a] text-[#f8f7f4] font-bold py-3 rounded-lg transition duration-200 uppercase tracking-wider">Send Message</button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] py-8 text-center text-xs text-[#8a8a8a] font-mono border-t border-[#ddd9d1]/20">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-white font-bold">&lt;{initials} /&gt;</span>
          <p>Designed & Built by <span className="vp-accent-text font-bold">{personalInfo.fullName || 'Graduate'}</span> &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

