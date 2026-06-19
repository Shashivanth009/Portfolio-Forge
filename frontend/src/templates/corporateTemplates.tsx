import React from 'react';
import { PortfolioData } from '../context/store';
import { Briefcase, Award, Mail, Phone, MapPin, CheckCircle } from 'lucide-react';

interface TemplateProps {
  data: PortfolioData;
}

function getFontClass(font: string) {
  if (font === 'mono') return 'font-mono';
  if (font === 'display') return 'font-display';
  return 'font-sans';
}

/* ============================================================================
   11. EXECUTIVE TEMPLATE
   ============================================================================ */
export const Executive: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, socials, education, experience, projects, skills, achievements, themeConfig } = data;

  const dynamicStyles = {
    '--primary': themeConfig.primaryColor || '#1e3a8a', // Navy-900
    '--secondary': themeConfig.secondaryColor || '#3b82f6', // Blue-500
    '--bg': themeConfig.backgroundColor || '#ffffff',
    '--radius': themeConfig.borderRadius || '6px',
  } as React.CSSProperties;

  return (
    <div 
      style={dynamicStyles}
      className={`min-h-screen text-slate-800 bg-white p-6 sm:p-16 ${getFontClass(themeConfig.fontFamily)}`}
    >
      <style>{`
        .exec-border { border-color: var(--primary); }
        .text-exec-primary { color: var(--primary); }
        .bg-exec-primary { background-color: var(--primary); }
        .card-exec { border: 1px solid #e2e8f0; border-radius: var(--radius); background: #f8fafc; }
      `}</style>

      <div className="max-w-4xl mx-auto space-y-12">
        {/* Professional Header */}
        <header className="border-b pb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{personalInfo.fullName || 'Executive Leader'}</h1>
            <p className="text-sm font-semibold text-exec-primary tracking-wide uppercase">Senior Professional // Executive Profile</p>
            <div className="flex flex-wrap gap-4 text-xs text-slate-500 font-medium pt-1">
              <span className="flex items-center"><MapPin size={12} className="mr-1" /> {personalInfo.location || 'Corporate HQ'}</span>
              <span className="flex items-center"><Mail size={12} className="mr-1" /> {personalInfo.email}</span>
              {personalInfo.phone && <span className="flex items-center"><Phone size={12} className="mr-1" /> {personalInfo.phone}</span>}
            </div>
          </div>
          {personalInfo.avatarUrl && (
            <div className="w-24 h-24 rounded-lg overflow-hidden border border-slate-200 shrink-0">
              <img src={personalInfo.avatarUrl} alt="Executive" className="w-full h-full object-cover" />
            </div>
          )}
        </header>

        {/* Bio summary */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Professional Summary</h2>
          <p className="text-sm text-slate-700 leading-relaxed font-serif">{personalInfo.bio}</p>
        </section>

        {/* Core Timeline (Experience) */}
        <section className="space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Career History</h2>
          <div className="space-y-6">
            {experience.map((exp, idx) => (
              <div key={idx} className="relative pl-6 border-l-2 border-slate-200">
                <span className="absolute left-[-6px] top-1.5 w-2.5 h-2.5 rounded-full bg-exec-primary"></span>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 mb-1">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">{exp.role}</h3>
                  <span className="text-[10px] text-slate-500 font-bold bg-slate-100 border px-2 py-0.5 rounded">{exp.duration}</span>
                </div>
                <h4 className="text-xs text-exec-primary font-semibold">{exp.company}</h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Grid for projects & skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Key skills */}
          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Core Competencies</h2>
            <div className="grid grid-cols-2 gap-3">
              {skills.map((skill, idx) => (
                <div key={idx} className="flex items-center text-xs text-slate-700 font-medium">
                  <CheckCircle size={14} className="mr-2 text-exec-primary" /> {skill.name}
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Academic Background</h2>
            <div className="space-y-4">
              {education.map((edu, idx) => (
                <div key={idx} className="text-xs">
                  <h4 className="font-bold text-slate-800">{edu.degree}</h4>
                  <p className="text-slate-500">{edu.college} ({edu.year})</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Strategic Case Studies (Projects) */}
        {projects && projects.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Significant Initiatives</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.map((proj, idx) => (
                <div key={idx} className="card-exec p-5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">{proj.title}</h3>
                    <p className="text-[11px] text-slate-500 line-clamp-3 leading-relaxed mb-4">{proj.description}</p>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold text-exec-primary pt-2 border-t">
                    <span>Tech: {proj.technologies.slice(0, 2).join(', ')}</span>
                    {proj.liveLink && <a href={proj.liveLink} className="hover:underline">View Case Study</a>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="border-t pt-6 text-center text-[10px] text-slate-400 font-mono uppercase">
          Confidential Portfolio Profile // &copy; {new Date().getFullYear()} Executive Group
        </footer>
      </div>
    </div>
  );
};

/* ============================================================================
   12. ENTERPRISE TEMPLATE
   ============================================================================ */
export const Enterprise: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, education, experience, projects, skills, themeConfig } = data;

  const dynamicStyles = {
    '--primary': themeConfig.primaryColor || '#0284c7', // Sky-600
    '--secondary': themeConfig.secondaryColor || '#0369a1', // Sky-700
    '--bg': themeConfig.backgroundColor || '#f0f9ff', // Light sky
    '--radius': themeConfig.borderRadius || '8px',
  } as React.CSSProperties;

  return (
    <div 
      style={dynamicStyles}
      className={`min-h-screen text-slate-800 bg-[#f8fafc] p-6 sm:p-12 ${getFontClass(themeConfig.fontFamily)}`}
    >
      <style>{`
        .enterprise-card { background: white; border-radius: var(--radius); border: 1px solid #e2e8f0; }
        .text-primary-ent { color: var(--primary); }
      `}</style>

      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Banner with Corporate Colors */}
        <header className="enterprise-card p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-sm border-l-4" style={{borderLeftColor: 'var(--primary)'}}>
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-[10px] font-bold tracking-widest text-primary-ent bg-sky-50 px-2 py-0.5 border border-sky-100 rounded">ENTERPRISE CONSULTANT</span>
            <h1 className="text-2xl font-bold text-slate-900">{personalInfo.fullName || 'Consultant Profile'}</h1>
            <p className="text-xs text-slate-500 font-medium">{personalInfo.location || 'Global Operations'}</p>
            <p className="text-xs text-slate-600 max-w-xl leading-relaxed">{personalInfo.bio}</p>
          </div>
          {personalInfo.avatarUrl && (
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-200 shrink-0">
              <img src={personalInfo.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            </div>
          )}
        </header>

        {/* Main timeline grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Work (Col 1 & 2) */}
          <div className="md:col-span-2 space-y-6">
            <div className="enterprise-card p-6 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b pb-2 flex items-center">
                <Briefcase size={14} className="mr-2 text-primary-ent" /> Professional Log
              </h2>
              <div className="space-y-4">
                {experience.map((exp, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                      <span>{exp.role}</span>
                      <span className="text-slate-400 font-normal">{exp.duration}</span>
                    </div>
                    <p className="text-[11px] text-primary-ent font-semibold">{exp.company}</p>
                    <p className="text-[11px] text-slate-500 leading-normal">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Education & Skills (Col 3) */}
          <div className="space-y-6">
            {/* Skills */}
            <div className="enterprise-card p-6 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b pb-2 flex items-center">
                <Award size={14} className="mr-2 text-primary-ent" /> Expertise
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, idx) => (
                  <span key={idx} className="text-[10px] bg-slate-100 border text-slate-600 px-2.5 py-0.5 rounded font-semibold">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="enterprise-card p-6 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b pb-2 flex items-center">
                Credentials
              </h2>
              <div className="space-y-3">
                {education.map((edu, idx) => (
                  <div key={idx} className="text-xs">
                    <h4 className="font-bold text-slate-800">{edu.degree}</h4>
                    <p className="text-slate-500">{edu.college} ({edu.year})</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Projects / Case Studies */}
        <div className="enterprise-card p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b pb-2">Deployments & Client Case Studies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {projects.map((proj, idx) => (
              <div key={idx} className="border p-4 rounded bg-slate-50/50 space-y-2 text-xs">
                <h4 className="font-bold text-slate-800 uppercase tracking-wide">{proj.title}</h4>
                <p className="text-slate-500 line-clamp-3 leading-normal">{proj.description}</p>
                {proj.liveLink && (
                  <a href={proj.liveLink} className="text-primary-ent hover:underline font-semibold block pt-1">Verify Output &rarr;</a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact info banner */}
        <div className="enterprise-card p-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-sky-50/50 border-sky-100 text-xs">
          <span>Need consultation services? Reach out directly.</span>
          <div className="flex space-x-4">
            {personalInfo.email && <a href={`mailto:${personalInfo.email}`} className="text-primary-ent hover:underline font-bold">Email Desk</a>}
          </div>
        </div>
      </div>
    </div>
  );
};
