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

export const SAMPLE_BUSINESS_STUDENT_CV: CVData = {
  personalInfo: {
    fullName: 'EMILY R. ZHAO',
    jobTitle: 'Business & Finance Associate | Aspiring Management Consultant',
    email: 'emily.zhao@email.com',
    phone: '+1 (555) 419-8230',
    location: 'Chicago, IL',
    linkedinUrl: 'linkedin.com/in/emilyzhao-biz',
    githubUrl: '',
    websiteUrl: 'emilyzhao.me',
  },
  summary:
    'High-achieving Business Administration & Finance senior (GPA 3.88/4.0) with hands-on internship experience in financial valuation, market entry strategy, and quantitative data analytics. Proven track record building 3-statement DCF financial models, conducting cross-industry competitive intelligence, and presenting executive-ready recommendations. 1st Place Winner of the 2023 National Collegiate Consulting Case Competition.',
  experience: [
    {
      id: 'exp-1',
      jobTitle: 'Investment Banking Summer Analyst',
      company: 'Horizon Capital Partners',
      location: 'Chicago, IL',
      startDate: 'Jun 2023',
      endDate: 'Aug 2023',
      isCurrent: false,
      bullets: [
        'Constructed dynamic DCF, precedent transactions, and comparable company valuation models for 4 active M&A mandates totaling $450M in enterprise value.',
        'Authored 25-page confidential information memorandums (CIM) and pitch books presented directly to C-suite executives and institutional sponsors.',
        'Automated financial variance reporting routines using Advanced Excel and VBA, reducing bi-weekly reporting prep time by 35%.',
        'Conducted detailed financial statement analysis across 18 public peers to benchmark EBITDA margins, leverage ratios, and working capital cycles.',
      ],
    },
    {
      id: 'exp-2',
      jobTitle: 'Corporate Strategy & Marketing Intern',
      company: 'Apex Consumer Brands',
      location: 'Chicago, IL',
      startDate: 'Jan 2023',
      endDate: 'May 2023',
      isCurrent: false,
      bullets: [
        'Analyzed customer churn data across 12 product categories using SQL and Power BI, uncovering strategic insights that identified $1.2M in annualized cost savings.',
        'Designed go-to-market (GTM) expansion framework for digital direct-to-consumer line, accelerating project timeline by 3 weeks.',
        'Synthesized syndicated market research reports (Nielsen, Euromonitor) into actionable competitive intelligence briefs for senior brand directors.',
      ],
    },
    {
      id: 'exp-3',
      jobTitle: 'Portfolio Analyst (Student Investment Fund)',
      company: 'Northwestern Student Endowment Fund',
      location: 'Evanston, IL',
      startDate: 'Sep 2022',
      endDate: 'Present',
      isCurrent: true,
      bullets: [
        'Co-managed $1.5M student-run equity endowment, pitching equity research recommendations in the technology and consumer discretionary sectors.',
        'Monitored macroeconomic indicators, interest rate sensitivity, and earnings guidance to rebalance asset allocation quarterly.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'Bachelor of Science in Business Administration (Finance & Strategy)',
      institution: 'Northwestern University',
      location: 'Evanston, IL',
      graduationDate: 'May 2024',
      gpa: '3.88 / 4.0',
      honors: 'Magna Cum Laude, Dean’s Honor List (All Semesters), Beta Gamma Sigma Honor Society',
    },
  ],
  skillCategories: [
    {
      id: 'skill-1',
      categoryName: 'Financial Modeling & Valuation',
      skills: ['DCF Modeling', '3-Statement Modeling', 'Comparable Company Analysis', 'LBO Fundamentals', 'Capital Budgeting', 'Financial Statement Analysis'],
    },
    {
      id: 'skill-2',
      categoryName: 'Business Analytics & Tools',
      skills: ['Advanced Excel (VBA/Macros)', 'SQL', 'Power BI', 'Tableau', 'Bloomberg Terminal', 'Capital IQ', 'PitchBook'],
    },
    {
      id: 'skill-3',
      categoryName: 'Strategic Planning & Research',
      skills: ['Market Research', 'Competitive Benchmarking', 'Go-To-Market (GTM) Strategy', 'Financial Due Diligence', 'Executive Presentations'],
    },
    {
      id: 'skill-4',
      categoryName: 'Leadership & Methodologies',
      skills: ['Case Competition Strategy', 'Stakeholder Management', 'Cross-Functional Team Collaboration', 'Agile Project Tracking'],
    },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'National Collegiate Case Competition - 1st Place Strategy Framework',
      technologies: 'Financial Valuation, Market Sizing, Scenario Analysis, PowerPoint',
      date: 'Nov 2023',
      bullets: [
        'Formulated comprehensive 5-year turnaround and omnichannel expansion strategy for a struggling regional retailer, winning 1st Place out of 48 university teams.',
        'Modeled payback periods and capital expenditure requirements across 3 growth scenarios, justifying a $15M investment proposal to panel of McKinsey and BCG judges.',
      ],
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'Bloomberg Market Concepts (BMC) Certification',
      issuer: 'Bloomberg LP',
      date: 'Issued Feb 2023',
    },
    {
      id: 'cert-2',
      name: 'Financial Modeling & Valuation Analyst (FMVA)',
      issuer: 'Corporate Finance Institute (CFI)',
      date: 'Issued Aug 2023',
    },
  ],
};

export const SAMPLE_ARTS_STUDENT_CV: CVData = {
  personalInfo: {
    fullName: 'MAYA LIN CARTER',
    jobTitle: 'Visual Designer & Fine Arts Graduate | Creative Media Specialist',
    email: 'maya.carter@email.com',
    phone: '+1 (555) 628-9411',
    location: 'New York, NY',
    linkedinUrl: 'linkedin.com/in/mayacarter-arts',
    githubUrl: '',
    websiteUrl: 'mayacarterdesign.com',
  },
  summary:
    'Creative and detail-oriented Fine Arts & Visual Design graduate with comprehensive studio and digital media experience spanning brand identity development, typography systems, editorial layout, and exhibition curation. Proficient in translating abstract conceptual narratives into compelling, accessible visual identities across digital, interactive, and print formats. Recipient of the 2024 Dean’s Award for Outstanding Fine Arts Portfolio.',
  experience: [
    {
      id: 'exp-1',
      jobTitle: 'Junior Graphic Designer & Studio Intern',
      company: 'Monochrome Creative Studio',
      location: 'Brooklyn, NY',
      startDate: 'Jun 2023',
      endDate: 'Aug 2023',
      isCurrent: false,
      bullets: [
        'Designed cohesive brand identity kits, custom vector illustrations, and packaging mechanicals for 8 emerging lifestyle and cultural clients.',
        'Collaborated with senior art directors to produce multi-channel digital marketing campaigns, generating over 120,000 organic social impressions.',
        'Prepared rigorous pre-press print production files with precise color separations (Pantone/CMYK), bleeds, and paper stock specifications.',
        'Structured modular Figma design systems and typography hierarchies adopted across the agency’s internal design workflows.',
      ],
    },
    {
      id: 'exp-2',
      jobTitle: 'Gallery Assistant & Digital Media Coordinator',
      company: 'Pratt Manhattan Gallery',
      location: 'New York, NY',
      startDate: 'Sep 2022',
      endDate: 'May 2023',
      isCurrent: false,
      bullets: [
        'Curated and designed layout for 3 full-color exhibition catalogs, managing print vendor deadlines and budget limits.',
        'Photographed high-resolution fine art installations and edited color-accurate portfolio documentation using Adobe Lightroom and Photoshop.',
        'Coordinated digital promotional assets and museum signage for seasonal exhibitions welcoming 15,000+ annual visitors.',
      ],
    },
    {
      id: 'exp-3',
      jobTitle: 'Freelance Visual Designer & Illustrator',
      company: 'Maya Carter Creative',
      location: 'New York, NY',
      startDate: 'Jan 2022',
      endDate: 'Present',
      isCurrent: true,
      bullets: [
        'Provided comprehensive branding packages, logo marks, and promotional posters for 14 independent non-profit and arts organizations.',
        'Maintained 100% on-time delivery record and received 5-star client satisfaction ratings across all creative deliverables.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'Bachelor of Fine Arts (BFA) in Graphic Design & Studio Arts',
      institution: 'Pratt Institute',
      location: 'Brooklyn, NY',
      graduationDate: 'May 2024',
      gpa: '3.91 / 4.0',
      honors: 'President’s List with Distinction, Dean’s Showcase Award, Senior Honors Exhibition',
    },
  ],
  skillCategories: [
    {
      id: 'skill-1',
      categoryName: 'Design Software & Tools',
      skills: ['Adobe Photoshop', 'Adobe Illustrator', 'Adobe InDesign', 'Figma', 'Adobe After Effects', 'Lightroom', 'Procreate', 'Keynote'],
    },
    {
      id: 'skill-2',
      categoryName: 'Visual & Graphic Disciplines',
      skills: ['Brand Identity Systems', 'Typography & Grid Layout', 'Editorial Design', 'Color Theory & Systems', 'Print Production (CMYK/Pantone)', 'UI/UX Prototyping'],
    },
    {
      id: 'skill-3',
      categoryName: 'Studio & Fine Art Techniques',
      skills: ['Screen Printing', 'Digital Photography', 'Exhibition Installation & Lighting', 'Archival Documentation', 'Vector Illustration'],
    },
    {
      id: 'skill-4',
      categoryName: 'Professional & Collaborative',
      skills: ['Creative Art Direction', 'Client Pitching & Presentations', 'Design System Documentation', 'Pre-Press Verification', 'Vendor Management'],
    },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'Senior Thesis: "Urban Glyphs" Typography Monograph',
      technologies: 'Adobe InDesign, Risograph Printing, Custom Typography, French Fold Binding',
      date: 'Apr 2024',
      bullets: [
        'Researched, authored, and designed a 96-page limited-edition book investigating vernacular street signage and architectural letterforms across NYC.',
        'Selected for permanent display in the Pratt Institute Fine Arts Library Rare Book Collection.',
      ],
    },
    {
      id: 'proj-2',
      title: 'EcoArt Collective Digital Brand & Interactive App Prototype',
      technologies: 'Figma, Adobe Illustrator, Design Systems, User Testing',
      date: 'Dec 2023',
      bullets: [
        'Architected comprehensive design system and 24-screen interactive mobile prototype connecting local sustainable artists with patrons, verified via 35 user test sessions.',
      ],
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'Adobe Certified Professional in Visual Design',
      issuer: 'Adobe',
      date: 'Issued Oct 2023',
    },
    {
      id: 'cert-2',
      name: 'UI/UX Design Specialization Certificate',
      issuer: 'California Institute of the Arts (CalArts)',
      date: 'Issued Jun 2023',
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
