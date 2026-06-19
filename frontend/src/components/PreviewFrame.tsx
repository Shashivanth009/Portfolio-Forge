import React from 'react';
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

  const activeTemplate = TEMPLATE_REGISTRY[data.templateId] || TEMPLATE_REGISTRY.codecraft;
  const ActiveComponent = activeTemplate.component;

  // Set sizing classes based on selected device preview mode
  const getSizingClass = () => {
    if (mode === 'tablet') return 'w-[768px] h-[90vh] border-[12px] border-gray-800 rounded-3xl';
    if (mode === 'mobile') return 'w-[375px] h-[75vh] border-[12px] border-gray-800 rounded-[2.5rem]';
    return 'w-full h-full border border-gray-800 rounded-xl';
  };

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
        <div 
          key={reloadKey}
          className={`bg-slate-900 shadow-2xl transition-all duration-300 overflow-y-auto ${getSizingClass()}`}
        >
          {/* Direct component injection for instant render refresh */}
          <ActiveComponent data={data} />
        </div>
      </div>
    </div>
  );
};
