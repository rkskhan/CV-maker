import { CVData } from '../types/cv';
import { analyzeJobMatch } from './keywordMatcher';

interface OptimizeResult {
  optimizedCV: CVData;
  keywordsAdded: string[];
  verbsEnhanced: number;
}

const WEAK_TO_STRONG_VERBS: Record<string, string> = {
  'worked on': 'Architected and engineered',
  'helped with': 'Spearheaded cross-functional delivery of',
  'helped': 'Spearheaded execution of',
  'responsible for': 'Directed end-to-end development of',
  'handled': 'Orchestrated deployment and maintenance of',
  'assisted': 'Collaborated to accelerate release of',
  'did': 'Executed and delivered',
  'made': 'Designed and implemented',
  'participated in': 'Co-led engineering initiatives for',
  'involved in': 'Championed development of'
};

/**
 * Optimizes a CV for a target job description:
 * 1. Injects missing job keywords into relevant skill categories
 * 2. Aligns summary with target job keywords
 * 3. Upgrades passive verbs to high-impact ATS power action verbs
 */
export function optimizeCVForJob(cv: CVData, jobDescription: string): OptimizeResult {
  if (!jobDescription || !jobDescription.trim()) {
    return {
      optimizedCV: { ...cv },
      keywordsAdded: [],
      verbsEnhanced: 0
    };
  }

  const matchReport = analyzeJobMatch(cv, jobDescription);
  const missingKeywords = matchReport.missingKeywords.slice(0, 10);
  const keywordsAdded: string[] = [];

  // Deep clone CV
  const newCV: CVData = JSON.parse(JSON.stringify(cv));

  // 1. Inject missing keywords into Skill Categories
  if (missingKeywords.length > 0) {
    let targetCategory = newCV.skillCategories.find(c => 
      /target|technical|domain|core|technologies/i.test(c.categoryName)
    );

    if (!targetCategory) {
      if (newCV.skillCategories.length > 0) {
        targetCategory = newCV.skillCategories[0];
      } else {
        targetCategory = {
          id: 'cat-target',
          categoryName: 'Target Job Competencies',
          skills: []
        };
        newCV.skillCategories.push(targetCategory);
      }
    }

    const existingSkillsLower = new Set(
      newCV.skillCategories.flatMap(c => c.skills.map(s => s.toLowerCase()))
    );

    missingKeywords.forEach(kw => {
      if (!existingSkillsLower.has(kw.toLowerCase())) {
        targetCategory!.skills.push(kw);
        existingSkillsLower.add(kw.toLowerCase());
        keywordsAdded.push(kw);
      }
    });
  }

  // 2. Enhance Experience Bullets (Upgrade weak verbs to impactful ATS power verbs)
  let verbsEnhanced = 0;
  newCV.experience.forEach(exp => {
    exp.bullets = exp.bullets.map(bullet => {
      let upgraded = bullet;
      for (const [weak, strong] of Object.entries(WEAK_TO_STRONG_VERBS)) {
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

  // 3. Align Summary with job title keywords if relevant
  const lines = jobDescription.split('\n').filter(l => l.trim().length > 0);
  const potentialJobTitle = lines[0]?.replace(/^(job title|role|position)[:\s-]*/i, '').trim();
  if (potentialJobTitle && potentialJobTitle.length < 50 && !potentialJobTitle.includes('.')) {
    if (!newCV.summary.toLowerCase().includes(potentialJobTitle.toLowerCase())) {
      newCV.summary = `${potentialJobTitle} with deep expertise across modern architectures. ` + newCV.summary;
    }
  }

  return {
    optimizedCV: newCV,
    keywordsAdded,
    verbsEnhanced
  };
}
