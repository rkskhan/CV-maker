import React from 'react';
import { 
  Download, 
  Printer, 
} from 'lucide-react';
import { CVData } from '../types/cv';

interface HeaderProps {
  cv: CVData;
  onExportDocx: () => void;
  onExportPdf: () => void;
  onPrint: () => void;
  atsScore: number;
}

export const Header: React.FC<HeaderProps> = ({
  onExportDocx,
  onExportPdf,
  onPrint,
  atsScore,
}) => {
  return (
    <header id="main-header" className="no-print bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          {/* Brand & ATS Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-black text-red-600 rounded-lg flex items-center justify-center font-black text-xl tracking-tight shadow-xs select-none border border-slate-900">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-slate-900 select-none leading-none">
                  rksk
                </h1>
                <span className="text-xs font-bold text-slate-800 tracking-tight">
                  ATS CV Optimizer
                </span>
                <span className="hidden md:inline-block text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                  ATS-Compliant
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Upload CV or create from scratch • Match target job • 1-Click ATS optimization
              </p>
            </div>
          </div>

          {/* Clean Quick Actions */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            {/* Live ATS Optimization Score Pill Badge */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden sm:inline">
                ATS Score
              </span>
              <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-200">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-bold">{atsScore}%</span>
              </div>
            </div>

            {/* Direct Quick Exports */}
            <button
              id="export-docx-btn"
              onClick={onExportDocx}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
              title="Download standard Word .docx (Recommended for Workday & Taleo)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export DOCX</span>
            </button>

            <button
              id="export-pdf-btn"
              onClick={onExportPdf}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
              title="Download clean selectable text PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </button>

            <button
              id="print-btn"
              onClick={onPrint}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Print or Save with Browser PDF Engine"
            >
              <Printer className="w-3.5 h-3.5 text-slate-700" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
