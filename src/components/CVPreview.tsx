import React, { useState } from 'react';
import { CVData, ATSFormatPreset } from '../types/cv';
import { Eye, Code, CheckCircle, Info, Sparkles } from 'lucide-react';

interface CVPreviewProps {
  cv: CVData;
  formatPreset: ATSFormatPreset;
  highlightKeywords?: string[];
}

export const CVPreview: React.FC<CVPreviewProps> = ({
  cv,
  formatPreset,
  highlightKeywords = [],
}) => {
  const [viewMode, setViewMode] = useState<'visual' | 'parser'>('visual');

  // Helper to highlight keywords in text when active
  const renderHighlightedText = (text: string) => {
    if (!highlightKeywords || highlightKeywords.length === 0 || !text) {
      return text;
    }

    const escapedWords = highlightKeywords
      .filter((kw) => kw.length > 2)
      .map((kw) => kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

    if (escapedWords.length === 0) return text;

    const regex = new RegExp(`(${escapedWords.join('|')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) => {
      const isMatch = highlightKeywords.some(
        (kw) => kw.toLowerCase() === part.toLowerCase()
      );
      if (isMatch) {
        return (
          <mark
            key={i}
            className="bg-emerald-100 text-emerald-950 font-semibold px-0.5 rounded-xs"
            title="Matched Target Keyword"
          >
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  // Font and spacing styles based on selected ATS preset
  const getPresetStyles = () => {
    switch (formatPreset) {
      case 'classic':
        return {
          fontFamily: 'Georgia, "Times New Roman", Merriweather, serif',
          headerBorder: 'border-b border-slate-900',
          headingClass: 'font-serif font-bold tracking-widest uppercase text-slate-900 text-xs',
          baseText: 'text-slate-800 leading-relaxed text-[13.5px]',
        };
      case 'compact':
        return {
          fontFamily: 'Arial, Helvetica, sans-serif',
          headerBorder: 'border-b border-slate-900',
          headingClass: 'font-sans font-bold tracking-widest uppercase text-slate-900 text-xs',
          baseText: 'text-slate-800 leading-normal text-[12.5px]',
        };
      case 'modern':
      default:
        return {
          fontFamily: '"Plus Jakarta Sans", Arial, Calibri, sans-serif',
          headerBorder: 'border-b border-slate-900',
          headingClass: 'font-sans font-bold tracking-widest uppercase text-slate-900 text-xs',
          baseText: 'text-slate-800 leading-relaxed text-[13px]',
        };
    }
  };

  const styles = getPresetStyles();

  // Contact items array
  const contactItems: string[] = [];
  if (cv.personalInfo.email) contactItems.push(cv.personalInfo.email);
  if (cv.personalInfo.phone) contactItems.push(cv.personalInfo.phone);
  if (cv.personalInfo.location) contactItems.push(cv.personalInfo.location);
  if (cv.personalInfo.linkedinUrl) contactItems.push(cv.personalInfo.linkedinUrl);
  if (cv.personalInfo.githubUrl) contactItems.push(cv.personalInfo.githubUrl);
  if (cv.personalInfo.websiteUrl) contactItems.push(cv.personalInfo.websiteUrl);

  return (
    <div className="flex flex-col h-full">
      {/* Top Preview Bar */}
      <div className="no-print flex items-center justify-between pb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              id="view-mode-visual-btn"
              onClick={() => setViewMode('visual')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium transition-all ${
                viewMode === 'visual'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-slate-700" />
              Recruiter Document View
            </button>
            <button
              id="view-mode-parser-btn"
              onClick={() => setViewMode('parser')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium transition-all ${
                viewMode === 'parser'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code className="w-3.5 h-3.5 text-slate-700" />
              ATS Parser Text Stream
            </button>
          </div>

          {highlightKeywords.length > 0 && (
            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full font-bold uppercase text-[10px]">
              <Sparkles className="w-3 h-3 text-green-600" />
              {highlightKeywords.length} Keywords Highlighted
            </span>
          )}
        </div>

        <div className="text-xs text-slate-500 font-medium hidden sm:flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-green-600" />
          <span className="uppercase tracking-wider text-[10px] font-bold text-slate-400">Standard ATS Format</span>
        </div>
      </div>

      {/* Main Document Canvas */}
      <div className="flex-1 overflow-y-auto bg-slate-100 p-4 sm:p-8 rounded-xl border border-slate-200 flex justify-center shadow-xs">
        {viewMode === 'parser' ? (
          /* ATS Parser Raw Text Stream View */
          <div 
            id="ats-parser-raw-stream"
            className="w-full max-w-3xl bg-slate-900 text-slate-200 p-6 rounded-lg font-mono text-xs leading-relaxed shadow-xl border border-slate-800"
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-slate-400">
              <span className="flex items-center gap-2 text-green-400 font-semibold text-xs">
                <CheckCircle className="w-4 h-4" />
                Raw Machine Parser Output (Single-Column Standard)
              </span>
              <span className="text-[11px] text-slate-500">Encoding: UTF-8 Plain Text</span>
            </div>
            <pre className="whitespace-pre-wrap font-mono select-all">
{`=== CANDIDATE PROFILE ===
NAME: ${cv.personalInfo.fullName.toUpperCase()}
TITLE: ${cv.personalInfo.jobTitle}
CONTACT: ${contactItems.join(' | ')}

=== PROFESSIONAL SUMMARY ===
${cv.summary}

=== WORK EXPERIENCE ===
${cv.experience
  .map(
    (e) =>
      `[ROLE] ${e.jobTitle} @ ${e.company} (${e.location || 'Remote'})
[DATES] ${e.startDate} - ${e.isCurrent ? 'Present' : e.endDate}
${e.bullets.map((b) => `  * ${b}`).join('\n')}`
  )
  .join('\n\n')}

=== SKILLS TAXONOMY ===
${cv.skillCategories
  .map((c) => `[CATEGORY: ${c.categoryName}] ${c.skills.join(', ')}`)
  .join('\n')}

=== EDUCATION ===
${cv.education
  .map(
    (edu) =>
      `${edu.degree} - ${edu.institution} (${edu.graduationDate})${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}${edu.honors ? ` | Honors: ${edu.honors}` : ''}`
  )
  .join('\n')}

${cv.projects.length > 0 ? `=== PROJECTS ===\n` + cv.projects.map((p) => `${p.title} [Tech: ${p.technologies}]\n${p.bullets.map((b) => `  * ${b}`).join('\n')}`).join('\n\n') : ''}
${cv.certifications.length > 0 ? `=== CERTIFICATIONS ===\n` + cv.certifications.map((c) => `* ${c.name} (${c.issuer}) - ${c.date}`).join('\n') : ''}
`}
            </pre>
          </div>
        ) : (
          /* Visual Document View (Print-ready, pixel-perfect ATS layout with sleek styling) */
          <div
            id="cv-document-sheet"
            className="cv-document-preview w-full max-w-[800px] min-h-[1050px] bg-white text-slate-900 shadow-2xl border border-slate-200 p-8 sm:p-12 transition-all rounded-xs"
            style={{ fontFamily: styles.fontFamily }}
          >
            {/* Header Section: Candidate Identity */}
            <div id="cv-header" className="text-center border-b pb-4 mb-4 border-slate-200">
              <h1
                id="cv-candidate-name"
                className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 uppercase mb-1"
              >
                {cv.personalInfo.fullName || 'YOUR FULL NAME'}
              </h1>

              {cv.personalInfo.jobTitle && (
                <div
                  id="cv-job-title"
                  className="text-sm font-semibold text-slate-700 tracking-wide mb-1"
                >
                  {renderHighlightedText(cv.personalInfo.jobTitle)}
                </div>
              )}

              {contactItems.length > 0 && (
                <div
                  id="cv-contact-details"
                  className="flex flex-wrap justify-center items-center gap-x-2 gap-y-1 text-xs text-slate-600 font-medium tracking-wide mt-1"
                >
                  {contactItems.map((item, idx) => (
                    <React.Fragment key={idx}>
                      <span>{renderHighlightedText(item)}</span>
                      {idx < contactItems.length - 1 && (
                        <span className="text-slate-400 select-none">•</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>

            {/* 1. Professional Summary Section */}
            {cv.summary && cv.summary.trim().length > 0 && (
              <section id="cv-section-summary" className="mb-5">
                <div className={`pb-1 mb-2 ${styles.headerBorder}`}>
                  <h2 className={styles.headingClass}>Professional Summary</h2>
                </div>
                <p className={`${styles.baseText} text-justify`}>
                  {renderHighlightedText(cv.summary)}
                </p>
              </section>
            )}

            {/* 2. Work Experience Section */}
            {cv.experience && cv.experience.length > 0 && (
              <section id="cv-section-experience" className="mb-5">
                <div className={`pb-1 mb-2.5 ${styles.headerBorder}`}>
                  <h2 className={styles.headingClass}>Work Experience</h2>
                </div>

                <div className="space-y-4">
                  {cv.experience.map((exp, idx) => (
                    <div key={exp.id || idx} id={`cv-experience-item-${idx}`} className="group">
                      {/* Line 1: Title and Dates */}
                      <div className="flex justify-between items-baseline gap-2">
                        <h3 className="font-bold text-slate-900 text-sm">
                          {renderHighlightedText(exp.jobTitle || 'Job Title')}
                        </h3>
                        <span className="text-xs font-semibold text-slate-700 shrink-0">
                          {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                        </span>
                      </div>

                      {/* Line 2: Company & Location */}
                      <div className="flex justify-between items-baseline text-xs text-slate-600 italic mb-1.5">
                        <span>{renderHighlightedText(exp.company || 'Company')}</span>
                        {exp.location && <span>{exp.location}</span>}
                      </div>

                      {/* Bullet points */}
                      {exp.bullets && exp.bullets.length > 0 && (
                        <ul className="list-disc ml-4 space-y-1 text-xs text-slate-800">
                          {exp.bullets.map(
                            (bullet, bIdx) =>
                              bullet.trim() && (
                                <li key={bIdx} className="leading-relaxed pl-1">
                                  {renderHighlightedText(bullet)}
                                </li>
                              )
                          )}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 3. Technical & Professional Skills Section */}
            {cv.skillCategories && cv.skillCategories.length > 0 && (
              <section id="cv-section-skills" className="mb-5">
                <div className={`pb-1 mb-2 ${styles.headerBorder}`}>
                  <h2 className={styles.headingClass}>Technical & Professional Skills</h2>
                </div>

                <div className="space-y-1.5 text-xs">
                  {cv.skillCategories.map((cat, idx) => (
                    <div key={cat.id || idx} id={`cv-skill-cat-${idx}`} className="flex flex-wrap gap-1 leading-relaxed">
                      <span className="font-bold text-slate-900 shrink-0">
                        {cat.categoryName}:
                      </span>
                      <span className="text-slate-800">
                        {renderHighlightedText(cat.skills.join(', '))}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 4. Education Section */}
            {cv.education && cv.education.length > 0 && (
              <section id="cv-section-education" className="mb-5">
                <div className={`pb-1 mb-2.5 ${styles.headerBorder}`}>
                  <h2 className={styles.headingClass}>Education</h2>
                </div>

                <div className="space-y-3">
                  {cv.education.map((edu, idx) => (
                    <div key={edu.id || idx} id={`cv-education-item-${idx}`}>
                      <div className="flex justify-between items-baseline gap-2">
                        <h3 className="font-bold text-slate-900 text-sm">
                          {renderHighlightedText(edu.degree || 'Degree')}
                        </h3>
                        {edu.graduationDate && (
                          <span className="text-xs font-semibold text-slate-700 shrink-0">
                            {edu.graduationDate}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-baseline text-xs text-slate-600 italic">
                        <span>{edu.institution}</span>
                        {edu.location && <span>{edu.location}</span>}
                      </div>
                      {(edu.gpa || edu.honors) && (
                        <div className="text-xs text-slate-600 mt-0.5">
                          {edu.gpa && <span className="mr-3">GPA: {edu.gpa}</span>}
                          {edu.honors && <span>Honors: {edu.honors}</span>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 5. Projects Section (if any) */}
            {cv.projects && cv.projects.length > 0 && (
              <section id="cv-section-projects" className="mb-5">
                <div className={`pb-1 mb-2.5 ${styles.headerBorder}`}>
                  <h2 className={styles.headingClass}>Projects</h2>
                </div>

                <div className="space-y-3">
                  {cv.projects.map((proj, idx) => (
                    <div key={proj.id || idx} id={`cv-project-item-${idx}`}>
                      <div className="flex justify-between items-baseline gap-2">
                        <h3 className="font-bold text-slate-900 text-sm">
                          {renderHighlightedText(proj.title)}
                        </h3>
                        {proj.date && (
                          <span className="text-xs font-semibold text-slate-700 shrink-0">
                            {proj.date}
                          </span>
                        )}
                      </div>
                      {(proj.technologies || proj.link) && (
                        <div className="text-xs text-slate-600 italic mb-1">
                          {proj.technologies && <span>Technologies: {proj.technologies}</span>}
                          {proj.technologies && proj.link && <span> | </span>}
                          {proj.link && <span className="text-blue-600 underline">{proj.link}</span>}
                        </div>
                      )}
                      {proj.bullets && proj.bullets.length > 0 && (
                        <ul className="list-disc ml-4 space-y-1 text-xs text-slate-800">
                          {proj.bullets.map(
                            (b, bIdx) =>
                              b.trim() && (
                                <li key={bIdx} className="leading-relaxed pl-1">
                                  {renderHighlightedText(b)}
                                </li>
                              )
                          )}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 6. Certifications Section (if any) */}
            {cv.certifications && cv.certifications.length > 0 && (
              <section id="cv-section-certifications" className="mb-4">
                <div className={`pb-1 mb-2 ${styles.headerBorder}`}>
                  <h2 className={styles.headingClass}>Certifications</h2>
                </div>

                <div className="space-y-1.5 text-xs">
                  {cv.certifications.map((cert, idx) => (
                    <div key={cert.id || idx} id={`cv-cert-item-${idx}`} className="flex justify-between items-baseline">
                      <div>
                        <span className="font-bold text-slate-900">{cert.name}</span>
                        {cert.issuer && (
                          <span className="text-slate-600 italic ml-2">— {cert.issuer}</span>
                        )}
                      </div>
                      {cert.date && (
                        <span className="text-slate-600 shrink-0 text-[11px]">{cert.date}</span>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
