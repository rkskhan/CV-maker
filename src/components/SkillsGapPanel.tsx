import React, { useState } from 'react';
import { CVData, JobMatchReport } from '../types/cv';
import { 
  AlertCircle, 
  CheckCircle2, 
  Plus, 
  Check, 
  Sparkles, 
  Search, 
  ArrowRight,
  TrendingUp,
  Layers,
  HelpCircle,
  RotateCcw,
  Zap
} from 'lucide-react';

interface SkillsGapPanelProps {
  cv: CVData;
  onUpdateCV: (newCV: CVData) => void;
  jobDescription: string;
  jobMatchReport: JobMatchReport;
}

export const SkillsGapPanel: React.FC<SkillsGapPanelProps> = ({
  cv,
  onUpdateCV,
  jobDescription,
  jobMatchReport,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'missing' | 'matched'>('all');
  const [recentlyAdded, setRecentlyAdded] = useState<string[]>([]);
  const [showTips, setShowTips] = useState(false);

  const missingKeywords = jobMatchReport.missingKeywords;
  const foundKeywords = jobMatchReport.foundKeywords;
  const totalKeywords = missingKeywords.length + foundKeywords.length;
  const coveragePercent = totalKeywords > 0 
    ? Math.round((foundKeywords.length / totalKeywords) * 100) 
    : 100;

  // Add a single missing skill to CV
  const handleAddSkill = (skill: string) => {
    const updatedCV = JSON.parse(JSON.stringify(cv)) as CVData;
    
    // Find preferred category: 'Technical Skills', 'Core Skills', or first existing
    let targetCat = updatedCV.skillCategories.find(c => 
      /technical|core|tools|technologies|proficiencies/i.test(c.categoryName)
    );

    if (!targetCat) {
      if (updatedCV.skillCategories.length > 0) {
        targetCat = updatedCV.skillCategories[0];
      } else {
        targetCat = {
          id: `cat-${Date.now()}`,
          categoryName: 'Target Job Skills',
          skills: []
        };
        updatedCV.skillCategories.push(targetCat);
      }
    }

    // Check if skill already present (case-insensitive)
    const exists = targetCat.skills.some(s => s.toLowerCase() === skill.toLowerCase());
    if (!exists) {
      targetCat.skills.push(skill);
      onUpdateCV(updatedCV);
      setRecentlyAdded(prev => [...prev, skill.toLowerCase()]);
    }
  };

  // Add all missing skills in 1-click
  const handleAddAllMissing = () => {
    if (missingKeywords.length === 0) return;

    const updatedCV = JSON.parse(JSON.stringify(cv)) as CVData;
    let targetCat = updatedCV.skillCategories.find(c => 
      /technical|core|tools|technologies/i.test(c.categoryName)
    );

    if (!targetCat) {
      if (updatedCV.skillCategories.length > 0) {
        targetCat = updatedCV.skillCategories[0];
      } else {
        targetCat = {
          id: `cat-${Date.now()}`,
          categoryName: 'Target Job Skills',
          skills: []
        };
        updatedCV.skillCategories.push(targetCat);
      }
    }

    const newlyAddedList: string[] = [];
    missingKeywords.forEach(kw => {
      const exists = targetCat!.skills.some(s => s.toLowerCase() === kw.toLowerCase());
      if (!exists) {
        targetCat!.skills.push(kw);
        newlyAddedList.push(kw.toLowerCase());
      }
    });

    onUpdateCV(updatedCV);
    setRecentlyAdded(prev => [...prev, ...newlyAddedList]);
  };

  // Remove skill if user wants to undo
  const handleRemoveSkill = (skill: string) => {
    const updatedCV = JSON.parse(JSON.stringify(cv)) as CVData;
    updatedCV.skillCategories.forEach(cat => {
      cat.skills = cat.skills.filter(s => s.toLowerCase() !== skill.toLowerCase());
    });
    onUpdateCV(updatedCV);
    setRecentlyAdded(prev => prev.filter(s => s !== skill.toLowerCase()));
  };

  // Filter lists based on search
  const filteredMissing = missingKeywords.filter(k => 
    k.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredFound = foundKeywords.filter(k => 
    k.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="skills-gap-section" className="space-y-4">
      {/* Top Header & Coverage Banner */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-black text-red-600 flex items-center justify-center font-black text-sm border border-slate-900 shadow-2xs">
              S
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                Skills Gap Analysis
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                  ATS Match Engine
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Comparing your candidate profile against required skills in the job description.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
              coveragePercent >= 75 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : coveragePercent >= 50
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}>
              {coveragePercent}% Skills Covered
            </span>
          </div>
        </div>

        {/* Coverage Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-xs text-slate-600 font-medium">
            <span>Profile Match: <strong className="text-slate-900">{foundKeywords.length}</strong> of {totalKeywords} keywords matched</span>
            <span className="text-slate-500">{missingKeywords.length} missing skills</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
            <div 
              className={`h-full transition-all duration-500 ${
                coveragePercent >= 75
                  ? 'bg-emerald-600'
                  : coveragePercent >= 50
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${Math.max(8, coveragePercent)}%` }}
            />
          </div>
        </div>

        {/* Quick KPI Stat Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Matched Skills</span>
            <span className="text-base font-bold text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {foundKeywords.length}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Missing Skills</span>
            <span className="text-base font-bold text-amber-700 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              {missingKeywords.length}
            </span>
          </div>
          <div className="col-span-2 sm:col-span-1 p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Target Job Status</span>
            <span className="text-xs font-semibold text-slate-800 truncate">
              {jobDescription.trim() ? 'Job Loaded & Scanned' : 'No JD Loaded'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Banner: 1-Click Add All Missing Skills */}
      {missingKeywords.length > 0 && (
        <div className="p-3.5 bg-gradient-to-r from-red-50/70 to-slate-50 border border-red-200/80 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-red-600" />
              <span className="text-xs font-bold text-slate-900">
                Bridge the Gap in 1-Click
              </span>
            </div>
            <p className="text-[11px] text-slate-600">
              Add all {missingKeywords.length} missing competencies directly to your CV skills list to maximize ATS indexing.
            </p>
          </div>

          <button
            id="btn-add-all-missing-skills"
            onClick={handleAddAllMissing}
            className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs shrink-0 self-stretch sm:self-auto justify-center"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add All {missingKeywords.length} Skills to CV</span>
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search keywords (e.g., Python, Docker, SQL)..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs w-full sm:w-auto shrink-0">
          <button
            onClick={() => setFilterMode('all')}
            className={`flex-1 sm:flex-initial px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              filterMode === 'all'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({totalKeywords})
          </button>
          <button
            onClick={() => setFilterMode('missing')}
            className={`flex-1 sm:flex-initial px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              filterMode === 'missing'
                ? 'bg-white text-amber-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Missing ({missingKeywords.length})
          </button>
          <button
            onClick={() => setFilterMode('matched')}
            className={`flex-1 sm:flex-initial px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              filterMode === 'matched'
                ? 'bg-white text-emerald-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Matched ({foundKeywords.length})
          </button>
        </div>
      </div>

      {/* Missing Skills Section */}
      {(filterMode === 'all' || filterMode === 'missing') && (
        <div className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/40 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5 uppercase tracking-wider">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Missing Skills from Job Posting ({filteredMissing.length})
            </span>
            <span className="text-[10px] text-amber-700 font-semibold">
              Click + to inject into profile
            </span>
          </div>

          {filteredMissing.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {filteredMissing.map((skill, idx) => {
                const wasAdded = recentlyAdded.includes(skill.toLowerCase());
                return (
                  <div
                    key={idx}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                      wasAdded
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-2xs'
                        : 'bg-white hover:bg-amber-100/60 border-amber-300 text-amber-950 shadow-2xs'
                    }`}
                  >
                    <span>{skill}</span>
                    {wasAdded ? (
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-emerald-700 hover:text-rose-600 p-0.5 rounded transition-colors"
                        title="Remove added skill"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAddSkill(skill)}
                        className="text-amber-800 hover:text-red-700 p-0.5 rounded transition-colors hover:scale-110"
                        title={`Add "${skill}" to CV skills`}
                      >
                        <Plus className="w-3.5 h-3.5 text-red-600 font-bold" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-amber-800 italic py-1">
              {missingKeywords.length === 0 
                ? 'Outstanding! No missing keywords detected for this job.' 
                : 'No missing skills matching your search.'}
            </p>
          )}
        </div>
      )}

      {/* Matched Skills Section */}
      {(filterMode === 'all' || filterMode === 'matched') && (
        <div className="p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/30 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Skills Found in Your CV ({filteredFound.length})
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold">
              ATS Readable
            </span>
          </div>

          {filteredFound.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {filteredFound.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-white border border-emerald-300 text-emerald-900 shadow-2xs"
                >
                  <Check className="w-3 h-3 text-emerald-600 font-bold" />
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-emerald-800 italic py-1">
              No matching skills found in CV yet. Add the suggested skills above!
            </p>
          )}
        </div>
      )}

      {/* ATS Skills Optimization Guidance Dropdown */}
      <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-2">
        <button
          onClick={() => setShowTips(!showTips)}
          className="w-full flex items-center justify-between text-left font-semibold text-slate-800 hover:text-slate-950 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            ATS Best Practices for Incorporating Missing Skills
          </span>
          <span className="text-[11px] text-slate-500 underline">
            {showTips ? 'Hide guidance' : 'View tips'}
          </span>
        </button>

        {showTips && (
          <div className="pt-2 border-t border-slate-200 space-y-2 text-slate-600 text-[11px] leading-relaxed">
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
              <p><strong>Exact Keyword Matching:</strong> Applicant Tracking Systems search for exact literal spellings (e.g. "PostgreSQL" vs "Postgres", "Amazon Web Services" vs "AWS"). Ensure both variations are present where appropriate.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
              <p><strong>Dual Integration:</strong> Add missing competencies to your Skills section for quick keyword indexing, and weave 1-2 into bullet points with quantifiable impact metrics.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
              <p><strong>Contextual Legitimacy:</strong> Never place keywords in white invisible text or artificial lists; modern parsers like Workday and Greenhouse evaluate context surrounding each competency.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
