import { CVData } from '../types/cv';
import * as mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker if in browser
try {
  if (typeof window !== 'undefined' && pdfjsLib && pdfjsLib.GlobalWorkerOptions) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.0.379'}/pdf.worker.min.mjs`;
  }
} catch (e) {
  console.warn('PDF.js worker init warning:', e);
}

/**
 * Extract plain text from an uploaded File (.docx, .pdf, .txt, .json)
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'docx') {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value || '';
  }

  if (extension === 'pdf') {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageStrings = textContent.items
          .map((item: any) => ('str' in item ? item.str : ''))
          .join(' ');
        fullText += pageStrings + '\n\n';
      }
      return fullText.trim();
    } catch (pdfErr) {
      console.warn('PDF.js parse failed, trying binary text fallback:', pdfErr);
      // Fallback binary text stream extraction for simple PDFs
      const arrayBuffer = await file.arrayBuffer();
      const decoder = new TextDecoder('utf-8', { fatal: false });
      const raw = decoder.decode(arrayBuffer);
      // Match text streams within parentheses (Tj / TJ commands)
      const matches = raw.match(/\(([^()]{2,})\)\s*Tj/g);
      if (matches && matches.length > 0) {
        return matches
          .map(m => m.replace(/^\(/, '').replace(/\)\s*Tj$/, ''))
          .join(' ');
      }
      throw new Error('Unable to extract text from this PDF. Please copy and paste or use DOCX format.');
    }
  }

  // Plain text or fallback
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve((e.target?.result as string) || '');
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
}

/**
 * Convert extracted plain text into a structured CVData model
 */
export function parseCVTextToData(rawText: string, originalFileName?: string): CVData {
  const lines = rawText
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0);

  // Extract Email
  const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0].trim() : '';

  // Extract Phone (supports international, Bangladeshi, US, UK formats)
  const phoneMatch = rawText.match(/(?:\+?\d{1,4}[-.\s]?)?(?:\(?\d{2,5}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{3,5}/);
  const phone = phoneMatch && phoneMatch[0].trim().replace(/\D/g, '').length >= 7 ? phoneMatch[0].trim() : '';

  // Extract LinkedIn & GitHub strictly from text (leave empty if not in CV)
  const linkedinMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  const linkedinUrl = linkedinMatch ? linkedinMatch[0].replace(/^https?:\/\/(www\.)?/, '').trim() : '';

  const githubMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i);
  const githubUrl = githubMatch ? githubMatch[0].replace(/^https?:\/\/(www\.)?/, '').trim() : '';

  // Extract Website / Portfolio (leave empty if not in CV)
  const websiteMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.(?:com|dev|io|org|net|me|portfolio|site)(?:\/[a-zA-Z0-9-_]+)?)/i);
  let websiteUrl = '';
  if (websiteMatch && !websiteMatch[0].includes('linkedin') && !websiteMatch[0].includes('github') && !websiteMatch[0].includes('gmail')) {
    websiteUrl = websiteMatch[0].replace(/^https?:\/\/(www\.)?/, '').trim();
  }

  // Extract Candidate Name & Location from top header lines
  let fullName = '';
  let jobTitle = '';
  let location = '';

  for (let i = 0; i < Math.min(lines.length, 6); i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Skip lines with emails or URLs
    if (line.includes('@') || line.includes('http') || line.includes('.com') || line.includes('www.')) {
      continue;
    }

    // Check for Location pattern (e.g. City, Country / State, or postal code)
    if (!location && (line.includes(',') || /\b(bangladesh|usa|united states|uk|canada|germany|singapore|australia|india|dhaka|san francisco|new york|london|toronto|berlin|austin)\b/i.test(line))) {
      // If it looks like a location and not a job title or name
      if (!line.match(/\b(engineer|manager|developer|specialist|officer|assistant|executive|intern|lead|director|consultant|analyst)\b/i)) {
        location = line.replace(/^[•|\-–]\s*/, '').trim();
        continue;
      }
    }

    // Candidate Name detection
    if (!fullName && line.length >= 2 && line.length <= 40 && !line.match(/\d{3}/)) {
      fullName = line.replace(/^(resume|cv|curriculum vitae)[:\s-]*/i, '').trim();
      continue;
    }

    // Candidate Job Title detection
    if (fullName && !jobTitle && line.length >= 3 && line.length <= 50 && !line.match(/\d{4}/)) {
      jobTitle = line.replace(/^[•|\-–]\s*/, '').trim();
      continue;
    }
  }

  if (!fullName && originalFileName) {
    const cleaned = originalFileName
      .replace(/\.[^/.]+$/, '')
      .replace(/[-_]/g, ' ')
      .replace(/\b(resume|cv|curriculum|vitae)\b/gi, '')
      .trim();
    if (cleaned.length > 2) fullName = cleaned;
  }

  if (!fullName) fullName = 'CANDIDATE NAME';
  // Do NOT assume 'Software & Technology Professional' for non-tech candidates
  if (!jobTitle) jobTitle = '';

  // Section heading detection
  const sectionKeywords = {
    summary: /^(professional summary|summary|about me|profile|career objective|objective|executive summary)/i,
    experience: /^(work experience|professional experience|experience|employment history|work history|career history)/i,
    skills: /^(skills|technical skills|core competencies|areas of expertise|technologies|key skills|competencies)/i,
    education: /^(education|academic background|degrees|qualifications|academic history)/i,
    projects: /^(projects|key projects|personal projects|selected projects)/i,
    certifications: /^(certifications|licenses|credentials|awards|certificates)/i,
  };

  let currentSection: 'header' | 'summary' | 'experience' | 'skills' | 'education' | 'projects' | 'certifications' = 'header';
  const sectionLines: Record<string, string[]> = {
    summary: [],
    experience: [],
    skills: [],
    education: [],
    projects: [],
    certifications: [],
  };

  for (const line of lines) {
    let matchedSection = false;
    for (const [sec, regex] of Object.entries(sectionKeywords)) {
      if (regex.test(line)) {
        currentSection = sec as any;
        matchedSection = true;
        break;
      }
    }
    if (!matchedSection && currentSection !== 'header') {
      sectionLines[currentSection].push(line);
    }
  }

  // 1. Parse Summary
  const summaryText = sectionLines.summary.slice(0, 10).join(' ').trim();

  // 2. Parse Skills (strip trailing dots, commas, bullets)
  const rawSkillWords: string[] = [];
  sectionLines.skills.forEach(l => {
    const parts = l
      .split(/[,|;•\n\t]+/)
      .map(s => s.replace(/^[•\-*\s]+|[.\s]+$/g, '').trim())
      .filter(s => s.length > 1 && s.length < 40);
    rawSkillWords.push(...parts);
  });

  const uniqueSkills = Array.from(new Set(rawSkillWords));
  const skillCategories = [
    {
      id: 'cat-1',
      categoryName: 'Technical & Professional Skills',
      skills: uniqueSkills
    }
  ];

  // 3. Parse Experience
  const experiences: any[] = [];
  if (sectionLines.experience.length > 0) {
    let currentRole: any = null;
    for (const line of sectionLines.experience) {
      const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*');
      const isDateLine = /\b(19\d\d|20\d\d|present|current)\b/i.test(line);

      if (!isBullet && (isDateLine || line.length < 70)) {
        if (currentRole && currentRole.bullets.length > 0) {
          experiences.push(currentRole);
        }
        const parts = line.split(/[-–—|at,]/).map(p => p.trim());
        currentRole = {
          id: 'exp-' + Math.random().toString(36).substr(2, 9),
          jobTitle: parts[0] || 'Professional Role',
          company: parts[1] || '',
          location: parts[2] || '',
          startDate: '',
          endDate: 'Present',
          isCurrent: true,
          bullets: []
        };
      } else if (currentRole) {
        const cleanBullet = line.replace(/^[•\-*]\s*/, '').trim();
        if (cleanBullet.length > 6) {
          currentRole.bullets.push(cleanBullet);
        }
      }
    }
    if (currentRole && (currentRole.bullets.length > 0 || currentRole.company)) {
      experiences.push(currentRole);
    }
  }

  // If no experience parsed, create a single clean blank container rather than fake jobs
  if (experiences.length === 0) {
    experiences.push({
      id: 'exp-1',
      jobTitle: jobTitle || 'Professional Role',
      company: '',
      location: '',
      startDate: '',
      endDate: 'Present',
      isCurrent: true,
      bullets: []
    });
  }

  // 4. Parse Education (only if present in text)
  const educations: any[] = [];
  if (sectionLines.education.length > 0) {
    let currentEdu: any = null;
    for (const line of sectionLines.education) {
      if (line.length > 3) {
        const degreeMatch = line.match(/(Bachelor|Master|B\.S\.|M\.S\.|B\.A\.|BBA|MBA|Ph\.D\.|Diploma|Associate|High School)[^,.]*/i);
        educations.push({
          id: 'edu-' + Math.random().toString(36).substr(2, 9),
          degree: degreeMatch ? degreeMatch[0].trim() : line.trim(),
          institution: '',
          location: '',
          graduationDate: '',
          gpa: ''
        });
        if (educations.length >= 3) break;
      }
    }
  }

  // 5. Parse Projects (ONLY if actually in uploaded CV)
  const projects: any[] = [];
  if (sectionLines.projects.length > 0) {
    sectionLines.projects.forEach((l, pIdx) => {
      if (l.trim().length > 5 && !l.startsWith('•')) {
        projects.push({
          id: `proj-${pIdx}`,
          title: l.trim(),
          technologies: '',
          date: '',
          bullets: []
        });
      }
    });
  }

  // 6. Parse Certifications (ONLY if actually in uploaded CV)
  const certifications: any[] = [];
  if (sectionLines.certifications.length > 0) {
    sectionLines.certifications.forEach((l, cIdx) => {
      const cleanCert = l.replace(/^[•\-*]\s*/, '').trim();
      if (cleanCert.length > 3) {
        certifications.push({
          id: `cert-${cIdx}`,
          name: cleanCert,
          issuer: '',
          date: ''
        });
      }
    });
  }

  return {
    personalInfo: {
      fullName,
      jobTitle: jobTitle || (experiences[0]?.jobTitle !== 'Professional Role' ? experiences[0]?.jobTitle : ''),
      email,
      phone,
      location,
      linkedinUrl,
      githubUrl,
      websiteUrl
    },
    summary: summaryText,
    experience: experiences,
    skillCategories,
    education: educations,
    projects,
    certifications
  };
}
