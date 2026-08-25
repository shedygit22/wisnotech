import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const CMS_DIR = path.join(ROOT, "content", "cms");

if (!fs.existsSync(CMS_DIR)) fs.mkdirSync(CMS_DIR, { recursive: true });

const pages = {
  masterclass: {
    title: "Masterclass",
    hero: {
      tagline: "Agentic AI + Vibe Coding Masterclass",
      headline: "Stop Watching AI Build the Future. Start Building With It.",
      subheadline: "Learn how to turn your ideas into real software, AI agents, SaaS products, mobile apps and automated systems using the new generation of AI-powered building tools.",
      description: "A practical masterclass that teaches you how to think like a product builder, direct AI effectively, connect intelligent systems, solve problems and ship products into the real world.",
    },
    pricing: {
      earlyBird: 50000,
      latePrice: 100000,
      save: 50000,
      deadlineNote: "Limited early bird registration.",
    },
    tools: [
      { name: "Antigravity", image: "/assets/antigravity.jpg", description: "A versatile AI agent framework for building intelligent systems that reason, plan and execute complex tasks autonomously." },
      { name: "Hermes Agent", image: "/assets/hermes-agent.jpg", description: "A powerful AI assistant platform for creating conversational agents that can search, analyze, generate and interact with external tools." },
      { name: "Open Code", image: "/assets/open-code.jpg", description: "An open-source AI coding assistant that helps you write, debug, and refactor code faster with intelligent suggestions and context-aware completions." },
    ],
    modules: [
      { n: "01", title: "The New Era of AI-Powered Building", desc: "Understand how AI is changing software development and where opportunities are emerging.", bullets: ["The modern AI building ecosystem", "How vibe coding actually works", "Choosing the right AI tools", "Why product thinking beats blind prompting"] },
      { n: "02", title: "Turning Ideas Into Product Blueprints", desc: "Before building anything, you need to know what you're building.", bullets: ["Validate and structure an idea", "Break large ideas into features", "Define users and use cases", "Create a build roadmap"] },
      { n: "03", title: "Vibe Coding: Building With AI", desc: "Learn to use AI coding tools to create real applications — and fix them when they break.", bullets: ["Product prompting & iteration", "Understanding project structure", "Debugging and fixing features", "Scaling a project"] },
      { n: "04", title: "Building SaaS Products", desc: "The architecture behind modern software products.", bullets: ["User accounts & auth", "Dashboards, DB & admin systems", "Payments, APIs & AI features"] },
      { n: "05", title: "Building AI-Powered Applications", desc: "Turn AI capabilities into useful products.", bullets: ["AI chat & assistants", "AI content & analysis tools", "AI generation workflows"] },
      { n: "06", title: "Agentic AI: Building Systems That Can Do Work", desc: "Go beyond chatbots — build agents that execute multi-step work.", bullets: ["Agent architecture & memory", "Tools, actions & decision-making", "Multi-agent orchestration"] },
      { n: "07", title: "AI Automation", desc: "Connect systems and automate workflows.", bullets: ["APIs, webhooks & triggers", "AI-powered business automation", "Data movement & notifications"] },
      { n: "08", title: "Building Mobile Applications With AI", desc: "From idea to functional mobile app with AI-accelerated workflows.", bullets: ["App planning & user flows", "Interface & core features", "Testing & iteration"] },
      { n: "09", title: "APIs, Integrations & Connecting Systems", desc: "How modern products communicate.", bullets: ["AI, database & payments APIs", "External services & webhooks", "Your product ↔ AI ↔ DB ↔ automation"] },
      { n: "10", title: "Debugging, Deployment & Shipping", desc: "Building is only the beginning — ship it.", bullets: ["Debug AI-generated projects", "Test, improve & deploy", "Connect domains & go live — Build it. Fix it. Ship it."] },
    ],
    projects: [
      { n: "01", title: "An AI-Powered SaaS Product", desc: "A functional web application with real product features — auth, dashboard, AI." },
      { n: "02", title: "An Autonomous AI Agent", desc: "A system that handles multi-step tasks, uses tools and delivers results." },
      { n: "03", title: "An AI Automation System", desc: "Connected tools and services that run a workflow automatically." },
      { n: "04", title: "An AI-Powered Mobile Application", desc: "A mobile app idea taken to a functional product." },
      { n: "05", title: "Your Own Product Idea", desc: "Your idea → your blueprint → your product → your launch." },
    ],
    paymentMethods: [
      { label: "For Africa", provider: "Paystack", url: "https://paystack.shop/pay/tv9m8lungl", image: "/assets/paystack-banner.png", currency: "NGN", price: 50000 },
      { label: "International", provider: "Selar", url: "https://selar.com/58h5q98191", image: "/assets/selar-banner.png", currency: "USD", price: 37.14 },
    ],
    faqs: [
      { q: "Do I need to know how to code?", a: "No prior professional programming experience is required. The masterclass is designed to help you understand how to build with modern AI tools. You should be prepared to learn, experiment, troubleshoot and work through technical challenges." },
      { q: "Is this for complete beginners?", a: "Yes. Beginners can join. The training builds from foundational concepts into more advanced product-building, AI agent, automation and deployment workflows." },
      { q: "Will I learn how to build SaaS products?", a: "Yes. The masterclass covers the process and systems involved in building modern AI-powered web products." },
      { q: "Will we build AI agents?", a: "Yes. You will learn the concepts and workflows behind agentic AI systems and how AI agents can perform multi-step tasks." },
      { q: "Will I learn automation?", a: "Yes. You'll explore how APIs, triggers, workflows, AI and external services can be connected to automate useful processes." },
      { q: "What tools will we use?", a: "The AI ecosystem changes quickly. The masterclass focuses on relevant modern tools and, more importantly, the workflows and principles behind using them effectively." },
      { q: "How much is the masterclass?", a: "Early bird is ₦50,000. After early bird closes, it becomes ₦100,000. Joining early saves you ₦50,000." },
      { q: "Will the sessions be recorded?", a: "Yes. You will have access to all sessions." },
      { q: "How long is the masterclass?", a: "1 week intensive." },
      { q: "What happens after I register?", a: "After successful registration, you'll receive onboarding information and instructions for accessing the masterclass." },
    ],
    images: {
      instructor: "/assets/shedrack-akue-640.jpg",
    },
  },

  academy: {
    title: "Academy",
    hero: {
      headline: "Build Real Products With AI.",
      subheadline: "A structured learning program that takes you from idea to deployment — teaching you how to think like a builder, use AI effectively and ship real products.",
    },
    curriculum: [
      { n: "01", title: "The AI Building Landscape", desc: "Understand the new ecosystem.", bullets: ["How modern products are built", "The role of AI in building", "Choosing your path"] },
      { n: "02", title: "Product Thinking", desc: "Before code, think product.", bullets: ["Idea validation", "User needs & use cases", "Feature scoping"] },
      { n: "03", title: "Building With AI", desc: "The core skill.", bullets: ["Product prompting", "Iterating with AI", "Debugging AI output"] },
      { n: "04", title: "Web Applications", desc: "Build real products.", bullets: ["SaaS fundamentals", "Auth, dashboards, APIs", "Deployment"] },
      { n: "05", title: "AI Applications", desc: "Integrate intelligence.", bullets: ["AI chat & assistants", "Content generation", "Analysis tools"] },
      { n: "06", title: "Agentic AI", desc: "Build autonomous systems.", bullets: ["Agent design", "Tool use & memory", "Multi-step workflows"] },
      { n: "07", title: "Automation", desc: "Connect & automate.", bullets: ["APIs & webhooks", "Workflow automation", "Notifications"] },
      { n: "08", title: "Ship & Improve", desc: "Launch and iterate.", bullets: ["Debugging", "Deployment", "Domain & hosting"] },
    ],
    pricing: {
      tiers: [
        { name: "Standard", price: 60000, currency: "NGN", usdPrice: 40, features: ["Full curriculum", "Hands-on projects", "Community access", "Session recordings", "Certificate"] },
        { name: "One-on-One", price: 250000, currency: "NGN", usdPrice: 160, features: ["Everything in Standard", "Personal mentorship", "Custom project guidance", "Weekly 1-on-1 sessions", "Priority support"] },
      ],
    },
    faqs: [],
    images: {},
  },

  training: {
    title: "Training",
    hero: {
      headline: "Advanced AI Building Training.",
      subheadline: "Deep-dive training for people who want to master the art of building with AI — from SaaS products to AI agents and automation systems.",
    },
    curriculum: [],
    pricing: { price: 150000, currency: "NGN", usdPrice: 89 },
    projects: [],
    faqs: [],
    testimonials: [],
    resources: [],
    images: {},
  },

  fae: {
    title: "FAE Bootcamp",
    hero: {
      headline: "Full-Stack AI Engineering Bootcamp.",
      subheadline: "An intensive bootcamp designed to transform beginners into skilled AI engineers who can build, deploy and ship real products.",
    },
    curriculum: [],
    pricing: { price: 300000, currency: "NGN", usdPrice: 195 },
    builds: [],
    faqs: [],
    images: { flyer: "/assets/fae-flyer.jpg" },
  },

  portfolio: {
    title: "Portfolio",
    hero: {
      headline: "Our Work Speaks for Itself.",
      subheadline: "Explore the products, applications and systems we've built — from SaaS dashboards to AI agents and mobile apps.",
    },
    audiences: [],
    services: [],
    pricing: [],
    process: [],
    whyWisnotech: [],
    ecosystem: [],
    faqs: [],
    images: { og: "/assets/portfolio-og.jpg" },
  },

  homepage: {
    title: "Homepage",
    hero: {
      headline: "We Build AI-Powered Products.",
      subheadline: "Wisnotech is an AI agency that builds software, AI agents, SaaS products, mobile apps and automated systems.",
    },
    nav: [
      { label: "Services", href: "#services" },
      { label: "Solutions", href: "#solutions" },
      { label: "Our Work", href: "#work" },
      { label: "About", href: "#about" },
      { label: "Training", href: "/training" },
      { label: "Academy", href: "/academy" },
      { label: "Masterclass", href: "/masterclass" },
      { label: "Contact", href: "#contact" },
    ],
    services: [],
    solutions: [],
    images: {},
  },

  blog: {
    title: "Blog",
    hero: {
      headline: "Insights on AI & Building.",
      subheadline: "Practical articles on AI-powered development, product building, automation and the future of software.",
    },
    images: {},
  },

  legal: {
    title: "Legal",
    privacy: { sections: [] },
    terms: { sections: [] },
  },
};

// Write each page to a JSON file
Object.entries(pages).forEach(([slug, data]) => {
  data._createdAt = new Date().toISOString();
  data._updatedAt = data._createdAt;
  const file = path.join(CMS_DIR, `${slug}.json`);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  console.log(`✓ Created ${slug}.json`);
});

console.log(`\n✓ CMS content initialized in ${CMS_DIR}`);
