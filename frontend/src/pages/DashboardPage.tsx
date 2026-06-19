import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Home, LayoutTemplate, Sparkles } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#030712] bg-mesh text-gray-100">
      <nav className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <button type="button" onClick={() => navigate('/')} className="text-xl font-black text-white">
          PortfolioForge
        </button>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition"
        >
          <Home size={15} /> Home
        </button>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-14 space-y-10">
        <section className="space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
            <Sparkles size={13} /> Career workspace
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight">What do you want to create?</h1>
          <p className="text-gray-400 max-w-2xl leading-relaxed">
            Pick a tool and start building. Your resume details can also be reused inside the portfolio builder.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          <button
            type="button"
            onClick={() => navigate('/resume')}
            className="group text-left bg-gray-950/70 border border-gray-800 hover:border-emerald-400/70 rounded-2xl p-7 transition min-h-[220px]"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center mb-8">
              <FileText className="text-emerald-300" size={24} />
            </div>
            <h2 className="text-2xl font-black text-white mb-3">Create Resume</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Generate a polished resume by entering your profile, education, projects, skills, and experience.
            </p>
          </button>

          <button
            type="button"
            onClick={() => navigate('/builder')}
            className="group text-left bg-gray-950/70 border border-gray-800 hover:border-amber-400/70 rounded-2xl p-7 transition min-h-[220px]"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mb-8">
              <LayoutTemplate className="text-amber-300" size={24} />
            </div>
            <h2 className="text-2xl font-black text-white mb-3">Create Portfolio</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Open the live portfolio builder, import a resume, choose a template, preview, and export source code.
            </p>
          </button>
        </section>
      </main>
    </div>
  );
};
