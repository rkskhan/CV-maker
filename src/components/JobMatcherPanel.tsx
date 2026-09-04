import React, { useState } from 'react';
import { CVData, JobMatchReport } from '../types/cv';
import { 
  Target, 
  Sparkles, 
  Plus, 
  Check, 
  AlertCircle, 
  FileSearch, 
  RotateCcw,
  CheckCircle2,
  Copy
} from 'lucide-react';

interface JobMatcherPanelProps {
  cv: CVData;
  onUpdateCV: (newCV: CVData) => void;
  jobDescription: string;
  onUpdateJobDescription: (jd: string) => void;
  report: JobMatchReport;
  onHighlightKeywords: (keywords: string[]) => void;
}

const SAMPLE_TECH_JD = `We are seeking a Senior Full Stack Software Engineer to join our Core Infrastructure engineering team. 

Key Responsibilities:
- Design and architect scalable cloud microservices utilizing Node.js, TypeScript, and AWS Lambda.
- Build high-performance frontend interfaces with React 18, Next.js, and Tailwind CSS.
- Optimize complex PostgreSQL queries and Redis caching layers for high-throughput distributed systems.
- Build automated CI/CD pipelines with Docker, Kubernetes, and GitHub Actions.
- Ensure strict SOC 2 and GDPR compliance while maintaining 99.99% system availability.
- Mentor junior engineers and collaborate in fast-paced Agile / Scrum sprints.

Required Skills:
- 5+ years with TypeScript, React, Node.js, and Python.
- Proven experience with PostgreSQL, GraphQL, Docker, Kubernetes, and AWS.
- Strong knowledge of unit testing (Jest, Cypress) and system design.`;

const SAMPLE_PRODUCT_JD = `We are looking for an experienced Senior Product Manager to drive product roadmap and execution for our B2B Enterprise SaaS suite.

Responsibilities:
- Lead product discovery, market research, and customer journey mapping with enterprise buyers.
- Define OKRs and KPI metrics using Amplitude, Mixpanel, and SQL data analytics.
- Collaborate cross-functionally with 15+ engineers and UX designers in bi-weekly Agile sprints.
- Author detailed PRDs, user stories, and acceptance criteria.
- Conduct continuous A/B testing to optimize free-to-paid conversion funnels.

Qualifications:
- 4+ years of Product Management in B2B SaaS or Fintech.
- Deep expertise in SQL, Product Roadmapping, Stakeholder Management, and PLG.`;

export const JobMatcherPanel: React.FC<JobMatcherPanelProps> = ({
  cv,
  onUpdateCV,
  jobDescription,
  onUpdateJobDescription,
  report,
  onHighlightKeywords,
}) => {
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);

  const handleAddSkillToCV = (keyword: string) => {
    // Add to first category or create one
    const categories = [...cv.skillCategories];
    if (categories.length === 0) {
      categories.push({
        id: 'skill-custom',
        categoryName: 'Target Job Skills',
        skills: [keyword],
      });
    } else {
      // Add to the first category if not present
      if (!categories[0].skills.includes(keyword)) {
        categories[0] = {
          ...categories[0],
          skills: [...categories[0].skills, keyword],
        };
      }
    }

    onUpdateCV({
      ...cv,
      skillCategories: categories,
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyword(text);
    setTimeout(() => setCopiedKeyword(null), 1500);
  };

  return (
    <div id="job-matcher-panel" className="space-y-4">
      {/* Header Info */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-blue-600" />
          Job Description Target Scanner
        </h2>
        <p className="text-slate-600 leading-relaxed text-xs">
          Paste the target job description. The parser extracts industry competencies and scores your match rate before application submission.
        </p>
      </div>

      {/* Input Box & Quick JD Samples */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-900 text-xs">Job Description Text</span>
          <div className="flex gap-1.5 text-[11px]">
            <button
              id="sample-tech-jd-btn"
              onClick={() => onUpdateJobDescription(SAMPLE_TECH_JD)}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition-colors font-medium text-xs"
            >
              Sample Tech JD
            </button>
            <button
              id="sample-pm-jd-btn"
              onClick={() => onUpdateJobDescription(SAMPLE_PRODUCT_JD)}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition-colors font-medium text-xs"
            >
              Sample PM JD
            </button>
            {jobDescription && (
              <button
                id="clear-jd-btn"
                onClick={() => onUpdateJobDescription('')}
                className="px-2 py-1 rounded text-slate-500 hover:text-rose-600 transition-colors text-xs"
                title="Clear job description"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <textarea
          id="job-description-input"
          value={jobDescription}
          onChange={(e) => onUpdateJobDescription(e.target.value)}
          placeholder="Paste job description requirements and responsibilities here..."
          rows={5}
          className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-sans outline-none bg-slate-50/50 focus:bg-white text-slate-900 resize-y transition-colors"
        />
      </div>

      {/* Match Results Display */}
      {jobDescription.trim().length > 20 && (
        <div className="space-y-3 pt-1">
          {/* Match Score Gauge */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Target Job Match Rate
                </h2>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span
                    className={`text-2xl font-extrabold tracking-tight ${
                      report.matchScore >= 80
                        ? 'text-green-600'
                        : report.matchScore >= 60
                        ? 'text-blue-600'
                        : 'text-amber-600'
                    }`}
                  >
                    {report.matchScore}%
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    ({report.foundKeywords.length} of {report.foundKeywords.length + report.missingKeywords.length} keywords matched)
                  </span>
                </div>
              </div>

              <button
                onClick={() => onHighlightKeywords(report.foundKeywords)}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors font-medium"
                title="Highlight matched words in preview"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Highlight in CV
              </button>
            </div>

            {/* Match Progress Bar */}
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  report.matchScore >= 80 ? 'bg-green-500' : 'bg-blue-600'
                }`}
                style={{ width: `${report.matchScore}%` }}
              />
            </div>
          </div>

          {/* Missing Keywords Section (Actionable!) */}
          {report.missingKeywords.length > 0 && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  Missing Keywords ({report.missingKeywords.length})
                </h3>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  Click + to add to skills
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {report.missingKeywords.slice(0, 18).map((kw, i) => (
                  <div
                    key={i}
                    className="inline-flex items-center gap-1 bg-white border border-slate-200 text-slate-700 px-2 py-1 rounded text-[10px] font-bold uppercase shadow-2xs hover:border-blue-400 group transition-colors"
                  >
                    <span>{kw}</span>
                    <button
                      onClick={() => handleAddSkillToCV(kw)}
                      className="text-blue-600 hover:text-blue-800 p-0.5 rounded hover:bg-blue-50"
                      title={`Add "${kw}" to CV skills section`}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Keywords Section */}
          {report.foundKeywords.length > 0 && (
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                Matched Keywords ({report.foundKeywords.length})
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {report.foundKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase flex items-center gap-1"
                  >
                    <Check className="w-3 h-3 text-green-600" />
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
