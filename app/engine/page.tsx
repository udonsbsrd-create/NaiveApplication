"use client";

import { Download, Eye, Loader2, RefreshCw, Search, Sparkles, X, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type FitTier = "PRIMARY" | "SECONDARY" | "SKIP";
type AIScore = { score: number; primitive: string; reason: string };

type QueryRow = {
  id: number;
  text: string;
  source: string;
  url: string;
  raw_score: number;
  category: string;
  competition_score: number;
  competition: "low" | "medium" | "high";
  opportunity_score: number;
  naive_has_content: boolean;
  fit_tier: FitTier;
  fit_reason: string;
  builder_signal: number;
  bottleneck_signal: number;
  stage_fit: number;
  created_at: string;
};

type Stats = {
  total: number;
  gaps: number;
  high_opportunity_count: number;
  total_volume: number;
  sources: number;
};

type IntentMode = "tight" | "balanced" | "wide";

type ScrapeConfig = {
  intent_mode: IntentMode;
  user_overrides: boolean;
  sources: string[];
  source_floors: Record<string, number>;
  post_types: string[];
  recency_days: number;
  categories: string[];
  max_results: number;
  clear_existing: boolean;
};

const API_BASE = "/api/engine";
const CATEGORIES = ["formation", "banking", "identity", "kyc", "infrastructure", "deployment", "mcp-discovery", "aeo"];
const FILTER_CATEGORIES = ["all", "formation", "banking", "identity", "kyc", "infrastructure", "deployment", "mcp-discovery", "aeo"];
const TIGHT_SOURCES = [
  "r/entrepreneur", "r/startups", "r/smallbusiness", "r/legaladvice",
  "r/SaaS", "r/AIAgents", "Hacker News", "Stack Overflow",
];
const BALANCED_SOURCES = [
  "r/entrepreneur", "r/startups", "r/smallbusiness", "r/legaladvice",
  "r/SaaS", "r/AIAgents", "r/LangChain", "r/ClaudeAI", "r/indiehackers",
  "r/SideProject", "r/ChatGPT", "r/microsaas", "r/fintech",
  "r/webdev", "r/LocalLLaMA", "r/digitalnomad", "Hacker News", "Stack Overflow",
];
const WIDE_SOURCES = [
  "r/AIAgents", "r/LangChain", "r/ClaudeAI", "r/ChatGPT", "r/OpenAI",
  "r/LocalLLaMA", "r/AutoGPT", "r/PromptEngineering", "r/ArtificialIntelligence", "r/GPT4",
  "r/CrewAI", "r/indiehackers", "r/SideProject", "r/microsaas", "r/SaaS",
  "r/startups", "r/EntrepreneurRideAlong", "r/entrepreneur", "r/smallbusiness", "r/growmybusiness",
  "r/webdev", "r/ExperiencedDevs", "r/Python", "r/softwareengineering", "r/devops",
  "r/aws", "r/legaladvice", "r/digitalnomad", "r/personalfinance", "r/tax",
  "r/fintech", "r/stripe", "r/nocode", "r/n8n", "r/automation",
  "r/Zapier", "r/Business", "Hacker News", "Stack Overflow",
];
const SOURCE_LIST = [...new Set([...WIDE_SOURCES])];
const SOURCE_COLORS: Record<string, string> = {
  "r/entrepreneur": "#ffe66d", "r/startups": "#a8e6cf", "r/smallbusiness": "#f97316",
  "r/legaladvice": "#a78bfa", "r/indiehackers": "#38bdf8", "r/SaaS": "#4ecdc4",
  "r/AIAgents": "#ff6b6b", "r/LangChain": "#10b981", "r/ClaudeAI": "#f59e0b",
  "r/AutoGPT": "#e879f9", "r/SideProject": "#fb923c", "r/LocalLLaMA": "#34d399",
  "r/digitalnomad": "#6366f1", "Hacker News": "#ff9f43", "Stack Overflow": "#4a9eff",
  "r/ChatGPT": "#74c0fc", "r/OpenAI": "#a9e34b", "r/PromptEngineering": "#ffa94d",
  "r/ArtificialIntelligence": "#da77f2", "r/GPT4": "#63e6be", "r/CrewAI": "#ff8787",
  "r/microsaas": "#66d9e8", "r/EntrepreneurRideAlong": "#ffd43b", "r/growmybusiness": "#8ce99a",
  "r/webdev": "#4dabf7", "r/ExperiencedDevs": "#cc5de8", "r/Python": "#339af0",
  "r/softwareengineering": "#20c997", "r/devops": "#f783ac", "r/aws": "#fd7e14",
  "r/personalfinance": "#94d82d", "r/tax": "#e64980", "r/fintech": "#1c7ed6",
  "r/stripe": "#7950f2", "r/nocode": "#f76707", "r/n8n": "#2f9e44",
  "r/automation": "#e67700", "r/Zapier": "#f03e3e", "r/Business": "#868e96",
};
const CAT_COLORS: Record<string, { bg: string; text: string }> = {
  formation: { bg: "#0f2a1a", text: "#3ecf78" },
  banking: { bg: "#081828", text: "#4a9eff" },
  identity: { bg: "#1a1228", text: "#a78bfa" },
  kyc: { bg: "#2a1e08", text: "#e8a23a" },
  infrastructure: { bg: "#0a1a2a", text: "#38bdf8" },
  deployment: { bg: "#2a1008", text: "#f97316" },
  "mcp-discovery": { bg: "#1a1228", text: "#a78bfa" },
  "aeo": { bg: "#0a2218", text: "#34d399" },
};

const PRESETS: Record<IntentMode, { label: string; best: string; config: Partial<ScrapeConfig> }> = {
  tight: {
    label: "Quick",
    best: "fast check",
    config: {
      sources: TIGHT_SOURCES,
      recency_days: 90,
      max_results: 15,
      post_types: ["questions", "help", "ask_hn"],
      source_floors: { "r/entrepreneur": 8, "r/startups": 8, "r/smallbusiness": 5, "r/legaladvice": 4, "r/SaaS": 5, "r/AIAgents": 6, "Hacker News": 8, "Stack Overflow": 2 },
    },
  },
  balanced: {
    label: "Standard",
    best: "weekly run",
    config: {
      sources: BALANCED_SOURCES,
      recency_days: 180,
      max_results: 60,
      post_types: ["questions", "help", "discussion", "ask_hn"],
      source_floors: { "r/entrepreneur": 5, "r/startups": 5, "r/smallbusiness": 4, "r/legaladvice": 3, "r/indiehackers": 4, "r/SaaS": 4, "r/AIAgents": 5, "r/LangChain": 4, "r/ClaudeAI": 4, "r/ChatGPT": 3, "r/microsaas": 3, "r/fintech": 3, "r/webdev": 3, "r/LocalLLaMA": 3, "r/SideProject": 3, "r/digitalnomad": 2, "Hacker News": 5, "Stack Overflow": 1 },
    },
  },
  wide: {
    label: "Deep",
    best: "max coverage",
    config: {
      sources: WIDE_SOURCES,
      recency_days: 365,
      max_results: 200,
      post_types: ["questions", "help", "discussion"],
      source_floors: Object.fromEntries(WIDE_SOURCES.map(s => [s, s === "Stack Overflow" ? 0 : 2])),
    },
  },
};

type RowGenState = {
  loading: boolean;
  markdown?: string;
  filename?: string;
  error?: string;
};

type BriefPreview = {
  query: string;
  filename: string;
  markdown: string;
};

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

function querySlug(text: string): string {
  const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
  return slug || "naive-page";
}

function stripMarkdownFences(content: string): string {
  const fenced = content.match(/^```(?:markdown|md)?\s*([\s\S]*?)```$/i);
  if (fenced) return fenced[1].trim();
  return content.replace(/^```(?:markdown|md)?\s*/i, "").replace(/```$/i, "").trim();
}

function stripLeadingH1(markdown: string): string {
  return markdown.replace(/^#\s+.+?\n+/m, "").trim();
}

const GUARDRAILS = `
GUARDRAILS (naive-context.md):
- Naïve is NOT a bank. Do not claim it replaces Mercury, Relay, Brex, or Airwallex for full business banking.
- Only mention primitives that exist: /formation, /kyc, /cards, /email, /browser, /social, /research, GEO, orchestration.
- Pricing: formation $249/filing; cards $0/mo + interchange; pay-as-you-go compute — do not invent other prices or guarantees.
- Do not duplicate existing "Introducing /formation" style posts.
`;

const ICP_PRIMITIVE_MAP: Record<string, string> = {
  formation: "/formation + /kyc (Footprint) — non-US founders, EIN, Doola filing",
  banking: "/cards (Stripe Issuing virtual cards) — pair with Mercury/Airwallex for full banking, not replace them",
  kyc: "/kyc + /verification — Footprint-hosted flows",
  identity: "/email + /domain — business identity for agents/companies",
  infrastructure: "Orchestration + /browser + /credentials — only if autonomous company ops",
  deployment: "AI employees + orchestration primitives",
  "mcp-discovery": "/research + tool discovery only when tied to business ops",
  "aeo": "/aeo/llm-responses + /aeo/llm-mentions + /aeo/ai-keywords — AEO for developers tracking brand in AI search",
};

function buildMarkdownPrompt(query: string, category: string, fitTier: FitTier): string {
  if (fitTier === "SECONDARY") {
    return `Write a SHORT GEO content brief in Markdown. Naïve (usenaive.ai) is ONLY an adjacent tool at the end — NOT the main answer.

THREAD QUESTION (H1 will be added verbatim):
"${query}"

${GUARDRAILS}

Return ONLY body sections (no # title). ~80% of content must answer the thread question using real alternatives (Mercury, Relay, Doola, Atlas, etc.). Naïve appears ONLY in the last section.

## Direct answer
Answer the question fully without leading with Naïve.

## Comparison or how-to
The useful content: real steps, tradeoffs, provider names.

## If you also need X
One short section — mention a specific Naïve primitive ONLY if genuinely adjacent (usually /cards for virtual cards, or /formation if formation came up). No CTA unless clearly relevant.`;
  }

  return `Write a FULL GEO/SEO content brief in Markdown for Naïve (usenaive.ai) — autonomous company runtime.

THREAD QUESTION (H1 will be added verbatim):
"${query}"

Category: ${category}
ICP mapping: ${ICP_PRIMITIVE_MAP[category] ?? "Match pain to /formation, /kyc, /cards, /email, GEO"}

${GUARDRAILS}

Return ONLY body sections (no # title). No code fences.

## Direct answer
2-3 sentences answering the question plainly.

## Step by step
What the user actually needs to do.

## Where Naïve fits
Which specific primitive solves this (from ICP mapping). Be concrete.

## Comparison table
Naïve vs alternatives if relevant (honest; Naïve is API-first agent runtime, not a bank).

## FAQ
3-5 questions people ask around this topic.

## CTA
One line pointing to https://usenaive.ai`;
}

function assembleMarkdown(query: string, category: string, body: string): string {
  const sections = stripLeadingH1(stripMarkdownFences(body));
  return `# ${query}

**Category:** ${category} · **Site:** [usenaive.ai](https://usenaive.ai)

${sections}
`;
}

const SPRINT_ASSET_MAP: Record<string, string> = {
  formation: "blog post or comparison page",
  banking: "blog post — position /cards as virtual card layer",
  kyc: "docs page or explainer",
  identity: "docs page",
  infrastructure: "landing page or developer guide",
  deployment: "landing page or case study",
  "mcp-discovery": "docs page or integration guide",
  aeo: "blog post — AEO/GEO explainer for developers",
  social: "docs page or integration guide",
  seo: "blog post or comparison page",
  general: "review manually — confirm Naïve fit before creating content",
};

const SPRINT_PRIMITIVE_MAP: Record<string, string> = {
  formation: "`/formation` + `/kyc` — LLC filing via Doola, Footprint KYC, EIN without SSN",
  banking: "`/cards` — Stripe Issuing virtual cards, per-agent spend limits",
  kyc: "`/kyc` + `/verification` — Footprint-hosted KYC flows",
  identity: "`/email` + `/domain` — business inboxes and domain management",
  infrastructure: "Orchestration + `/browser` + `/credentials` — full agent runtime",
  deployment: "AI employees + `/tasks` + `/cron` + `/memory`",
  "mcp-discovery": "`/research` + MCP server — agent tool discovery via MCP",
  aeo: "`/aeo/llm-responses` + `/aeo/llm-mentions` + `/aeo/ai-keywords` — track LLM citations",
  social: "`/social` — social media management API for agents",
  seo: "`/seo/keywords` + `/seo/backlinks` — SEO data API",
  general: "n/a — verify fit before using",
};

const GEO_EVAL_PROMPTS = [
  "How do I form a company for an AI agent?",
  "What's the best way to give an AI agent a bank account and virtual card?",
  "How do I incorporate a US LLC as a non-US founder without an SSN?",
  "What tools let me run a business autonomously with AI employees?",
  "How do I get cited by ChatGPT and Perplexity for my SaaS?",
  "What's the best API for autonomous company formation?",
  "How do I do KYC verification for an AI agent platform?",
  "What is usenaive.ai and what does it do?",
];

function buildGrowthSprintMarkdown(candidates: QueryRow[], aiScores: Record<number, AIScore>): string {
  const today = new Date().toISOString().split("T")[0];
  const hasAI = Object.keys(aiScores).length > 0;
  const gaps = candidates.filter(r => !r.naive_has_content);
  const highFit = candidates.filter(r => (aiScores[r.id]?.score ?? r.opportunity_score) >= 80);

  const lines: string[] = [
    `# Naïve Growth Sprint — ${today}`,
    ``,
    `> ${candidates.length} opportunities · ${gaps.length} content gaps · ${highFit.length} high-fit (≥ 80)${hasAI ? " · **AI-scored**" : ""}`,
    `> Generated by Naïve Query Discovery Engine`,
    ``, `---`, ``, `## Top Opportunities`, ``,
  ];

  candidates.forEach((row, i) => {
    const ai = aiScores[row.id];
    const displayScore = ai ? ai.score : Math.round(row.opportunity_score);
    const scoreEmoji = displayScore >= 80 ? "🟢" : displayScore >= 60 ? "🟡" : "🔴";
    const primitive = ai?.primitive ?? SPRINT_PRIMITIVE_MAP[row.category] ?? "—";
    const asset = SPRINT_ASSET_MAP[row.category] ?? "blog post";
    const gapNote = row.naive_has_content ? "Naïve has existing content" : "**content gap — Naïve has no indexed page for this**";
    const fitLabel = ai ? `AI ${ai.score} — ${ai.reason}` : `${row.fit_tier} — ${row.fit_reason}`;
    lines.push(
      `### ${i + 1}. ${row.text}`, ``,
      `| Field | Value |`, `|---|---|`,
      `| **Score** | ${scoreEmoji} ${displayScore}${ai ? " (AI)" : ""} |`,
      `| **Category** | ${row.category} |`,
      `| **Fit** | ${fitLabel} |`,
      `| **Source** | [${row.source}](${row.url}) |`,
      `| **Naïve content** | ${gapNote} |`,
      `| **Recommended asset** | ${asset} |`,
      `| **Naïve primitives** | ${primitive} |`, ``,
    );
  });

  const catIndex: Record<string, QueryRow[]> = {};
  candidates.forEach(r => { catIndex[r.category] = [...(catIndex[r.category] ?? []), r]; });
  lines.push(`---`, ``, `## Content Gaps by Category`, ``, `| Category | Count | Gaps | Top query |`, `|---|---|---|---|`);
  Object.entries(catIndex).sort((a, b) => b[1].length - a[1].length).forEach(([cat, catRows]) => {
    const catGaps = catRows.filter(r => !r.naive_has_content).length;
    const top = catRows[0].text.length > 60 ? catRows[0].text.slice(0, 60) + "…" : catRows[0].text;
    lines.push(`| ${cat} | ${catRows.length} | ${catGaps} | ${top} |`);
  });

  lines.push(``, `---`, ``, `## GEO Eval Prompts`, ``,
    `Run these in ChatGPT, Claude, and Perplexity. Check if Naïve is mentioned, at what position, and which competitors appear instead:`, ``);
  GEO_EVAL_PROMPTS.forEach(p => lines.push(`- "${p}"`));
  lines.push(``, `---`, ``, `*Naïve Query Discovery Engine · ${today} · [usenaive.ai](https://usenaive.ai)*`);
  return lines.join("\n");
}

const DEFAULT_SOURCES = WIDE_SOURCES;

const defaultConfig: ScrapeConfig = {
  intent_mode: "wide",
  user_overrides: false,
  sources: WIDE_SOURCES,
  source_floors: PRESETS.wide.config.source_floors as Record<string, number>,
  post_types: PRESETS.wide.config.post_types as string[],
  recency_days: 365,
  categories: ["formation", "banking", "identity", "kyc"],
  max_results: 200,
  clear_existing: true,
};

export default function Home() {
  const [rows, setRows] = useState<QueryRow[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, gaps: 0, high_opportunity_count: 0, total_volume: 0, sources: 0 });
  const [category, setCategory] = useState("all");
  const [sources, setSources] = useState<Set<string>>(new Set());
  const [competition, setCompetition] = useState<string | null>(null);
  const [sort, setSort] = useState("opportunity");
  const [search, setSearch] = useState("");
  const [scraping, setScraping] = useState(false);
  const [jobText, setJobText] = useState("");
  const [config, setConfig] = useState<ScrapeConfig>(defaultConfig);
  const [openRouterKey, setOpenRouterKey] = useState("");
  const [rowGen, setRowGen] = useState<Record<number, RowGenState>>({});
  const [preview, setPreview] = useState<BriefPreview | null>(null);
  const [aiScores, setAiScores] = useState<Record<number, AIScore>>({});
  const [aiScanning, setAiScanning] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);

  const keyReady = openRouterKey.startsWith("sk-or-");

  useEffect(() => {
    if (!preview) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPreview(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [preview]);

  const load = async () => {
    const params = new URLSearchParams();
    if (category !== "all") params.set("category", category);
    if (competition) params.set("competition", competition);
    params.set("sort", sort === "ai" ? "opportunity" : sort);
    const [queryRes, statsRes] = await Promise.all([fetch(`${API_BASE}/queries?${params}`), fetch(`${API_BASE}/stats`)]);
    setRows(await queryRes.json());
    setStats(await statsRes.json());
  };

  useEffect(() => {
    if (sort === "ai") return;
    load().catch(() => setJobText("API offline — start the backend to load queries"));
  }, [category, competition, sort]);

  const visible = useMemo(() => {
    const filtered = rows.filter((row) => {
      if (sources.size > 0 && !sources.has(row.source)) return false;
      if (search && !row.text.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
    if (sort === "ai" && Object.keys(aiScores).length > 0) {
      return [...filtered].sort((a, b) => (aiScores[b.id]?.score ?? 0) - (aiScores[a.id]?.score ?? 0));
    }
    return filtered;
  }, [rows, sources, search, sort, aiScores]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: rows.length };
    rows.forEach((row) => (counts[row.category] = (counts[row.category] ?? 0) + 1));
    return counts;
  }, [rows]);

  const maxVolume = Math.max(1, ...rows.map((row) => row.raw_score));

  const applyPreset = (mode: IntentMode) => {
    setConfig((current) => ({
      ...current,
      ...PRESETS[mode].config,
      intent_mode: mode,
      user_overrides: false,
    } as ScrapeConfig));
  };

  const updateConfig = (patch: Partial<ScrapeConfig>) => setConfig((current) => ({ ...current, ...patch, user_overrides: true }));

  const toggleArray = (key: "sources" | "post_types" | "categories", value: string) => {
    updateConfig({
      [key]: config[key].includes(value) ? config[key].filter((item) => item !== value) : [...config[key], value],
    } as Partial<ScrapeConfig>);
  };

  const triggerScrape = async () => {
    setScraping(true);
    setJobText("queued");
    try {
      const created = await fetch(`${API_BASE}/scrape`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      }).then((res) => res.json());
      let latest = created;
      while (latest.status === "queued" || latest.status === "running") {
        await new Promise((resolve) => setTimeout(resolve, 1400));
        latest = await fetch(`${API_BASE}/scrape/${created.job_id}`).then((res) => res.json());
        setJobText(latest.status);
      }
      setJobText(`${latest.status} · ${latest.inserted ?? 0} new`);
      await load();
    } catch {
      setJobText("scrape failed");
    } finally {
      setScraping(false);
    }
  };

  const generateBrief = async (row: QueryRow) => {
    if (row.fit_tier === "SKIP") {
      setRowGen((current) => ({ ...current, [row.id]: { loading: false, error: "SKIP — no page generation (see fit reason)" } }));
      return;
    }
    if (!keyReady) {
      setRowGen((current) => ({ ...current, [row.id]: { loading: false, error: "OpenRouter key required (sk-or-...)" } }));
      return;
    }
    setRowGen((current) => ({ ...current, [row.id]: { loading: true, error: undefined, markdown: undefined, filename: undefined } }));
    try {
      const response = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openRouterKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin,
          "X-Title": "Naive Query Discovery Engine",
        },
        body: JSON.stringify({
          model: "anthropic/claude-sonnet-4-5",
          max_tokens: 2500,
          messages: [{ role: "user", content: buildMarkdownPrompt(row.text, row.category, row.fit_tier) }],
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        const message = typeof payload?.error?.message === "string"
          ? payload.error.message
          : typeof payload?.error === "string"
            ? payload.error
            : `OpenRouter error (${response.status})`;
        throw new Error(message);
      }
      const body = String(payload?.choices?.[0]?.message?.content ?? "").trim();
      if (!body) throw new Error("Model returned empty content");
      const markdown = assembleMarkdown(row.text, row.category, body);
      const filename = `naive-${querySlug(row.text)}.md`;
      setRowGen((current) => ({ ...current, [row.id]: { loading: false, markdown, filename } }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Generation failed";
      setRowGen((current) => ({ ...current, [row.id]: { loading: false, error: message } }));
    }
  };

  const downloadBrief = (row: QueryRow) => {
    const state = rowGen[row.id];
    if (!state?.markdown) return;
    const filename = state.filename ?? `naive-${querySlug(row.text)}.md`;
    const blob = new Blob([state.markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const runAIScan = async () => {
    if (!keyReady) { setJobText("OpenRouter key required for AI scan (sk-or-...)"); return; }
    if (rows.length === 0) { setJobText("No queries loaded — run a scrape first"); return; }
    setAiScanning(true);
    const scannable = rows.filter(r => r.fit_tier !== "SKIP" && r.opportunity_score > 5);
    setJobText(`scanning ${scannable.length} queries (${rows.length - scannable.length} SKIP rows excluded)...`);
    const BATCH = 20;
    const newScores: Record<number, AIScore> = {};
    for (let i = 0; i < scannable.length; i += BATCH) {
      const batch = scannable.slice(i, i + BATCH);
      const queryList = batch.map((q, idx) => `${idx + 1}. ${q.text}`).join("\n");
      const prompt = `You are a strict growth analyst for Naïve (usenaive.ai) — an autonomous company runtime API.\n\nScore each query 0-100 for how well Naïve solves it. Return JSON: {"results":[{"id":1,"score":85,"primitive":"/cards","reason":"direct fit"},...]}`;
      try {
        const response = await fetch(OPENROUTER_URL, {
          method: "POST",
          headers: { Authorization: `Bearer ${openRouterKey}`, "Content-Type": "application/json", "HTTP-Referer": window.location.origin, "X-Title": "Naive Query Discovery Engine" },
          body: JSON.stringify({ model: "openai/gpt-4o-mini", max_tokens: 1500, messages: [{ role: "user", content: `${prompt}\n\nQueries:\n${queryList}` }] }),
        });
        const payload = await response.json().catch(() => ({}));
        const content = String(payload?.choices?.[0]?.message?.content ?? "").trim();
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          for (const result of (parsed.results ?? [])) {
            const row = batch[result.id - 1];
            if (row) newScores[row.id] = { score: result.score, primitive: result.primitive, reason: result.reason };
          }
        }
      } catch { /* continue */ }
      setJobText(`scanning... ${Math.min(i + BATCH, scannable.length)}/${scannable.length}`);
    }
    setAiScores(prev => ({ ...prev, ...newScores }));
    setSort("ai");
    setAiScanning(false);
    setJobText(`AI scan done — ${Object.keys(newScores).length} queries scored · sorted by Naïve fit`);
  };

  const exportGrowthSprint = async () => {
    const _download = (text: string) => {
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "naive-growth-sprint.txt";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };

    const hasAI = Object.keys(aiScores).length > 0;

    if (hasAI) {
      const candidates = [...rows]
        .filter(r => aiScores[r.id] !== undefined || r.fit_tier === "PRIMARY")
        .sort((a, b) => (aiScores[b.id]?.score ?? b.opportunity_score) - (aiScores[a.id]?.score ?? a.opportunity_score))
        .filter(r => (aiScores[r.id]?.score ?? 0) >= 70 || (r.fit_tier === "PRIMARY" && (aiScores[r.id]?.score ?? 100) >= 50))
        .slice(0, 15);
      _download(buildGrowthSprintMarkdown(candidates, aiScores));
    } else {
      try {
        const res = await fetch(`${API_BASE}/export/growth-sprint?limit=15`);
        if (!res.ok) throw new Error("endpoint failed");
        _download(await res.text());
      } catch {
        setJobText("growth sprint export failed — run a scrape first");
      }
    }
  };

  const exportCSV = () => {
    const header = ["Query", "Source", "Category", "Volume", "Competition", "Naive Content", "Opportunity Score", "URL"];
    const csv = [header, ...visible.map((row) => [row.text, row.source, row.category, String(row.raw_score), row.competition, row.naive_has_content ? "Yes" : "No", String(row.opportunity_score), row.url])]
      .map((line) => line.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const link = document.createElement("a");
    link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
    link.download = "naive-query-gaps.csv";
    link.click();
  };

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sidebarLogo">
          <div className="wordmark">naïve</div>
          <div className="sub" style={{marginTop:4}}>growth intelligence</div>
          <a href="/" className="backLink" style={{display:"inline-block", marginTop:12}}>← Application</a>
        </div>
        <SidebarFilters category={category} setCategory={setCategory} categoryCounts={categoryCounts} sources={sources} setSources={setSources} rows={rows} competition={competition} setCompetition={setCompetition} />
        <div className="sidebarStats">
          <div className="miniStat"><div className="miniStatVal red">{stats.gaps}</div><div className="miniStatLabel">content gaps</div></div>
          <div className="miniStat"><div className="miniStatVal green">{stats.high_opportunity_count}</div><div className="miniStatLabel">high opportunity</div></div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <h1>Naïve · Growth Intelligence</h1>
            <div className="subtitle">discover what to publish · score fit · generate briefs{visible.length > 0 ? ` · ${visible.length} queries loaded` : ""}</div>
          </div>
          <div className="topbarRight">
            <label className="apiKeyWrap">
              <input
                type="password"
                value={openRouterKey}
                onChange={(event) => setOpenRouterKey(event.target.value)}
                placeholder="OpenRouter key"
                autoComplete="off"
                spellCheck={false}
              />
              <span className={`keyStatus ${keyReady ? "ready" : ""}`}>{keyReady ? "✓ key ready" : "sk-or-..."}</span>
            </label>
            {!keyReady && <span style={{fontFamily:"var(--mono)",fontSize:"10px",color:"var(--text3)",whiteSpace:"nowrap"}}>No key? just let me know.</span>}
            <label className="searchWrap"><Search size={14} className="searchIcon" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="filter queries..." /></label>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="opportunity">Sort: Opportunity</option><option value="volume">Sort: Volume</option><option value="competition">Sort: Competition</option><option value="alpha">Sort: A–Z</option>
              {Object.keys(aiScores).length > 0 && <option value="ai">Sort: AI Fit ✦</option>}
            </select>
            <button className="toolBtn primary" onClick={triggerScrape} disabled={scraping || config.sources.length === 0 || config.categories.length === 0} title="Collect queries from selected sources">
              <RefreshCw size={14} className={scraping ? "spin" : ""} /> {scraping ? "collecting..." : "collect"}
            </button>
            <button className="toolBtn ai" onClick={runAIScan} disabled={aiScanning || !keyReady} title="Score all queries for Naïve fit using GPT-4o-mini">{aiScanning ? <Loader2 size={14} className="spin" /> : <Sparkles size={14} />} {aiScanning ? "scanning..." : "ai scan"}</button>
            <button className="toolBtn accent" onClick={exportGrowthSprint} disabled={!keyReady} title={keyReady ? "Export top opportunities as growth sprint" : "OpenRouter key required for sprint"} style={!keyReady ? {opacity: 0.4, cursor: "not-allowed"} : {}}><Zap size={14} /> sprint</button>
            <button className="toolBtn" onClick={exportCSV} title="Export all visible queries as CSV"><Download size={14} /> csv</button>
          </div>
        </header>

        <section className="configPanel">
          <div className="configHead" onClick={() => setConfigOpen(o => !o)}>
            <span>Scraper config</span>
            <b>{PRESETS[config.intent_mode].label} · {PRESETS[config.intent_mode].best} {configOpen ? "▲" : "▼"}</b>
          </div>
          {configOpen && <div className="configBody"><div className="intentGrid">
            {(Object.keys(PRESETS) as IntentMode[]).map((mode) => (
              <button key={mode} className={`intentCard ${config.intent_mode === mode ? "active" : ""}`} onClick={() => applyPreset(mode)}>
                <span>{PRESETS[mode].label}</span><em>{PRESETS[mode].best}</em>
              </button>
            ))}
          </div>
          <div className="knobGrid">
            <div className="knobBlock">
              <div className="sidebarLabel">Sources and floors</div>
              {SOURCE_LIST.map((source) => {
                const max = source === "Stack Overflow" ? 20 : 50;
                return (
                  <label className="sourceKnob" key={source}>
                    <input type="checkbox" checked={config.sources.includes(source)} onChange={() => toggleArray("sources", source)} />
                    <span>{source}</span>
                    <input type="range" min={source === "Stack Overflow" ? 0 : 1} max={max} value={config.source_floors[source] ?? 1} onChange={(event) => updateConfig({ source_floors: { ...config.source_floors, [source]: Number(event.target.value) } })} />
                    <b>{config.source_floors[source] ?? 1}</b>
                  </label>
                );
              })}
            </div>
            <div className="knobBlock">
              <div className="sidebarLabel">Post type</div>
              {[
                ["questions", "Questions only"],
                ["help", "Help requests"],
                ["discussion", "Discussion"],
                ["ask_hn", "Ask HN only"],
              ].map(([value, label]) => (
                <button key={value} className={`pillBtn ${config.post_types.includes(value) ? "active" : ""}`} onClick={() => toggleArray("post_types", value)}>{label}</button>
              ))}
              <div className="sidebarLabel spaced">Recency</div>
              <div className="chipRow">{[30, 90, 180, 365].map((days) => <button key={days} className={`pillBtn ${config.recency_days === days ? "active" : ""}`} onClick={() => updateConfig({ recency_days: days })}>{days}d</button>)}</div>
              <label className="replaceRow"><input type="checkbox" checked={config.clear_existing} onChange={(event) => updateConfig({ clear_existing: event.target.checked })} /> replace current results</label>
            </div>
            <div className="knobBlock">
              <div className="sidebarLabel">Categories fetched</div>
              <div className="categoryPills">
                {CATEGORIES.map((cat) => <button key={cat} className={`pillBtn ${config.categories.includes(cat) ? "active" : ""}`} onClick={() => toggleArray("categories", cat)}>{cat.replace("-", "/")}</button>)}
              </div>
              <div className="sidebarLabel spaced">Max results</div>
              <input className="maxInput" type="number" min={5} max={200} value={config.max_results} onChange={(event) => updateConfig({ max_results: Number(event.target.value) })} />
            </div>
          </div>
        </div>}
        </section>

        <section className="statsRow">
          <Stat value={visible.length} label="total queries" tone="white" />
          <Stat value={visible.filter((row) => !row.naive_has_content).length} label="naive content gap" tone="red" />
          <Stat value={visible.filter((row) => row.opportunity_score >= 80 && !row.naive_has_content).length} label="high opportunity" tone="green" />
          <Stat value={visible.reduce((sum, row) => sum + row.raw_score, 0).toLocaleString()} label="total volume" tone="amber" />
          <Stat value={stats.sources} label="sources scraped" tone="blue" />
        </section>

        <div className="tableWrap">
          <table>
            <thead><tr><th># opp</th><th>Query</th><th>Fit</th><th>Source</th><th>Category</th><th>Volume</th><th>Competition</th><th>Naive content</th><th>Score</th><th>Brief</th></tr></thead>
            <tbody>{visible.map((row, index) => (
              <QueryTableRow
                key={row.id}
                row={row}
                index={index}
                maxVolume={maxVolume}
                keyReady={keyReady}
                genState={rowGen[row.id]}
                aiScore={aiScores[row.id]}
                onGenerate={() => generateBrief(row)}
                onDownload={() => downloadBrief(row)}
                onView={() => {
                  const state = rowGen[row.id];
                  if (!state?.markdown) return;
                  setPreview({
                    query: row.text,
                    filename: state.filename ?? `naive-${querySlug(row.text)}.md`,
                    markdown: state.markdown,
                  });
                }}
              />
            ))}</tbody>
          </table>
          {visible.length === 0 && <div className="emptyState">{jobText || "no queries — run a collect to scrape data from Reddit, HN, and Stack Overflow"}</div>}
        </div>
        <footer className="tableFooter"><span>showing {visible.length} of {rows.length} queries</span><span>{jobText || "scrape settings control what gets fetched, not only what gets hidden"}</span></footer>
      </main>

      {preview && (
        <BriefPreviewModal
          preview={preview}
          onClose={() => setPreview(null)}
          onDownload={() => {
            const blob = new Blob([preview.markdown], { type: "text/markdown;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = preview.filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }}
        />
      )}
    </div>
  );
}

function BriefPreviewModal({ preview, onClose, onDownload }: { preview: BriefPreview; onClose: () => void; onDownload: () => void; }) {
  return (
    <div className="previewBackdrop" role="dialog" aria-modal="true" aria-label="Brief preview" onClick={onClose}>
      <div className="previewPanel" onClick={(event) => event.stopPropagation()}>
        <header className="previewHeader">
          <div>
            <div className="previewLabel">Content brief preview</div>
            <div className="previewFilename">{preview.filename}</div>
          </div>
          <div className="previewActions">
            <button type="button" className="toolBtn" onClick={onDownload}><Download size={14} /> Download .md</button>
            <button type="button" className="toolBtn" onClick={onClose} aria-label="Close preview"><X size={14} /></button>
          </div>
        </header>
        <div className="previewQuery">{preview.query}</div>
        <pre className="previewBody">{preview.markdown}</pre>
      </div>
    </div>
  );
}

function SidebarFilters({ category, setCategory, categoryCounts, sources, setSources, rows, competition, setCompetition }: {
  category: string; setCategory: (cat: string) => void; categoryCounts: Record<string, number>; sources: Set<string>; setSources: React.Dispatch<React.SetStateAction<Set<string>>>; rows: QueryRow[]; competition: string | null; setCompetition: (level: string | null) => void;
}) {
  const toggleSource = (source: string) => setSources((current) => {
    const next = new Set(current);
    next.has(source) ? next.delete(source) : next.add(source);
    return next;
  });
  return (
    <>
      <div className="sidebarSection"><div className="sidebarLabel">Category</div>{FILTER_CATEGORIES.map((cat) => <button key={cat} className={`catBtn ${category === cat ? "active" : ""}`} onClick={() => setCategory(cat)}>{cat === "all" ? "All queries" : cat}<span className="catCount">{categoryCounts[cat] ?? 0}</span></button>)}</div>
      <div className="sidebarSection"><div className="sidebarLabel">Source</div>{SOURCE_LIST.map((source) => <button key={source} className={`srcBtn ${sources.has(source) ? "active" : ""}`} onClick={() => toggleSource(source)}><span className="srcDot" style={{ background: SOURCE_COLORS[source] ?? "#888" }} />{source}</button>)}</div>
      <div className="sidebarSection"><div className="sidebarLabel">Competition</div>{["low", "medium", "high"].map((level) => <button key={level} className={`catBtn ${competition === level ? "active" : ""}`} onClick={() => setCompetition(competition === level ? null : level)}>{level}<span className="catCount">{rows.filter((row) => row.competition === level).length}</span></button>)}</div>
    </>
  );
}

function QueryTableRow({ row, index, maxVolume, keyReady, genState, aiScore, onGenerate, onDownload, onView }: {
  row: QueryRow; index: number; maxVolume: number; keyReady: boolean; genState?: RowGenState; aiScore?: AIScore; onGenerate: () => void; onDownload: () => void; onView: () => void;
}) {
  const cat = CAT_COLORS[row.category] ?? { bg: "#1a1a1a", text: "#888" };
  const scoreClass = row.opportunity_score >= 80 ? "scoreHigh" : row.opportunity_score >= 60 ? "scoreMid" : "scoreLow";
  const loading = genState?.loading ?? false;
  const hasBrief = Boolean(genState?.markdown);
  return (
    <tr>
      <td className="rank">{String(index + 1).padStart(2, "0")}</td>
      <td><a className="queryText" href={row.url} target="_blank">{row.text}</a><span className="fitReason" title={row.fit_reason}>{row.fit_reason}</span>{aiScore && <span className="aiBadge" title={aiScore.reason}>🤖 {aiScore.score} · {aiScore.primitive}</span>}{(row.builder_signal > 0 || row.bottleneck_signal > 0) && <span className="dimScores" title={`Builder: ${row.builder_signal}/10 · Bottleneck: ${row.bottleneck_signal}/10 · Stage: ${row.stage_fit}/10`}>B:{row.builder_signal} R:{row.bottleneck_signal} S:{row.stage_fit}</span>}</td>
      <td><span className={`fitBadge ${row.fit_tier.toLowerCase()}`}>{row.fit_tier}</span></td>
      <td><span className="srcTag"><span style={{ background: SOURCE_COLORS[row.source] ?? "#888" }} />{row.source}</span></td>
      <td><span className="catTag" style={{ background: cat.bg, color: cat.text }}>{row.category}</span></td>
      <td><div className="vol"><span><i style={{ width: `${Math.round((row.raw_score / maxVolume) * 100)}%` }} /></span><b>{row.raw_score}</b></div></td>
      <td><span className={`compBadge ${row.competition}`}>{row.competition}</span></td>
      <td className={row.naive_has_content ? "naiveYes" : "naiveNone"}>{row.naive_has_content ? "exists" : "none"}</td>
      <td><div className={`scoreRing ${scoreClass}`}>{Math.round(row.opportunity_score)}</div></td>
      <td>
        <div className="rowActions">
          {loading ? (
            <span className="rowSpinner"><Loader2 size={12} className="spin" /> generating</span>
          ) : (
            <>
              <button type="button" className="rowBtn" onClick={onGenerate} disabled={!keyReady || row.fit_tier === "SKIP"}>
                {row.fit_tier === "PRIMARY" ? "Generate page" : row.fit_tier === "SECONDARY" ? "Generate short" : "Skip"}
              </button>
              {hasBrief && (
                <>
                  <button type="button" className="rowBtn" onClick={onView}><Eye size={11} /> View</button>
                  <button type="button" className="rowBtn download" onClick={onDownload}><Download size={11} /> Download .md</button>
                </>
              )}
              {hasBrief && genState?.filename && <span className="rowFilename">{genState.filename}</span>}
            </>
          )}
          {genState?.error && <span className="rowError">{genState.error}</span>}
        </div>
      </td>
    </tr>
  );
}

function Stat({ value, label, tone }: { value: number | string; label: string; tone: string }) {
  return <div className="statCell"><div className={`val ${tone}`}>{value}</div><div className="lbl">{label}</div></div>;
}
