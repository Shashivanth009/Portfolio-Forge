import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UploadCloud, Layers, PenTool, Archive, Radio, Smartphone, ChevronDown, ArrowRight } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = React.useState<number | null>(null);
  const workspacePath = '/dashboard';

  const features = [
    { icon: <UploadCloud className="text-amber-400" size={24} />, title: 'Resume Parsing', desc: 'Instantly convert PDF/DOCX resumes into clean, structured data.' },
    { icon: <Layers className="text-purple-400" size={24} />, title: '15+ Templates', desc: 'Professionally styled developer, security, student, and corporate portfolios.' },
    { icon: <PenTool className="text-emerald-400" size={24} />, title: 'Live Visual Editor', desc: 'Edit text details, update color configurations, and preview changes instantly.' },
    { icon: <Archive className="text-blue-400" size={24} />, title: 'ZIP Code Export', desc: 'Download a complete zero-config Vite + React codebase to run locally.' },
    { icon: <Radio className="text-pink-400" size={24} />, title: 'Deployment Ready', desc: 'Pre-configured vercel.json and netlify.toml for one-click hosting deployments.' },
    { icon: <Smartphone className="text-sky-400" size={24} />, title: 'Fully Responsive', desc: 'Optimised layouts catering to mobile, tablet, and widescreen viewport sizes.' },
  ];

  const testimonials = [
    { quote: "PortfolioForge saved me hours. I uploaded my B.Tech resume, chose CodeCraft, and deployed it to Vercel in 5 minutes!", author: "Rohan Sharma", role: "Software Engineer Grad" },
    { quote: "The cybersecurity templates are incredible. The terminal simulation perfectly shows off my OSCP certificate and penetration projects.", author: "Sarah Jenkins", role: "SOC Analyst" },
    { quote: "No locked subscriptions. Just clean, raw React source code. This is what developers have been looking for.", author: "Marc Dubois", role: "Full Stack Engineer" },
  ];

  const faqs = [
    { q: "Is this service really free?", a: "Yes, PortfolioForge is built entirely on open-source libraries and free-tier integrations like Gemini Free API. There are no paid subscriptions or lock-ins." },
    { q: "What files do the downloaded ZIP contain?", a: "The ZIP archive contains a complete, production-ready React + TypeScript + Vite project pre-configured with TailwindCSS, containing all template files, assets, sitemaps, and deployment blueprints." },
    { q: "How do I deploy the exported project?", a: "Simply upload the code to GitHub and connect it to Vercel or Netlify. The project contains pre-configured vercel.json and netlify.toml files for automated, zero-config hosting." },
    { q: "Can I edit details after uploading my resume?", a: "Yes. Once parsed, you can manually adjust all details, reorder layout sections, customize theme colors, and write SEO meta tags inside our visual split-pane builder." },
  ];

  return (
    <div className="bg-[#030712] min-h-screen bg-mesh text-gray-100">
      {/* Navbar */}
      <nav className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center relative z-20">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
          <span className="text-2xl font-black font-display bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">PortfolioForge</span>
        </div>
        <div className="flex items-center space-x-6 text-sm font-semibold">
          <button type="button" onClick={() => navigate('/templates')} className="text-gray-400 hover:text-white transition">Templates</button>
          <button 
            type="button" 
            onClick={() => navigate(workspacePath)} 
            className="bg-amber-400 text-black px-4 py-2 rounded-lg hover:bg-amber-300 transition"
          >
            Dashboard
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center relative z-10 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
            No subscriptions. No lock-ins.
          </span>
          <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight leading-[1.15] text-white">
            Turn Your Resume Into A <br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">
              Professional Portfolio Website
            </span>
          </h1>
          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Upload your resume, choose a template, customize your portfolio, and download deployment-ready source code.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-center gap-4 pt-4"
        >
          <button
            type="button"
            onClick={() => navigate(workspacePath)}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-orange-950/20 transition flex items-center justify-center"
          >
            Create Resume or Portfolio <ArrowRight size={18} className="ml-2" />
          </button>
          <button
            type="button"
            onClick={() => navigate('/templates')}
            className="bg-gray-900 border border-gray-800 hover:bg-gray-800 text-white font-bold px-8 py-4 rounded-xl transition"
          >
            Browse Templates
          </button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-gray-900">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Designed For Modern Careers</h2>
          <p className="text-sm text-gray-400 max-w-md mx-auto">Everything you need to build, optimize, and deploy your developer or security web presence.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {features.map((feat, i) => (
            <div key={i} className="p-6 rounded-2xl border border-gray-800/80 bg-gray-950/40 hover:border-gray-700 transition">
              <div className="w-12 h-12 rounded-xl bg-gray-900/80 flex items-center justify-center border border-gray-800 mb-6">{feat.icon}</div>
              <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-gray-900 bg-gray-950/10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Loved by Students and Devs</h2>
          <p className="text-sm text-gray-400">Read reviews from students and engineers who launched portfolios using PortfolioForge.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, i) => (
            <div key={i} className="p-8 rounded-2xl border border-gray-800 bg-gray-950/30 flex flex-col justify-between">
              <p className="text-xs text-gray-300 italic leading-relaxed">"{test.quote}"</p>
              <div className="mt-6 pt-4 border-t border-gray-900 flex justify-between items-center">
                <span className="font-bold text-xs text-white">{test.author}</span>
                <span className="text-[10px] text-amber-400 font-semibold">{test.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-4xl mx-auto px-6 py-20 border-t border-gray-900">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-center text-white mb-12">Common Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-800 rounded-xl overflow-hidden bg-gray-950/20">
              <button
                type="button"
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className="w-full text-left px-6 py-5 font-bold text-sm text-white flex justify-between items-center transition hover:bg-gray-900/20"
              >
                <span>{faq.q}</span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {activeFaq === i && (
                <div className="px-6 pb-6 pt-1 text-xs text-gray-400 leading-relaxed border-t border-gray-900/60">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-900/80 bg-gray-950/60 py-12 relative z-10 text-xs text-gray-500 font-mono">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="font-black text-sm text-white">PortfolioForge</span>
            <p className="text-[10px]">Generate professional portfolios instantly.</p>
          </div>
          <div className="flex space-x-6">
            <button type="button" onClick={() => navigate('/')} className="hover:text-white transition">Home</button>
            <button type="button" onClick={() => navigate('/templates')} className="hover:text-white transition">Templates</button>
            <button type="button" onClick={() => navigate(workspacePath)} className="hover:text-white transition">Create</button>
          </div>
          <span>&copy; {new Date().getFullYear()} PortfolioForge</span>
        </div>
      </footer>
    </div>
  );
};
