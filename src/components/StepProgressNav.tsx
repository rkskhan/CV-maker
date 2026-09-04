import React from 'react';
import { FileText, Target, Zap, Check } from 'lucide-react';

export type AppPart = 1 | 2 | 3;

interface StepProgressNavProps {
  currentPart: AppPart;
  onSelectPart: (part: AppPart) => void;
  candidateName: string;
  hasJobDescription: boolean;
  atsScore: number;
  matchScore: number;
}

export const StepProgressNav: React.FC<StepProgressNavProps> = ({
  currentPart,
  onSelectPart,
  candidateName,
  hasJobDescription,
  atsScore,
  matchScore,
}) => {
  const steps: {
    part: AppPart;
    number: string;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    isCompleted: boolean;
  }[] = [
    {
      part: 1,
      number: '1',
      title: 'Part 1: Your CV',
      subtitle: candidateName || 'Upload PDF/DOCX or Create',
      icon: <FileText className="w-4 h-4" />,
      isCompleted: currentPart > 1 || Boolean(candidateName),
    },
    {
      part: 2,
      number: '2',
      title: 'Part 2: Job Description',
      subtitle: hasJobDescription ? `Loaded (${matchScore}% match)` : 'Upload or Paste JD',
      icon: <Target className="w-4 h-4" />,
      isCompleted: currentPart > 2 || hasJobDescription,
    },
    {
      part: 3,
      number: '3',
      title: 'Part 3: Skills Gap & Export',
      subtitle: `ATS ${atsScore}% • ${matchScore}% Match • DOCX & PDF`,
      icon: <Zap className="w-4 h-4" />,
      isCompleted: currentPart === 3,
    },
  ];

  return (
    <nav aria-label="Workflow Steps" className="no-print bg-white rounded-xl border border-slate-200 p-2 shadow-xs mb-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {steps.map((step) => {
          const isActive = currentPart === step.part;
          return (
            <button
              key={step.part}
              id={`nav-part-${step.part}-btn`}
              onClick={() => onSelectPart(step.part)}
              className={`text-left px-3.5 py-2.5 rounded-lg border transition-all flex items-center gap-3 ${
                isActive
                  ? 'bg-red-50/70 border-red-500 shadow-xs'
                  : 'bg-slate-50/40 hover:bg-slate-100/80 border-transparent hover:border-slate-200'
              }`}
            >
              {/* Step indicator circle */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                  isActive
                    ? 'bg-red-600 text-white shadow-2xs'
                    : step.isCompleted
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {step.isCompleted && !isActive ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  step.number
                )}
              </div>

              {/* Step text */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-xs font-bold tracking-tight truncate ${
                      isActive ? 'text-red-950' : 'text-slate-800'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate font-medium">
                  {step.subtitle}
                </p>
              </div>

              {/* Status pill on active */}
              {isActive && (
                <span className="hidden lg:inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-600 text-white">
                  Active
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
