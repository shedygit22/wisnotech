export interface CourseOutcome {
  title: string;
  description: string;
}

export interface CourseModule {
  title: string;
  lessons: string[];
}

export interface Course {
  slug: string;
  title: string;
  tagline: string;
  duration: string;
  level: string;
  format: string;
  usd: number;
  naira: number;
  badge?: string;
  featured?: boolean;
  topics: string[];
  areYou: string[];
  modules: CourseModule[];
  outcomes: CourseOutcome[];
  includes: string[];
}

export const COURSES: Course[] = [
  {
    slug: "ai-fundamentals",
    title: "AI Fundamentals",
    tagline: "The zero-to-one foundation in artificial intelligence for complete beginners.",
    duration: "4 weeks",
    level: "Beginner",
    format: "Live + recorded",
    usd: 199,
    naira: 350000,
    badge: "Foundation",
    topics: ["How AI actually works", "Using the best AI tools", "Prompting essentials", "Your first AI workflow"],
    areYou: [
      "Completely new to AI and feel behind the curve",
      "A professional who wants to use AI at work this week",
      "A business owner who needs a plain-English starting point",
    ],
    modules: [
      {
        title: "Module 1 · How AI actually works",
        lessons: ["What AI can and can't do", "Models, tokens and inference explained simply", "AI terminology without the jargon"],
      },
      {
        title: "Module 2 · The essential AI toolkit",
        lessons: ["Top AI tools and when to use each", "Chat-based, voice and image tools", "Building a daily AI workflow"],
      },
      {
        title: "Module 3 · Prompting that works",
        lessons: ["The anatomy of a great prompt", "Context and constraints that get results", "Common prompting mistakes to avoid"],
      },
      {
        title: "Module 4 · Your first AI workflow",
        lessons: ["From idea to working process", "Automating one repetitive task end-to-end", "Staying safe and responsible with AI"],
      },
    ],
    outcomes: [
      { title: "Speak AI fluently", description: "Explain how modern AI works and use the right tool for each job." },
      { title: "Prompt with precision", description: "Write prompts that consistently produce the output you intended." },
      { title: "Ship a real workflow", description: "Automate at least one repetitive task this month using AI." },
    ],
    includes: [
      "4 live sessions with an instructor (recorded)",
      "Hands-on projects you keep",
      "Course certificate on completion",
      "Private community access",
    ],
  },
  {
    slug: "automation-workflow-specialist",
    title: "Automation & Workflow Specialist",
    tagline: "Automate repetitive business tasks with no-code tools, workflows and AI agents.",
    duration: "5 weeks",
    level: "Beginner–Intermediate",
    format: "Live + recorded",
    usd: 299,
    naira: 520000,
    badge: "Specialist",
    topics: ["No-code automation tools", "Business process mapping", "AI customer support bots", "Workflow SOPs"],
    areYou: [
      "An operations or support lead stuck doing the same tasks manually",
      "A freelancer who wants to deliver more with less effort",
      "A founder who wants systems that run while you're not there",
    ],
    modules: [
      {
        title: "Module 1 · Process mapping",
        lessons: ["Documenting workflows that scale", "Finding the bottlenecks worth automating", "Setting measurable before/after targets"],
      },
      {
        title: "Module 2 · No-code automation",
        lessons: ["Zapier, Make and native connectors", "Data sync, notifications and scheduling", "Error handling and monitoring"],
      },
      {
        title: "Module 3 · AI customer support bots",
        lessons: ["Designing a support bot with your knowledge base", "Handing off to humans gracefully", "Measuring deflection and satisfaction"],
      },
      {
        title: "Module 4 · Workflow SOPs & handover",
        lessons: ["Documenting automations for your team", "Governance, security and permissions", "Pricing automation as a service"],
      },
    ],
    outcomes: [
      { title: "Map processes fast", description: "Spot the tasks worth automating in under an hour." },
      { title: "Build reliable automations", description: "Deploy no-code workflows with proper error handling." },
      { title: "Launch an AI support bot", description: "Ship a customer-facing bot trained on your own content." },
    ],
    includes: [
      "5 live sessions with an instructor (recorded)",
      "Automation templates worth hundreds",
      "Course certificate on completion",
      "Private community access",
    ],
  },
  {
    slug: "ai-content-creation-pro",
    title: "AI Content Creation Pro",
    tagline: "Produce studio-grade videos, images and campaign content with AI.",
    duration: "5 weeks",
    level: "Beginner–Intermediate",
    format: "Live + recorded",
    usd: 249,
    naira: 430000,
    badge: "Creative",
    topics: ["AI video generation", "Avatars & talking heads", "AI image creation", "Content repurposing"],
    areYou: [
      "A creator or marketer publishing daily content",
      "A business that wants product videos without a studio",
      "Someone tired of slow, expensive content production",
    ],
    modules: [
      {
        title: "Module 1 · AI video generation",
        lessons: ["Text-to-video and image-to-video tools", "Camera direction with prompt language", "Editing AI footage into a cut"],
      },
      {
        title: "Module 2 · Avatars & talking heads",
        lessons: ["Choosing and training a lifelike avatar", "Scripting for natural delivery", "Localized versions of one video"],
      },
      {
        title: "Module 3 · AI image creation",
        lessons: ["Generating consistent brand imagery", "Iterating from sketch to final asset", "Legal and licensing basics"],
      },
      {
        title: "Module 4 · Repurposing engine",
        lessons: ["Long video → shorts, posts and reels", "Turning transcripts into articles", "A repeatable weekly content pipeline"],
      },
    ],
    outcomes: [
      { title: "Produce studio-grade video", description: "Generate and edit videos that look professionally made." },
      { title: "Build a lifelike avatar", description: "Create your own talking-head avatar for consistent output." },
      { title: "Repurpose everything", description: "Turn one asset into a month of content automatically." },
    ],
    includes: [
      "5 live sessions with an instructor (recorded)",
      "Prompt packs for video, image and voice",
      "Course certificate on completion",
      "Private community access",
    ],
  },
  {
    slug: "prompt-engineering-ai-agents",
    title: "Prompt Engineering & AI Agents",
    tagline: "Master advanced prompting and build autonomous AI agents that do real work.",
    duration: "4 weeks",
    level: "Intermediate",
    format: "Live + recorded",
    usd: 279,
    naira: 490000,
    badge: "Advanced",
    topics: ["Advanced prompt design", "Chain-of-thought patterns", "Building AI agents", "Agent tooling & APIs"],
    areYou: [
      "A developer or power user ready to go beyond basics",
      "A professional automating multi-step work with AI",
      "A builder who wants agents that call tools and APIs",
    ],
    modules: [
      {
        title: "Module 1 · Advanced prompt design",
        lessons: ["System, user and assistant roles", "Few-shot and structured output", "Evaluating and iterating on prompts"],
      },
      {
        title: "Module 2 · Chain-of-thought patterns",
        lessons: ["Reasoning patterns that improve accuracy", "Planning, reflection and self-correction", "When chain-of-thought works (and when not)"],
      },
      {
        title: "Module 3 · Building AI agents",
        lessons: ["Agent architecture and loops", "Tools, function calling and memory", "RAG for grounded responses"],
      },
      {
        title: "Module 4 · Agent tooling & APIs",
        lessons: ["Connecting agents to your data", "Deploying and monitoring agents", "Costs, limits and production safety"],
      },
    ],
    outcomes: [
      { title: "Engineer reliable prompts", description: "Design prompts that meet strict requirements at scale." },
      { title: "Build working agents", description: "Construct autonomous agents with tools and memory." },
      { title: "Ship to production", description: "Deploy an agent that calls your APIs safely." },
    ],
    includes: [
      "4 live sessions with an instructor (recorded)",
      "Agent blueprints you can remix",
      "Course certificate on completion",
      "Private community access",
    ],
  },
  {
    slug: "no-code-app-building",
    title: "No-Code & App Building",
    tagline: "Build and launch functional web apps without writing code.",
    duration: "6 weeks",
    level: "Beginner",
    format: "Live + recorded",
    usd: 299,
    naira: 520000,
    badge: "Builder",
    topics: ["No-code platforms", "Databases & logic", "Launching your first app", "Monetization basics"],
    areYou: [
      "A non-technical founder with an app idea",
      "A professional who wants to build internal tools",
      "Someone who wants to charge for the apps they build",
    ],
    modules: [
      {
        title: "Module 1 · Choosing your stack",
        lessons: ["Bubble, Glide, Flutterflow and more", "Matching the platform to the product", "Setting up your workspace"],
      },
      {
        title: "Module 2 · Databases & logic",
        lessons: ["Designing a data model", "Workflows, conditions and automation", "Users, auth and permissions"],
      },
      {
        title: "Module 3 · Launching your first app",
        lessons: ["Polish, theming and responsive design", "Testing before launch", "Publishing to the web and stores"],
      },
      {
        title: "Module 4 · Monetization basics",
        lessons: ["Pricing your product", "Payments, subscriptions and in-app billing", "Marketing your app in week one"],
      },
    ],
    outcomes: [
      { title: "Build a real web app", description: "Launch a functional product without writing code." },
      { title: "Design with data in mind", description: "Model databases and logic that scale with your product." },
      { title: "Start earning", description: "Add payments and pricing to your first app." },
    ],
    includes: [
      "6 live sessions with an instructor (recorded)",
      "App templates and UI kits",
      "Course certificate on completion",
      "Private community access",
    ],
  },
  {
    slug: "ai-for-business-growth",
    title: "AI for Business Growth",
    tagline: "A practical roadmap to apply AI across marketing, sales, operations and service.",
    duration: "5 weeks",
    level: "All levels",
    format: "Live + recorded",
    usd: 349,
    naira: 610000,
    badge: "Growth",
    featured: true,
    topics: ["AI growth strategy", "Sales & marketing automation", "Customer experience", "ROI measurement"],
    areYou: [
      "A founder or business leader shaping strategy",
      "A marketing or sales lead accountable for results",
      "A team owner who wants AI wins this quarter",
    ],
    modules: [
      {
        title: "Module 1 · AI growth strategy",
        lessons: ["Where AI creates your biggest wins", "Building an AI roadmap for your business", "Choosing what NOT to automate"],
      },
      {
        title: "Module 2 · Sales & marketing automation",
        lessons: ["Lead capture, scoring and nurturing", "Personalized outreach at scale", "Content engines that feed your funnel"],
      },
      {
        title: "Module 3 · Customer experience",
        lessons: ["AI support and self-service", "Proactive engagement with AI", "Keeping the human touch"],
      },
      {
        title: "Module 4 · ROI measurement",
        lessons: ["Metrics that actually matter", "Tracking AI projects properly", "Reporting results to stakeholders"],
      },
    ],
    outcomes: [
      { title: "Build an AI roadmap", description: "Know exactly where AI creates value in your business." },
      { title: "Automate growth systems", description: "Deploy lead capture, scoring and nurture flows." },
      { title: "Measure real ROI", description: "Report the impact of AI with numbers your team trusts." },
    ],
    includes: [
      "5 live sessions with a growth strategist (recorded)",
      "Strategy templates and playbooks",
      "Course certificate on completion",
      "Private community access",
    ],
  },
  {
    slug: "web-development-bootcamp",
    title: "Web Development Bootcamp",
    tagline: "From zero to building modern, production-ready websites that actually ship.",
    duration: "8 weeks",
    level: "Beginner",
    format: "Live + recorded",
    usd: 399,
    naira: 700000,
    badge: "Bootcamp",
    topics: ["HTML, CSS & JavaScript", "React fundamentals", "Responsive design", "Deploying to production"],
    areYou: [
      "A complete beginner ready for a new career",
      "A designer who wants to build what they design",
      "A professional switching into tech",
    ],
    modules: [
      {
        title: "Module 1 · The web foundation",
        lessons: ["HTML structure and semantics", "CSS layout, flexbox and grid", "Building your first pages"],
      },
      {
        title: "Module 2 · JavaScript core",
        lessons: ["Variables, functions and events", "Working with the DOM", "Fetching and using data"],
      },
      {
        title: "Module 3 · React fundamentals",
        lessons: ["Components, props and state", "Hooks and side effects", "Building a project-based app"],
      },
      {
        title: "Module 4 · Responsive design",
        lessons: ["Mobile-first layouts", "Accessibility and performance", "Design systems and theming"],
      },
      {
        title: "Module 5 · Deploying to production",
        lessons: ["Version control with Git", "Build and deploy pipelines", "Domain, hosting and launch"],
      },
    ],
    outcomes: [
      { title: "Build from scratch", description: "Hand-code responsive sites with modern HTML, CSS and JS." },
      { title: "Think in React", description: "Build component-based apps with confidence." },
      { title: "Ship to production", description: "Deploy a real project with Git and a hosting pipeline." },
    ],
    includes: [
      "8 live sessions with an instructor (recorded)",
      "Capstone project with portfolio review",
      "Course certificate on completion",
      "Private community access",
    ],
  },
  {
    slug: "full-stack-software-engineering",
    title: "Full-Stack Software Engineering",
    tagline: "A complete program covering front-end, back-end, APIs and AI integration.",
    duration: "12 weeks",
    level: "Intermediate",
    format: "Live + recorded",
    usd: 599,
    naira: 1050000,
    badge: "Flagship",
    featured: true,
    topics: ["Front-end with React", "Back-end & databases", "REST & GraphQL APIs", "Integrating AI features"],
    areYou: [
      "A junior developer aiming for full-stack",
      "A builder who wants to ship AI-powered products",
      "A career switcher ready to invest deeply",
    ],
    modules: [
      {
        title: "Weeks 1–3 · Front-end with React",
        lessons: ["Advanced React patterns", "State management and data fetching", "Designing for real users"],
      },
      {
        title: "Weeks 4–6 · Back-end & databases",
        lessons: ["Node.js and API design", "Databases, modeling and migrations", "Authentication and security"],
      },
      {
        title: "Weeks 7–9 · REST & GraphQL APIs",
        lessons: ["Building and consuming REST APIs", "GraphQL schemas and resolvers", "Testing and documentation"],
      },
      {
        title: "Weeks 10–12 · Integrating AI features",
        lessons: ["Calling LLM APIs safely", "RAG, embeddings and vector search", "Shipping an AI feature end-to-end"],
      },
    ],
    outcomes: [
      { title: "Ship full-stack apps", description: "Architect and build production-ready applications." },
      { title: "Engineer APIs", description: "Design REST and GraphQL APIs your team will enjoy." },
      { title: "Integrate AI natively", description: "Add LLM features with grounding, memory and guardrails." },
    ],
    includes: [
      "12 live sessions with an instructor (recorded)",
      "2 capstone projects + code reviews",
      "Course certificate on completion",
      "Private community access",
    ],
  },
];

export function getCourseBySlug(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug);
}