import { useState } from 'react';
import { LeftPanel, CanvasPanel, RightPanel, HtmlPanel } from '../components';

export function Home() {
  const [viewMode, setViewMode] = useState<'tree' | 'html'>('tree');

  return (
    <div className="flex w-full h-full gap-4 p-4" style={{backgroundColor: '#F7F8F0'}}>
      {/* Left Panel - Buttons */}
      <div className="bg-gray-300 rounded-lg p-4 shadow-lg w-48">
        <LeftPanel />
      </div>

      {/* Center - Canvas/Tree (Macbook Window Style) */}
      <div className="flex-1 bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col border border-gray-200">
        {/* Title Bar - Macbook Style */}
        <div className="bg-gradient-to-b from-gray-100 to-gray-85 border-b border-gray-300 px-6 py-3 flex items-center gap-3 group hover:from-gray-105 transition-colors">
          {/* Window Control Buttons */}
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer transition-colors shadow-sm"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-500 cursor-pointer transition-colors shadow-sm"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 cursor-pointer transition-colors shadow-sm"></div>
          </div>
          {/* Title */}
          <div className="flex-1 text-center">
            <h3 className="text-sm font-semibold text-gray-700">
              {viewMode === 'tree' ? 'Filename.html DOM Tree' : 'Filename.html Raw HTML'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode('tree')}
              className={`px-3 py-1 text-xs font-semibold rounded-md border transition-colors ${
                viewMode === 'tree'
                  ? 'bg-[#355872] text-white border-[#355872]'
                  : 'bg-white text-gray-600 border-gray-300'
              }`}
            >
              Tree
            </button>
            <button
              type="button"
              onClick={() => setViewMode('html')}
              className={`px-3 py-1 text-xs font-semibold rounded-md border transition-colors ${
                viewMode === 'html'
                  ? 'bg-[#355872] text-white border-[#355872]'
                  : 'bg-white text-gray-600 border-gray-300'
              }`}
            >
              HTML
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-gray-50">
          {viewMode === 'tree' ? <CanvasPanel /> : <HtmlPanel />}
        </div>
      </div>

      {/* Right Panel - Input */}
      <div className="bg-gray-300 rounded-lg p-4 shadow-lg w-64">
        <RightPanel />
      </div>
    </div>
  );
}
