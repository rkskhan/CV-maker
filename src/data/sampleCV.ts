import { CVData } from '../types/cv';

export const SAMPLE_TECH_CV: CVData = {
  personalInfo: {
    fullName: 'ALEXANDER CHEN',
    jobTitle: 'Senior Full Stack Software Engineer',
    email: 'alexander.chen@email.com',
    phone: '+1 (555) 382-9104',
    location: 'San Francisco, CA',
    linkedinUrl: 'linkedin.com/in/alexanderchen-dev',
    githubUrl: 'github.com/alexchen',
    websiteUrl: 'alexanderchen.dev',
  },
  summary:
    'Results-driven Senior Full Stack Software Engineer with 7+ years of experience architecting resilient cloud microservices, high-throughput APIs, and scalable web platforms. Proven track record reducing system latency by 42% and driving 99.99% uptime across enterprise distributed systems. Proficient in TypeScript, React, Node.js, Python, PostgreSQL, AWS, and CI/CD automation in fast-paced Agile environments.',
  experience: [
    {
      id: 'exp-1',
      jobTitle: 'Senior Full Stack Engineer',
      company: 'Apex Cloud Systems',
      location: 'San Francisco, CA',
      startDate: 'Mar 2022',
      endDate: 'Present',
      isCurrent: true,
      bullets: [
        'Architected and deployed distributed event-driven microservices using Node.js, TypeScript, and AWS Lambda, processing over 15M daily transactions with 99.99% availability.',
        'Spearheaded the migration of legacy monolithic architecture to React 18 and GraphQL, reducing page initial load times by 45% and boosting conversion rate by 18%.',
        'Implemented automated CI/CD pipelines via GitHub Actions and Docker, reducing team deployment cycle time from 4 days to under 25 minutes.',
        'Mentored 6 junior and mid-level engineers through structured code reviews and system design workshops, elevating team test coverage from 68% to 94%.',
      ],
    },
    {
      id: 'exp-2',
      jobTitle: 'Full Stack Software Engineer',
      company: 'Vanguard Data Labs',
      location: 'San Jose, CA',
      startDate: 'Jul 2019',
      endDate: 'Feb 2022',
      isCurrent: false,
      bullets: [
        'Engineered responsive web analytics dashboard utilizing React, Redux, and D3.js, adopted by 85,000+ monthly active enterprise customers.',
        'Optimized PostgreSQL queries, connection pooling, and Redis caching layers, eliminating database bottlenecks and decreasing p95 query latency by 58%.',
        'Integrated Stripe payments and OAuth 2.0 multi-tenant authentication protocols, ensuring strict SOC 2 and GDPR compliance.',
        'Collaborated with cross-functional product and design teams in two-week Agile sprints to deliver 14 major feature releases ahead of schedule.',
      ],
    },
    {
      id: 'exp-3',
      jobTitle: 'Junior Software Engineer',
      company: 'Nexis Digital',
      location: 'Berkeley, CA',
      startDate: 'Jun 2017',
      endDate: 'Jun 2019',
      isCurrent: false,
      bullets: [
        'Developed robust RESTful API endpoints utilizing Express.js and MongoDB, supporting high-concurrency mobile and web client requests.',
        'Refactored frontend component library into modular reusable design system, decreasing technical debt and developer bug reports by 32%.',
        'Authored comprehensive unit and end-to-end integration tests using Jest and Cypress, achieving 90%+ code coverage on core billing modules.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'Bachelor of Science in Computer Science',
      institution: 'University of California, Berkeley',
      location: 'Berkeley, CA',
      graduationDate: 'May 2017',
      gpa: '3.85 / 4.0',
      honors: 'Dean’s Honors List, Magna Cum Laude',
    },
  ],
  skillCategories: [
    {
      id: 'skill-1',
      categoryName: 'Languages & Core',
      skills: ['TypeScript', 'JavaScript (ES6+)', 'Python', 'SQL', 'HTML5', 'CSS3', 'Bash'],
    },
    {
      id: 'skill-2',
      categoryName: 'Frameworks & Libraries',
      skills: ['React.js', 'Next.js', 'Node.js', 'Express', 'GraphQL', 'Redux Toolkit', 'Tailwind CSS'],
    },
    {
      id: 'skill-3',
      categoryName: 'Databases & Cloud',
      skills: ['PostgreSQL', 'Redis', 'MongoDB', 'AWS (S3, EC2, Lambda, DynamoDB)', 'Docker', 'Kubernetes'],
    },
    {
      id: 'skill-4',
      categoryName: 'DevOps & Tools',
      skills: ['Git', 'GitHub Actions', 'CI/CD Pipelines', 'Jest', 'Cypress', 'Webpack', 'Vite', 'Agile / Scrum'],
    },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'CloudMetrics: Real-time Distributed Monitoring Agent',
      technologies: 'TypeScript, Go, React, WebSockets, Docker',
      link: 'github.com/alexchen/cloudmetrics',
      date: '2023',
      bullets: [
        'Constructed open-source server telemetry agent tracking CPU, memory, and network throughput across 1,000+ concurrent nodes.',
        'Streamed metric aggregates via WebSockets to interactive React dashboard with sub-100ms UI render latency.',
      ],
    },
    {
      id: 'proj-2',
      title: 'SecureVault: Zero-Knowledge Password & Secret Manager',
      technologies: 'React, Node.js, Web Cryptography API, SQLite',
      link: 'github.com/alexchen/secure-vault',
      date: '2021',
      bullets: [
        'Implemented end-to-end client-side encryption using AES-256-GCM and PBKDF2 key derivation for cross-platform team credential sharing.',
      ],
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services (AWS)',
      date: 'Issued Nov 2023 · Expires Nov 2026',
    },
    {
      id: 'cert-2',
      name: 'Certified Kubernetes Administrator (CKA)',
      issuer: 'Cloud Native Computing Foundation (CNCF)',
      date: 'Issued Feb 2024 · Expires Feb 2027',
    },
  ],
};

export const SAMPLE_PRODUCT_CV: CVData = {
  personalInfo: {
    fullName: 'SARAH J. JENNINGS',
    jobTitle: 'Senior Product Manager',
    email: 'sarah.jennings@email.com',
    phone: '+1 (555) 749-2180',
    location: 'New York, NY',
    linkedinUrl: 'linkedin.com/in/sarahjennings-pm',
    githubUrl: '',
    websiteUrl: 'sarahjennings.co',
  },
  summary:
    'Data-driven Senior Product Manager with 6+ years of experience leading B2B SaaS and enterprise fintech product lifecycles from ideation to scale. Proven history increasing ARR by $4.2M, boosting user retention by 28%, and driving cross-functional alignment across 35+ engineers, designers, and commercial stakeholders. Expert in customer discovery, Agile product development, roadmapping, SQL data analysis, and OKR execution.',
  experience: [
    {
      id: 'exp-1',
      jobTitle: 'Senior Product Manager',
      company: 'Finova Enterprise Solutions',
      location: 'New York, NY',
      startDate: 'Jan 2022',
      endDate: 'Present',
      isCurrent: true,
      bullets: [
        'Defined multi-year product roadmap and led cross-functional team of 16 engineers and 3 designers delivering enterprise payments reconciliation suite.',
        'Generated $3.8M net new ARR within 9 months of launch, securing contracts with 18 Fortune 500 financial institutions.',
        'Conducted 60+ in-depth enterprise buyer interviews and mapped customer journeys, decreasing customer onboarding friction and drop-off by 34%.',
        'Established quantitative product metric telemetry using Amplitude and Mixpanel, monitoring daily cohort retention and feature adoption.',
      ],
    },
    {
      id: 'exp-2',
      jobTitle: 'Product Manager',
      company: 'Aura Analytics SaaS',
      location: 'Boston, MA',
      startDate: 'Aug 2018',
      endDate: 'Dec 2021',
      isCurrent: false,
      bullets: [
        'Owned end-to-end delivery of self-serve self-onboarding flow, lifting product-led growth (PLG) free-to-paid conversion rate by 22%.',
        'Prioritized sprint backlogs and author detailed PRDs, user stories, and acceptance criteria in bi-weekly Scrum cycles.',
        'Executed 24+ rigorous A/B experiments on pricing tiers, optimizing checkout funnels and yielding an incremental $750K annual revenue.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'Master of Business Administration (MBA)',
      institution: 'Columbia Business School',
      location: 'New York, NY',
      graduationDate: 'May 2018',
    },
    {
      id: 'edu-2',
      degree: 'Bachelor of Science in Economics',
      institution: 'Boston College',
      location: 'Chestnut Hill, MA',
      graduationDate: 'May 2015',
    },
  ],
  skillCategories: [
    {
      id: 'skill-1',
      categoryName: 'Product Strategy & Discovery',
      skills: ['Product Roadmapping', 'User Journey Mapping', 'Customer Discovery', 'Market Research', 'Competitive Analysis', 'GTM Strategy'],
    },
    {
      id: 'skill-2',
      categoryName: 'Technical & Analytical',
      skills: ['SQL', 'Data Analytics', 'Amplitude', 'Mixpanel', 'Google Analytics', 'A/B Testing', 'Tableau', 'Jira', 'Figma'],
    },
    {
      id: 'skill-3',
      categoryName: 'Methodologies & Leadership',
      skills: ['Agile / Scrum', 'PRD Authoring', 'OKRs & KPI Tracking', 'Stakeholder Management', 'Cross-Functional Leadership'],
    },
  ],
  projects: [],
  certifications: [
    {
      id: 'cert-1',
      name: 'Pragmatic Certified Product Manager (PMC-III)',
      issuer: 'Pragmatic Institute',
      date: 'Issued Oct 2020',
    },
    {
      id: 'cert-2',
      name: 'Certified Scrum Product Owner (CSPO)',
      issuer: 'Scrum Alliance',
      date: 'Issued Jan 2019',
    },
  ],
};

export const BLANK_CV: CVData = {
  personalInfo: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    linkedinUrl: '',
    githubUrl: '',
    websiteUrl: '',
  },
  summary: '',
  experience: [
    {
      id: 'exp-1',
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: true,
      bullets: [''],
    },
  ],
  education: [
    {
      id: 'edu-1',
      degree: '',
      institution: '',
      location: '',
      graduationDate: '',
    },
  ],
  skillCategories: [
    {
      id: 'skill-1',
      categoryName: 'Technical Skills',
      skills: [],
    },
  ],
  projects: [],
  certifications: [],
};
