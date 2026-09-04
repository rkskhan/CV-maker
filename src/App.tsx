/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { CVData, ATSFormatPreset } from './types/cv';
import { SAMPLE_TECH_CV } from './data/sampleCV';
import { auditCVForATS } from './utils/atsAuditor';
import { analyzeJobMatch } from './utils/keywordMatcher';
import { exportToDocx } from './utils/docxExport';
import { exportToPdf } from './utils/pdfExport';
import { Header } from './components/Header';
import { CVPreview } from './components/CVPreview';
import { EditorPanel } from './components/EditorPanel';
import { ATSAuditPanel } from './components/ATSAuditPanel';
import { JobMatcherPanel } from './components/JobMatcherPanel';
import { ActionVerbsHelper } from './components/ActionVerbsHelper';
import { 
  FileEdit, 
  ShieldCheck, 
  Target, 
  Sparkles, 
  Download, 
  Check, 
  AlertCircle
} from 'lucide-react';

export default function App() {
  const [cv, setCV] = useState<CVData>(SAMPLE_TECH_CV);
  const [formatPreset, setFormatPreset] = useState<ATSFormatPreset>('classic');
  const [activeStudioTab, setActiveStudioTab] = useState<'editor' | 'audit' | 'matcher' | 'verbs'>('editor');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [highlightKeywords, setHighlightKeywords] = useState<string[]>([]);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Compute live ATS score report whenever CV data updates
  const atsReport = useMemo(() => auditCVForATS(cv), [cv]);

  // Compute Job Match report whenever CV or Job Description updates
  const jobMatchReport = useMemo(() => analyzeJobMatch(cv, jobDescription), [cv, jobDescription]);

  // Temporary notification toast
  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleExportDocx = async () => {
    try {
      await exportToDocx(cv);
      showToast('ATS-optimized Word document (.docx) generated successfully!');
    } catch (err) {
      console.error('DOCX Export error:', err);
      showToast('Error generating DOCX document. Check input fields.', 'info');
    }
  };

  const handleExportPdf = () => {
    try {
      exportToPdf(cv);
      showToast('Searchable text ATS-compliant PDF generated successfully!');
    } catch (err) {
      console.error('PDF Export error:', err);
      showToast('Error generating PDF document.', 'info');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-[#1e293b] flex flex-col font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="no-print fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-lg shadow-xl border border-slate-800 text-xs font-medium animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header Bar */}
      <Header
        cv={cv}
        onUpdateCV={setCV}
        formatPreset={formatPreset}
        onSelectPreset={setFormatPreset}
        onExportDocx={handleExportDocx}
        onExportPdf={handleExportPdf}
        onPrint={handlePrint}
        atsScore={atsReport.overallScore}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: ATS Optimization Studio & Editor (5 cols on large screens) */}
          <div className="no-print lg:col-span-5 space-y-4">
            
            {/* Studio Mode Selector */}
            <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
              <div className="grid grid-cols-4 gap-1 text-xs">
                <button
                  id="nav-tab-editor"
                  onClick={() => setActiveStudioTab('editor')}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg font-medium transition-all ${
                    activeStudioTab === 'editor'
                      ? 'bg-blue-600 text-white shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <FileEdit className="w-4 h-4 mb-1" />
                  <span>CV Content</span>
                </button>

                <button
                  id="nav-tab-audit"
                  onClick={() => setActiveStudioTab('audit')}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg font-medium transition-all ${
                    activeStudioTab === 'audit'
                      ? 'bg-blue-600 text-white shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="relative">
                    <ShieldCheck className="w-4 h-4 mb-1" />
                    <span
                      className={`absolute -top-1 -right-4 text-[9px] font-bold px-1 rounded-full ${
                        activeStudioTab === 'audit'
                          ? 'bg-white text-blue-600'
                          : atsReport.overallScore >= 85
                          ? 'bg-emerald-500 text-white'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      {atsReport.overallScore}
                    </span>
                  </div>
                  <span>ATS Score</span>
                </button>

                <button
                  id="nav-tab-matcher"
                  onClick={() => setActiveStudioTab('matcher')}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg font-medium transition-all ${
                    activeStudioTab === 'matcher'
                      ? 'bg-blue-600 text-white shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="relative">
                    <Target className="w-4 h-4 mb-1" />
                    {jobDescription.trim().length > 20 && (
                      <span className={`absolute -top-1 -right-3 text-[9px] font-bold px-1 rounded-full ${
                        activeStudioTab === 'matcher' ? 'bg-white text-blue-600' : 'bg-blue-500 text-white'
                      }`}>
                        {jobMatchReport.matchScore}%
                      </span>
                    )}
                  </div>
                  <span>Job Match</span>
                </button>

                <button
                  id="nav-tab-verbs"
                  onClick={() => setActiveStudioTab('verbs')}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg font-medium transition-all ${
                    activeStudioTab === 'verbs'
                      ? 'bg-blue-600 text-white shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Sparkles className="w-4 h-4 mb-1" />
                  <span>Action Verbs</span>
                </button>
              </div>
            </div>

            {/* Active Studio View */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              {activeStudioTab === 'editor' && (
                <EditorPanel cv={cv} onUpdateCV={setCV} />
              )}

              {activeStudioTab === 'audit' && (
                <ATSAuditPanel report={atsReport} cv={cv} onUpdateCV={setCV} />
              )}

              {activeStudioTab === 'matcher' && (
                <JobMatcherPanel
                  cv={cv}
                  onUpdateCV={setCV}
                  jobDescription={jobDescription}
                  onUpdateJobDescription={setJobDescription}
                  report={jobMatchReport}
                  onHighlightKeywords={(kws) => setHighlightKeywords(kws)}
                />
              )}

              {activeStudioTab === 'verbs' && (
                <ActionVerbsHelper />
              )}
            </div>

            {/* Sleek Theme Pro Tip & ATS Algorithm Guarantees */}
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <p className="text-xs text-blue-900 leading-relaxed font-medium">
                  <strong className="block mb-1 text-blue-950 font-bold">Pro Tip:</strong>
                  Removing images, tables, and complex multi-column graphics ensures 100% readability by Workday, Taleo, and Greenhouse ATS scanners.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    Algorithm Guarantees
                  </span>
                  <span className="text-[11px] text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full font-bold">
                    100% Compatible
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase">
                    Single-Column
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase">
                    Zero Graphics
                  </span>
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase">
                    Standard Headings
                  </span>
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase">
                    Standard Bullets
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Live ATS Document Preview (7 cols on large screens) */}
          <div className="lg:col-span-7 sticky top-20">
            <CVPreview
              cv={cv}
              formatPreset={formatPreset}
              highlightKeywords={highlightKeywords}
            />
          </div>

        </div>
      </main>
    </div>
  );
}
