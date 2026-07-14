// Centralized dummy data for the Phase 1 frontend prototype.
// Replace with real API responses once the backend is connected.

export const navItems = [
  { label: "Dashboard", path: "/", icon: "grid" },
  { label: "Prompt Builder", path: "/builder", icon: "hammer" },
  { label: "Prompt Library", path: "/library", icon: "book" },
  { label: "Playground", path: "/playground", icon: "flask" },
  { label: "Prompt Optimizer", path: "/optimizer", icon: "sparkle" },
  { label: "Prompt Evaluator", path: "/evaluator", icon: "gauge" },
  { label: "Multi-model Comparison", path: "/comparison", icon: "columns" },
  { label: "Version History", path: "/versions", icon: "clock" },
  { label: "Analytics", path: "/analytics", icon: "chart" },
  { label: "Export / Import", path: "/export-import", icon: "swap" },
  { label: "Settings", path: "/settings", icon: "settings" },
];

export const currentUser = {
  name: "Asha Rao",
  role: "Lead Prompt Engineer",
  org: "Nimbus Analytics",
  avatarInitials: "AR",
};

export const statCards = [
  { label: "Prompts Created", value: "1,284", delta: "+12.4%", trend: "up" },
  { label: "Avg. Quality Score", value: "87.3", delta: "+3.1%", trend: "up" },
  { label: "Tokens Saved", value: "482K", delta: "+18.9%", trend: "up" },
  { label: "Active Projects", value: "16", delta: "-2.0%", trend: "down" },
];

export const recentPrompts = [
  { id: "p1", title: "Customer Churn Diagnosis Agent", category: "Analytics", score: 92, updated: "2h ago" },
  { id: "p2", title: "Onboarding Email Sequence Writer", category: "Marketing", score: 78, updated: "5h ago" },
  { id: "p3", title: "SQL Query Explainer", category: "Engineering", score: 95, updated: "1d ago" },
  { id: "p4", title: "Legal Clause Simplifier", category: "Legal", score: 64, updated: "2d ago" },
  { id: "p5", title: "Support Ticket Triage", category: "Support", score: 88, updated: "3d ago" },
];

export const recentActivity = [
  { id: "a1", actor: "Asha Rao", action: "optimized", target: "Customer Churn Diagnosis Agent", time: "10 min ago" },
  { id: "a2", actor: "Devon Cole", action: "created", target: "Refund Policy Assistant", time: "48 min ago" },
  { id: "a3", actor: "System", action: "flagged low clarity in", target: "Legal Clause Simplifier", time: "2h ago" },
  { id: "a4", actor: "Priya Nair", action: "compared 3 models on", target: "SQL Query Explainer", time: "4h ago" },
  { id: "a5", actor: "Asha Rao", action: "restored version 4 of", target: "Onboarding Email Sequence Writer", time: "6h ago" },
];

export const usageSeries = [
  { day: "Mon", prompts: 42, tokens: 12400 },
  { day: "Tue", prompts: 58, tokens: 15800 },
  { day: "Wed", prompts: 51, tokens: 14100 },
  { day: "Thu", prompts: 67, tokens: 19200 },
  { day: "Fri", prompts: 74, tokens: 21300 },
  { day: "Sat", prompts: 39, tokens: 9800 },
  { day: "Sun", prompts: 33, tokens: 8700 },
];

export const scoreDistribution = [
  { name: "Excellent (90-100)", value: 34, color: "#34d399" },
  { name: "Good (75-89)", value: 41, color: "#22d3ee" },
  { name: "Fair (60-74)", value: 18, color: "#f5a623" },
  { name: "Needs Work (<60)", value: 7, color: "#fb7185" },
];

export const categoryBreakdown = [
  { name: "Engineering", value: 28 },
  { name: "Marketing", value: 21 },
  { name: "Support", value: 17 },
  { name: "Analytics", value: 24 },
  { name: "Legal", value: 10 },
];

export const promptLibrary = [
  { id: "l1", title: "Customer Churn Diagnosis Agent", category: "Analytics", tags: ["retention", "sql", "diagnosis"], score: 92, favorite: true, updated: "2h ago", author: "Asha Rao" },
  { id: "l2", title: "Onboarding Email Sequence Writer", category: "Marketing", tags: ["email", "lifecycle"], score: 78, favorite: false, updated: "5h ago", author: "Devon Cole" },
  { id: "l3", title: "SQL Query Explainer", category: "Engineering", tags: ["sql", "docs"], score: 95, favorite: true, updated: "1d ago", author: "Priya Nair" },
  { id: "l5", title: "Support Ticket Triage", category: "Support", tags: ["routing", "priority"], score: 88, favorite: true, updated: "3d ago", author: "Devon Cole" },
];

export const categories = ["All", "Analytics", "Marketing", "Engineering", "Legal", "Support"];

export const aiModels = [
  {
    id: "gemini",
    name: "Gemini 2.5 Pro",
    provider: "Google",
  },
];

export const playgroundHistory = [
  {
    id: "h1",
    prompt: "Customer Churn Diagnosis Agent",
    model: "Google Gemini",
    time: "10 min ago",
  },
  {
    id: "h2",
    prompt: "SQL Query Explainer",
    model: "Google Gemini",
    time: "1 hour ago",
  },
  {
    id: "h3",
    prompt: "Support Ticket Triage",
    model: "Google Gemini",
    time: "3 hours ago",
  },
];

export const dummyOutput = `Here's the structured diagnosis for the churn signal you provided:

1. Primary driver: pricing sensitivity in the SMB segment (42% of flagged accounts)
2. Secondary driver: onboarding drop-off before day 7 (31%)
3. Recommended action: trigger a save-offer workflow for accounts scoring above 0.7 churn-risk

Confidence: high (based on 1,204 historical account trajectories)`;

export const optimizerExample = {
  original:
    "Write something about our product for customers who are thinking about leaving.",
  optimized:
    "Act as a retention specialist. Given a customer's account history and stated reason for cancellation, write a concise, empathetic email (120-160 words) that acknowledges their concern, offers one relevant retention incentive, and includes a single clear call to action. Avoid generic apologies and avoid discounts above 20%.",
  summary: [
    "Added a clear role to anchor tone and expertise",
    "Defined explicit output length and format constraints",
    "Replaced vague intent with a measurable goal",
    "Added a boundary condition to prevent over-discounting",
  ],
  scoreBefore: 41,
  scoreAfter: 89,
};

export const evaluatorScores = {
  overall: 87,
  metrics: [
    { label: "Clarity", value: 92 },
    { label: "Specificity", value: 84 },
    { label: "Context", value: 79 },
    { label: "Constraints", value: 88 },
    { label: "Completeness", value: 91 },
  ],
  suggestions: [
    "Specify the desired tone (e.g. formal, conversational) explicitly.",
    "Add an example of an ideal response to anchor the output format.",
    "Clarify what should happen when required input data is missing.",
  ],
};

export const comparisonRows = [
  {
    id: "c1",
    model: "GPT-5",
    response: "Structured 3-step diagnosis with confidence interval and a suggested workflow trigger.",
    latency: "1.8s",
    score: 91,
    winner: false,
  },
  {
    id: "c2",
    model: "Claude Sonnet 5",
    response: "Same structure, adds a caveat about data recency and one alternative hypothesis.",
    latency: "2.1s",
    score: 95,
    winner: true,
  },
  {
    id: "c3",
    model: "Gemini 2.5 Pro",
    response: "Shorter answer, omits confidence scoring, faster response time.",
    latency: "1.2s",
    score: 82,
    winner: false,
  },
];

export const versionHistory = [
  { id: "v5", version: "v5", label: "Current", author: "Asha Rao", time: "10 min ago", note: "Tightened output format to bullet list, added confidence scoring." },
  { id: "v4", version: "v4", label: "Restored 6h ago", author: "Asha Rao", time: "1d ago", note: "Added explicit role and constraints section." },
  { id: "v3", version: "v3", label: "", author: "Devon Cole", time: "3d ago", note: "Rewrote task description for clarity." },
  { id: "v2", version: "v2", label: "", author: "Priya Nair", time: "6d ago", note: "Added two-shot examples." },
  { id: "v1", version: "v1", label: "Initial", author: "Asha Rao", time: "9d ago", note: "First draft imported from notes." },
];

export const analyticsSeries = {
  dailyUsage: usageSeries,
  successRate: [
    { day: "Mon", rate: 88 },
    { day: "Tue", rate: 91 },
    { day: "Wed", rate: 87 },
    { day: "Thu", rate: 93 },
    { day: "Fri", rate: 95 },
    { day: "Sat", rate: 90 },
    { day: "Sun", rate: 92 },
  ],
  responseTime: [
    { model: "GPT-5", ms: 1800 },
    { model: "Claude Sonnet 5", ms: 2100 },
    { model: "Gemini 2.5 Pro", ms: 1200 },
    { model: "Llama 4", ms: 2600 },
  ],
  categories: categoryBreakdown,
  avgScoreTrend: [
    { week: "W1", score: 74 },
    { week: "W2", score: 79 },
    { week: "W3", score: 81 },
    { week: "W4", score: 87 },
  ],
};

export const notifications = [
  { id: "n1", title: "Prompt quality dropped", detail: "Legal Clause Simplifier fell below 70.", time: "12 min ago", unread: true },
  { id: "n2", title: "Comparison finished", detail: "3-model comparison for SQL Query Explainer is ready.", time: "1h ago", unread: true },
  { id: "n3", title: "Version restored", detail: "Devon restored v3 of Onboarding Email Sequence Writer.", time: "6h ago", unread: false },
];
