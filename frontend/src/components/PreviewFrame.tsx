import React from 'react';
import { createPortal } from 'react-dom';
import { PortfolioData } from '../context/store';
import { TEMPLATE_REGISTRY } from '../templates/registry';
import { Laptop, Tablet as TabletIcon, Smartphone, RefreshCw } from 'lucide-react';

interface PreviewFrameProps {
  data: PortfolioData;
}

type PreviewMode = 'desktop' | 'tablet' | 'mobile';

export const PreviewFrame: React.FC<PreviewFrameProps> = ({ data }) => {
  const [mode, setMode] = React.useState<PreviewMode>('desktop');
  const [reloadKey, setReloadKey] = React.useState(0);
  const [iframeRef, setIframeRef] = React.useState<HTMLIFrameElement | null>(null);

  const activeTemplate = TEMPLATE_REGISTRY[data.templateId] || TEMPLATE_REGISTRY.codecraft;
  const ActiveComponent = activeTemplate.component;

  // Set sizing classes based on selected device preview mode
  const getSizingClass = () => {
    if (mode === 'tablet') return 'w-[768px] h-[90%] border-[12px] border-gray-800 rounded-3xl';
    if (mode === 'mobile') return 'w-[375px] h-[80%] border-[12px] border-gray-800 rounded-[2.5rem]';
    return 'w-full h-full border border-gray-800/80 rounded-xl';
  };

  // Inject styles into the iframe on load or reload
  React.useEffect(() => {
    if (!iframeRef) return;
    const doc = iframeRef.contentDocument || iframeRef.contentWindow?.document;
    if (!doc) return;

    // Clear head
    doc.head.innerHTML = '';

    // Copy all stylesheets and styles from parent to iframe
    document.querySelectorAll('style, link[rel="stylesheet"]').forEach((style) => {
      doc.head.appendChild(style.cloneNode(true));
    });

    // Inject Google Fonts
    const fontLink = doc.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Outfit:wght@400;700&family=JetBrains+Mono&display=swap';
    doc.head.appendChild(fontLink);

    // Apply baseline styling to iframe body
    const docBody = doc.body;
    docBody.style.margin = '0';
    docBody.style.padding = '0';
    docBody.style.minHeight = '100vh';
    docBody.style.backgroundColor = data.themeConfig.backgroundColor || '#0f172a';
    docBody.style.color = '#f1f5f9';

  }, [iframeRef, data.themeConfig.backgroundColor, reloadKey]);

  return (
    <div className="flex flex-col h-full bg-gray-950 rounded-xl overflow-hidden border border-gray-800">
      {/* Device Toolbar */}
      <div className="bg-gray-900 px-4 py-3 border-b border-gray-800 flex justify-between items-center shrink-0">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
          <span className="text-xs text-gray-400 font-mono font-medium ml-2">{activeTemplate.name} preview</span>
        </div>

        {/* Viewport Toggles */}
        <div className="flex bg-gray-950 p-1 rounded-lg border border-gray-800/80">
          <button
            type="button"
            onClick={() => setMode('desktop')}
            className={`p-1.5 rounded transition ${
              mode === 'desktop' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
            title="Desktop View"
          >
            <Laptop size={14} />
          </button>
          <button
            type="button"
            onClick={() => setMode('tablet')}
            className={`p-1.5 rounded transition ${
              mode === 'tablet' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
            title="Tablet View"
          >
            <TabletIcon size={14} />
          </button>
          <button
            type="button"
            onClick={() => setMode('mobile')}
            className={`p-1.5 rounded transition ${
              mode === 'mobile' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
            title="Mobile View"
          >
            <Smartphone size={14} />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setReloadKey((k) => k + 1)}
          className="text-gray-500 hover:text-white p-1 rounded transition"
          title="Reload preview"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Frame Sandbox */}
      <div className="flex-grow flex justify-center items-center p-4 bg-gray-900/40 overflow-auto">
        <iframe
          ref={setIframeRef}
          key={reloadKey}
          title="Portfolio Preview Frame"
          className={`bg-[#0f172a] shadow-2xl transition-all duration-300 border-none ${getSizingClass()}`}
        />
        {iframeRef && iframeRef.contentDocument && createPortal(
          <div style={{
            minHeight: '100vh',
            width: '100%',
            fontFamily: data.themeConfig.fontFamily === 'mono' ? 'JetBrains Mono, monospace' : data.themeConfig.fontFamily === 'display' ? 'Outfit, sans-serif' : 'Inter, sans-serif'
          }}>
            <ActiveComponent data={data} />
          </div>,
          iframeRef.contentDocument.body
        )}
      </div>
    </div>
  );
};
