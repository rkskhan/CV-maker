import React, { useState } from 'react';
import { ATSScoreReport, ATSCheckResult, CVData } from '../types/cv';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';
import { WEAK_VERB_PATTERNS } from '../utils/atsAuditor';

interface ATSAuditPanelProps {
  report: ATSScoreReport;
  cv: CVData;
  onUpdateCV: (newCV: CVData) => void;
}

export const ATSAuditPanel: React.FC<ATSAuditPanelProps> = ({ report, cv, onUpdateCV }) => {
  const [filter, setFilter] = useState<'all' | 'issues' | 'passed'>('all');

  const filteredChecks = report.checks.filter((chk) => {
    if (filter === 'issues') return chk.status === 'warning' || chk.status === 'fail';
    if (filter === 'passed') return chk.status === 'pass';
    return true;
  });

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-emerald-50 border-emerald-200';
    if (score >= 75) return 'bg-blue-50 border-blue-200';
    if (score >= 60) return 'bg-amber-50 border-amber-200';
    return 'bg-rose-50 border-rose-200';
  };

  // Helper to fix weak verb in bullets
  const handleReplaceWeakVerb = (weakPhrase: string, replacement: string) => {
    const updatedExp = cv.experience.map((exp) => ({
      ...exp,
      bullets: exp.bullets.map((b) => {
        const regex = new RegExp(`\\b${weakPhrase}\\b`, 'i');
        return b.replace(regex, replacement);
      }),
    }));
    onUpdateCV({ ...cv, experience: updatedExp });
  };

  return (
    <div id="ats-audit-panel" className="space-y-4">
      {/* Overall Score Card */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs transition-all">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Algorithm Analysis
            </h2>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-3xl font-extrabold tracking-tight ${getScoreColor(report.overallScore)}`}>
                {report.overallScore}%
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {report.overallScore >= 90
                  ? 'Ready for Workday/Taleo'
                  : report.overallScore >= 75
                  ? 'Competitive'
                  : 'Needs Optimization'}
              </span>
            </div>
          </div>

          <div className="w-11 h-11 rounded-full border-2 border-slate-200 flex items-center justify-center bg-slate-50">
            <ShieldCheck className={`w-6 h-6 ${getScoreColor(report.overallScore)}`} />
          </div>
        </div>

        {/* 3 Metric Progress Sub-bars in Sleek Card format */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
            <div className="flex justify-between text-[11px] mb-1.5 font-medium text-slate-700">
              <span>Formatting</span>
              <span className="text-blue-600 font-bold">{report.formattingScore}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all"
                style={{ width: `${report.formattingScore}%` }}
              />
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
            <div className="flex justify-between text-[11px] mb-1.5 font-medium text-slate-700">
              <span>Content</span>
              <span className="text-blue-600 font-bold">{report.contentScore}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all"
                style={{ width: `${report.contentScore}%` }}
              />
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
            <div className="flex justify-between text-[11px] mb-1.5 font-medium text-slate-700">
              <span>Keywords</span>
              <span className="text-blue-600 font-bold">{report.keywordScore}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all"
                style={{ width: `${report.keywordScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Weak Verbs Alert if found */}
      {report.weakVerbsFound.length > 0 && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-amber-900 font-semibold text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Passive / Weak Action Verbs Detected</span>
          </div>
          <p className="text-xs text-amber-800">
            Automated screening algorithms downgrade generic verbs like &quot;responsible for&quot; or &quot;helped with&quot;.
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {report.weakVerbsFound.map((phrase, idx) => {
              return (
                <div
                  key={idx}
                  className="inline-flex items-center gap-1.5 bg-white border border-amber-300 px-2 py-1 rounded-md text-xs shadow-2xs"
                >
                  <span className="line-through text-rose-600 font-medium">{phrase}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <button
                    onClick={() => handleReplaceWeakVerb(phrase, 'Spearheaded')}
                    className="font-bold text-emerald-700 hover:underline"
                    title="Replace with Spearheaded"
                  >
                    Spearheaded
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    onClick={() => handleReplaceWeakVerb(phrase, 'Engineered')}
                    className="font-bold text-emerald-700 hover:underline"
                    title="Replace with Engineered"
                  >
                    Engineered
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Metrics & Action Verb Counters in Sleek Cards */}
      <div className="grid grid-cols-2 gap-2.5 text-xs">
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-green-100 text-green-700 flex items-center justify-center font-bold">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-900 text-sm">{report.metricsCount}</div>
            <div className="text-slate-500 text-[11px] font-medium">Quantified Results (%, $)</div>
          </div>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-900 text-sm">{report.bulletCount}</div>
            <div className="text-slate-500 text-[11px] font-medium">Experience Bullets</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between pt-1">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
          Inspection Checks ({report.checks.length})
        </h2>
        <div className="flex gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
              filter === 'all' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('issues')}
            className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
              filter === 'issues' ? 'bg-white shadow-xs text-amber-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Issues (
            {report.checks.filter((c) => c.status !== 'pass').length})
          </button>
          <button
            onClick={() => setFilter('passed')}
            className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
              filter === 'passed' ? 'bg-white shadow-xs text-emerald-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Passed
          </button>
        </div>
      </div>

      {/* Checks List */}
      <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
        {filteredChecks.map((chk) => (
          <div
            key={chk.id}
            className={`p-3 rounded-lg border text-xs transition-colors ${
              chk.status === 'pass'
                ? 'bg-white border-slate-200'
                : chk.status === 'warning'
                ? 'bg-amber-50/50 border-amber-200'
                : 'bg-rose-50/50 border-rose-200'
            }`}
          >
            <div className="flex items-start gap-2">
              {chk.status === 'pass' && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              )}
              {chk.status === 'warning' && (
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              )}
              {chk.status === 'fail' && (
                <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="font-semibold text-slate-900">{chk.title}</h4>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      chk.category === 'formatting'
                        ? 'bg-slate-100 text-slate-600'
                        : chk.category === 'keywords'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {chk.category}
                  </span>
                </div>
                <p className="text-slate-600 text-xs mt-0.5">{chk.description}</p>
                {chk.recommendation && (
                  <div className="mt-1.5 p-1.5 bg-slate-50 rounded border border-slate-200 text-[11.5px] text-slate-800 flex items-start gap-1">
                    <span className="font-semibold text-blue-700 shrink-0">Tip:</span>
                    <span>{chk.recommendation}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
