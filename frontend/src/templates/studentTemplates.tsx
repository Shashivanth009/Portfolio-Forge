import React from 'react';
import { PortfolioData } from '../context/store';
import { GraduationCap, Award, BookOpen, Compass, Mail, Globe, MapPin } from 'lucide-react';

interface TemplateProps {
  data: PortfolioData;
}

function getFontClass(font: string) {
  if (font === 'mono') return 'font-mono';
  if (font === 'display') return 'font-display';
  return 'font-sans';
}

/* ============================================================================
   7. CAMPUS TEMPLATE
   ============================================================================ */
export const Campus: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, socials, education, experience, projects, skills, achievements, themeConfig } = data;

  const dynamicStyles = {
    '--primary': themeConfig.primaryColor || '#4f46e5', // Indigo-600
    '--secondary': themeConfig.secondaryColor || '#0ea5e9', // Sky-500
    '--bg': themeConfig.backgroundColor || '#f8fafc', // Slate-50 (light mode template!)
    '--radius': themeConfig.borderRadius || '12px',
  } as React.CSSProperties;

  return (
    <div 
      style={dynamicStyles}
      className={`min-h-screen text-slate-800 bg-[#f8fafc] p-6 sm:p-12 ${getFontClass(themeConfig.fontFamily)}`}
    >
      <style>{`
        .campus-card { background: white; border-radius: var(--radius); border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .text-campus-primary { color: var(--primary); }
        .bg-campus-primary { background-color: var(--primary); }
      `}</style>

      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Banner Card */}
        <header className="campus-card p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-campus-primary bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">STUDENT PROFILE</span>
            <h1 className="text-3xl font-extrabold text-slate-900">{personalInfo.fullName || 'Alex Student'}</h1>
            <p className="text-sm text-slate-500 flex items-center justify-center sm:justify-start">
              <MapPin size={14} className="mr-1" /> {personalInfo.location || 'University Campus'}
            </p>
            <p className="text-sm text-slate-600 max-w-xl">{personalInfo.bio || 'Aspiring engineer looking for internship opportunities.'}</p>
          </div>
          {personalInfo.avatarUrl && (
            <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-indigo-600 shadow-md shrink-0">
              <img src={personalInfo.avatarUrl} alt="Alex" className="w-full h-full object-cover" />
            </div>
          )}
        </header>

        {/* Education & Achievements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Education */}
          <div className="campus-card p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center border-b pb-2">
              <GraduationCap className="mr-2 text-campus-primary" size={20} /> Education Detail
            </h2>
            <div className="space-y-4">
              {education.map((edu, idx) => (
                <div key={idx} className="relative pl-4 border-l-2 border-slate-200">
                  <h3 className="text-sm font-bold text-slate-800">{edu.degree}</h3>
                  <p className="text-xs text-slate-500">{edu.college}</p>
                  <p className="text-xs text-campus-primary font-semibold mt-0.5">{edu.year} {edu.grade ? `| Score: ${edu.grade}` : ''}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="campus-card p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center border-b pb-2">
              <Award className="mr-2 text-campus-primary" size={20} /> Accomplishments
            </h2>
            <div className="space-y-4">
              {achievements && achievements.map((ach, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <h4 className="font-bold text-slate-800">{ach.title}</h4>
                    <span className="text-slate-400 text-[10px]">{ach.date}</span>
                  </div>
                  <p className="text-xs text-slate-500">{ach.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Projects */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 px-2 flex items-center">
            <BookOpen className="mr-2 text-campus-primary" size={20} /> Campus Work & Projects
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.map((proj, idx) => (
              <div key={idx} className="campus-card p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{proj.title}</h3>
                  <p className="text-xs text-slate-500 mb-4">{proj.description}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {proj.technologies.map((t, idx2) => (
                      <span key={idx2} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-3 text-xs border-t pt-3 font-semibold">
                  {proj.githubLink && <a href={proj.githubLink} className="text-slate-500 hover:text-slate-900">Repository</a>}
                  {proj.liveLink && <a href={proj.liveLink} className="text-campus-primary hover:underline">Launch Demo</a>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Experience & Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Work History */}
          <div className="campus-card p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center border-b pb-2">
              <Compass className="mr-2 text-campus-primary" size={20} /> Training / Internships
            </h2>
            <div className="space-y-4">
              {experience.map((exp, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <h3 className="font-bold text-slate-800">{exp.role}</h3>
                    <span className="text-slate-400 text-[10px]">{exp.duration}</span>
                  </div>
                  <p className="text-xs text-campus-primary font-semibold">{exp.company}</p>
                  <p className="text-xs text-slate-500 leading-normal">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Grid */}
          <div className="campus-card p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center border-b pb-2">
              <Globe className="mr-2 text-campus-primary" size={20} /> Knowledge Base
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <span key={idx} className="text-xs px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-full font-semibold">
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Banner */}
        <div className="campus-card p-6 text-center space-y-3 bg-gradient-to-r from-indigo-50 to-sky-50 border-indigo-100">
          <h3 className="text-base font-bold text-slate-900">Let's Connect!</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">Open for internships, entry roles, and project collaborations.</p>
          <div className="flex justify-center space-x-6 pt-2 text-xs font-semibold">
            {personalInfo.email && <a href={`mailto:${personalInfo.email}`} className="text-campus-primary hover:underline flex items-center"><Mail size={12} className="mr-1" /> {personalInfo.email}</a>}
            {socials.linkedin && <a href={socials.linkedin} className="text-slate-500 hover:text-slate-900">LinkedIn</a>}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   8. FRESHGRAD TEMPLATE
   ============================================================================ */
export const FreshGrad: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, socials, education, experience, projects, skills, certifications } = data;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 sm:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Banner with borders */}
        <header className="border-t-4 border-emerald-500 bg-slate-900/40 p-6 rounded-b-xl border border-slate-800 space-y-4 shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h1 className="text-3xl font-bold font-display text-white">{personalInfo.fullName || 'Graduate Name'}</h1>
              <p className="text-sm text-emerald-400 font-semibold mt-1">Fresh Graduate // {personalInfo.location}</p>
            </div>
            {personalInfo.email && (
              <a href={`mailto:${personalInfo.email}`} className="text-xs bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition font-bold px-4 py-2 rounded-full shadow-md">
                Email Operator
              </a>
            )}
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">{personalInfo.bio}</p>
        </header>

        {/* Education & Experience list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-base font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">Academic Roadmap</h2>
            <div className="space-y-4">
              {education.map((edu, idx) => (
                <div key={idx} className="bg-slate-900/30 p-4 border border-slate-900 rounded-lg">
                  <h3 className="text-sm font-bold text-white">{edu.degree}</h3>
                  <p className="text-xs text-slate-400 mt-1">{edu.college}</p>
                  <div className="flex justify-between items-center text-xs text-slate-500 mt-2 font-semibold">
                    <span>Graduation: {edu.year}</span>
                    {edu.grade && <span className="text-emerald-400">CGPA: {edu.grade}</span>}
                  </div>
                </div>
              ))}
            </div>

            {certifications && certifications.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-base font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">Certifications</h2>
                <div className="grid grid-cols-1 gap-3">
                  {certifications.map((cert, idx) => (
                    <div key={idx} className="bg-slate-900/30 p-3 border border-slate-900 rounded-lg flex justify-between items-center text-xs">
                      <div>
                        <h4 className="font-bold text-white">{cert.name}</h4>
                        <p className="text-slate-500 text-[10px]">{cert.issuer} ({cert.date})</p>
                      </div>
                      {cert.url && <a href={cert.url} className="text-emerald-400 hover:underline">Link</a>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <h2 className="text-base font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">Internships & Work</h2>
            <div className="space-y-4">
              {experience.map((exp, idx) => (
                <div key={idx} className="bg-slate-900/30 p-4 border border-slate-900 rounded-lg relative pl-6">
                  <span className="absolute left-3 top-5 w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  <h3 className="text-sm font-bold text-white">{exp.role}</h3>
                  <p className="text-xs text-emerald-400 font-semibold">{exp.company}</p>
                  <p className="text-xs text-slate-500 font-mono mt-1">{exp.duration}</p>
                  <p className="text-xs text-slate-400 mt-3 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Technical Projects */}
        <div className="space-y-6">
          <h2 className="text-base font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">Capstone & Hobby Projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {projects.map((proj, idx) => (
              <div key={idx} className="bg-slate-900/20 border border-slate-900 p-5 rounded-lg flex flex-col justify-between hover:border-slate-800 transition">
                <div>
                  <h3 className="text-sm font-bold text-white mb-1.5">{proj.title}</h3>
                  <p className="text-[11px] text-slate-400 line-clamp-3 mb-4 leading-relaxed">{proj.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {proj.technologies.map((t, idx2) => (
                      <span key={idx2} className="text-[9px] bg-slate-900 text-slate-400 border border-slate-800/80 px-2 py-0.5 rounded">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-3 text-xs pt-2 font-semibold">
                  {proj.githubLink && <a href={proj.githubLink} className="text-slate-400 hover:text-white">Github</a>}
                  {proj.liveLink && <a href={proj.liveLink} className="text-emerald-400 hover:underline">Link</a>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Tag Cloud */}
        <div className="bg-slate-900/30 p-6 rounded-lg border border-slate-900 space-y-4">
          <h3 className="text-sm font-bold text-white">Acquired Competencies</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, idx) => (
              <span key={idx} className="text-xs bg-slate-950 border border-slate-800 text-slate-300 px-3 py-1 rounded-full font-mono">
                {skill.name}
              </span>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <footer className="text-center text-[10px] text-slate-600 font-mono">
          &copy; {new Date().getFullYear()} FreshGrad profile. Powered by PortfolioForge.
        </footer>
      </div>
    </div>
  );
};
