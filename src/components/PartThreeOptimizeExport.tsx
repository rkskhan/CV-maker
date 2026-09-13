import React, { useState } from 'react';
import { CVData, ATSFormatPreset, ATSScoreReport, JobMatchReport } from '../types/cv';
import { optimizeCVForJob } from '../utils/cvOptimizer';
import { cleanAndFormatForATS } from '../utils/atsFormatter';
import { CVPreview } from './CVPreview';
import { ATSAuditPanel } from './ATSAuditPanel';
import { ActionVerbsHelper } from './ActionVerbsHelper';
import { SkillsGapPanel } from './SkillsGapPanel';
import { 
  Sparkles, 
  Download, 
  Printer, 
  CheckCircle2, 
  RotateCcw, 
  ArrowLeft, 
  Zap, 
  ShieldCheck, 
  FileCheck,
  AlertTriangle,
  Sliders,
  Target,
  ArrowRight
} from 'lucide-react';

interface PartThreeOptimizeExportProps {
  cv: CVData;
  onUpdateCV: (newCV: CVData) => void;
  jobDescription: string;
  atsReport: ATSScoreReport;
  jobMatchReport: JobMatchReport;
  formatPreset: ATSFormatPreset;
  onSelectPreset: (preset: ATSFormatPreset) => void;
  onExportDocx: () => void;
  onExportPdf: () => void;
  onPrint: () => void;
  onPrev: () => void;
}

export const PartThreeOptimizeExport: React.FC<PartThreeOptimizeExportProps> = ({
  cv,
  onUpdateCV,
  jobDescription,
  atsReport,
  jobMatchReport,
  formatPreset,
  onSelectPreset,
  onExportDocx,
  onExportPdf,
  onPrint,
  onPrev
}) => {
  const [previousCV, setPreviousCV] = useState<CVData | null>(null);
  const [optDetails, setOptDetails] = useState<{ 
    keywordsAdded: string[]; 
    verbsEnhanced: number;
    domainDetected: string;
    targetRoleTitle: string;
  } | null>(null);
  const [cleanReport, setCleanReport] = useState<string[] | null>(null);
  const [highlightKeywords, setHighlightKeywords] = useState<string[]>(jobMatchReport.foundKeywords);
  const [activeSideTab, setActiveSideTab] = useState<'skills-gap' | 'audit' | 'verbs'>(
    jobDescription.trim() ? 'skills-gap' : 'audit'
  );

  const hasJD = Boolean(jobDescription.trim());

  const handle1ClickOptimize = () => {
    if (!hasJD) {
      alert('Please enter or upload a job description in Part 2 before optimizing.');
      return;
    }

    // Save previous state for revert
    setPreviousCV(JSON.parse(JSON.stringify(cv)));

    const result = optimizeCVForJob(cv, jobDescription);
    onUpdateCV(result.optimizedCV);
    setOptDetails({
      keywordsAdded: result.keywordsAdded,
      verbsEnhanced: result.verbsEnhanced,
      domainDetected: result.domainDetected,
      targetRoleTitle: result.targetRoleTitle
    });

    // Update highlighted keywords with all matched and added
    const combined = Array.from(new Set([...jobMatchReport.foundKeywords, ...result.keywordsAdded]));
    setHighlightKeywords(combined);
  };

  const handleDirectCleanAndFormat = () => {
    setPreviousCV(JSON.parse(JSON.stringify(cv)));
    const res = cleanAndFormatForATS(cv);
    onUpdateCV(res.formattedCV);
    setCleanReport(res.changesMade);
  };

  const handleRevert = () => {
    if (previousCV) {
      onUpdateCV(previousCV);
      setPreviousCV(null);
      setOptDetails(null);
      setCleanReport(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Part 3 Introduction */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[11px] font-black flex items-center justify-center">
                3
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                Step 3 of 3
              </span>
              <h2 className="text-base font-bold text-slate-900">
                {hasJD ? 'Optimize CV & Export (PDF / DOCX)' : 'ATS Format & Export (PDF / DOCX)'}
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              {hasJD 
                ? 'Apply 1-click ATS keyword optimization, verify ATS compatibility, and export in Word (.docx) or PDF (.pdf).'
                : 'Direct ATS Mode: Format your existing CV into a 100% machine-readable single-column layout for Workday, Taleo, Greenhouse, and Lever.'}
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-200">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs font-bold">ATS Score: {atsReport.overallScore}%</span>
            </div>
            {hasJD ? (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                <span className="text-xs font-bold">Job Match: {jobMatchReport.matchScore}%</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs font-bold">Direct ATS Mode</span>
              </div>
            )}
          </div>
        </div>

        {/* HERO ACTION SECTION: Adapts based on whether user provided a Job Description */}
        {!hasJD ? (
          /* Direct ATS Formatter Hero Card (No JD Required) */
          <div className="mt-5 p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-red-600 text-white font-black text-[10px] uppercase tracking-wider rounded">
                    Direct ATS Engine
                  </span>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Convert Existing CV to ATS-Friendly Format
                  </h3>
                </div>
                <p className="text-xs text-slate-300">
                  Standardizes section headings, sanitizes non-standard bullet symbols/wingdings, validates contact details, and formats your existing CV into a clean single-column layout for Workday, Taleo, Greenhouse, and Lever.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  id="btn-direct-clean-format"
                  onClick={handleDirectCleanAndFormat}
                  className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg flex items-center gap-2 transition-all shadow-xs"
                >
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>⚡ 1-Click ATS Reformat & Clean</span>
                </button>

                {previousCV && (
                  <button
                    id="btn-revert-direct-clean"
                    onClick={handleRevert}
                    className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
                    title="Undo reformatting"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                    <span>Revert</span>
                  </button>
                )}

                <button
                  id="btn-add-jd-from-part3"
                  onClick={onPrev}
                  className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
                  title="Optionally add a job description to match keywords"
                >
                  <Target className="w-3.5 h-3.5 text-slate-400" />
                  <span>+ Match a Job (Optional)</span>
                </button>
              </div>
            </div>

            {/* Direct Formatting Success Feedback */}
            {cleanReport && cleanReport.length > 0 && (
              <div className="mt-3 p-3.5 bg-emerald-950/80 border border-emerald-500/30 rounded-lg flex items-start gap-2.5 text-xs text-emerald-200 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1 w-full">
                  <p className="font-bold text-emerald-300 text-xs">
                    ATS Single-Column Format & Structure Successfully Applied!
                  </p>
                  <ul className="text-[11px] text-emerald-200/90 space-y-0.5 list-disc list-inside">
                    {cleanReport.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Job Match Optimizer Hero Action Card */
          <div className="mt-5 p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/50 border border-blue-200 rounded-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-blue-600 text-white font-black text-[10px] uppercase tracking-wider rounded">
                    Algorithmic Engine
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    Automated 1-Click ATS Job Optimizer
                  </h3>
                </div>
                <p className="text-xs text-slate-600">
                  Identified {jobMatchReport.missingKeywords.length} missing target keywords. Clicking optimize will inject missing competencies and upgrade passive verbs.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  id="btn-one-click-optimize"
                  onClick={handle1ClickOptimize}
                  className="px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-xs bg-red-600 hover:bg-red-700 text-white"
                >
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>⚡ 1-Click ATS Optimize for This Job</span>
                </button>

                <button
                  id="btn-reformat-clean-part3"
                  onClick={handleDirectCleanAndFormat}
                  className="px-3 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                  title="Sanitize bullet symbols and standardize section headings"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
                  <span>Clean ATS Formatting</span>
                </button>

                {previousCV && (
                  <button
                    id="btn-revert-optimize"
                    onClick={handleRevert}
                    className="px-3 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
                    title="Undo optimization"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                    <span>Revert</span>
                  </button>
                )}
              </div>
            </div>

            {/* Optimization Success Feedback */}
            {optDetails && (
              <div className="mt-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2.5 text-xs text-emerald-950 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1.5 w-full">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-bold text-emerald-950">
                      Relatable Optimization Successfully Applied!
                    </p>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded font-bold text-[10px] uppercase tracking-wider">
                        Role Domain: {optDetails.domainDetected === 'hr' ? 'Human Resources (HR)' : optDetails.domainDetected === 'marketing' ? 'Marketing & Growth' : optDetails.domainDetected === 'operations' ? 'Operations & Admin' : optDetails.domainDetected === 'tech' ? 'Software & Tech' : 'Professional Business'}
                      </span>
                      <span className="px-2 py-0.5 bg-white text-slate-800 border border-slate-200 rounded font-semibold text-[10px]">
                        Target: {optDetails.targetRoleTitle}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-emerald-900 leading-relaxed">
                    • Injected <span className="font-bold">{optDetails.keywordsAdded.length}</span> role-specific competencies ({optDetails.keywordsAdded.slice(0, 5).join(', ')}{optDetails.keywordsAdded.length > 5 ? '...' : ''}) without adding extraneous contact info or certificates.<br />
                    • Upgraded <span className="font-bold">{optDetails.verbsEnhanced}</span> bullet point action verbs to role-appropriate active phrasing.<br />
                    • Tailored professional summary to naturally match the requirements of <span className="font-bold">{optDetails.targetRoleTitle}</span>.
                  </p>
                </div>
              </div>
            )}

            {/* Direct Clean Feedback if run in JD mode */}
            {cleanReport && cleanReport.length > 0 && !optDetails && (
              <div className="mt-3 p-3 bg-white border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">ATS formatting sanitized and standardized!</p>
                  <p className="text-[11px] text-slate-600 mt-0.5">{cleanReport.slice(0, 3).join(' • ')}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Primary Export Station */}
        <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-blue-600" />
              Export Ready:
            </span>
            <span className="text-xs text-slate-500">
              Select format for job application upload
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="export-docx-part3-btn"
              onClick={onExportDocx}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
              title="Download Microsoft Word .docx format (Best for Workday & Taleo)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export DOCX (Word)</span>
            </button>

            <button
              id="export-pdf-part3-btn"
              onClick={onExportPdf}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
              title="Download searchable text vector PDF format (Best for Greenhouse & Lever)"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </button>

            <button
              id="print-part3-btn"
              onClick={onPrint}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
              title="Print document or Save as PDF via system dialog"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Two-Column Studio: Left Diagnostics / Right Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Diagnostics, Keyword Breakdown, & Verbs */}
        <div className="no-print lg:col-span-5 space-y-4">
          {/* Sub-tabs inside Part 3 */}
          <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
            <div className="grid grid-cols-3 gap-1 text-xs">
              <button
                id="tab-skills-gap"
                onClick={() => setActiveSideTab('skills-gap')}
                className={`py-2 px-1 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
                  activeSideTab === 'skills-gap'
                    ? 'bg-black text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Sparkles className={`w-3.5 h-3.5 ${activeSideTab === 'skills-gap' ? 'text-red-500' : 'text-slate-500'}`} />
                <span>Skills Gap</span>
                {jobMatchReport.missingKeywords.length > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeSideTab === 'skills-gap' ? 'bg-red-600 text-white' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {jobMatchReport.missingKeywords.length}
                  </span>
                )}
              </button>

              <button
                id="tab-ats-audit"
                onClick={() => setActiveSideTab('audit')}
                className={`py-2 px-1 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
                  activeSideTab === 'audit'
                    ? 'bg-black text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ATS Audit</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeSideTab === 'audit' ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'
                }`}>
                  {atsReport.overallScore}%
                </span>
              </button>

              <button
                id="tab-action-verbs"
                onClick={() => setActiveSideTab('verbs')}
                className={`py-2 px-1 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
                  activeSideTab === 'verbs'
                    ? 'bg-black text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Zap className={`w-3.5 h-3.5 ${activeSideTab === 'verbs' ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>Power Verbs</span>
              </button>
            </div>
          </div>

          {/* Sub-view Content */}
          <div>
            {activeSideTab === 'skills-gap' && (
              hasJD ? (
                <SkillsGapPanel
                  cv={cv}
                  onUpdateCV={onUpdateCV}
                  jobDescription={jobDescription}
                  jobMatchReport={jobMatchReport}
                />
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 p-6 text-center space-y-3.5 shadow-xs">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-500">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Skills Gap Scan (Requires Target Job)
                    </h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                      You are currently using <strong>Direct ATS Mode</strong> (converting your CV without matching a specific job). To view automated keyword gap analysis, load a job posting in Step 2.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
                    <button
                      id="btn-goto-step2-from-skillsgap"
                      onClick={onPrev}
                      className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg inline-flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Target className="w-3.5 h-3.5" />
                      <span>Add Target Job in Step 2</span>
                    </button>
                    <button
                      id="btn-switchto-audit-tab"
                      onClick={() => setActiveSideTab('audit')}
                      className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg inline-flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>View ATS Audit Checks</span>
                    </button>
                  </div>
                </div>
              )
            )}

            {activeSideTab === 'audit' && (
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <ATSAuditPanel report={atsReport} cv={cv} onUpdateCV={onUpdateCV} />
              </div>
            )}

            {activeSideTab === 'verbs' && (
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <ActionVerbsHelper />
              </div>
            )}
          </div>

          {/* Quick Style Format Selector */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-600 uppercase text-[10px] tracking-wider">
                Typography & Style Preset
              </span>
              <span className="text-[10px] text-slate-400 font-mono">100% ATS Compliant</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => onSelectPreset('classic')}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors ${
                  formatPreset === 'classic'
                    ? 'bg-red-50 border-red-500 text-red-900 font-bold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Classic Serif
              </button>
              <button
                onClick={() => onSelectPreset('modern')}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors ${
                  formatPreset === 'modern'
                    ? 'bg-red-50 border-red-500 text-red-900 font-bold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Modern Sans
              </button>
              <button
                onClick={() => onSelectPreset('executive')}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors ${
                  formatPreset === 'executive'
                    ? 'bg-red-50 border-red-500 text-red-900 font-bold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Executive
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live ATS Document Preview */}
        <div className="lg:col-span-7 sticky top-20">
          <CVPreview
            cv={cv}
            formatPreset={formatPreset}
            highlightKeywords={highlightKeywords}
          />
        </div>
      </div>

      {/* Part 3 Bottom Navigation & Export Station */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <button
          id="btn-backto-part2"
          onClick={onPrev}
          className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Part 2: Job Description</span>
        </button>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={onExportDocx}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export DOCX</span>
          </button>

          <button
            onClick={onExportPdf}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
