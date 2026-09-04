import React, { useState } from 'react';
import { 
  CVData, 
  ExperienceItem, 
  EducationItem, 
  SkillCategory, 
  ProjectItem, 
  CertificationItem 
} from '../types/cv';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Wrench, 
  FolderGit2, 
  Award, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  Info,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { STRONG_ACTION_VERBS } from '../utils/atsAuditor';

interface EditorPanelProps {
  cv: CVData;
  onUpdateCV: (newCV: CVData) => void;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({ cv, onUpdateCV }) => {
  const [activeTab, setActiveTab] = useState<'contact' | 'summary' | 'experience' | 'skills' | 'education' | 'projects' | 'certs'>('contact');
  const [newSkillInputs, setNewSkillInputs] = useState<{ [catId: string]: string }>({});

  // 1. Personal Info Handler
  const handlePersonalInfoChange = (field: keyof CVData['personalInfo'], value: string) => {
    onUpdateCV({
      ...cv,
      personalInfo: {
        ...cv.personalInfo,
        [field]: value,
      },
    });
  };

  // 2. Summary Handler
  const handleSummaryChange = (value: string) => {
    onUpdateCV({
      ...cv,
      summary: value,
    });
  };

  // 3. Experience Handlers
  const handleAddExperience = () => {
    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: true,
      bullets: [''],
    };
    onUpdateCV({
      ...cv,
      experience: [newExp, ...cv.experience],
    });
  };

  const handleUpdateExperience = (index: number, field: keyof ExperienceItem, value: any) => {
    const updated = [...cv.experience];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onUpdateCV({ ...cv, experience: updated });
  };

  const handleDeleteExperience = (index: number) => {
    const updated = cv.experience.filter((_, i) => i !== index);
    onUpdateCV({ ...cv, experience: updated });
  };

  const handleAddBullet = (expIndex: number) => {
    const updated = [...cv.experience];
    updated[expIndex].bullets.push('');
    onUpdateCV({ ...cv, experience: updated });
  };

  const handleUpdateBullet = (expIndex: number, bulletIndex: number, text: string) => {
    const updated = [...cv.experience];
    updated[expIndex].bullets[bulletIndex] = text;
    onUpdateCV({ ...cv, experience: updated });
  };

  const handleDeleteBullet = (expIndex: number, bulletIndex: number) => {
    const updated = [...cv.experience];
    updated[expIndex].bullets = updated[expIndex].bullets.filter((_, i) => i !== bulletIndex);
    onUpdateCV({ ...cv, experience: updated });
  };

  // 4. Skills Handlers
  const handleAddCategory = () => {
    const newCat: SkillCategory = {
      id: `skill-${Date.now()}`,
      categoryName: 'New Category',
      skills: [],
    };
    onUpdateCV({
      ...cv,
      skillCategories: [...cv.skillCategories, newCat],
    });
  };

  const handleUpdateCategoryName = (catIndex: number, name: string) => {
    const updated = [...cv.skillCategories];
    updated[catIndex].categoryName = name;
    onUpdateCV({ ...cv, skillCategories: updated });
  };

  const handleDeleteCategory = (catIndex: number) => {
    const updated = cv.skillCategories.filter((_, i) => i !== catIndex);
    onUpdateCV({ ...cv, skillCategories: updated });
  };

  const handleAddSkillTag = (catIndex: number, skillName: string) => {
    const trimmed = skillName.trim();
    if (!trimmed) return;
    const updated = [...cv.skillCategories];
    if (!updated[catIndex].skills.includes(trimmed)) {
      updated[catIndex].skills.push(trimmed);
      onUpdateCV({ ...cv, skillCategories: updated });
    }
    setNewSkillInputs({ ...newSkillInputs, [updated[catIndex].id]: '' });
  };

  const handleRemoveSkillTag = (catIndex: number, skillIndex: number) => {
    const updated = [...cv.skillCategories];
    updated[catIndex].skills = updated[catIndex].skills.filter((_, i) => i !== skillIndex);
    onUpdateCV({ ...cv, skillCategories: updated });
  };

  // 5. Education Handlers
  const handleAddEducation = () => {
    const newEdu: EducationItem = {
      id: `edu-${Date.now()}`,
      degree: '',
      institution: '',
      location: '',
      graduationDate: '',
    };
    onUpdateCV({
      ...cv,
      education: [...cv.education, newEdu],
    });
  };

  const handleUpdateEducation = (index: number, field: keyof EducationItem, value: string) => {
    const updated = [...cv.education];
    updated[index] = { ...updated[index], [field]: value };
    onUpdateCV({ ...cv, education: updated });
  };

  const handleDeleteEducation = (index: number) => {
    const updated = cv.education.filter((_, i) => i !== index);
    onUpdateCV({ ...cv, education: updated });
  };

  // 6. Project Handlers
  const handleAddProject = () => {
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: '',
      technologies: '',
      link: '',
      date: '',
      bullets: [''],
    };
    onUpdateCV({
      ...cv,
      projects: [...cv.projects, newProj],
    });
  };

  const handleUpdateProject = (index: number, field: keyof ProjectItem, value: any) => {
    const updated = [...cv.projects];
    updated[index] = { ...updated[index], [field]: value };
    onUpdateCV({ ...cv, projects: updated });
  };

  const handleDeleteProject = (index: number) => {
    const updated = cv.projects.filter((_, i) => i !== index);
    onUpdateCV({ ...cv, projects: updated });
  };

  // 7. Certifications Handlers
  const handleAddCert = () => {
    const newCert: CertificationItem = {
      id: `cert-${Date.now()}`,
      name: '',
      issuer: '',
      date: '',
    };
    onUpdateCV({
      ...cv,
      certifications: [...cv.certifications, newCert],
    });
  };

  const handleUpdateCert = (index: number, field: keyof CertificationItem, value: string) => {
    const updated = [...cv.certifications];
    updated[index] = { ...updated[index], [field]: value };
    onUpdateCV({ ...cv, certifications: updated });
  };

  const handleDeleteCert = (index: number) => {
    const updated = cv.certifications.filter((_, i) => i !== index);
    onUpdateCV({ ...cv, certifications: updated });
  };

  // Word count for summary
  const summaryWords = cv.summary ? cv.summary.trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    <div id="cv-editor-panel" className="space-y-4">
      {/* Sub Section Navigation */}
      <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-medium">
        <button
          id="tab-contact-btn"
          onClick={() => setActiveTab('contact')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'contact'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <User className="w-3.5 h-3.5 text-slate-500" />
          <span>Contact</span>
        </button>

        <button
          id="tab-summary-btn"
          onClick={() => setActiveTab('summary')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'summary'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Summary</span>
          {summaryWords >= 25 && summaryWords <= 120 && (
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          )}
        </button>

        <button
          id="tab-experience-btn"
          onClick={() => setActiveTab('experience')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'experience'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5 text-slate-500" />
          <span>Experience</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 font-bold">
            {cv.experience.length}
          </span>
        </button>

        <button
          id="tab-skills-btn"
          onClick={() => setActiveTab('skills')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'skills'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Wrench className="w-3.5 h-3.5 text-slate-500" />
          <span>Skills</span>
        </button>

        <button
          id="tab-education-btn"
          onClick={() => setActiveTab('education')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'education'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
          <span>Education</span>
        </button>

        <button
          id="tab-projects-btn"
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'projects'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FolderGit2 className="w-3.5 h-3.5 text-slate-500" />
          <span>Projects</span>
        </button>

        <button
          id="tab-certs-btn"
          onClick={() => setActiveTab('certs')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'certs'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-slate-500" />
          <span>Certs</span>
        </button>
      </div>

      {/* Tab 1: Personal Contact Info */}
      {activeTab === 'contact' && (
        <div id="section-editor-contact" className="space-y-3">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-600 flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              <strong>ATS Tip:</strong> Plain text headers ensure automated parsers can index your legal name, email, and phone number without regex parsing corruption.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Legal Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={cv.personalInfo.fullName}
                onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                placeholder="e.g. ALEXANDER CHEN"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-slate-50/50 focus:bg-white text-slate-900 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Job Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={cv.personalInfo.jobTitle}
                onChange={(e) => handlePersonalInfoChange('jobTitle', e.target.value)}
                placeholder="e.g. Senior Full Stack Software Engineer"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-slate-50/50 focus:bg-white text-slate-900 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={cv.personalInfo.email}
                onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                placeholder="name@domain.com"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-slate-50/50 focus:bg-white text-slate-900 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                value={cv.personalInfo.phone}
                onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                placeholder="+1 (555) 019-2834"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-slate-50/50 focus:bg-white text-slate-900 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Location (City, State / Country)
              </label>
              <input
                type="text"
                value={cv.personalInfo.location}
                onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                placeholder="San Francisco, CA"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-slate-50/50 focus:bg-white text-slate-900 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                LinkedIn Profile URL
              </label>
              <input
                type="text"
                value={cv.personalInfo.linkedinUrl}
                onChange={(e) => handlePersonalInfoChange('linkedinUrl', e.target.value)}
                placeholder="linkedin.com/in/yourname"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-slate-50/50 focus:bg-white text-slate-900 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                GitHub Profile URL
              </label>
              <input
                type="text"
                value={cv.personalInfo.githubUrl}
                onChange={(e) => handlePersonalInfoChange('githubUrl', e.target.value)}
                placeholder="github.com/username"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-slate-50/50 focus:bg-white text-slate-900 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Portfolio / Website
              </label>
              <input
                type="text"
                value={cv.personalInfo.websiteUrl}
                onChange={(e) => handlePersonalInfoChange('websiteUrl', e.target.value)}
                placeholder="yourportfolio.dev"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-slate-50/50 focus:bg-white text-slate-900 transition-colors"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Professional Summary */}
      {activeTab === 'summary' && (
        <div id="section-editor-summary" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Professional Summary
            </h2>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                summaryWords >= 30 && summaryWords <= 90
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              {summaryWords} words {summaryWords >= 30 && summaryWords <= 90 ? '(Ideal)' : '(Aim for 30-80)'}
            </span>
          </div>

          <textarea
            value={cv.summary}
            onChange={(e) => handleSummaryChange(e.target.value)}
            placeholder="Write a 2-4 sentence career summary packed with target job keywords, years of experience, core technical stack, and your biggest career achievement (e.g. latency reduction or revenue growth)..."
            rows={5}
            className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-slate-50/50 focus:bg-white text-slate-900 leading-relaxed resize-y transition-colors"
          />

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 space-y-1">
            <span className="font-semibold text-slate-900">ATS Keyword Rule:</span>
            <p>
              Taleo and Workday algorithms weigh the first 100 words heavily. Ensure your target title, primary frameworks/skills, and domain experience are explicitly named in this summary.
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Work Experience */}
      {activeTab === 'experience' && (
        <div id="section-editor-experience" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Work Experience ({cv.experience.length})
            </h2>
            <button
              onClick={handleAddExperience}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Position
            </button>
          </div>

          <div className="space-y-4">
            {cv.experience.map((exp, expIdx) => (
              <div
                key={exp.id || expIdx}
                className="p-4 bg-white border border-slate-200 rounded-xl space-y-3 shadow-2xs"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800">
                    Position #{expIdx + 1}: {exp.jobTitle || 'Untitled Position'}
                  </span>
                  <button
                    onClick={() => handleDeleteExperience(expIdx)}
                    className="text-rose-500 hover:text-rose-700 p-1 rounded hover:bg-rose-50 transition-colors"
                    title="Delete position"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={exp.jobTitle}
                      onChange={(e) => handleUpdateExperience(expIdx, 'jobTitle', e.target.value)}
                      placeholder="e.g. Senior Software Engineer"
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => handleUpdateExperience(expIdx, 'company', e.target.value)}
                      placeholder="e.g. Apex Systems Inc."
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Location (e.g. New York, NY or Remote)
                    </label>
                    <input
                      type="text"
                      value={exp.location}
                      onChange={(e) => handleUpdateExperience(expIdx, 'location', e.target.value)}
                      placeholder="e.g. San Francisco, CA"
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Start Date
                      </label>
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) => handleUpdateExperience(expIdx, 'startDate', e.target.value)}
                        placeholder="e.g. Mar 2022"
                        className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        End Date
                      </label>
                      <input
                        type="text"
                        disabled={exp.isCurrent}
                        value={exp.isCurrent ? 'Present' : exp.endDate}
                        onChange={(e) => handleUpdateExperience(expIdx, 'endDate', e.target.value)}
                        placeholder="e.g. Dec 2024"
                        className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:border-blue-500 outline-none disabled:bg-slate-100 disabled:text-slate-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-0.5">
                  <input
                    type="checkbox"
                    id={`current-job-${expIdx}`}
                    checked={exp.isCurrent}
                    onChange={(e) => handleUpdateExperience(expIdx, 'isCurrent', e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor={`current-job-${expIdx}`} className="text-xs text-slate-700">
                    I currently work in this role
                  </label>
                </div>

                {/* Bullets List */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-semibold text-slate-700">
                      Accomplishment Bullets ({exp.bullets.length})
                    </label>
                    <button
                      onClick={() => handleAddBullet(expIdx)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Add Bullet
                    </button>
                  </div>

                  <div className="space-y-2">
                    {exp.bullets.map((bullet, bIdx) => {
                      const firstWord = bullet.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '');
                      const isStrong = firstWord && STRONG_ACTION_VERBS.includes(firstWord);
                      const hasMetric = /\b(\d+%|\$\d+|\d+\s*(users|clients|engineers|x|times))\b/i.test(bullet);

                      return (
                        <div key={bIdx} className="space-y-1">
                          <div className="flex items-start gap-1.5">
                            <span className="text-slate-400 mt-2 font-bold">•</span>
                            <textarea
                              value={bullet}
                              onChange={(e) => handleUpdateBullet(expIdx, bIdx, e.target.value)}
                              placeholder="Action Verb + Context + Quantified Metric (e.g. Spearheaded microservices migration, reducing latency by 45%)..."
                              rows={2}
                              className="flex-1 text-xs p-2 rounded-lg border border-slate-300 focus:border-blue-500 outline-none resize-y leading-relaxed"
                            />
                            {exp.bullets.length > 1 && (
                              <button
                                onClick={() => handleDeleteBullet(expIdx, bIdx)}
                                className="text-slate-400 hover:text-rose-500 p-1 mt-1 rounded"
                                title="Remove bullet"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          {/* Live Bullet Status Pills */}
                          {bullet.trim() && (
                            <div className="flex gap-2 pl-4 text-[10px]">
                              {isStrong ? (
                                <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                                  <CheckCircle className="w-3 h-3" /> Strong verb: &quot;{firstWord}&quot;
                                </span>
                              ) : (
                                <span className="text-amber-700 font-medium flex items-center gap-0.5">
                                  <AlertCircle className="w-3 h-3" /> Consider a commanding action verb
                                </span>
                              )}
                              {hasMetric && (
                                <span className="text-blue-700 font-semibold">
                                  • Quantified metric detected
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Skills Taxonomy */}
      {activeTab === 'skills' && (
        <div id="section-editor-skills" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Categorized Skills Taxonomy
            </h2>
            <button
              onClick={handleAddCategory}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Category
            </button>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-600">
            <strong>ATS Tip:</strong> Categorized skill lists (e.g. Languages, Cloud, Frameworks) match ATS taxonomy tables seamlessly compared to loose unstructured tag clouds.
          </div>

          <div className="space-y-3">
            {cv.skillCategories.map((cat, catIdx) => (
              <div
                key={cat.id || catIdx}
                className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2.5 shadow-2xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={cat.categoryName}
                    onChange={(e) => handleUpdateCategoryName(catIdx, e.target.value)}
                    placeholder="Category Name (e.g. Languages & Frameworks)"
                    className="font-bold text-xs text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none px-1 py-0.5 flex-1"
                  />
                  <button
                    onClick={() => handleDeleteCategory(catIdx)}
                    className="text-slate-400 hover:text-rose-500 p-1 rounded"
                    title="Delete category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {cat.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200"
                    >
                      {skill}
                      <button
                        onClick={() => handleRemoveSkillTag(catIdx, sIdx)}
                        className="text-slate-400 hover:text-rose-600 ml-0.5 text-xs font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add Tag Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkillInputs[cat.id] || ''}
                    onChange={(e) =>
                      setNewSkillInputs({ ...newSkillInputs, [cat.id]: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        handleAddSkillTag(catIdx, newSkillInputs[cat.id] || '');
                      }
                    }}
                    placeholder="Type skill & press Enter (e.g. React, PostgreSQL)..."
                    className="flex-1 text-xs p-2 rounded-lg border border-slate-300 focus:border-blue-500 outline-none"
                  />
                  <button
                    onClick={() => handleAddSkillTag(catIdx, newSkillInputs[cat.id] || '')}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Education */}
      {activeTab === 'education' && (
        <div id="section-editor-education" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Education Entries ({cv.education.length})
            </h2>
            <button
              onClick={handleAddEducation}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Degree
            </button>
          </div>

          <div className="space-y-3">
            {cv.education.map((edu, eduIdx) => (
              <div
                key={edu.id || eduIdx}
                className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2.5 shadow-2xs"
              >
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800">
                    Degree #{eduIdx + 1}: {edu.degree || 'Untitled Degree'}
                  </span>
                  <button
                    onClick={() => handleDeleteEducation(eduIdx)}
                    className="text-rose-500 hover:text-rose-700 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Degree / Major
                    </label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => handleUpdateEducation(eduIdx, 'degree', e.target.value)}
                      placeholder="e.g. Bachelor of Science in Computer Science"
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Institution / University
                    </label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => handleUpdateEducation(eduIdx, 'institution', e.target.value)}
                      placeholder="e.g. University of California, Berkeley"
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={edu.location}
                      onChange={(e) => handleUpdateEducation(eduIdx, 'location', e.target.value)}
                      placeholder="e.g. Berkeley, CA"
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Graduation Year / Date
                    </label>
                    <input
                      type="text"
                      value={edu.graduationDate}
                      onChange={(e) => handleUpdateEducation(eduIdx, 'graduationDate', e.target.value)}
                      placeholder="e.g. May 2017"
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      GPA (Optional)
                    </label>
                    <input
                      type="text"
                      value={edu.gpa || ''}
                      onChange={(e) => handleUpdateEducation(eduIdx, 'gpa', e.target.value)}
                      placeholder="e.g. 3.85 / 4.0"
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Honors / Awards (Optional)
                    </label>
                    <input
                      type="text"
                      value={edu.honors || ''}
                      onChange={(e) => handleUpdateEducation(eduIdx, 'honors', e.target.value)}
                      placeholder="e.g. Magna Cum Laude"
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Projects */}
      {activeTab === 'projects' && (
        <div id="section-editor-projects" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Projects ({cv.projects.length})
            </h2>
            <button
              onClick={handleAddProject}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Project
            </button>
          </div>

          <div className="space-y-3">
            {cv.projects.map((proj, pIdx) => (
              <div
                key={proj.id || pIdx}
                className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2.5 shadow-2xs"
              >
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800">
                    Project: {proj.title || 'Untitled'}
                  </span>
                  <button
                    onClick={() => handleDeleteProject(pIdx)}
                    className="text-rose-500 hover:text-rose-700 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Project Title
                    </label>
                    <input
                      type="text"
                      value={proj.title}
                      onChange={(e) => handleUpdateProject(pIdx, 'title', e.target.value)}
                      placeholder="e.g. CloudMetrics Realtime Agent"
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Technologies Used
                    </label>
                    <input
                      type="text"
                      value={proj.technologies}
                      onChange={(e) => handleUpdateProject(pIdx, 'technologies', e.target.value)}
                      placeholder="e.g. TypeScript, React, Go, Docker"
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Project / Repository Link
                    </label>
                    <input
                      type="text"
                      value={proj.link || ''}
                      onChange={(e) => handleUpdateProject(pIdx, 'link', e.target.value)}
                      placeholder="e.g. github.com/username/project"
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Date / Year
                    </label>
                    <input
                      type="text"
                      value={proj.date || ''}
                      onChange={(e) => handleUpdateProject(pIdx, 'date', e.target.value)}
                      placeholder="e.g. 2023"
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                {/* Bullets for Project */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Key Outcomes & Features
                  </label>
                  {proj.bullets.map((b, bIdx) => (
                    <div key={bIdx} className="flex gap-1.5 mb-1.5">
                      <input
                        type="text"
                        value={b}
                        onChange={(e) => {
                          const updated = [...proj.bullets];
                          updated[bIdx] = e.target.value;
                          handleUpdateProject(pIdx, 'bullets', updated);
                        }}
                        placeholder="Bullet describing impact..."
                        className="flex-1 text-xs p-2 rounded-lg border border-slate-300 focus:border-blue-500 outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7: Certifications */}
      {activeTab === 'certs' && (
        <div id="section-editor-certs" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Certifications & Credentials ({cv.certifications.length})
            </h2>
            <button
              onClick={handleAddCert}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Certification
            </button>
          </div>

          <div className="space-y-3">
            {cv.certifications.map((cert, certIdx) => (
              <div
                key={cert.id || certIdx}
                className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2.5 shadow-2xs"
              >
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800">
                    {cert.name || 'Untitled Certification'}
                  </span>
                  <button
                    onClick={() => handleDeleteCert(certIdx)}
                    className="text-rose-500 hover:text-rose-700 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Certification Name
                    </label>
                    <input
                      type="text"
                      value={cert.name}
                      onChange={(e) => handleUpdateCert(certIdx, 'name', e.target.value)}
                      placeholder="e.g. AWS Certified Solutions Architect"
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Issuing Body / Organization
                    </label>
                    <input
                      type="text"
                      value={cert.issuer}
                      onChange={(e) => handleUpdateCert(certIdx, 'issuer', e.target.value)}
                      placeholder="e.g. Amazon Web Services"
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Date or Expiration
                    </label>
                    <input
                      type="text"
                      value={cert.date}
                      onChange={(e) => handleUpdateCert(certIdx, 'date', e.target.value)}
                      placeholder="e.g. Nov 2023 · Expires Nov 2026"
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
