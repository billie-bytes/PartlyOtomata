import type { ReactNode } from 'react';
import { LeftPanel } from './LeftPanel';

interface ExplanationLayoutProps {
  children: ReactNode;
  title?: string;
}

export function ExplanationLayout({ children, title = 'Explanation Page' }: ExplanationLayoutProps) {
  return (
    <div className="flex w-full h-full gap-4 p-4 bg-gray-200">
      {/* Left Panel - Navigation */}
      <div className="bg-gray-300 rounded-lg p-4 shadow-lg w-48">
        <LeftPanel />
      </div>

      {/* Center - Main Content (Macbook Window Style) */}
      <div className="flex-1 bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col border border-gray-200">
        {/* Title Bar - Macbook Style */}
        <div className="bg-gradient-to-b from-gray-100 to-gray-85 border-b border-gray-300 px-6 py-3 flex items-center gap-3 hover:from-gray-105 transition-colors">
          {/* Window Control Buttons */}
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer transition-colors shadow-sm"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-500 cursor-pointer transition-colors shadow-sm"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 cursor-pointer transition-colors shadow-sm"></div>
          </div>
          {/* Title */}
          <div className="flex-1 text-center">
            <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
          </div>
          {/* Spacer for balance */}
          <div className="w-12"></div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto flex items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}
