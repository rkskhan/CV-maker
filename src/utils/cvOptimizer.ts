import { CVData } from '../types/cv';
import { analyzeJobMatch, formatKeywordDisplay } from './keywordMatcher';

export type RoleDomain = 'hr' | 'marketing' | 'operations' | 'tech' | 'general';

export interface OptimizeResult {
  optimizedCV: CVData;
  keywordsAdded: string[];
  verbsEnhanced: number;
  domainDetected: RoleDomain;
  targetRoleTitle: string;
}

export function detectRoleDomain(text: string): RoleDomain {
  const lower = text.toLowerCase();

  // 1. Human Resources & People Operations
  if (/\b(human resources|hr|hris|talent acquisition|recruitment|recruiter|people operations|employee relations|onboarding|offboarding|staffing|payroll|workforce planning)\b/i.test(lower)) {
    return 'hr';
  }

  // 2. Marketing, Sales, Growth & Brand
  if (/\b(marketing|seo|sem|social media|content marketing|brand management|advertising|campaigns|copywriting|sales|account executive)\b/i.test(lower)) {
    return 'marketing';
  }

  // 3. Operations, Logistics, Finance & Administration
  if (/\b(operations|logistics|procurement|supply chain|finance|accounting|accountant|budgeting|auditing|administrative|office management)\b/i.test(lower)) {
    return 'operations';
  }

  // 4. Technology, Engineering & IT
  if (/\b(software|developer|engineer|full stack|frontend|backend|devops|cloud|architect|python|react|typescript|node\.js|aws|system design|kubernetes)\b/i.test(lower)) {
    return 'tech';
  }

  return 'general';
}

const DOMAIN_VERBS: Record<RoleDomain, Record<string, string>> = {
  hr: {
    'worked on': 'Administered and coordinated',
    'helped with': 'Facilitated and supported',
    'helped': 'Facilitated and assisted',
    'responsible for': 'Oversaw and administered',
    'handled': 'Managed, processed, and maintained',
    'assisted in': 'Partnered with department leads to coordinate',
    'assisted': 'Assisted and coordinated',
    'did': 'Executed and maintained',
    'made': 'Formulated and established',
    'participated in': 'Collaborated cross-functionally on',
    'involved in': 'Coordinated key initiatives for'
  },
  marketing: {
    'worked on': 'Developed and executed',
    'helped with': 'Partnered to accelerate and scale',
    'helped': 'Accelerated performance and reach of',
    'responsible for': 'Spearheaded execution and optimization of',
    'handled': 'Managed, monitored, and optimized',
    'assisted in': 'Collaborated cross-functionally to drive',
    'assisted': 'Supported campaign delivery and analysis for',
    'did': 'Produced and launched',
    'made': 'Designed and implemented',
    'participated in': 'Contributed to strategic growth of',
    'involved in': 'Championed campaigns for'
  },
  operations: {
    'worked on': 'Streamlined and executed',
    'helped with': 'Collaborated to standardize and improve',
    'helped': 'Enhanced operational efficiency of',
    'responsible for': 'Directed operational oversight and management of',
    'handled': 'Managed, organized, and audited',
    'assisted in': 'Supported workflow optimization across',
    'assisted': 'Assisted with procedural coordination of',
    'did': 'Executed and delivered',
    'made': 'Formulated and implemented',
    'participated in': 'Collaborated across teams to optimize',
    'involved in': 'Coordinated key process improvements for'
  },
  tech: {
    'worked on': 'Architected and engineered',
    'helped with': 'Collaborated cross-functionally to accelerate',
    'helped': 'Spearheaded execution and delivery of',
    'responsible for': 'Directed end-to-end development of',
    'handled': 'Orchestrated deployment and maintenance of',
    'assisted in': 'Collaborated to implement and optimize',
    'assisted': 'Contributed to high-throughput release of',
    'did': 'Executed and deployed',
    'made': 'Designed and implemented',
    'participated in': 'Co-led engineering initiatives for',
    'involved in': 'Championed development of'
  },
  general: {
    'worked on': 'Spearheaded and executed',
    'helped with': 'Collaborated cross-functionally to streamline',
    'helped': 'Supported and advanced execution of',
    'responsible for': 'Oversaw and managed',
    'handled': 'Managed, organized, and resolved',
    'assisted in': 'Partnered across teams to facilitate',
    'assisted': 'Coordinated and supported',
    'did': 'Executed and delivered',
    'made': 'Designed and established',
    'participated in': 'Actively collaborated on',
    'involved in': 'Facilitated core initiatives for'
  }
};

/**
 * Optimizes a CV for a target job description with 100% role-relatable changes:
 * 1. Accurately detects job domain (HR, Marketing, Operations, Tech, General)
 * 2. Injects missing job keywords formatted cleanly into appropriate competencies
 * 3. Aligns professional summary to target role and matched competencies without buzzwords
 * 4. Upgrades passive verbs to role-appropriate action verbs (e.g. "Administered and coordinated" for HR)
 */
export function optimizeCVForJob(cv: CVData, jobDescription: string): OptimizeResult {
  if (!jobDescription || !jobDescription.trim()) {
    return {
      optimizedCV: { ...cv },
      keywordsAdded: [],
      verbsEnhanced: 0,
      domainDetected: 'general',
      targetRoleTitle: cv.personalInfo.jobTitle || 'Professional'
    };
  }

  // Combine CV and Job Description to accurately identify domain
  const combinedContext = `${jobDescription}\n${cv.personalInfo.jobTitle}\n${cv.summary}`;
  const domain = detectRoleDomain(combinedContext);

  const matchReport = analyzeJobMatch(cv, jobDescription);
  const missingKeywords = matchReport.missingKeywords.slice(0, 8);
  const keywordsAdded: string[] = [];

  // Deep clone CV
  const newCV: CVData = JSON.parse(JSON.stringify(cv));

  // 1. Inject missing keywords into Skill Categories cleanly
  if (missingKeywords.length > 0) {
    let targetCategory = newCV.skillCategories.find(c => 
      /target|competenc|technical|domain|core|professional|skills/i.test(c.categoryName)
    );

    if (!targetCategory) {
      if (newCV.skillCategories.length > 0) {
        targetCategory = newCV.skillCategories[0];
      } else {
        targetCategory = {
          id: 'cat-target',
          categoryName: 'Core Competencies',
          skills: []
        };
        newCV.skillCategories.push(targetCategory);
      }
    }

    const existingSkillsLower = new Set(
      newCV.skillCategories.flatMap(c => c.skills.map(s => s.toLowerCase().trim()))
    );

    missingKeywords.forEach(kw => {
      const cleanKw = kw.trim();
      if (cleanKw && !existingSkillsLower.has(cleanKw.toLowerCase())) {
        const formatted = formatKeywordDisplay(cleanKw);
        targetCategory!.skills.push(formatted);
        existingSkillsLower.add(cleanKw.toLowerCase());
        keywordsAdded.push(formatted);
      }
    });
  }

  // 2. Enhance Experience Bullets with DOMAIN-SPECIFIC relatable action verbs
  let verbsEnhanced = 0;
  const verbMap = DOMAIN_VERBS[domain] || DOMAIN_VERBS.general;

  newCV.experience.forEach(exp => {
    exp.bullets = exp.bullets.map(bullet => {
      let upgraded = bullet;
      for (const [weak, strong] of Object.entries(verbMap)) {
        const regex = new RegExp(`^${weak}\\b`, 'i');
        if (regex.test(upgraded)) {
          upgraded = upgraded.replace(regex, strong);
          verbsEnhanced++;
          break;
        }
      }
      return upgraded;
    });
  });

  // 3. Extract Target Job Title cleanly from Job Description
  const lines = jobDescription.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  let targetRoleTitle = '';
  for (const line of lines.slice(0, 5)) {
    const titleMatch = line.match(/(?:job title|role|position)[:\s-]*([a-zA-Z\s/&-]+)/i);
    if (titleMatch && titleMatch[1].trim().length >= 3) {
      targetRoleTitle = titleMatch[1].trim();
      break;
    }
    if (!targetRoleTitle && line.length < 50 && !line.includes('.') && /\b(intern|specialist|manager|executive|officer|assistant|lead|coordinator|consultant|analyst|engineer|developer)\b/i.test(line)) {
      targetRoleTitle = line.replace(/^(looking for|we are hiring|seeking a|role:)\s*/i, '').trim();
      break;
    }
  }

  if (!targetRoleTitle) {
    targetRoleTitle = cv.personalInfo.jobTitle || (
      domain === 'hr' ? 'Human Resources Professional' :
      domain === 'marketing' ? 'Marketing Professional' :
      domain === 'operations' ? 'Operations Professional' :
      domain === 'tech' ? 'Technology Professional' : 'Professional'
    );
  }

  // 4. Generate Relatable Professional Summary based on detected domain and matched skills
  const topSkills = matchReport.foundKeywords.concat(keywordsAdded).slice(0, 4).map(formatKeywordDisplay);
  const skillsPhrase = topSkills.length > 0 ? topSkills.join(', ') : 'core domain proficiencies';

  let relatableSummary = '';
  switch (domain) {
    case 'hr':
      relatableSummary = `Dedicated and detail-oriented ${targetRoleTitle} with practical expertise in ${skillsPhrase}. Proven track record supporting recruitment, streamlining employee records, coordinating onboarding, and collaborating across departments to foster positive workplace engagement and organizational efficiency.`;
      break;
    case 'marketing':
      relatableSummary = `Results-driven ${targetRoleTitle} experienced in ${skillsPhrase}. Adept at planning and executing targeted campaigns, monitoring audience performance metrics, and collaborating cross-functionally to elevate brand reach and measurable engagement.`;
      break;
    case 'operations':
      relatableSummary = `Proactive and organized ${targetRoleTitle} with hands-on proficiency in ${skillsPhrase}. Demonstrated ability to streamline administrative workflows, maintain accurate records, and partner across functional teams to drive operational efficiency.`;
      break;
    case 'tech':
      relatableSummary = `Solutions-oriented ${targetRoleTitle} with strong foundation across ${skillsPhrase}. Experienced in building robust deliverables, optimizing workflows, and collaborating in Agile teams to deliver high-quality solutions.`;
      break;
    default:
      relatableSummary = `Resourceful and motivated ${targetRoleTitle} with proven background in ${skillsPhrase}. Demonstrated track record managing key responsibilities, optimizing daily processes, and collaborating effectively across teams to achieve organizational goals.`;
      break;
  }

  // Update summary if empty, brief, or user triggers optimization
  if (!newCV.summary || newCV.summary.trim().length < 30 || !newCV.summary.toLowerCase().includes(targetRoleTitle.toLowerCase())) {
    newCV.summary = relatableSummary;
  }

  return {
    optimizedCV: newCV,
    keywordsAdded,
    verbsEnhanced,
    domainDetected: domain,
    targetRoleTitle
  };
}
