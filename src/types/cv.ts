export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  githubUrl: string;
  websiteUrl: string;
}

export interface ExperienceItem {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  graduationDate: string;
  gpa?: string;
  honors?: string;
}

export interface SkillCategory {
  id: string;
  categoryName: string;
  skills: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  technologies: string;
  link?: string;
  date?: string;
  bullets: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skillCategories: SkillCategory[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
}

export type ATSFormatPreset = 'classic' | 'modern' | 'executive' | 'minimal';

export interface ATSCheckResult {
  id: string;
  category: 'formatting' | 'content' | 'keywords' | 'contact';
  title: string;
  description: string;
  status: 'pass' | 'warning' | 'fail';
  recommendation?: string;
}

export interface ATSScoreReport {
  overallScore: number;
  formattingScore: number;
  contentScore: number;
  keywordScore: number;
  checks: ATSCheckResult[];
  weakVerbsFound: string[];
  metricsCount: number;
  bulletCount: number;
}

export interface JobMatchReport {
  matchScore: number;
  foundKeywords: string[];
  missingKeywords: string[];
  suggestedKeywords: string[];
  jobTitleMatch: boolean;
}
