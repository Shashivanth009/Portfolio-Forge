import React from 'react';
import { PortfolioData } from '../context/store';
import { BadgeCheck, Calendar, Phone, Mail, Link2, DollarSign, Award, Grid } from 'lucide-react';

interface TemplateProps {
  data: PortfolioData;
}

function getFontClass(font: string) {
  if (font === 'mono') return 'font-mono';
  if (font === 'display') return 'font-display';
  return 'font-sans';
}

/* ============================================================================
   13. FREELANCER PRO TEMPLATE
   ============================================================================ */
export const FreelancerPro: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, socials, experience, projects, skills, themeConfig } = data;

  const dynamicStyles = {
    '--primary': themeConfig.primaryColor || '#a855f7', // Purple-500
    '--secondary': themeConfig.secondaryColor || '#6366f1', // Indigo-500
    '--bg': themeConfig.backgroundColor || '#090514',
    '--radius': themeConfig.borderRadius || '16px',
  } as React.CSSProperties;

  return (
    <div 
      style={dynamicStyles}
      className={`min-h-screen text-gray-200 ${getFontClass(themeConfig.fontFamily)} bg-[#090514]`}
    >
      <style>{`
        .fl-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: var(--radius); }
        .text-fl-primary { color: var(--primary); }
        .bg-fl-primary { background-color: var(--primary); }
        .border-fl-primary { border-color: var(--primary); }
        .btn-fl { background: linear-gradient(135deg, var(--primary), var(--secondary)); border-radius: var(--radius); color: white; border: none; font-weight: bold; }
        .btn-fl:hover { opacity: 0.9; }
      `}</style>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">
        {/* Banner with profile */}
        <header className="fl-card p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-4 max-w-2xl text-center md:text-left">
            <span className="text-[10px] font-bold tracking-widest text-purple-400 bg-purple-950/40 border border-purple-900 px-3 py-1 rounded-full uppercase">AVAILABLE FOR FREELANCE CONTRACTS</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{personalInfo.fullName || 'Freelancer Pro'}</h1>
            <p className="text-sm text-gray-300 leading-relaxed">{personalInfo.bio || 'Your freelance business services summary goes here.'}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <a href="#contact" className="btn-fl px-6 py-2.5 text-xs">Hire Me Now</a>
              <a href="#services" className="bg-gray-900 border border-gray-800 hover:bg-gray-800 text-xs text-white px-6 py-2.5 rounded font-bold" style={{borderRadius: 'var(--radius)'}}>Our Services</a>
            </div>
          </div>
          {personalInfo.avatarUrl && (
            <div className="w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden border-2 border-purple-500 shrink-0">
              <img src={personalInfo.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            </div>
          )}
        </header>

        {/* Pricing / Services Grid */}
        <section id="services" className="space-y-6">
          <h2 className="text-xl font-extrabold text-white flex items-center px-1">
            <DollarSign size={20} className="mr-2 text-purple-500" /> Services & Rates
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="fl-card p-6 space-y-4 border-t-4 border-fl-primary">
              <h3 className="text-sm font-bold text-white uppercase">Basic Package</h3>
              <p className="text-2xl font-black text-white">$499 <span className="text-xs text-gray-400 font-normal">/ project</span></p>
              <p className="text-xs text-gray-400 leading-relaxed">Perfect for simple landing pages, portfolio setup, and basic customizations.</p>
              <ul className="text-xs space-y-2 text-gray-300 pt-2">
                <li className="flex items-center"><BadgeCheck size={14} className="mr-2 text-purple-500" /> 1-Page Layout</li>
                <li className="flex items-center"><BadgeCheck size={14} className="mr-2 text-purple-500" /> Responsive Design</li>
                <li className="flex items-center"><BadgeCheck size={14} className="mr-2 text-purple-500" /> Deployment Ready</li>
              </ul>
            </div>
            
            <div className="fl-card p-6 space-y-4 border-t-4 border-indigo-500 scale-[1.03] bg-purple-950/10">
              <span className="text-[9px] bg-indigo-500 text-white font-bold px-2 py-0.5 rounded-full uppercase absolute top-2 right-2">POPULAR</span>
              <h3 className="text-sm font-bold text-white uppercase">Standard Pro</h3>
              <p className="text-2xl font-black text-white">$999 <span className="text-xs text-gray-400 font-normal">/ project</span></p>
              <p className="text-xs text-gray-400 leading-relaxed">Full-featured business site, portfolio showcase, custom analytics, and SEO optimization.</p>
              <ul className="text-xs space-y-2 text-gray-300 pt-2">
                <li className="flex items-center"><BadgeCheck size={14} className="mr-2 text-indigo-500" /> Up to 5 Pages</li>
                <li className="flex items-center"><BadgeCheck size={14} className="mr-2 text-indigo-500" /> Visual Theme Editors</li>
                <li className="flex items-center"><BadgeCheck size={14} className="mr-2 text-indigo-500" /> Custom CMS Integration</li>
              </ul>
            </div>

            <div className="fl-card p-6 space-y-4 border-t-4 border-pink-500">
              <h3 className="text-sm font-bold text-white uppercase">Enterprise CMS</h3>
              <p className="text-2xl font-black text-white">$1,999 <span className="text-xs text-gray-400 font-normal">/ project</span></p>
              <p className="text-xs text-gray-400 leading-relaxed">Full stack application, PostgreSQL database integration, auth system setup, and dedicated support.</p>
              <ul className="text-xs space-y-2 text-gray-300 pt-2">
                <li className="flex items-center"><BadgeCheck size={14} className="mr-2 text-pink-500" /> Complete Web App</li>
                <li className="flex items-center"><BadgeCheck size={14} className="mr-2 text-pink-500" /> Database & API setups</li>
                <li className="flex items-center"><BadgeCheck size={14} className="mr-2 text-pink-500" /> 1 Month Free Support</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Selected works */}
        <section className="space-y-6">
          <h2 className="text-xl font-extrabold text-white flex items-center px-1">
            <Grid size={20} className="mr-2 text-purple-500" /> Selected Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {projects.map((proj, idx) => (
              <div key={idx} className="fl-card p-6 flex flex-col justify-between hover:scale-[1.01] transition">
                <div>
                  <h3 className="text-base font-bold text-white mb-2">{proj.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed mb-4">{proj.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {proj.technologies.map((t, idx2) => (
                      <span key={idx2} className="text-[10px] bg-purple-950/20 text-purple-400 border border-purple-950/40 px-2.5 py-0.5 rounded">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-4 text-xs font-semibold pt-4 border-t border-gray-900/60 mt-4">
                  {proj.githubLink && <a href={proj.githubLink} className="text-gray-400 hover:text-white flex items-center"><Link2 size={12} className="mr-1" /> REPO</a>}
                  {proj.liveLink && <a href={proj.liveLink} className="text-purple-400 hover:underline">LIVE PREVIEW</a>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Core skills & experience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Skill Tag Cloud */}
          <div className="fl-card p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">Core Capabilities</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <span key={idx} className="text-xs px-3 py-1 bg-purple-950/30 border border-purple-900/60 text-purple-300 rounded-full font-semibold">
                  {skill.name} ({skill.level}/5)
                </span>
              ))}
            </div>
          </div>

          {/* Client Experience */}
          <div className="fl-card p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">Client Experience</h2>
            <div className="space-y-4">
              {experience.map((exp, idx) => (
                <div key={idx} className="border-l border-purple-900 pl-4 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <h4 className="font-bold text-white">{exp.role}</h4>
                    <span className="text-[10px] text-gray-500">{exp.duration}</span>
                  </div>
                  <p className="text-xs text-purple-400 font-semibold">{exp.company}</p>
                  <p className="text-xs text-gray-400 leading-normal">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Contact */}
        <section id="contact" className="fl-card p-8 text-center space-y-4 bg-gradient-to-r from-purple-950/20 to-indigo-950/20 border-purple-900/40">
          <h2 className="text-xl font-extrabold text-white">Start Your Project Today</h2>
          <p className="text-xs text-gray-400 max-w-md mx-auto">Get in touch to align on timelines, requirements, and custom pricing models.</p>
          <div className="flex justify-center space-x-6 pt-3 text-xs font-semibold">
            {personalInfo.email && <a href={`mailto:${personalInfo.email}`} className="text-purple-400 hover:underline flex items-center"><Mail size={12} className="mr-1" /> {personalInfo.email}</a>}
            {personalInfo.phone && <span className="flex items-center text-gray-400"><Phone size={12} className="mr-1" /> {personalInfo.phone}</span>}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-xs text-gray-700 font-mono border-t border-gray-900/60 pt-6">
          &copy; {new Date().getFullYear()} Freelancer Pro Studio. Powered by PortfolioForge.
        </footer>
      </div>
    </div>
  );
};

/* ============================================================================
   14. CREATIVE STUDIO TEMPLATE
   ============================================================================ */
export const CreativeStudio: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experience, projects, themeConfig } = data;

  return (
    <div className="min-h-screen bg-black text-white p-6 sm:p-16 font-sans">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="space-y-4">
          <span className="text-[10px] bg-white text-black font-black uppercase px-2 py-0.5 tracking-widest">CREATIVE STUDIO</span>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl uppercase font-display text-white">
            {personalInfo.fullName || 'Creative Studio'}
          </h1>
          <p className="text-xs text-gray-400 max-w-xl leading-relaxed">{personalInfo.bio}</p>
        </header>

        {/* Full bleed grids of project items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-900">
          {projects.map((proj, idx) => (
            <div key={idx} className="group relative overflow-hidden bg-gray-900 border border-gray-800 p-6 flex flex-col justify-between h-64 hover:border-white transition duration-300">
              <div>
                <span className="text-[9px] text-gray-500 font-mono">PROJECT_0{idx + 1}</span>
                <h3 className="text-xl font-bold uppercase tracking-wider text-white mt-1 group-hover:text-yellow-400 transition">{proj.title}</h3>
                <p className="text-xs text-gray-400 mt-2 line-clamp-3 leading-relaxed">{proj.description}</p>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-gray-800 pt-3">
                <span className="text-[10px] font-mono text-gray-500">{proj.technologies.slice(0, 3).join(' / ')}</span>
                {proj.liveLink && (
                  <a href={proj.liveLink} className="underline text-white font-bold group-hover:text-yellow-400 transition">LAUNCH</a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Experience log */}
        <div className="space-y-6 pt-10 border-t border-gray-900">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">EXPERIENCE & ENGAGEMENTS</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {experience.map((exp, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-white uppercase">{exp.role}</h4>
                  <span className="text-gray-500 font-mono">{exp.duration}</span>
                </div>
                <p className="text-yellow-400 font-semibold">{exp.company}</p>
                <p className="text-gray-400 leading-normal pt-2">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Connect desk */}
        <footer className="pt-12 border-t border-gray-950 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-gray-600">
          <span>&copy; {new Date().getFullYear()} STUDIO ENGINE</span>
          {personalInfo.email && <a href={`mailto:${personalInfo.email}`} className="hover:text-white uppercase transition">{personalInfo.email}</a>}
        </footer>
      </div>
    </div>
  );
};

/* ============================================================================
   15. CONSULTANT TEMPLATE
   ============================================================================ */
export const Consultant: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, education, experience, skills, themeConfig } = data;

  return (
    <div className="min-h-screen bg-[#fafaf9] text-stone-800 p-8 sm:p-16 font-serif">
      <div className="max-w-3xl mx-auto space-y-12">
        <header className="space-y-4 border-b border-stone-200 pb-8">
          <span className="text-[10px] font-sans uppercase tracking-widest text-stone-500 font-semibold">Advisory & Consultancy</span>
          <h1 className="text-3xl sm:text-4xl font-normal text-stone-900 leading-tight">
            {personalInfo.fullName || 'Advisor Name'}
          </h1>
          <p className="text-xs font-sans text-stone-500">{personalInfo.location || 'Consulting Firm'}</p>
          <p className="text-sm font-sans text-stone-600 max-w-xl leading-relaxed italic">{personalInfo.bio}</p>
        </header>

        {/* Consulting layout details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 font-sans">
          {/* Work logs */}
          <div className="space-y-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-400 border-b border-stone-200 pb-2">ADVISORY HISTORY</h2>
            <div className="space-y-6">
              {experience.map((exp, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between items-center font-bold text-stone-900">
                    <span>{exp.role}</span>
                    <span className="text-stone-400 font-normal font-mono">{exp.duration}</span>
                  </div>
                  <p className="text-stone-600 font-semibold">{exp.company}</p>
                  <p className="text-stone-500 leading-relaxed mt-2">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Details column */}
          <div className="space-y-8">
            {/* Expertise */}
            <div className="space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-400 border-b border-stone-200 pb-2">EXPERT FIELDS</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, idx) => (
                  <span key={idx} className="text-xs bg-stone-100 border border-stone-200 text-stone-700 px-3.5 py-1 rounded-md">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Academic history */}
            <div className="space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-400 border-b border-stone-200 pb-2">EDUCATION</h2>
              <div className="space-y-3 text-xs">
                {education.map((edu, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <h4 className="font-bold text-stone-900">{edu.degree}</h4>
                    <p className="text-stone-500">{edu.college} ({edu.year})</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="border border-stone-200 p-6 text-center space-y-3 font-sans text-xs bg-stone-50 rounded-lg">
          <h4 className="font-semibold text-stone-900">Schedule a consultation</h4>
          <p className="text-stone-500">Inquire about client bookings, project scopes, and retainer agreements.</p>
          <div className="pt-2">
            {personalInfo.email && <a href={`mailto:${personalInfo.email}`} className="text-stone-800 font-bold underline hover:text-stone-500">{personalInfo.email}</a>}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center font-sans text-[10px] text-stone-400 uppercase pt-6">
          &copy; {new Date().getFullYear()} ADVISOR PORTFOLIO // PortfolioForge
        </footer>
      </div>
    </div>
  );
};
