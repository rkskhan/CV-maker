import React from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Sparkles, 
  RotateCcw, 
  Upload, 
  HelpCircle,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { ATSFormatPreset, CVData } from '../types/cv';
import { SAMPLE_TECH_CV, SAMPLE_PRODUCT_CV, BLANK_CV } from '../data/sampleCV';

interface HeaderProps {
  cv: CVData;
  onUpdateCV: (newCV: CVData) => void;
  formatPreset: ATSFormatPreset;
  onSelectPreset: (preset: ATSFormatPreset) => void;
  onExportDocx: () => void;
  onExportPdf: () => void;
  onPrint: () => void;
  onOpenNetlifyModal: () => void;
  atsScore: number;
}

export const Header: React.FC<HeaderProps> = ({
  cv,
  onUpdateCV,
  formatPreset,
  onSelectPreset,
  onExportDocx,
  onExportPdf,
  onPrint,
  onOpenNetlifyModal,
  atsScore,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleJsonExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(cv, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${cv.personalInfo.fullName.replace(/\s+/g, '_') || 'CV'}_data.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleJsonImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.personalInfo && parsed.experience) {
          onUpdateCV(parsed);
        } else {
          alert('Invalid CV JSON file format.');
        }
      } catch (err) {
        alert('Could not read JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <header id="main-header" className="no-print bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          
          {/* Brand & ATS Verification Badge */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-base shadow-xs">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  ATS<span className="text-blue-600">Forge</span>
                </h1>
                <span className="hidden sm:inline-block text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                  CV Maker
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Standard format & keyword indexing for Workday, Taleo, Greenhouse & Lever
              </p>
            </div>
          </div>

          {/* Quick Controls: Presets, Formatting Style, & Exports */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-start lg:justify-end">
            
            {/* Live ATS Optimization Score Pill Badge */}
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden sm:inline">
                ATS Score
              </span>
              <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-200">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-bold">{atsScore}%</span>
              </div>
            </div>

            {/* Template Selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <span className="text-slate-500 font-medium px-1.5 hidden xl:inline">Preset:</span>
              <button
                id="preset-tech-btn"
                onClick={() => onUpdateCV(SAMPLE_TECH_CV)}
                className="px-2.5 py-1.5 rounded text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-white transition-colors"
                title="Load Senior Software Engineer template"
              >
                Tech Role
              </button>
              <button
                id="preset-product-btn"
                onClick={() => onUpdateCV(SAMPLE_PRODUCT_CV)}
                className="px-2.5 py-1.5 rounded text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-white transition-colors"
                title="Load Senior Product Manager template"
              >
                Product Role
              </button>
              <button
                id="preset-blank-btn"
                onClick={() => onUpdateCV(BLANK_CV)}
                className="px-2 py-1.5 rounded text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-white transition-colors flex items-center gap-1"
                title="Clear all fields"
              >
                <RotateCcw className="w-3 h-3 text-slate-500" />
                Blank
              </button>
            </div>

            {/* Typography & Style Preset */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <span className="text-slate-500 font-medium px-1.5 hidden xl:inline">Style:</span>
              <button
                id="style-classic-btn"
                onClick={() => onSelectPreset('classic')}
                className={`px-2.5 py-1.5 rounded text-xs font-medium transition-all ${
                  formatPreset === 'classic'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Serif typography (Times/Georgia) - Harvard & Wall Street standard"
              >
                Classic Serif
              </button>
              <button
                id="style-modern-btn"
                onClick={() => onSelectPreset('modern')}
                className={`px-2.5 py-1.5 rounded text-xs font-medium transition-all ${
                  formatPreset === 'modern'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Clean sans-serif (Arial/Calibri/Inter) - Tech & Corporate standard"
              >
                Modern Clean
              </button>
              <button
                id="style-compact-btn"
                onClick={() => onSelectPreset('compact')}
                className={`px-2.5 py-1.5 rounded text-xs font-medium transition-all ${
                  formatPreset === 'compact'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Compact high-density single-page format"
              >
                Executive
              </button>
            </div>

            {/* Hidden File Input for JSON import */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleJsonImport}
              accept=".json"
              className="hidden"
            />

            {/* Data backup buttons */}
            <div className="flex items-center gap-1">
              <button
                id="import-json-btn"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5"
                title="Import saved CV JSON"
              >
                <Upload className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Import</span>
              </button>
              <button
                id="export-json-btn"
                onClick={handleJsonExport}
                className="px-2.5 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5"
                title="Backup CV as JSON"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Save Draft</span>
              </button>
            </div>

            {/* Netlify Deploy Guide Button */}
            <button
              id="netlify-info-btn"
              onClick={onOpenNetlifyModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors text-xs font-medium"
              title="Netlify deployment instructions"
            >
              <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
              <span>Deploy Guide</span>
            </button>

            {/* Primary Action Buttons: DOCX, PDF, Print */}
            <div className="flex items-center gap-2 ml-1">
              <button
                id="export-docx-btn"
                onClick={onExportDocx}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded flex items-center gap-1.5 transition-colors shadow-xs"
                title="Download standard Word .docx (Recommended for Workday & Taleo)"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export DOCX</span>
              </button>

              <button
                id="export-pdf-btn"
                onClick={onExportPdf}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded flex items-center gap-1.5 transition-colors shadow-xs"
                title="Download clean selectable text PDF"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>

              <button
                id="print-btn"
                onClick={onPrint}
                className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                title="Print or Save with Browser PDF Engine"
              >
                <Printer className="w-4 h-4 text-slate-700" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
