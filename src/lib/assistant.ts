export type Stage = "intro" | "need" | "qualify" | "recommend" | "objection" | "close";

/** Distilled client profile, sent to the LLM backend so answers are tailored. */
export interface ClientProfile {
  name?: string;
  role?: string;
  businessType?: string;
  projectType?: string;
  interest?: string;
  timeline?: string;
  budget?: string;
}

export interface AssistState {
  stage: Stage;
  name?: string;
  role?: string;
  businessType?: string;
  projectType?: string;
  interest?: string;
  timeline?: string;
  budget?: string;
  timelineAsked: boolean;
  budgetAsked: boolean;
  offerMade: boolean;
  closeAsked: boolean;
  worryCount: number;
}

export interface Reply {
  text: string;
  href?: string;
}

export interface Turn {
  reply: Reply;
  next: AssistState;
}

const TOPIC_KEYWORDS: { id: string; service: string; answer: string; keywords: string[] }[] = [
  {
    id: "ai-automation",
    service: "AI & Automation",
    answer:
      "AI & Automation removes repetitive work with intelligent workflows, assistants and automated systems — often the fastest win for businesses.",
    keywords: [
      "automation",
      "chatbot",
      "chat bot",
      "assistant",
      "workflow",
      "process",
      "efficiency",
      "repetitive",
      "agents",
      "customer support",
      "auto reply",
      "copilot",
      "customer service",
      "auto respond",
    ],
  },
  {
    id: "ai-video",
    service: "AI Video Content Creation",
    answer:
      "AI Video Content Creation produces studio-grade videos without a studio — scripts, avatars, editing and motion graphics. See examples in the Showreel section.",
    keywords: [
      "video",
      "avatar",
      "showreel",
      "reels",
      "short form",
      "tiktok",
      "content",
      "ads",
      "animation",
      "motion",
      "promo",
      "marketing video",
      "digital human",
    ],
  },
  {
    id: "ai-images",
    service: "AI Visual Creation",
    answer:
      "We generate AI imagery for brands, products and campaigns — unique visuals ready to use, browseable in the AI Creations gallery.",
    keywords: ["image", "images", "pictures", "art", "visuals", "creations", "graphic", "photo", "branding"],
  },
  {
    id: "software",
    service: "Software Development",
    answer:
      "Software Development covers custom web applications, SaaS platforms and business software engineered to scale with you.",
    keywords: ["software", "application", "app build", "platform", "saas", "custom", "web app", "mvp", "api", "dashboard", "system", "internal tool", "product", "build an app"],
  },
  {
    id: "web-mobile",
    service: "Web & Mobile",
    answer:
      "Web & Mobile gets you a modern website or app designed around real users and real results — perfect for getting online.",
    keywords: ["website", "web", "landing page", "mobile app", "ios", "android", "ecommerce", "shop", "store", "online presence", "portfolio site"],
  },
  {
    id: "education",
    service: "AI Education",
    answer:
      "Wisnotech Academy delivers hands-on training in AI, automation, content creation and software.",
    keywords: ["learn", "training", "course", "academy", "teach", "class", "curriculum", "workshop", "education", "upskill", "student", "bootcamp"],
  },
  {
    id: "consulting",
    service: "AI Consulting",
    answer:
      "AI Consulting gives clear, practical guidance on where AI creates real value in your business — a great low-risk first step.",
    keywords: ["consult", "strategy", "roadmap", "advice", "guidance", "where to start", "audit", "get started", "unsure", "confused", "not sure", "recommendation", "advice"],
  },
  {
    id: "pricing",
    service: "Pricing",
    answer:
      "Pricing reflects scope, so we're transparent: it depends on the goal, but the first step to an accurate quote is a quick discovery call — no obligation.",
    keywords: ["price", "pricing", "cost", "how much", "rates", "quote", "estimate", "expensive", "budget", "cheap", "fee", "afford"],
  },
];

/* ---------- Helpers ---------- */

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function pick(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

function detectTopic(text: string): { id: string; service: string; answer: string } | null {
  const q = normalize(text);
  let best: { id: string; service: string; answer: string } | null = null;
  let bestScore = 0;
  for (const t of TOPIC_KEYWORDS) {
    let score = 0;
    for (const kw of t.keywords) {
      const clean = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (q.includes(kw) || new RegExp(`\\b${clean}\\b`).test(q)) score += kw.length > 8 ? 4 : 2;
    }
    if (score > bestScore) {
      bestScore = score;
      best = t;
    }
  }
  return bestScore > 0 ? best : null;
}

function looksLikeEmail(text: string): string | null {
  const m = text.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);
  return m ? m[0] : null;
}

function extractName(text: string): string | null {
  const m = text.match(/(?:my name is|i am|i'm|this is|call me|name is)\s+([A-Za-z]+)/i);
  return m ? m[1].charAt(0).toUpperCase() + m[1].slice(1) : null;
}

function detectTimeline(text: string): string | null {
  const q = normalize(text);
  if (/(asap|now|immediately|urgent|right away|this week|this month)/.test(q)) return "ASAP";
  if (/(two weeks|2 weeks|week\b)/.test(q)) return "within a couple weeks";
  if (/(a month|one month|month\b)/.test(q)) return "within a month";
  if (/(few months|3 months|three months|quarter)/.test(q)) return "within ~3 months";
  if (/(six months|6 months|half a year)/.test(q)) return "within 6 months";
  if (/(this year|end of year|year\b)/.test(q)) return "within a year";
  if (/(exploring|just looking|researching|someday|eventually|no rush|not sure yet|browsing)/.test(q)) return "exploring";
  return null;
}

function detectBudget(text: string): string | null {
  const q = normalize(text);
  if (/(small|tight|limited|tiny|minimal)/.test(q) && /(budget|money|cost)/.test(q)) return "small";
  if (/(flexible|open budget|depends|whatever)/.test(q)) return "flexible";
  if (/(thousand|k\b|\$\s?\d|\€\s?\d|\d{2,}k)/.test(q)) return "clearly-sized";
  if (/(budget|funding|allocated|money)/.test(q)) return "defined";
  // A bare short reply that mentions fine numbers hints at a budget
  const m = q.match(/\b\d{2,6}\b/);
  if (m) return `around ${m[0]}`;
  return null;
}

/* ---------- Business / project type detection ---------- */

const BUSINESS_TYPES: { type: string; label: string; keywords: string[] }[] = [
  {
    type: "food & hospitality",
    label: "Food & hospitality",
    keywords: ["restaurant", "cafe", "coffee", "bar", "hotel", "lodge", "catering", "food", "kitchen", "bakery", "grill", "suya", "buka", "fast food", "guest house"],
  },
  {
    type: "retail & e-commerce",
    label: "Retail & e-commerce",
    keywords: ["shop", "store", "retail", "boutique", "ecommerce", "e-commerce", "online store", "marketplace", "supermarket", "mall", "fashion", "clothing", "sell products", "product", "goods", "supply"],
  },
  {
    type: "beauty & wellness",
    label: "Beauty & wellness",
    keywords: ["salon", "barbershop", "barber", "spa", "beauty", "makeup", "hair", "nails", "massage", "fitness", "gym", "wellness", "esthetics"],
  },
  {
    type: "health & care",
    label: "Health & care",
    keywords: ["clinic", "hospital", "pharmacy", "chemist", "dental", "dentist", "doctor", "medical", "health", "laboratory", "healthcare", "diagnostic"],
  },
  {
    type: "education",
    label: "Education",
    keywords: ["school", "academy", "tutor", "tutoring", "college", "university", "e-learning", "training center", "coaching", "students", "education", "classroom"],
  },
  {
    type: "real estate",
    label: "Real estate",
    keywords: ["real estate", "property", "estate agent", "agent", "rental", "rentals", "landlord", "housing", "apartment", "land", "realtor", "buying and selling houses", "shortlet"],
  },
  {
    type: "logistics & transport",
    label: "Logistics & transport",
    keywords: ["logistics", "shipping", "delivery", "courier", "fleet", "transport", "dispatch", "trucking", "cargo", "rides", "drivers"],
  },
  {
    type: "professional services",
    label: "Professional services",
    keywords: ["law", "legal", "lawyer", "finance", "accounting", "accountant", "tax", "consulting", "consultant", "agency", "marketing agency", "insurance", "bank", "bookkeeping"],
  },
  {
    type: "creator",
    label: "Creator & personal brand",
    keywords: ["creator", "influencer", "youtuber", "you tube", "artist", "musician", "freelancer", "blogger", "personal brand", "podcast", "content creator", "brand myself"],
  },
  {
    type: "community & nonprofit",
    label: "Community & nonprofit",
    keywords: ["church", "ngo", "nonprofit", "non-profit", "charity", "foundation", "community", "ministry", "mosque", "association"],
  },
  {
    type: "travel & tourism",
    label: "Travel & tourism",
    keywords: ["travel", "tourism", "tour", "agency", "trips", "flight", "booking", "vacation", "destination"],
  },
];

const PROJECT_TYPES: { type: string; label: string; keywords: string[] }[] = [
  {
    type: "AI & automation",
    label: "AI & automation",
    keywords: ["chatbot", "chat bot", "automation", "workflow", "ai assistant", "auto reply", "customer support", "customer service", "agents", "auto respond", "lead follow up", "booking bot", "whatsapp bot"],
  },
  {
    type: "AI video",
    label: "AI video content",
    keywords: ["video", "avatar", "reels", "shorts", "tiktok", "youtube videos", "ads", "promo", "showreel", "animation", "digital human", "content"],
  },
  {
    type: "AI imagery",
    label: "AI visual creation",
    keywords: ["image", "images", "art", "visuals", "branding", "logo", "pictures", "graphic design", "album art", "photo"],
  },
  {
    type: "software",
    label: "Software development",
    keywords: ["software", "app", "application", "saas", "platform", "dashboard", "mvp", "api", "system", "internal tool", "custom software", "inventory software", "pos", "management system"],
  },
  {
    type: "website",
    label: "Website & mobile",
    keywords: ["website", "web", "landing page", "online presence", "ecommerce site", "shop online", "portfolio site", "mobile app", "ios", "android", "web app", "online store website"],
  },
  {
    type: "education",
    label: "AI education & training",
    keywords: ["learn", "training", "course", "teach", "class", "upskill", "bootcamp", "study", "certificate", "workshop"],
  },
  {
    type: "consulting",
    label: "AI consulting & strategy",
    keywords: ["consulting", "strategy", "audit", "advice", "roadmap", "where to start", "guidance", "assessment", "advisory"],
  },
];

function matchType<T extends { keywords: string[] }>(entries: T[], text: string): T | null {
  const q = normalize(text);
  let best: T | null = null;
  let bestScore = 0;
  for (const e of entries) {
    let score = 0;
    for (const kw of e.keywords) {
      const clean = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (q.includes(kw) || new RegExp(`\\b${clean}\\b`).test(q)) score += kw.length > 8 ? 3 : 1.5;
    }
    if (score > bestScore) {
      bestScore = score;
      best = e;
    }
  }
  return bestScore > 0 ? best : null;
}

export function detectBusinessType(text: string): string | null {
  return matchType(BUSINESS_TYPES, text)?.type ?? null;
}

export function detectProjectType(text: string): string | null {
  return matchType(PROJECT_TYPES, text)?.type ?? null;
}

export function detectRole(text: string): string | null {
  const q = normalize(text);
  if (/(business owner|business person|entrepreneur|founder|i own|i run|company|startup|brand|store|shop|restaurant|salon|clinic|school)/.test(q)) {
    return "business";
  }
  if (/(creator|influencer|youtuber|artist|freelancer|musician|designer|for myself|personal|content creator)/.test(q)) {
    return "creator";
  }
  if (/(student|learner|learning|upskill|i want to learn|training|study)/.test(q)) {
    return "learner";
  }
  return null;
}

/** Build the client profile sent to the LLM backend from captured state. */
export function buildClientProfile(state: AssistState): ClientProfile {
  const profile: ClientProfile = {};
  if (state.name) profile.name = state.name;
  if (state.role) profile.role = state.role;
  if (state.businessType) profile.businessType = state.businessType;
  if (state.projectType) profile.projectType = state.projectType;
  if (state.interest) profile.interest = state.interest;
  if (state.timeline) profile.timeline = state.timeline;
  if (state.budget) profile.budget = state.budget;
  return profile;
}

/* ---------- Proactive / user-sensing ---------- */

export function contextMessage(section: string | null): string | null {
  if (!section) return null;
  const s = section.toLowerCase();
  if (s.includes("services") || s.includes("solutions")) {
    return "I see you're in the services section — need help picking which is the right fit as a first move?";
  }
  if (s.includes("showreel") || s.includes("creations")) {
    return "Loving the AI-work previews? I can tell you exactly how we'd approach a project like that for you.";
  }
  if (s.includes("academy")) {
    return "Thinking about learning AI hands-on? I can recommend whether the Academy or a consulting call fits best.";
  }
  if (s.includes("contact")) {
    return "I see you're looking at the contact section — I can line you up with the right person directly.";
  }
  return null;
}

export function openingLine(state: AssistState): string {
  const name = state.name ? `, ${state.name}` : "";
  return pick([
    `Hi${name}! I'm the Wisnotech AI advisor. Are you a business, a creator, or learning — and what are you hoping to achieve?`,
    `Hello${name}! Think of me as your guide through Wisnotech — a couple of questions and I'll point you to the right first step. What's your main goal?`,
    `Good to see you${name}! Tell me what you're working on and I'll map the fastest path to it.`,
  ]);
}

export function exitIntentMessage(name?: string): string {
  return name
    ? `Before you go, ${name} — I'd hate for you to leave without a plan. One sentence about your goal and I'll hand you your next step.`
    : "Before you go — one sentence about your goal and I'll hand you a clear next step. Promise it's quick!";
}

export function createInitialState(): AssistState {
  return {
    stage: "intro",
    timelineAsked: false,
    budgetAsked: false,
    offerMade: false,
    closeAsked: false,
    worryCount: 0,
  };
}

/* ---------- Core sales responder ---------- */

const GREETING_QS = ["hi", "hello", "hey", "good morning", "good afternoon", "good evening", "yo", "howdy"];
const BYE_QS = ["bye", "goodbye", "see you", "that's all", "no thanks", "i'm good"];
const YES_QS = ["yes", "yeah", "sure", "ok", "okay", "do it", "let's go", "absolutely", "yep", "right", "great", "affirm"];

export function ask(input: string, state: AssistState): Turn {
  const q = normalize(input);
  const next: AssistState = { ...state };
  const email = looksLikeEmail(q);
  const name = extractName(input);
  if (name) next.name = name;

  const topic = detectTopic(q);
  const timeline = detectTimeline(q);
  const budget = detectBudget(q);
  const businessType = detectBusinessType(q);
  const projectType = detectProjectType(q);
  const role = detectRole(q);
  if (businessType) next.businessType = businessType;
  if (projectType) next.projectType = projectType;
  if (role && !next.role) next.role = role;

  /* 0. Capture email → lead captured */
  if (email) {
    next.closeAsked = true;
    next.stage = "close";
    return {
      reply: {
        text: `Perfect — got it. We'll reach out to ${email} with a tailored plan. Anything else I can clarify meanwhile?`,
      },
      next,
    };
  }

  /* 1. Farewell */
  if (BYE_QS.some((b) => q === b || q.startsWith(b))) {
    next.stage = "intro";
    return {
      reply: {
        text: `No problem${next.name ? ", " + next.name : ""}! Reopen this chat anytime and I'll pick up where we left off. 🎯`,
      },
      next,
    };
  }

  /* 2. Thanks */
  if (/thank|thanks|appreciate/.test(q) && q.length < 25) {
    next.stage = "need";
    return {
      reply: {
        text: pick([
          "Anytime! Want me to point you to the right first step, or do you have a specific goal in mind?",
          "Glad it helped. Tell me what you're aiming at and I'll finalize your plan.",
        ]),
      },
      next,
    };
  }

  /* 3. Greeting */
  if (GREETING_QS.some((g) => q === g || q.startsWith(g)) && q.length < 30) {
    next.stage = "need";
    return {
      reply: {
        text: pick([
          `Great to meet you${next.name ? ", " + next.name : ""}! I'll help you choose the smartest first move with Wisnotech. Quick one — are you a business owner, a creator, or learning?`,
          `Hey${next.name ? " " + next.name : ""}! Let's be productive. Is this for improving your business, building something new, or boosting your own skills?`,
        ]),
      },
      next,
    };
  }

  /* 4. State machine */
  switch (next.stage) {
    case "intro": {
      if (topic) {
        next.stage = "qualify";
        next.interest = topic.service;
        return topic.id === "pricing" ? pricingReply(next) : qualifyQuestion(topic, next);
      }
      next.stage = "need";
      return tdlIntro(next);
    }

    case "need": {
      if (topic) {
        next.stage = "qualify";
        next.interest = topic.service;
        return topic.id === "pricing" ? pricingReply(next) : qualifyQuestion(topic, next);
      }
      if (/(business|company|brand|team|startup|campaign|client|sales|revenue)/.test(q)) {
        next.stage = "qualify";
        next.interest = "Business transformation";
        return {
          reply: {
            text: "Business focus — excellent. The strongest play for most companies is a short AI audit that spots your first automation win. Timing: ASAP, within a quarter, or just exploring?",
          },
          next,
        };
      }
      if (/(creator|influencer|youtuber|artist|freelancer|designer|personal|content|video)/.test(q)) {
        next.stage = "qualify";
        next.interest = "AI Content Creation";
        return {
          reply: {
            text: "Creator or personal project — perfect for our AI content kits. Roughly when do you want this live?",
          },
          next,
        };
      }
      return {
        reply: {
          text: "Let's zero in: is this mostly business or personal? And what's the #1 thing that's dragging — data, content, or busywork?",
        },
        next,
      };
    }

    case "qualify": {
      if (timeline && !next.timelineAsked) {
        next.timeline = timeline;
        next.timelineAsked = true;
        if (!next.budgetAsked) {
          next.budgetAsked = true;
          return {
            reply: {
              text: `Noted — ${timeline}. Before we lock the plan: roughly what budget do you have in mind (small, flexible, or a ballpark)?`,
            },
            next,
          };
        }
      }
      if (budget && !next.budgetAsked) {
        next.budget = budget;
        next.budgetAsked = true;
        return recommendReply(next);
      }
      if (!next.timelineAsked) {
        next.timelineAsked = true;
        return {
          reply: {
            text: "One setup question — how soon do you ideally want this going? ASAP, within a quarter, or just exploring?",
          },
          next,
        };
      }
      next.budget = detectBudget(q) ?? next.budget ?? "defined";
      next.budgetAsked = true;
      return recommendReply(next);
    }

    case "recommend": {
      if (/(price|cost|budget|afford|how much|expensive|quote)/.test(q)) {
        next.worryCount++;
        next.stage = "objection";
        return {
          reply: {
            text: "Pricing scales with scope — precisely why we start with a short discovery call and give a firm quote once we know the goal. Want me to sketch what a focused pilot vs a full build looks like?",
          },
          next,
        };
      }
      if (/(timeline|how long|time|when|duration)/.test(q)) {
        return {
          reply: {
            text: "A focused pilot starts after a short discovery call (often 1–2 weeks in), and a full build runs a few months with clear milestones. Pilot first, or full-speed?",
          },
          next,
        };
      }
      return closeAttempt(next);
    }

    case "objection": {
      next.worryCount++;
      if (/(expensive|too much|cost|budget|money|afford)/.test(q)) {
        return {
          reply: {
            text: "Totally fair. That's why we never cold-commit you — we start small, prove value, then scale. Want me to sketch a low-commitment first step?",
          },
          next,
        };
      }
      if (next.worryCount > 1) {
        return {
          reply: {
            text: "No pressure at all. Whenever you're ready, open this chat again and I'll line up a free intro conversation.",
          },
          next,
        };
      }
      next.stage = "need";
      return {
        reply: {
          text: "Let's park the specifics then. What's the one outcome that would be a genuine win for you? That frames the smallest worthwhile first step.",
        },
        next,
      };
    }

    case "close": {
      if (YES_QS.some((y) => q === y || q.startsWith(y))) {
        next.closeAsked = true;
        return {
          reply: {
            text: `Perfect — your next step is the contact section: tap "Start a Conversation" and mention ${next.name ?? "the AI assistant"}. Or drop your email right here and I'll record it.`,
            href: "#contact",
          },
          next,
        };
      }
      return closeAttempt(next);
    }

    default:
      return tdlIntro(next);
  }
}

/* ---------- Sub-replies ---------- */

function qualifyQuestion(topic: { service: string; answer: string }, state: AssistState): Turn {
  return {
    reply: {
      text: `Great pick — ${topic.service}. ${topic.answer}\n\nAnd the timing? ASAP, within 3 months, or still exploring?`,
    },
    next: state,
  };
}

function pricingReply(state: AssistState): Turn {
  state.stage = "close";
  state.offerMade = true;
  return {
    reply: {
      text: "Pricing reflects scope, so we stay transparent: a short discovery call pins an accurate quote with zero obligation. Want me to line up that intro?",
      href: "#contact",
    },
    next: state,
  };
}

function recommendReply(state: AssistState): Turn {
  state.stage = "recommend";
  state.offerMade = true;
  const focus = state.interest ?? "a focused AI pilot";
  const budgetMacro = state.budget === "small" ? "tight" : state.budget ?? "flexible";
  const who = state.businessType ? `for your ${state.businessType} business` : "";
  const what = state.projectType ? `built around ${state.projectType}` : "";
  const tailored = state.businessType || state.projectType;
  const opening = tailored
    ? `Here's the line for you${who ? `, ${who}` : ""}${what ? ` ${what}` : ""}: start with a ${focus} package — a focused pilot with a clear, measurable deliverable in the first month, then expand smartly.`
    : `Here's the line. For a ${budgetMacro} budget on ${state.timeline ?? "your timeline"}, start with a ${focus} package — a focused pilot with a clear, measurable deliverable in the first month, then expand smartly.`;
  return {
    reply: {
      text: `${opening}\n\nWant me to sketch the scope of that pilot?`,
    },
    next: state,
  };
}

function closeAttempt(state: AssistState): Turn {
  state.stage = "close";
  state.offerMade = true;
  return {
    reply: {
      text: `We're aligned. Whether you go project-first or consulting, the fastest route is a free 15-minute intro with the right person (${state.name ? state.name + ", " : ""}no pressure). Shall I line that up?`,
      href: "#contact",
    },
    next: state,
  };
}

function tdlIntro(state: AssistState): Turn {
  state.stage = "need";
  return {
    reply: {
      text: "Happy to help you find your path. In a few words — what are you trying to achieve? Automate admin, build an app, get AI-generated videos, or learn AI skills?",
    },
    next: state,
  };
}

/* ---------- Quick chips ---------- */

export function quickReplies(stage: Stage): string[] {
  switch (stage) {
    case "intro":
      return ["Business project", "I'm a creator", "Help me where to start", "What do you do?"];
    case "need":
      return ["AI & automation", "AI videos", "Build an app", "A website", "Just exploring"];
    case "qualify":
      return ["ASAP", "Within 3 months", "Just exploring", "Flexible budget"];
    case "objection":
      return ["Price is a concern", "I'm still comparing", "Let's do a consultation"];
    case "recommend":
      return ["What's the timeline?", "What does it cost?", "Let's go"];
    case "close":
      return ["Let's connect", "Tell me pricing", "Book a call"];
    default:
      return ["Start"];
  }
}

export function VIDEOS_SPIEL(): string {
  return "You can watch the videos in the Showreel and the generated visuals in the AI Creations gallery below it.";
}