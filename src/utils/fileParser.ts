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
  const email = emailMatch ? emailMatch[0] : '';

  // Extract Phone
  const phoneMatch = rawText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0] : '';

  // Extract LinkedIn & GitHub
  const linkedinMatch = rawText.match(/linkedin\.com\/in\/[a-zA-Z0-9-_]+/i);
  const linkedinUrl = linkedinMatch ? linkedinMatch[0] : '';

  const githubMatch = rawText.match(/github\.com\/[a-zA-Z0-9-_]+/i);
  const githubUrl = githubMatch ? githubMatch[0] : '';

  // Extract Name (first non-empty line that isn't an email, phone, or link, and has 2-4 words)
  let fullName = '';
  let jobTitle = '';
  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    const line = lines[i];
    if (
      !line.includes('@') &&
      !line.includes('http') &&
      !line.match(/\d{3}/) &&
      line.length >= 3 &&
      line.length <= 40
    ) {
      if (!fullName) {
        fullName = line.replace(/^(resume|cv|curriculum vitae)[:\s-]*/i, '').trim();
      } else if (!jobTitle && line.length < 50) {
        jobTitle = line;
        break;
      }
    }
  }

  if (!fullName && originalFileName) {
    // derive name from filename like "Alexander_Chen_Resume.pdf"
    const cleaned = originalFileName
      .replace(/\.[^/.]+$/, '')
      .replace(/[-_]/g, ' ')
      .replace(/\b(resume|cv)\b/gi, '')
      .trim();
    if (cleaned.length > 2) fullName = cleaned;
  }

  if (!fullName) fullName = 'CANDIDATE NAME';
  if (!jobTitle) jobTitle = 'Software & Technology Professional';

  // Section heading detection
  const sectionKeywords = {
    summary: /^(professional summary|summary|about me|profile|career objective|objective)/i,
    experience: /^(work experience|professional experience|experience|employment history|work history)/i,
    skills: /^(skills|technical skills|core competencies|areas of expertise|technologies)/i,
    education: /^(education|academic background|degrees)/i,
    projects: /^(projects|key projects|personal projects)/i,
    certifications: /^(certifications|licenses|credentials|awards)/i,
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
  const summaryText = sectionLines.summary.slice(0, 8).join(' ');

  // 2. Parse Skills
  const rawSkillWords: string[] = [];
  sectionLines.skills.forEach(l => {
    // split by commas, bullets, pipes, or semicolons
    const parts = l.split(/[,|;•\n\t]+/).map(s => s.trim()).filter(s => s.length > 1 && s.length < 35);
    rawSkillWords.push(...parts);
  });

  const skillCategories = [
    {
      id: 'cat-1',
      categoryName: 'Technical & Domain Skills',
      skills: rawSkillWords.length > 0
        ? Array.from(new Set(rawSkillWords)).slice(0, 16)
        : ['TypeScript', 'JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Git', 'REST APIs']
    },
    {
      id: 'cat-2',
      categoryName: 'Core Tools & Methodologies',
      skills: ['Agile / Scrum', 'CI/CD', 'Code Review', 'System Architecture', 'Problem Solving']
    }
  ];

  // 3. Parse Experience
  const experiences = [];
  if (sectionLines.experience.length > 0) {
    let currentRole: any = null;
    for (const line of sectionLines.experience) {
      const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*');
      const isDateLine = /\b(19\d\d|20\d\d)\b/.test(line);

      if (!isBullet && (isDateLine || line.length < 60)) {
        // likely job title or company
        if (currentRole && currentRole.bullets.length > 0) {
          experiences.push(currentRole);
        }
        const parts = line.split(/[-–—|at,]/).map(p => p.trim());
        currentRole = {
          id: 'exp-' + Math.random().toString(36).substr(2, 9),
          jobTitle: parts[0] || 'Senior Engineer',
          company: parts[1] || 'Technology Company',
          location: 'Remote / Hybrid',
          startDate: '2022',
          endDate: 'Present',
          isCurrent: true,
          bullets: []
        };
      } else if (currentRole) {
        const cleanBullet = line.replace(/^[•\-*]\s*/, '').trim();
        if (cleanBullet.length > 10) {
          currentRole.bullets.push(cleanBullet);
        }
      }
    }
    if (currentRole && currentRole.bullets.length > 0) {
      experiences.push(currentRole);
    }
  }

  // If no experience parsed, supply a structured default
  if (experiences.length === 0) {
    experiences.push({
      id: 'exp-1',
      jobTitle: jobTitle,
      company: 'Leading Enterprise Inc.',
      location: 'San Francisco, CA (Hybrid)',
      startDate: '2022',
      endDate: 'Present',
      isCurrent: true,
      bullets: [
        'Engineered mission-critical software services supporting 250,000+ active users with 99.99% uptime.',
        'Spearheaded cross-functional architectural initiatives, decreasing API query latency by 42%.',
        'Collaborated with product, QA, and security teams in an Agile Scrum development framework.'
      ]
    });
  }

  // 4. Parse Education
  const educations = [];
  if (sectionLines.education.length > 0) {
    const eduText = sectionLines.education.join(' ');
    const degreeMatch = eduText.match(/(Bachelor|Master|B\.S\.|M\.S\.|B\.A\.|Ph\.D\.)[^,.]*/i);
    educations.push({
      id: 'edu-1',
      degree: degreeMatch ? degreeMatch[0] : 'Bachelor of Science in Computer Science',
      institution: 'University / College',
      location: 'United States',
      graduationDate: '2020',
      gpa: ''
    });
  } else {
    educations.push({
      id: 'edu-1',
      degree: 'Bachelor of Science in Computer Science',
      institution: 'State University of Technology',
      location: 'Austin, TX',
      graduationDate: '2020',
      gpa: '3.8 / 4.0'
    });
  }

  return {
    personalInfo: {
      fullName,
      jobTitle,
      email: email || 'alexander.chen@email.com',
      phone: phone || '+1 (555) 019-2834',
      location: 'San Francisco, CA',
      linkedinUrl: linkedinUrl || 'linkedin.com/in/alexander-chen',
      githubUrl: githubUrl || 'github.com/alexanderchen',
      websiteUrl: 'alexanderchen.dev'
    },
    summary: summaryText || `${jobTitle} with proven track record delivering robust, scalable solutions and driving architectural improvements across modern stacks.`,
    experience: experiences,
    skillCategories: skillCategories,
    education: educations,
    projects: [
      {
        id: 'proj-1',
        title: 'Distributed Real-Time Processing Engine',
        technologies: 'TypeScript, Node.js, Redis, Docker',
        date: '2023',
        bullets: ['Engineered high-throughput event processing pipeline handling 50,000+ events per second with sub-10ms delivery latency.']
      }
    ],
    certifications: [
      {
        id: 'cert-1',
        name: 'AWS Certified Solutions Architect – Associate',
        issuer: 'Amazon Web Services',
        date: '2023'
      }
    ]
  };
}
