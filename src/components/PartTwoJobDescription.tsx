import React, { useState, useRef } from 'react';
import { CVData, JobMatchReport } from '../types/cv';
import { extractTextFromFile } from '../utils/fileParser';
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Target, 
  ArrowRight, 
  ArrowLeft,
  Plus,
  Check,
  Briefcase,
  Zap
} from 'lucide-react';

interface PartTwoJobDescriptionProps {
  cv: CVData;
  onUpdateCV: (newCV: CVData) => void;
  jobDescription: string;
  onUpdateJobDescription: (jd: string) => void;
  report: JobMatchReport;
  onPrev: () => void;
  onNext: () => void;
  onDirectConvert?: () => void;
}

const SAMPLE_JOB_POSTINGS: { label: string; roleType: string; text: string }[] = [
  {
    label: 'Tech Engineer',
    roleType: 'Tech',
    text: `Position: Senior Full Stack Software Engineer (Distributed Systems)
Location: New York, NY / Remote

Responsibilities:
- Architect high-throughput REST and GraphQL APIs using Node.js, TypeScript, and modern backend frameworks.
- Build responsive, accessible user interfaces using React, Next.js, and Tailwind CSS.
- Optimize database queries and schema design across PostgreSQL and Redis.
- Deploy and orchestrate containerized microservices using Docker, Kubernetes, and AWS cloud infrastructure.
- Lead Agile Scrum sprint cycles, test automation (Jest/Playwright), and code reviews.

Qualifications:
- 4+ years building full stack web applications at scale.
- Strong proficiency in TypeScript, JavaScript, React, Node.js, and SQL.
- Hands-on experience with Docker, Kubernetes, CI/CD pipelines, and AWS (ECS, S3, CloudFront).`
  },
  {
    label: 'Business Analyst',
    roleType: 'Business',
    text: `Position: Financial & Strategic Business Analyst
Location: Chicago, IL / Hybrid

Overview:
We are seeking a sharp, data-driven Business & Finance Analyst to join our Strategic Planning and Corporate Advisory group.

Responsibilities:
- Build dynamic 3-statement financial models, DCF valuations, and sensitivity scenario analysis for corporate transactions.
- Conduct cross-industry market research, competitor benchmarking, and commercial due diligence.
- Synthesize quantitative datasets using Advanced Excel (VBA/Macros), SQL, and Power BI to extract executive insights.
- Author presentation decks and memos for senior leadership and investment committees.
- Support go-to-market (GTM) execution and KPI tracking across strategic initiatives.

Qualifications:
- Degree in Business Administration, Finance, Economics, or related discipline.
- Proficient in DCF Modeling, Valuation, Advanced Excel, SQL, and Power BI.
- Strong written and verbal communication skills for executive presentations.`
  },
  {
    label: 'Visual Arts & Design',
    roleType: 'Arts',
    text: `Position: Visual Designer & Creative Media Specialist
Location: New York, NY / Brooklyn Studio

About The Role:
Join our multidisciplinary creative studio to craft distinctive brand identities, editorial layouts, and digital experiences for leading cultural and lifestyle brands.

Responsibilities:
- Design comprehensive brand visual identity systems, typography scales, color palettes, and vector iconography.
- Develop print-ready collateral, packaging mechanicals, and exhibition signage with precise CMYK/Pantone color separations.
- Create digital marketing assets, social campaigns, and interactive UI prototypes in Figma.
- Collaborate with creative directors and client stakeholders to present conceptual design directions.
- Prepare production files and coordinate directly with print vendors and bookbinders.

Requirements:
- Degree or background in Graphic Design, Visual Arts, Fine Arts, or Digital Media.
- Mastery of Adobe Creative Cloud (Photoshop, Illustrator, InDesign) and Figma.
- Deep understanding of typography, grid systems, brand identity, and color theory.`
  },
  {
    label: 'Product Manager',
    roleType: 'Product',
    text: `Position: Senior Product Manager (Core Platform & Growth)
Location: Remote / San Francisco, CA

Responsibilities:
- Own product roadmap and strategy from discovery to launch for high-growth SaaS platform.
- Author detailed PRDs, user stories, and acceptance criteria in bi-weekly Agile/Scrum cycles.
- Run quantitative A/B testing experimentation and cohort analytics using SQL, Amplitude, and Mixpanel.
- Partner with engineering, UX design, and commercial teams to drive user retention and ARR growth.

Qualifications:
- 3+ years in product management for B2B or B2C digital applications.
- Experience with Product Roadmapping, Customer Discovery, PRD authoring, and Agile methodologies.
- Analytical mindset with hands-on SQL and metrics telemetry experience.`
  }
];

export const PartTwoJobDescription: React.FC<PartTwoJobDescriptionProps> = ({
  cv,
  onUpdateCV,
  jobDescription,
  onUpdateJobDescription,
  report,
  onPrev,
  onNext,
  onDirectConvert,
}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleJdFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadNotice(null);
    try {
      const text = await extractTextFromFile(file);
      if (text && text.trim().length > 30) {
        onUpdateJobDescription(text);
        setUploadNotice(`Extracted job description from "${file.name}".`);
      } else {
        alert('Could not extract text from this file. Please paste the job description text.');
      }
    } catch (err: any) {
      console.error('JD file parse error:', err);
      alert('Failed to read document. Please copy and paste the job description text.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddKeywordToCV = (keyword: string) => {
    const newCV = JSON.parse(JSON.stringify(cv)) as CVData;
    let targetCat = newCV.skillCategories.find(c => /technical|core|tools|skills/i.test(c.categoryName));
    if (!targetCat) {
      if (newCV.skillCategories.length > 0) {
        targetCat = newCV.skillCategories[0];
      } else {
        targetCat = { id: 'cat-new', categoryName: 'Target Job Skills', skills: [] };
        newCV.skillCategories.push(targetCat);
      }
    }
    if (!targetCat.skills.some(s => s.toLowerCase() === keyword.toLowerCase())) {
      targetCat.skills.push(keyword);
      onUpdateCV(newCV);
    }
  };

  const wordCount = jobDescription.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Top Banner: Part 2 Introduction */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[11px] font-black flex items-center justify-center">
                2
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                Step 2 of 3
              </span>
              <h2 className="text-base font-bold text-slate-900">
                Target Job Description
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Paste or upload the job posting to find required keywords and measure ATS compatibility.
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Initial Match:
            </span>
            <span
              className={`px-2.5 py-1 font-bold text-xs rounded-full border ${
                report.matchScore >= 70
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : report.matchScore >= 45
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {report.matchScore}%
            </span>
          </div>
        </div>

        {/* Direct ATS Mode Skip Banner */}
        <div className="mt-4 p-3 bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-red-600" />
              Just want to convert your existing CV without matching a job?
            </span>
            <p className="text-[11px] text-slate-500">
              Skip job description matching to directly format, audit, and export your CV in 100% ATS-compliant single-column layout.
            </p>
          </div>
          <button
            id="btn-skip-jd-top"
            onClick={() => {
              if (onDirectConvert) onDirectConvert();
              else onNext();
            }}
            className="shrink-0 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-md flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
          >
            <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
            <span>⚡ Skip to Direct ATS Export</span>
          </button>
        </div>

        {/* Input Controls: File upload & Sample quick load */}
        <div className="mt-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleJdFileUpload(f);
                  e.target.value = '';
                }}
                accept=".txt,.pdf,.docx"
                className="hidden"
              />
              <button
                id="btn-upload-jd-file"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-slate-700" />
                <span>{isUploading ? 'Reading file...' : 'Upload Job File (.pdf, .docx, .txt)'}</span>
              </button>

              {uploadNotice && (
                <span className="text-[11px] font-medium text-green-700 bg-green-50 px-2 py-1 rounded border border-green-200 flex items-center gap-1">
                  <Check className="w-3 h-3 text-green-600" />
                  {uploadNotice}
                </span>
              )}
            </div>

            {/* Quick Sample Job Postings */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-semibold uppercase text-[10px] mr-1 hidden sm:inline">
                Sample Jobs:
              </span>
              {SAMPLE_JOB_POSTINGS.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onUpdateJobDescription(sample.text);
                    setUploadNotice(`Loaded "${sample.label}" posting.`);
                  }}
                  className="px-2.5 py-1 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-medium transition-colors"
                >
                  {sample.label}
                </button>
              ))}
              {jobDescription && (
                <button
                  onClick={() => {
                    onUpdateJobDescription('');
                    setUploadNotice(null);
                  }}
                  className="px-2 py-1 text-slate-400 hover:text-slate-600 text-[11px] font-medium ml-1"
                  title="Clear text"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Job Description Textarea */}
          <div className="relative">
            <textarea
              id="job-description-textarea"
              value={jobDescription}
              onChange={(e) => onUpdateJobDescription(e.target.value)}
              placeholder="Paste the target job description or requirements here..."
              rows={8}
              className="w-full text-xs font-mono p-3.5 rounded-xl border border-slate-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none bg-slate-50/50 focus:bg-white text-slate-800 leading-relaxed resize-y transition-colors"
            />
            <div className="absolute bottom-3 right-3 text-[11px] text-slate-400 font-mono bg-white/90 px-2 py-0.5 rounded border border-slate-200">
              {wordCount} words
            </div>
          </div>
        </div>
      </div>

      {/* Target Job Keyword Breakdown */}
      {jobDescription.trim().length > 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Keyword & Competency Audit
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                {report.foundKeywords.length} matching keywords in your CV • {report.missingKeywords.length} missing keywords ready to be optimized
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">ATS Match:</span>
              <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    report.matchScore >= 70
                      ? 'bg-green-600'
                      : report.matchScore >= 40
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${report.matchScore}%` }}
                ></div>
              </div>
              <span className="text-xs font-bold text-slate-800">{report.matchScore}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Matched Keywords */}
            <div className="p-3.5 bg-green-50/70 border border-green-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-green-900 flex items-center gap-1.5 uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                  Matched in CV ({report.foundKeywords.length})
                </span>
                <span className="text-[10px] text-green-700 font-semibold">Indexed</span>
              </div>
              {report.foundKeywords.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {report.foundKeywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-white text-green-800 border border-green-300 rounded text-[11px] font-semibold flex items-center gap-1 shadow-2xs"
                    >
                      <Check className="w-2.5 h-2.5 text-green-600" />
                      {kw}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-green-800/80 italic">
                  No direct keyword matches yet. Step 3 will automatically inject target skills!
                </p>
              )}
            </div>

            {/* Missing Keywords */}
            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5 uppercase tracking-wider">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  Missing from CV ({report.missingKeywords.length})
                </span>
                <span className="text-[10px] text-amber-700 font-semibold">Click + to add</span>
              </div>
              {report.missingKeywords.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {report.missingKeywords.slice(0, 16).map((kw, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAddKeywordToCV(kw)}
                      className="px-2 py-0.5 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded text-[11px] font-medium flex items-center gap-1 transition-colors group shadow-2xs"
                      title="Add keyword to CV skills"
                    >
                      <Plus className="w-2.5 h-2.5 text-amber-600 group-hover:scale-125 transition-transform" />
                      {kw}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-amber-800/80 italic">
                  Great match! No major missing keywords detected.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-6 text-center space-y-2 shadow-xs">
          <Target className="w-8 h-8 text-slate-400 mx-auto" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Paste or Select a Job Posting Above
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Choose one of the sample jobs above or paste your dream job to analyze ATS keywords and optimize in Step 3.
          </p>
        </div>
      )}

      {/* Part 2 Bottom Navigation Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <button
          id="btn-backto-part1"
          onClick={onPrev}
          className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Step 1: Your CV</span>
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          <button
            id="btn-skip-to-ats-export-bottom"
            onClick={() => {
              if (onDirectConvert) onDirectConvert();
              else onNext();
            }}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            title="Skip job description and go straight to ATS single-column formatting & export"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>⚡ Skip Match & Export ATS CV</span>
          </button>

          <button
            id="btn-goto-part3"
            onClick={onNext}
            className="w-full sm:w-auto px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <span>Continue to Step 3: Skills Gap & Export</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
