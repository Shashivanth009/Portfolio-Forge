import React from 'react';
import { PortfolioData } from '../context/store';
import { Sparkles, Palette, Layers, Compass, Mail, Link2, Monitor } from 'lucide-react';

interface TemplateProps {
  data: PortfolioData;
}

function getFontClass(font: string) {
  if (font === 'mono') return 'font-mono';
  if (font === 'display') return 'font-display';
  return 'font-sans';
}

/* ============================================================================
   9. AURORA TEMPLATE
   ============================================================================ */
export const Aurora: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, socials, education, experience, projects, skills, themeConfig } = data;

  const dynamicStyles = {
    '--primary': themeConfig.primaryColor || '#ec4899', // Pink-500
    '--secondary': themeConfig.secondaryColor || '#8b5cf6', // Violet-500
    '--accent': themeConfig.accentColor || '#3b82f6', // Blue-500
    '--bg': themeConfig.backgroundColor || '#0b0f19',
    '--radius': themeConfig.borderRadius || '24px', // Rounder shapes for designer
  } as React.CSSProperties;

  return (
    <div 
      style={dynamicStyles}
      className={`min-h-screen text-gray-100 ${getFontClass(themeConfig.fontFamily)} relative overflow-hidden bg-[#0b0f19]`}
    >
      <style>{`
        .aurora-blur-1 { position: absolute; top: 10%; left: -10%; width: 300px; height: 300px; border-radius: 50%; background: var(--primary); opacity: 0.15; filter: blur(80px); pointer-events: none; }
        .aurora-blur-2 { position: absolute; bottom: 10%; right: -10%; width: 400px; height: 400px; border-radius: 50%; background: var(--secondary); opacity: 0.15; filter: blur(100px); pointer-events: none; }
        .designer-card { background: rgba(255,255,255,0.03); backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.08); border-radius: var(--radius); }
        .text-designer-glow { text-shadow: 0 0 10px rgba(236, 72, 153, 0.3); }
        .gradient-text { background: linear-gradient(135deg, var(--primary), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .btn-aurora { background: linear-gradient(135deg, var(--primary), var(--secondary)); border-radius: var(--radius); color: white; border: none; }
        .btn-aurora:hover { filter: brightness(1.1); }
      `}</style>

      {/* Decorative Blurs */}
      <div className="aurora-blur-1"></div>
      <div className="aurora-blur-2"></div>

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-16 relative z-10">
        
        {/* Designer Hero */}
        <header className="designer-card p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-6 max-w-2xl text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-400 bg-pink-950/30 border border-pink-900/60 px-3.5 py-1 rounded-full flex items-center w-fit mx-auto md:mx-0">
              <Sparkles size={12} className="mr-1.5" /> CREATIVE PORTFOLIO
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Design & Development by <br />
              <span className="gradient-text font-display">{personalInfo.fullName || 'Aurora Creative'}</span>
            </h1>
            <p className="text-sm text-gray-300 leading-relaxed">{personalInfo.bio || 'Crafting gorgeous digital experiences combining aesthetics with robust code.'}</p>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="#projects" className="btn-aurora px-6 py-3 text-xs font-bold transition shadow-lg shadow-pink-900/20">EXPLORE WORK</a>
              {personalInfo.email && <a href={`mailto:${personalInfo.email}`} className="text-xs font-bold hover:text-pink-400 transition flex items-center"><Mail size={14} className="mr-1.5" /> MESSAGE ME</a>}
            </div>
          </div>
          {personalInfo.avatarUrl && (
            <div className="w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden border-2 border-pink-500/50 shadow-2xl shrink-0">
              <img src={personalInfo.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            </div>
          )}
        </header>

        {/* Selected Works Grids */}
        <div id="projects" className="space-y-6">
          <h2 className="text-xl font-extrabold text-white flex items-center px-2">
            <Palette size={20} className="mr-2 text-pink-500" /> SELECTED ARTIFACTS
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {projects.map((proj, idx) => (
              <div key={idx} className="designer-card p-6 flex flex-col justify-between hover:scale-[1.02] transition duration-300">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{proj.title}</h3>
                  <p className="text-xs text-gray-300 leading-relaxed mb-4">{proj.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {proj.technologies.map((t, idx2) => (
                      <span key={idx2} className="text-[10px] bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full text-pink-300">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-4 text-xs font-semibold pt-2 border-t border-white/5">
                  {proj.githubLink && <a href={proj.githubLink} className="text-gray-400 hover:text-white flex items-center"><Link2 size={12} className="mr-1" /> REPO</a>}
                  {proj.liveLink && <a href={proj.liveLink} className="text-pink-400 hover:underline flex items-center"><Monitor size={12} className="mr-1" /> DEMO</a>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills & Experience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Skills */}
          <div className="designer-card p-6 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center">
              <Layers size={18} className="mr-2 text-pink-500" /> CREATIVE STACK
            </h2>
            <div className="space-y-4">
              {skills.map((skill, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>{skill.name}</span>
                    <span className="text-pink-400">{skill.level}/5</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-pink-500 to-violet-500" style={{ width: `${(skill.level / 5) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Work details */}
          <div className="designer-card p-6 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center">
              <Compass size={18} className="mr-2 text-pink-500" /> TIMELINE JOURNEY
            </h2>
            <div className="space-y-6">
              {experience.map((exp, idx) => (
                <div key={idx} className="relative pl-6 border-l border-white/10 space-y-1">
                  <span className="absolute left-[-4px] top-1.5 w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-violet-500"></span>
                  <div className="flex justify-between items-center text-xs">
                    <h4 className="font-bold text-white">{exp.role}</h4>
                    <span className="text-[10px] text-gray-400">{exp.duration}</span>
                  </div>
                  <p className="text-xs text-pink-400">{exp.company}</p>
                  <p className="text-xs text-gray-300 leading-normal mt-2">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-gray-600 font-mono pt-8 border-t border-white/5">
          &copy; {new Date().getFullYear()} Aurora Creative Studio. Powered by PortfolioForge.
        </footer>
      </div>
    </div>
  );
};

/* ============================================================================
   10. NEO TEMPLATE
   ============================================================================ */
export const Neo: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, socials, education, experience, projects, skills } = data;

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-black p-6 sm:p-12 font-sans selection:bg-black selection:text-white">
      <style>{`
        .neo-card { background: white; border: 4px solid black; box-shadow: 6px 6px 0px black; }
        .neo-card-accent { background: #facc15; border: 4px solid black; box-shadow: 6px 6px 0px black; }
        .neo-card-cyan { background: #22d3ee; border: 4px solid black; box-shadow: 6px 6px 0px black; }
        .neo-btn { background: #f472b6; border: 4px solid black; box-shadow: 4px 4px 0px black; font-weight: bold; transition: all 0.1s ease; }
        .neo-btn:hover { box-shadow: 2px 2px 0px black; transform: translate(2px, 2px); }
      `}</style>

      <div className="max-w-4xl mx-auto space-y-10">
        {/* Neo Brutalist Header */}
        <header className="neo-card-accent p-8 space-y-4">
          <span className="text-xs font-mono font-black uppercase tracking-widest border-2 border-black bg-white px-2 py-0.5 shadow-[2px_2px_0px_black]">CREATIVE RADICAL</span>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight font-display text-black">{personalInfo.fullName || 'Neo Creator'}</h1>
          <p className="text-sm font-bold border-t-2 border-black pt-2 max-w-2xl">{personalInfo.bio}</p>
        </header>

        {/* Info widgets row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="neo-card p-6 space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">LOCATION</h3>
            <p className="text-sm font-black">{personalInfo.location || 'PLANET EARTH'}</p>
          </div>
          <div className="neo-card p-6 space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">COMMUNICATION</h3>
            <a href={`mailto:${personalInfo.email}`} className="text-sm font-black underline hover:text-[#f472b6]">{personalInfo.email || 'operator@neo.net'}</a>
          </div>
          <div className="neo-card p-6 space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">CONNECT</h3>
            <div className="flex space-x-3 text-xs font-black">
              {socials.github && <a href={socials.github} className="underline hover:text-[#f472b6]">Github</a>}
              {socials.linkedin && <a href={socials.linkedin} className="underline hover:text-[#f472b6]">LinkedIn</a>}
            </div>
          </div>
        </div>

        {/* Selected works */}
        <div className="space-y-4">
          <h2 className="text-xl font-black uppercase tracking-widest px-1">Selected Artifacts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {projects.map((proj, idx) => (
              <div key={idx} className="neo-card p-6 flex flex-col justify-between bg-white">
                <div>
                  <h3 className="text-lg font-black uppercase tracking-wider mb-2">{proj.title}</h3>
                  <p className="text-xs text-slate-600 mb-4 leading-relaxed font-semibold">{proj.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {proj.technologies.map((t, idx2) => (
                      <span key={idx2} className="text-[10px] font-mono border border-black bg-[#22d3ee] px-2 py-0.5 rounded shadow-[1px_1px_0px_black] text-black font-bold">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-4 text-xs font-black border-t-2 border-black pt-3">
                  {proj.githubLink && <a href={proj.githubLink} className="underline">Source Code</a>}
                  {proj.liveLink && <a href={proj.liveLink} className="underline text-[#f472b6]">Live Demo</a>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grid for Skills and experience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Skills */}
          <div className="neo-card p-6 space-y-6">
            <h2 className="text-base font-black uppercase tracking-widest border-b-2 border-black pb-2">Technical Engine</h2>
            <div className="space-y-3 font-semibold">
              {skills.map((skill, idx) => (
                <div key={idx} className="text-xs border-2 border-black p-3 bg-white shadow-[2px_2px_0px_black] flex justify-between items-center">
                  <span>{skill.name}</span>
                  <span className="bg-black text-white px-2 py-0.5 text-[10px] font-black">LVL: {skill.level}/5</span>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="neo-card-cyan p-6 space-y-6">
            <h2 className="text-base font-black uppercase tracking-widest border-b-2 border-black pb-2 text-black">Work Engagements</h2>
            <div className="space-y-4 text-black">
              {experience.map((exp, idx) => (
                <div key={idx} className="border-2 border-black p-4 bg-white shadow-[3px_3px_0px_black] space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-black uppercase">{exp.role}</span>
                    <span className="text-[10px] font-mono bg-black text-white px-1 py-0.5">{exp.duration}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-600">{exp.company}</h4>
                  <p className="text-[11px] font-medium leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center font-mono text-xs font-black uppercase py-4 border-2 border-black bg-white shadow-[4px_4px_0px_black]">
          Neo Brutalism Design &copy; {new Date().getFullYear()} // PortfolioForge
        </footer>
      </div>
    </div>
  );
};
