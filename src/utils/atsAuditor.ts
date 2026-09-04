import { CVData, ATSScoreReport, ATSCheckResult } from '../types/cv';

export const STRONG_ACTION_VERBS = [
  'accelerated', 'achieved', 'advanced', 'analyzed', 'architected', 'automated',
  'boosted', 'built', 'championed', 'collaborated', 'conceived', 'consolidated',
  'constructed', 'created', 'cultivated', 'decreased', 'delivered', 'deployed',
  'designed', 'developed', 'devised', 'directed', 'drove', 'eliminated',
  'engineered', 'enhanced', 'established', 'executed', 'expanded', 'expedited',
  'formulated', 'generated', 'governed', 'guided', 'headed', 'identified',
  'implemented', 'improved', 'increased', 'initiated', 'innovated', 'instituted',
  'integrated', 'introduced', 'invented', 'launched', 'led', 'leveraged',
  'managed', 'maximized', 'mentored', 'migrated', 'minimized', 'modernized',
  'negotiated', 'optimized', 'orchestrated', 'overhauled', 'pioneered', 'planned',
  'prioritized', 'produced', 'programmed', 'projected', 'promoted', 'reduced',
  'refactored', 'resolved', 'restructured', 'revamped', 'scaled', 'secured',
  'simplified', 'spearheaded', 'standardized', 'steered', 'streamlined', 'strengthened',
  'structured', 'surpassed', 'synthesized', 'transformed', 'upgraded', 'validated',
];

export const WEAK_VERB_PATTERNS = [
  { pattern: /\bresponsible for\b/i, phrase: 'Responsible for', suggestion: 'Use a direct action verb like "Spearheaded", "Managed", or "Orchestrated"' },
  { pattern: /\bhelped with\b/i, phrase: 'Helped with', suggestion: 'Replace with "Collaborated on" or "Contributed to"' },
  { pattern: /\bassisted in\b/i, phrase: 'Assisted in', suggestion: 'Replace with "Facilitated", "Coordinated", or specify your exact role' },
  { pattern: /\bworked on\b/i, phrase: 'Worked on', suggestion: 'Replace with "Engineered", "Designed", or "Developed"' },
  { pattern: /\btasked with\b/i, phrase: 'Tasked with', suggestion: 'Replace with "Executed", "Directed", or "Delivered"' },
  { pattern: /\bparticipated in\b/i, phrase: 'Participated in', suggestion: 'Replace with "Partnered with" or state your direct contribution' },
  { pattern: /\bdid\b/i, phrase: 'Did', suggestion: 'Replace with an assertive verb like "Executed" or "Conducted"' },
  { pattern: /\bhandled\b/i, phrase: 'Handled', suggestion: 'Replace with "Managed", "Resolved", or "Processed"' },
];

export function auditCVForATS(cv: CVData): ATSScoreReport {
  const checks: ATSCheckResult[] = [];
  const weakVerbsFound: string[] = [];
  let metricsCount = 0;
  let bulletCount = 0;
  let strongVerbsCount = 0;

  // 1. Personal & Contact checks
  const { fullName, email, phone, location, linkedinUrl } = cv.personalInfo;
  
  if (fullName && fullName.trim().length > 2) {
    checks.push({
      id: 'chk-name',
      category: 'contact',
      title: 'Full Name Clear & Parsable',
      description: 'Your legal name is prominently positioned at the header without obfuscating graphics.',
      status: 'pass',
    });
  } else {
    checks.push({
      id: 'chk-name',
      category: 'contact',
      title: 'Full Name Missing or Incomplete',
      description: 'ATS parsers look for candidate name at the very top to index candidate records.',
      status: 'fail',
      recommendation: 'Enter your full name at the top of the CV.',
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && emailRegex.test(email.trim())) {
    checks.push({
      id: 'chk-email',
      category: 'contact',
      title: 'Valid Email Address',
      description: 'ATS can parse communication channel correctly.',
      status: 'pass',
    });
  } else {
    checks.push({
      id: 'chk-email',
      category: 'contact',
      title: 'Invalid or Missing Email',
      description: 'Email is mandatory for automated ATS invitations and applicant profile creation.',
      status: 'fail',
      recommendation: 'Add a clean professional email address (e.g. name@domain.com).',
    });
  }

  const phoneDigits = (phone || '').replace(/\D/g, '');
  if (phoneDigits.length >= 7) {
    checks.push({
      id: 'chk-phone',
      category: 'contact',
      title: 'Telephone Number Present',
      description: 'Standard phone format recognized.',
      status: 'pass',
    });
  } else {
    checks.push({
      id: 'chk-phone',
      category: 'contact',
      title: 'Phone Number Incomplete',
      description: 'Many recruiter ATS filters automatically screen out submissions lacking a contact number.',
      status: 'warning',
      recommendation: 'Provide an active phone number including country or area code.',
    });
  }

  if (location && location.trim().length > 2) {
    checks.push({
      id: 'chk-loc',
      category: 'contact',
      title: 'Location / Residence Provided',
      description: 'City/State enables ATS regional radius matching.',
      status: 'pass',
    });
  } else {
    checks.push({
      id: 'chk-loc',
      category: 'contact',
      title: 'Location Missing',
      description: 'Recruiters frequently filter applicants by city, state, or timezone.',
      status: 'warning',
      recommendation: 'Add your City and State/Country (e.g. "Seattle, WA").',
    });
  }

  // 2. Summary Check
  const summaryWords = (cv.summary || '').trim().split(/\s+/).filter(Boolean);
  if (summaryWords.length >= 25 && summaryWords.length <= 120) {
    checks.push({
      id: 'chk-summary',
      category: 'content',
      title: 'Optimized Professional Summary',
      description: `Summary length (${summaryWords.length} words) is within ideal 2-5 sentence ATS scanning range.`,
      status: 'pass',
    });
  } else if (summaryWords.length === 0) {
    checks.push({
      id: 'chk-summary',
      category: 'content',
      title: 'Professional Summary Missing',
      description: 'A 2-4 sentence summary loaded with target role keywords boosts search ranking on Taleo and Workday.',
      status: 'warning',
      recommendation: 'Add a concise summary highlighting your years of experience, key domain, and primary skills.',
    });
  } else {
    checks.push({
      id: 'chk-summary',
      category: 'content',
      title: 'Summary Length Suboptimal',
      description: summaryWords.length < 25 ? 'Summary is too brief for ATS keyword extraction.' : 'Summary is overly long; keep under 120 words for rapid human and machine review.',
      status: 'warning',
      recommendation: 'Aim for 30 to 80 impactful words with key technical and industry terms.',
    });
  }

  // 3. Experience & Bullet Quality Checks
  if (cv.experience.length >= 1) {
    checks.push({
      id: 'chk-exp-count',
      category: 'formatting',
      title: 'Standard Chronological Experience Section',
      description: 'Uses industry-standard section heading and chronological layout recognized by 100% of parsers.',
      status: 'pass',
    });
  } else {
    checks.push({
      id: 'chk-exp-count',
      category: 'content',
      title: 'No Work Experience Entries',
      description: 'Work Experience is the primary section ATS parses for job titles and tenure.',
      status: 'fail',
      recommendation: 'Add at least one professional work experience role.',
    });
  }

  // Check bullets across all experience
  const metricRegex = /\b(\d+(\.\d+)?%|\$\d+(\.\d+)?[kKmMbB]?|\d+k\+?|\d+\+?\s*(users|clients|customers|engineers|members|transactions|requests|nodes|queries|features|releases|projects|hours|days|weeks|months|years))\b|\b\d{2,}\b/i;

  cv.experience.forEach((exp) => {
    exp.bullets.forEach((b) => {
      const text = b.trim();
      if (!text) return;
      bulletCount++;

      // Check weak verbs
      for (const w of WEAK_VERB_PATTERNS) {
        if (w.pattern.test(text) && !weakVerbsFound.includes(w.phrase)) {
          weakVerbsFound.push(w.phrase);
        }
      }

      // Check metrics
      if (metricRegex.test(text)) {
        metricsCount++;
      }

      // Check leading action verb
      const firstWord = text.split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '');
      if (firstWord && STRONG_ACTION_VERBS.includes(firstWord)) {
        strongVerbsCount++;
      }
    });
  });

  // Action Verbs Assessment
  if (weakVerbsFound.length === 0 && strongVerbsCount >= Math.max(1, Math.floor(bulletCount * 0.6))) {
    checks.push({
      id: 'chk-action-verbs',
      category: 'content',
      title: 'High-Impact Action Verbs',
      description: `Great job! Most bullets start with commanding verbs without passive cliches.`,
      status: 'pass',
    });
  } else if (weakVerbsFound.length > 0) {
    checks.push({
      id: 'chk-action-verbs',
      category: 'content',
      title: 'Passive or Weak Phrases Detected',
      description: `Found weak phrase(s): ${weakVerbsFound.join(', ')}. These reduce candidate score in automated evaluation.`,
      status: 'warning',
      recommendation: 'Begin every accomplishment bullet with an active verb (e.g., Spearheaded, Engineered, Optimized, Delivered).',
    });
  } else {
    checks.push({
      id: 'chk-action-verbs',
      category: 'content',
      title: 'More Action Verbs Recommended',
      description: 'Strengthen bullet points by starting with decisive past-tense verbs.',
      status: 'warning',
      recommendation: 'Start bullet points with strong verbs such as Architected, Decreased, Streamlined, or Accelerated.',
    });
  }

  // Metrics Assessment
  if (metricsCount >= Math.max(2, Math.floor(bulletCount * 0.4))) {
    checks.push({
      id: 'chk-metrics',
      category: 'content',
      title: 'Quantified Accomplishments & Metrics',
      description: `Found ${metricsCount} measurable metrics (%, $, scale, team size). ATS and recruiters reward data-driven evidence.`,
      status: 'pass',
    });
  } else {
    checks.push({
      id: 'chk-metrics',
      category: 'content',
      title: 'Low Quantification in Bullets',
      description: `Only ${metricsCount} bullet(s) contain numbers or percentages. Vague statements fail to distinguish top candidates.`,
      status: 'warning',
      recommendation: 'Include metrics wherever possible (e.g. "reduced latency by 35%", "managed budget of $500K", "scaled to 50K users").',
    });
  }

  // 4. Skills Categorization Check
  const totalSkills = cv.skillCategories.reduce((acc, cat) => acc + cat.skills.length, 0);
  if (totalSkills >= 8) {
    checks.push({
      id: 'chk-skills',
      category: 'keywords',
      title: 'Categorized Keywords & Skills Section',
      description: `${totalSkills} categorized skills detected. Plain-text skill lists parse cleanly into ATS taxonomy tables.`,
      status: 'pass',
    });
  } else if (totalSkills > 0) {
    checks.push({
      id: 'chk-skills',
      category: 'keywords',
      title: 'Skills Section Could Be Expanded',
      description: `Found ${totalSkills} skill(s). ATS search algorithms rank candidates heavily on exact skill matches.`,
      status: 'warning',
      recommendation: 'Add relevant tools, programming languages, methodologies, and frameworks (aim for 10-25 skills).',
    });
  } else {
    checks.push({
      id: 'chk-skills',
      category: 'keywords',
      title: 'Missing Skills Section',
      description: 'Skills are critical for automated keyword matching in Taleo, Greenhouse, and Lever.',
      status: 'fail',
      recommendation: 'Add your primary technical, industry, and software competencies.',
    });
  }

  // 5. Education Check
  if (cv.education.length > 0 && cv.education[0].institution && cv.education[0].degree) {
    checks.push({
      id: 'chk-education',
      category: 'formatting',
      title: 'Parsable Education Block',
      description: 'Standard degree and university layout complies with ATS degree requirements filters.',
      status: 'pass',
    });
  } else {
    checks.push({
      id: 'chk-education',
      category: 'formatting',
      title: 'Education Incomplete',
      description: 'Many automated filters require a verified degree or institution name.',
      status: 'warning',
      recommendation: 'Add your degree title, university/college, and graduation date.',
    });
  }

  // 6. ATS Layout Standard Guarantees
  checks.push({
    id: 'chk-single-column',
    category: 'formatting',
    title: 'Single-Column Linear Flow',
    description: '100% Guaranteed. Multi-column tables and text boxes scramble ATS reading order. This CV maintains strict linear hierarchy.',
    status: 'pass',
  });

  checks.push({
    id: 'chk-clean-fonts',
    category: 'formatting',
    title: 'Standard Web & System Typography',
    description: 'Uses universal, machine-parsable fonts without custom SVG symbol fonts.',
    status: 'pass',
  });

  checks.push({
    id: 'chk-no-graphics',
    category: 'formatting',
    title: 'Zero Graphical Barriers',
    description: 'No raster charts, profile photos, or rating star bars that cause ATS parsers to discard applications.',
    status: 'pass',
  });

  // Calculate scores
  const passCount = checks.filter(c => c.status === 'pass').length;
  const warningCount = checks.filter(c => c.status === 'warning').length;
  const failCount = checks.filter(c => c.status === 'fail').length;

  const rawScore = Math.round((passCount * 100 + warningCount * 50) / checks.length);
  const overallScore = Math.max(10, Math.min(100, rawScore));

  const formattingChecks = checks.filter(c => c.category === 'formatting');
  const formattingScore = Math.round(
    (formattingChecks.filter(c => c.status === 'pass').length * 100 +
     formattingChecks.filter(c => c.status === 'warning').length * 50) /
    (formattingChecks.length || 1)
  );

  const contentChecks = checks.filter(c => c.category === 'content');
  const contentScore = Math.round(
    (contentChecks.filter(c => c.status === 'pass').length * 100 +
     contentChecks.filter(c => c.status === 'warning').length * 50) /
    (contentChecks.length || 1)
  );

  const keywordChecks = checks.filter(c => c.category === 'keywords' || c.category === 'contact');
  const keywordScore = Math.round(
    (keywordChecks.filter(c => c.status === 'pass').length * 100 +
     keywordChecks.filter(c => c.status === 'warning').length * 50) /
    (keywordChecks.length || 1)
  );

  return {
    overallScore,
    formattingScore,
    contentScore,
    keywordScore,
    checks,
    weakVerbsFound,
    metricsCount,
    bulletCount,
  };
}
