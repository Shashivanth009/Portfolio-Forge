import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, LayoutTemplate, Plus, Trash2 } from 'lucide-react';
import { useStore } from '../context/store';

export const ResumeGenerator: React.FC = () => {
  const navigate = useNavigate();
  const { portfolio, setPortfolio } = useStore();
  const [activeTemplate, setActiveTemplate] = React.useState<'classic' | 'modern' | 'compact'>('classic');

  const templates = [
    {
      id: 'classic' as const,
      name: 'Classic',
      desc: 'Formal resume with strong section lines.',
      swatch: 'bg-slate-900',
    },
    {
      id: 'modern' as const,
      name: 'Modern',
      desc: 'Clean profile header with accent blocks.',
      swatch: 'bg-emerald-500',
    },
    {
      id: 'compact' as const,
      name: 'Compact',
      desc: 'Dense layout for more details on one page.',
      swatch: 'bg-amber-400',
    },
  ];

  const downloadResume = () => {
    window.print();
  };

  const updateSkillList = (value: string) => {
    setPortfolio({
      skills: value
        .split(',')
        .map((name) => name.trim())
        .filter(Boolean)
        .map((name) => ({ name, category: 'technical' as const, level: 4 })),
    });
  };

  return (
    <div className="min-h-screen bg-[#030712] text-gray-100 flex flex-col lg:flex-row print:block">
      <aside className="w-full lg:w-[440px] bg-gray-950 border-r border-gray-900 p-5 space-y-5 overflow-y-auto print:hidden">
        <div className="flex items-center justify-between">
          <button type="button" onClick={() => navigate('/dashboard')} className="text-lg font-black text-white">
            Resume Generator
          </button>
          <button
            type="button"
            onClick={() => navigate('/builder')}
            className="text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1.5"
          >
            <LayoutTemplate size={14} /> Portfolio
          </button>
        </div>

        <section className="space-y-3">
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">Template Gallery</h2>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {templates.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => setActiveTemplate(template.id)}
                className={`text-left rounded-xl border p-3 min-h-[118px] transition ${
                  activeTemplate === template.id
                    ? 'border-emerald-300 bg-emerald-400/10'
                    : 'border-gray-800 bg-gray-900/60 hover:border-gray-700'
                }`}
              >
                <span className={`block h-10 rounded-md mb-3 ${template.swatch}`} />
                <span className="block text-xs font-black text-white">{template.name}</span>
                <span className="block text-[10px] leading-snug text-gray-500 mt-1">{template.desc}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="space-y-4">
          <Field label="Full Name" value={portfolio.personalInfo.fullName} onChange={(value) => setPortfolio({ personalInfo: { ...portfolio.personalInfo, fullName: value } })} />
          <Field label="Email" value={portfolio.personalInfo.email} onChange={(value) => setPortfolio({ personalInfo: { ...portfolio.personalInfo, email: value } })} />
          <Field label="Phone" value={portfolio.personalInfo.phone} onChange={(value) => setPortfolio({ personalInfo: { ...portfolio.personalInfo, phone: value } })} />
          <Field label="Location" value={portfolio.personalInfo.location} onChange={(value) => setPortfolio({ personalInfo: { ...portfolio.personalInfo, location: value } })} />
          <TextArea label="Professional Summary" value={portfolio.personalInfo.bio} onChange={(value) => setPortfolio({ personalInfo: { ...portfolio.personalInfo, bio: value } })} />
          <Field label="Skills" value={portfolio.skills.map((skill) => skill.name).join(', ')} onChange={updateSkillList} />
        </div>

        <SectionEditor
          title="Experience"
          actionLabel="Add Experience"
          onAdd={() => setPortfolio({ experience: [...portfolio.experience, { role: '', company: '', duration: '', description: '' }] })}
        >
          {portfolio.experience.map((item, index) => (
            <EditorCard key={index} onRemove={() => setPortfolio({ experience: portfolio.experience.filter((_, itemIndex) => itemIndex !== index) })}>
              <Field label="Role" value={item.role} onChange={(value) => {
                const list = [...portfolio.experience];
                list[index].role = value;
                setPortfolio({ experience: list });
              }} />
              <Field label="Company" value={item.company} onChange={(value) => {
                const list = [...portfolio.experience];
                list[index].company = value;
                setPortfolio({ experience: list });
              }} />
              <Field label="Duration" value={item.duration} onChange={(value) => {
                const list = [...portfolio.experience];
                list[index].duration = value;
                setPortfolio({ experience: list });
              }} />
              <TextArea label="Description" value={item.description} onChange={(value) => {
                const list = [...portfolio.experience];
                list[index].description = value;
                setPortfolio({ experience: list });
              }} />
            </EditorCard>
          ))}
        </SectionEditor>

        <SectionEditor
          title="Education"
          actionLabel="Add Education"
          onAdd={() => setPortfolio({ education: [...portfolio.education, { degree: '', college: '', year: '', grade: '' }] })}
        >
          {portfolio.education.map((item, index) => (
            <EditorCard key={index} onRemove={() => setPortfolio({ education: portfolio.education.filter((_, itemIndex) => itemIndex !== index) })}>
              <Field label="Degree" value={item.degree} onChange={(value) => {
                const list = [...portfolio.education];
                list[index].degree = value;
                setPortfolio({ education: list });
              }} />
              <Field label="College" value={item.college} onChange={(value) => {
                const list = [...portfolio.education];
                list[index].college = value;
                setPortfolio({ education: list });
              }} />
              <Field label="Year" value={item.year} onChange={(value) => {
                const list = [...portfolio.education];
                list[index].year = value;
                setPortfolio({ education: list });
              }} />
            </EditorCard>
          ))}
        </SectionEditor>

        <SectionEditor
          title="Projects"
          actionLabel="Add Project"
          onAdd={() => setPortfolio({ projects: [...portfolio.projects, { title: '', description: '', technologies: [], githubLink: '', liveLink: '' }] })}
        >
          {portfolio.projects.map((item, index) => (
            <EditorCard key={index} onRemove={() => setPortfolio({ projects: portfolio.projects.filter((_, itemIndex) => itemIndex !== index) })}>
              <Field label="Title" value={item.title} onChange={(value) => {
                const list = [...portfolio.projects];
                list[index].title = value;
                setPortfolio({ projects: list });
              }} />
              <TextArea label="Description" value={item.description} onChange={(value) => {
                const list = [...portfolio.projects];
                list[index].description = value;
                setPortfolio({ projects: list });
              }} />
              <Field label="Technologies" value={item.technologies.join(', ')} onChange={(value) => {
                const list = [...portfolio.projects];
                list[index].technologies = value.split(',').map((tech) => tech.trim()).filter(Boolean);
                setPortfolio({ projects: list });
              }} />
            </EditorCard>
          ))}
        </SectionEditor>

        <button
          type="button"
          onClick={downloadResume}
          className="w-full bg-emerald-400 text-black rounded-xl py-3 font-black text-sm hover:bg-emerald-300 transition flex items-center justify-center gap-2"
        >
          <Download size={16} /> Download Resume
        </button>
      </aside>

      <main className="flex-1 bg-gray-200 p-4 sm:p-8 overflow-y-auto print:bg-white print:p-0">
        {activeTemplate === 'classic' && <ClassicResume data={portfolio} />}
        {activeTemplate === 'modern' && <ModernResume data={portfolio} />}
        {activeTemplate === 'compact' && <CompactResume data={portfolio} />}
      </main>
    </div>
  );
};

const Field: React.FC<{ label: string; value: string; onChange: (value: string) => void }> = ({ label, value, onChange }) => (
  <label className="block space-y-1.5">
    <span className="text-[11px] font-bold text-gray-400">{label}</span>
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2.5 text-sm outline-none text-white focus:border-emerald-400"
    />
  </label>
);

const TextArea: React.FC<{ label: string; value: string; onChange: (value: string) => void }> = ({ label, value, onChange }) => (
  <label className="block space-y-1.5">
    <span className="text-[11px] font-bold text-gray-400">{label}</span>
    <textarea
      rows={3}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2.5 text-sm outline-none text-white focus:border-emerald-400 leading-relaxed"
    />
  </label>
);

const SectionEditor: React.FC<{ title: string; actionLabel: string; onAdd: () => void; children: React.ReactNode }> = ({ title, actionLabel, onAdd, children }) => (
  <section className="space-y-3 border-t border-gray-900 pt-5">
    <div className="flex items-center justify-between">
      <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">{title}</h2>
      <button type="button" onClick={onAdd} className="text-[11px] font-bold text-emerald-300 hover:text-emerald-200 flex items-center gap-1">
        <Plus size={12} /> {actionLabel}
      </button>
    </div>
    {children}
  </section>
);

const EditorCard: React.FC<{ onRemove: () => void; children: React.ReactNode }> = ({ onRemove, children }) => (
  <div className="relative bg-gray-950/60 border border-gray-900 rounded-xl p-4 space-y-3">
    <button type="button" onClick={onRemove} className="absolute right-3 top-3 text-gray-500 hover:text-rose-300">
      <Trash2 size={14} />
    </button>
    <div className="pr-7 space-y-3">{children}</div>
  </div>
);

const contactLine = (data: ReturnType<typeof useStore.getState>['portfolio']) => (
  [data.personalInfo.email, data.personalInfo.phone, data.personalInfo.location].filter(Boolean).join(' | ') || 'email@example.com | +91 00000 00000 | City, Country'
);

const ClassicResume: React.FC<{ data: ReturnType<typeof useStore.getState>['portfolio'] }> = ({ data }) => (
  <article className="mx-auto max-w-[850px] min-h-[1100px] bg-white text-slate-900 shadow-2xl p-10 sm:p-14 print:shadow-none print:max-w-none print:min-h-0">
    <header className="border-b-4 border-slate-900 pb-5">
      <h1 className="text-4xl font-black tracking-tight">{data.personalInfo.fullName || 'Your Name'}</h1>
      <p className="mt-2 text-sm text-slate-600">{contactLine(data)}</p>
    </header>
    <ResumeContent data={data} />
  </article>
);

const ModernResume: React.FC<{ data: ReturnType<typeof useStore.getState>['portfolio'] }> = ({ data }) => (
  <article className="mx-auto max-w-[850px] min-h-[1100px] bg-white text-slate-900 shadow-2xl print:shadow-none print:max-w-none print:min-h-0">
    <header className="bg-slate-950 text-white p-10 sm:p-12">
      <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-300">Professional Resume</p>
      <h1 className="text-4xl font-black tracking-tight mt-3">{data.personalInfo.fullName || 'Your Name'}</h1>
      <p className="mt-3 text-sm text-slate-300">{contactLine(data)}</p>
    </header>
    <div className="p-10 sm:p-12">
      <ResumeContent data={data} variant="modern" />
    </div>
  </article>
);

const CompactResume: React.FC<{ data: ReturnType<typeof useStore.getState>['portfolio'] }> = ({ data }) => (
  <article className="mx-auto max-w-[850px] min-h-[1100px] bg-white text-slate-900 shadow-2xl p-8 sm:p-10 print:shadow-none print:max-w-none print:min-h-0">
    <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 border-b-2 border-amber-400 pb-4">
      <h1 className="text-3xl font-black tracking-tight">{data.personalInfo.fullName || 'Your Name'}</h1>
      <p className="text-xs text-slate-600 sm:text-right">{contactLine(data)}</p>
    </header>
    <ResumeContent data={data} variant="compact" />
  </article>
);

const ResumeContent: React.FC<{ data: ReturnType<typeof useStore.getState>['portfolio']; variant?: 'modern' | 'compact' }> = ({ data, variant }) => {
  const compact = variant === 'compact';

  return (
    <>
      <ResumeSection title="Summary" variant={variant}>
        <p className={`${compact ? 'text-xs' : 'text-sm'} leading-relaxed`}>{data.personalInfo.bio || 'Write a short professional summary that highlights your strengths, experience, and career goals.'}</p>
      </ResumeSection>

      <ResumeSection title="Skills" variant={variant}>
        <p className={`${compact ? 'text-xs' : 'text-sm'} leading-relaxed`}>{data.skills.map((skill) => skill.name).join(', ') || 'React, TypeScript, Node.js, UI Design, Communication'}</p>
      </ResumeSection>

      <ResumeSection title="Experience" variant={variant}>
        {data.experience.length ? data.experience.map((item, index) => (
          <div key={index} className={compact ? 'mb-3' : 'mb-4'}>
            <div className={`flex justify-between gap-4 ${compact ? 'text-xs' : 'text-sm'} font-bold`}>
              <span>{item.role || 'Role'} - {item.company || 'Company'}</span>
              <span className="text-slate-500">{item.duration}</span>
            </div>
            <p className={`${compact ? 'text-xs' : 'text-sm'} leading-relaxed mt-1`}>{item.description}</p>
          </div>
        )) : <EmptyLine text="Add work experience to show your role, company, duration, and impact." />}
      </ResumeSection>

      <ResumeSection title="Projects" variant={variant}>
        {data.projects.length ? data.projects.map((item, index) => (
          <div key={index} className={compact ? 'mb-3' : 'mb-4'}>
            <h3 className={`${compact ? 'text-xs' : 'text-sm'} font-bold`}>{item.title || 'Project Title'}</h3>
            <p className={`${compact ? 'text-xs' : 'text-sm'} leading-relaxed mt-1`}>{item.description}</p>
            {item.technologies.length > 0 && <p className="text-xs text-slate-500 mt-1">{item.technologies.join(', ')}</p>}
          </div>
        )) : <EmptyLine text="Add projects with technologies and outcomes." />}
      </ResumeSection>

      <ResumeSection title="Education" variant={variant}>
        {data.education.length ? data.education.map((item, index) => (
          <div key={index} className={`mb-3 flex justify-between gap-4 ${compact ? 'text-xs' : 'text-sm'}`}>
            <span><strong>{item.degree || 'Degree'}</strong>, {item.college || 'College'}</span>
            <span className="text-slate-500">{item.year}</span>
          </div>
        )) : <EmptyLine text="Add your education details." />}
      </ResumeSection>
    </>
  );
};

const ResumeSection: React.FC<{ title: string; variant?: 'modern' | 'compact'; children: React.ReactNode }> = ({ title, variant, children }) => (
  <section className={variant === 'compact' ? 'mt-5' : 'mt-7'}>
    <h2 className={`font-black uppercase tracking-[0.18em] pb-1 mb-3 ${
      variant === 'modern'
        ? 'text-sm text-emerald-700 border-b border-emerald-200'
        : variant === 'compact'
          ? 'text-xs text-slate-900 border-b border-amber-300'
          : 'text-sm text-slate-900 border-b border-slate-300'
    }`}>{title}</h2>
    {children}
  </section>
);

const EmptyLine: React.FC<{ text: string }> = ({ text }) => (
  <p className="text-sm text-slate-500 italic">{text}</p>
);
