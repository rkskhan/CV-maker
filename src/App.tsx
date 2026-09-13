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
import { StepProgressNav, AppPart } from './components/StepProgressNav';
import { PartOneCVSetup } from './components/PartOneCVSetup';
import { PartTwoJobDescription } from './components/PartTwoJobDescription';
import { PartThreeOptimizeExport } from './components/PartThreeOptimizeExport';
import { cleanAndFormatForATS } from './utils/atsFormatter';
import { Check } from 'lucide-react';

export default function App() {
  const [currentPart, setCurrentPart] = useState<AppPart>(1);
  const [cv, setCV] = useState<CVData>(SAMPLE_TECH_CV);
  const [formatPreset, setFormatPreset] = useState<ATSFormatPreset>('classic');
  const [jobDescription, setJobDescription] = useState<string>('');
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

  const handleDirectATSConvert = () => {
    const res = cleanAndFormatForATS(cv);
    setCV(res.formattedCV);
    setCurrentPart(3);
    showToast('Converted into 100% ATS-friendly single-column format! Ready to export.');
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
        onExportDocx={handleExportDocx}
        onExportPdf={handleExportPdf}
        onPrint={handlePrint}
        atsScore={atsReport.overallScore}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* 3-Part Workflow Step Navigation */}
        <StepProgressNav
          currentPart={currentPart}
          onSelectPart={setCurrentPart}
          candidateName={cv.personalInfo.fullName}
          hasJobDescription={Boolean(jobDescription.trim())}
          atsScore={atsReport.overallScore}
          matchScore={jobMatchReport.matchScore}
        />

        {/* Part 1: Upload Existing CV (PDF/DOCX) or Create New CV */}
        {currentPart === 1 && (
          <PartOneCVSetup
            cv={cv}
            onUpdateCV={setCV}
            onNext={() => setCurrentPart(2)}
            onDirectConvert={handleDirectATSConvert}
            atsScore={atsReport.overallScore}
          />
        )}

        {/* Part 2: Upload Target Job Description */}
        {currentPart === 2 && (
          <PartTwoJobDescription
            cv={cv}
            onUpdateCV={setCV}
            jobDescription={jobDescription}
            onUpdateJobDescription={setJobDescription}
            report={jobMatchReport}
            onPrev={() => setCurrentPart(1)}
            onNext={() => setCurrentPart(3)}
            onDirectConvert={handleDirectATSConvert}
          />
        )}

        {/* Part 3: Optimize CV for that Job & Export (PDF / DOCX) */}
        {currentPart === 3 && (
          <PartThreeOptimizeExport
            cv={cv}
            onUpdateCV={setCV}
            jobDescription={jobDescription}
            atsReport={atsReport}
            jobMatchReport={jobMatchReport}
            formatPreset={formatPreset}
            onSelectPreset={setFormatPreset}
            onExportDocx={handleExportDocx}
            onExportPdf={handleExportPdf}
            onPrint={handlePrint}
            onPrev={() => setCurrentPart(2)}
          />
        )}
      </main>

      {/* Subtle Footer */}
      <footer className="no-print border-t border-slate-200 bg-white py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-black text-red-600 font-black text-xs flex items-center justify-center border border-slate-900">S</span>
            <span className="font-bold text-slate-800 tracking-tight">
              rksk • ATS CV Optimizer
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Validated for Workday, Taleo, Greenhouse, Lever, and iCIMS candidate indexing.
          </p>
        </div>
      </footer>
    </div>
  );
}
