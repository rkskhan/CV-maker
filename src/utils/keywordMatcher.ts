import { CVData, JobMatchReport } from '../types/cv';

// Common technical and functional keywords list for ATS pattern recognition
const COMMON_INDUSTRY_KEYWORDS = [
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'golang', 'rust', 'ruby', 'php', 'swift', 'kotlin',
  'react', 'next.js', 'vue', 'angular', 'svelte', 'node.js', 'express', 'django', 'flask', 'fastapi', 'spring boot',
  'html5', 'css3', 'tailwind css', 'sass', 'bootstrap', 'graphql', 'rest api', 'grpc', 'web sockets',
  'postgresql', 'mysql', 'sqlite', 'mongodb', 'redis', 'cassandra', 'dynamodb', 'elasticsearch', 'oracle',
  'aws', 'amazon web services', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'terraform', 'ansible',
  'ci/cd', 'github actions', 'gitlab ci', 'jenkins', 'linux', 'bash', 'git',
  'microservices', 'distributed systems', 'system design', 'serverless', 'lambda',
  'unit testing', 'integration testing', 'jest', 'cypress', 'playwright', 'tdd', 'bdd',
  'agile', 'scrum', 'kanban', 'jira', 'confluence', 'sprint planning',
  'sql', 'data modeling', 'etl', 'data pipeline', 'spark', 'kafka', 'airflow', 'snowflake', 'bigquery',
  'machine learning', 'deep learning', 'pytorch', 'tensorflow', 'scikit-learn', 'nlp', 'llm', 'genai',
  'product roadmap', 'user stories', 'prd', 'product discovery', 'a/b testing', 'okrs', 'kpi',
  'amplitude', 'mixpanel', 'google analytics', 'tableau', 'power bi', 'figma',
  'stakeholder management', 'cross-functional', 'leadership', 'mentorship', 'budget management',
  'seo', 'sem', 'content marketing', 'crm', 'hubspot', 'salesforce', 'soc 2', 'gdpr', 'hipaa', 'cybersecurity'
];

// Stop words to exclude from keyword extraction
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'can\'t', 'cannot',
  'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during', 'each',
  'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d',
  'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i',
  'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s',
  'me', 'more', 'most', 'mustn\'t', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or',
  'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll',
  'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs',
  'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve',
  'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll',
  'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which',
  'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t', 'you', 'you\'d',
  'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves',
  'will', 'shall', 'may', 'might', 'must', 'can', 'could', 'apply', 'job', 'work', 'working', 'company', 'role',
  'candidate', 'team', 'ideal', 'looking', 'years', 'experience', 'required', 'preferred', 'qualifications',
  'responsibilities', 'duties', 'requirements', 'skills', 'ability', 'strong', 'excellent', 'proven', 'demonstrated',
  'well', 'good', 'great', 'high', 'level', 'including', 'across', 'within', 'related', 'field', 'plus', 'equal',
  'opportunity', 'employer', 'benefits', 'salary', 'compensation', 'range', 'location', 'remote', 'hybrid', 'full-time'
]);

export function extractKeywordsFromText(text: string): string[] {
  if (!text || text.trim().length === 0) return [];
  const normalizedText = text.toLowerCase();
  const extracted = new Set<string>();

  // 1. Match known multi-word & single-word industry keywords
  COMMON_INDUSTRY_KEYWORDS.forEach((kw) => {
    // Regex for word boundary or special char boundaries
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i');
    if (regex.test(normalizedText)) {
      extracted.add(kw);
    }
  });

  // 2. Extract capitalized proper nouns or technical n-grams that repeat
  const words = text
    .replace(/[^\w\s+#.-]/g, ' ')
    .split(/\s+/)
    .map(w => w.trim().toLowerCase())
    .filter(w => w.length >= 3 && !STOP_WORDS.has(w) && !/^\d+$/.test(w));

  const wordCounts: { [w: string]: number } = {};
  words.forEach((w) => {
    wordCounts[w] = (wordCounts[w] || 0) + 1;
  });

  // Include words that appear multiple times or are technical
  Object.entries(wordCounts).forEach(([w, count]) => {
    if (count >= 2 || w.includes('+') || w.includes('#') || w.includes('.')) {
      extracted.add(w);
    }
  });

  return Array.from(extracted).slice(0, 35);
}

export function analyzeJobMatch(cv: CVData, jobDescription: string): JobMatchReport {
  if (!jobDescription || jobDescription.trim().length < 20) {
    return {
      matchScore: 100,
      foundKeywords: [],
      missingKeywords: [],
      suggestedKeywords: [],
      jobTitleMatch: true,
    };
  }

  const jdKeywords = extractKeywordsFromText(jobDescription);
  
  // Aggregate all CV text for searching
  const cvTextParts: string[] = [
    cv.personalInfo.fullName,
    cv.personalInfo.jobTitle,
    cv.summary,
  ];

  cv.experience.forEach(exp => {
    cvTextParts.push(exp.jobTitle, exp.company);
    exp.bullets.forEach(b => cvTextParts.push(b));
  });

  cv.education.forEach(edu => {
    cvTextParts.push(edu.degree, edu.institution);
  });

  cv.skillCategories.forEach(cat => {
    cat.skills.forEach(s => cvTextParts.push(s));
  });

  cv.projects.forEach(p => {
    cvTextParts.push(p.title, p.technologies);
    p.bullets.forEach(b => cvTextParts.push(b));
  });

  cv.certifications.forEach(c => {
    cvTextParts.push(c.name, c.issuer);
  });

  const fullCvText = cvTextParts.join(' ').toLowerCase();

  const foundKeywords: string[] = [];
  const missingKeywords: string[] = [];

  jdKeywords.forEach((kw) => {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i');
    if (regex.test(fullCvText)) {
      foundKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  const totalKeywords = jdKeywords.length || 1;
  const matchScore = Math.min(100, Math.round((foundKeywords.length / totalKeywords) * 100));

  // Check if job title shares words
  const jdFirst200 = jobDescription.slice(0, 300).toLowerCase();
  const cvTitle = (cv.personalInfo.jobTitle || '').toLowerCase();
  const titleWords = cvTitle.split(/\s+/).filter(w => w.length > 3);
  const jobTitleMatch = titleWords.some(tw => jdFirst200.includes(tw));

  return {
    matchScore,
    foundKeywords,
    missingKeywords,
    suggestedKeywords: missingKeywords.slice(0, 10),
    jobTitleMatch,
  };
}
