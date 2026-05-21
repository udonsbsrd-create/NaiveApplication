"use client";

import { useState } from "react";
import Link from "next/link";

const P_COLORS: Record<string, string> = {
  Cards: "#3ecf78",
  Email: "#4a9eff",
  Formation: "#a78bfa",
  AEO: "#f59e0b",
  KYC: "#e8a23a",
  Orchestration: "#e2533a",
};

const PRIMITIVE_STATS = [
  { name: "Cards", count: 6, avgScore: 9.0, insight: "The highest-urgency gap. Builders are scared of their own agents — so scared they're building custom sandboxed wallets from scratch. One Reddit thread: an agent spent $8,000 on courses by mistake." },
  { name: "KYC", count: 2, avgScore: 9.15, insight: "Low volume, maximum pain. Both threads describe total blockers — not workarounds, not annoyances. The agent simply cannot exist without a verified identity." },
  { name: "Orchestration", count: 3, avgScore: 8.8, insight: "The multi-agent coordination problem is real and unsolved. Recursion containment, state handoff between agents, and network hop latency are engineering crises in production." },
  { name: "Email", count: 5, avgScore: 8.5, insight: "Most rebuilt primitive in agentic dev. Five separate builders hit the same wall independently — IMAP race conditions, shared inboxes, OTP blocks. All shipped fragile hacks." },
  { name: "AEO", count: 3, avgScore: 8.2, insight: "Google rank #1 is now worth less than it was. Founders have no tooling to measure, track, or improve AI citation rates — and the gap between SEO and AEO is widening." },
  { name: "Formation", count: 3, avgScore: 7.3, insight: "Pain here is chronic distrust — Stripe Atlas, Firstbase — people feel burned. The emotional register is betrayal, not just frustration." },
];

const maxCount = Math.max(...PRIMITIVE_STATS.map((p) => p.count));

const THREADS = [
  {
    title: "Why AI agents can't receive emails and how we're solving it",
    source: "r/LangChain", url: "https://www.reddit.com/r/LangChain/comments/1sw2rr0/",
    primitive: "Email", score: 10.0, b: 10, r: 10, s: 10,
    quote: "IMAP polling introduces 30–60 second delays. Attempting to poll every second triggers rate limits and account suspensions from Google and Microsoft.",
    pain: "IMAP is the only option — and it breaks at scale, leaks context, causes race conditions",
    featured: true,
  },
  {
    title: "Stuck on US Verification, Building AI Outbound Sales Agent",
    source: "r/SaaS", url: "https://www.reddit.com/r/SaaS/comments/1ruj1sr/",
    primitive: "KYC", score: 9.8, b: 10, r: 10, s: 9,
    quote: "Stripe and Twilio keep blocking my accounts. When they find an automated system lacking a verified human beneficial owner, they suspend immediately.",
    pain: "Outbound AI agents hit a hard KYC wall — no programmatic identity path exists",
    featured: true,
  },
  {
    title: "How do you handle payments when your LangChain agent needs to buy something?",
    source: "r/LangChain", url: "https://www.reddit.com/r/LangChain/comments/1s805ju/",
    primitive: "Cards", score: 9.8, b: 10, r: 10, s: 9,
    quote: "The moment an agent needs to pay for something, everything breaks. The human has to step back in, enter a credit card, and basically babysit the transaction.",
    pain: "Agent loop shatters at every checkout — no authorized spending primitive",
    featured: true,
  },
  {
    title: "I was terrified of giving my AI agent my credit card, so I built sandboxed wallets",
    source: "r/LangChain", url: "https://www.reddit.com/r/LangChain/comments/1rdmtq3/",
    primitive: "Cards", score: 9.1, b: 10, r: 9, s: 8,
    quote: "LLMs are non-deterministic. An agent could hallucinate an infinite provisioning loop and drain your bank account before the error is detected.",
    pain: "Static card credentials = catastrophic blast radius on any logic error",
    featured: false,
  },
  {
    title: "Remember when 'agentic commerce' demos always stopped at checkout?",
    source: "Hacker News", url: "https://news.ycombinator.com/item?id=45366552",
    primitive: "Cards", score: 9.0, b: 8, r: 10, s: 8,
    quote: "The limitation is not technical — models can navigate checkout DOM elements — it's a restriction of authorization and risk management.",
    pain: "Capability exists. Authorized spending infrastructure does not.",
    featured: false,
  },
  {
    title: "An AI agent spent $8,000 on courses by mistake. Your SaaS pricing page is not ready for this.",
    source: "r/SaaS", url: "https://www.reddit.com/r/SaaS/comments/1qzmldt/",
    primitive: "Cards", score: 8.5, b: 9, r: 9, s: 8,
    quote: "One crucial aspect that pricing pages often overlook is the necessity for an audit trail that tracks the journey from 'agent intent' to 'charge.'",
    pain: "No audit primitive between agent intent and actual charge — runaway spend has no circuit breaker",
    featured: false,
  },
  {
    title: "Show HN: Ledge — Policy layer for AI agent payments (prevents agents from draining your wallet)",
    source: "Hacker News", url: "https://news.ycombinator.com/item?id=47219966",
    primitive: "Cards", score: 8.5, b: 9, r: 9, s: 8,
    quote: "I built Ledge because I kept seeing demos of AI agents with wallet keys in their .env files, and thought 'this is going to end badly.'",
    pain: "Wallet keys in .env = no spend policy, no audit, no kill switch",
    featured: false,
  },
  {
    title: "We built a payment gateway for AI agents",
    source: "r/TestMyApp", url: "https://www.reddit.com/r/TestMyApp/comments/1s8f5jx/",
    primitive: "Cards", score: 8.0, b: 8, r: 8, s: 8,
    quote: "I was building agents that needed to occasionally rent their own server space or pay a $5 fee to access a resource. There was no clean way to do this.",
    pain: "No off-the-shelf agent wallet API — every builder writing payment infra from scratch",
    featured: false,
  },
  {
    title: "built a way for AI agents to get real email inboxes and handle OTP/2FA automatically",
    source: "r/nocode", url: "https://www.reddit.com/r/nocode/comments/1rjidro/",
    primitive: "Email", score: 8.5, b: 9, r: 9, s: 8,
    quote: "My AI agents require registration or login on various platforms, but they often get halted by email verification and OTP processes.",
    pain: "OTP screens stop agents cold — no inbox primitive means no autonomous account creation",
    featured: false,
  },
  {
    title: "How are you handling email for your AI agents? Built dedicated inbox infrastructure to solve this",
    source: "r/AI_Agents", url: "https://www.reddit.com/r/AI_Agents/comments/1rpr07e/",
    primitive: "Email", score: 8.0, b: 9, r: 8, s: 8,
    quote: "Agents require the ability to send and receive emails for various purposes such as outreach, notifications, or communication between themselves. No clean solution existed.",
    pain: "No reusable agent inbox primitive — every builder assembles their own from scratch",
    featured: false,
  },
  {
    title: "I built AgentMailr — dedicated email inboxes for AI agents (give your agent its own email address)",
    source: "r/SideProject", url: "https://www.reddit.com/r/SideProject/comments/1rovxbx/",
    primitive: "Email", score: 8.0, b: 9, r: 8, s: 7,
    quote: "Agents that need to manage emails often end up taking over your personal inbox. I've been developing AI agents for some time and this kept breaking everything.",
    pain: "Shared inbox chaos — no isolation between agent identity and operator identity",
    featured: false,
  },
  {
    title: "MCP servers I use every day — AgentMail gives your agent its own inbox",
    source: "r/ClaudeAI", url: "https://www.reddit.com/r/ClaudeAI/comments/1s0u2ms/",
    primitive: "Email", score: 7.0, b: 7, r: 7, s: 7,
    quote: "I didn't think I'd need 'agent email' but it's become one of the more useful MCPs in my stack.",
    pain: "Agents without dedicated inboxes can't receive OTPs, replies, or own a comms channel",
    featured: false,
  },
  {
    title: "AI agents are about to be real users of financial products. Our KYC flows are not ready.",
    source: "r/fintech", url: "https://www.reddit.com/r/fintech/comments/1tdn8p8/",
    primitive: "KYC", score: 8.5, b: 9, r: 9, s: 8,
    quote: "KYC processes are designed for individuals navigating the interface themselves. This means you either share your personal credentials with the agent, or create a delegated authentication layer that lacks robust support.",
    pain: "Legacy KYC assumes biological personhood — breaks for every autonomous agent deployment",
    featured: false,
  },
  {
    title: "Non-US resident here, need advice on forming a US LLC",
    source: "r/stripe", url: "https://www.reddit.com/r/stripe/comments/1mw4umq/",
    primitive: "Formation", score: 8.0, b: 8, r: 9, s: 7,
    quote: "To establish a US-based Stripe account, you must provide a legitimate physical address in the US. Part of this involves providing an address you won't be able to fulfill if you aren't genuinely residing there.",
    pain: "No unified, API-driven path from zero to US LLC + Stripe for non-residents",
    featured: false,
  },
  {
    title: "Non-Resident US Stripe Account (Stripe Atlas) — I will answer any question you have",
    source: "r/stripe", url: "https://www.reddit.com/r/stripe/comments/1dcg438/",
    primitive: "Formation", score: 7.5, b: 7, r: 8, s: 7,
    quote: "Just because you set up with Stripe Atlas does NOT guarantee merchant processing with Stripe. They are separate entities that each have their own process and requirements.",
    pain: "Formation vendors don't guarantee payment access — founders stranded with an LLC and no bank",
    featured: false,
  },
  {
    title: "Stripe shut down my account after forming my company through Stripe Atlas",
    source: "r/stripe", url: "https://www.reddit.com/r/stripe/comments/1k6zocp/",
    primitive: "Formation", score: 6.5, b: 7, r: 7, s: 6,
    quote: "Why would Stripe help me create a U.S. company only to later reject it? I already invested time, money, and legal effort assuming I'd use Stripe for payments.",
    pain: "Formation and payments sold as a bundle — delivered as two separate rejections",
    featured: false,
  },
  {
    title: "deepagents: Agent harness with LangChain/LangGraph — spawn subagents",
    source: "r/AutoGPT", url: "https://www.reddit.com/r/AutoGPT/comments/1rwzpl2/",
    primitive: "Orchestration", score: 9.5, b: 10, r: 9, s: 10,
    quote: "Frameworks that allow unconstrained recursion run the risk of creating localized denial-of-service events as sub-agents spawn infinitely.",
    pain: "Multi-agent spawning has no production-grade recursion containment standard",
    featured: false,
  },
  {
    title: "The real reason your multi-agent system fails isn't the model — it's what gets lost between agents",
    source: "r/AI_Agents", url: "https://www.reddit.com/r/AI_Agents/comments/1r86fmq/",
    primitive: "Orchestration", score: 8.5, b: 9, r: 9, s: 8,
    quote: "The recurring issue isn't related to the model itself; it stems from agents sharing insufficient context with one another, leading to incorrect assumptions by the receiving agent.",
    pain: "No clean handoff protocol — context loss between agents causes silent failures",
    featured: false,
  },
  {
    title: "Building a LangChain/LangGraph multi-agent orchestrator: how to handle transitions?",
    source: "r/LangChain", url: "https://www.reddit.com/r/LangChain/comments/1onoufx/",
    primitive: "Orchestration", score: 8.5, b: 9, r: 8, s: 9,
    quote: "When a single LLM prompt has too many diverse tools and conflicting responsibilities, reliability plummets — hallucinated tool calls and infinite loops.",
    pain: "No clean handoff protocol between specialist sub-agents",
    featured: false,
  },
  {
    title: "What actually helps you get cited by AI systems?",
    source: "r/AEOgrowth", url: "https://www.reddit.com/r/AEOgrowth/comments/1pzzzz7/",
    primitive: "AEO", score: 8.5, b: 8, r: 9, s: 8,
    quote: "Pages that are specific, well-structured, and authoritative receive more citations than lengthy opinion pieces, and schema markup only adds value if the page already makes the answer obvious.",
    pain: "No systematic framework for optimizing content for LLM citation — all anecdote",
    featured: false,
  },
  {
    title: "I accidentally discovered why most 'SEO experts' are about 10 years behind AI",
    source: "r/Entrepreneur", url: "https://www.reddit.com/r/Entrepreneur/comments/1mpsuwm/",
    primitive: "AEO", score: 8.0, b: 8, r: 9, s: 7,
    quote: "To my surprise, pages that ranked first on Google were hardly referenced, whereas outdated documentation was cited repeatedly.",
    pain: "Google rank #1 no longer predicts AI citation — no tooling to bridge the gap",
    featured: false,
  },
  {
    title: "How to get cited by ChatGPT",
    source: "r/LLMGEO", url: "https://www.reddit.com/r/LLMGEO/comments/1ox3los/",
    primitive: "AEO", score: 8.0, b: 8, r: 8, s: 8,
    quote: "To secure consistent citations, it's vital to distribute your content across various platforms. The broader your publishing reach, the higher the chances your writing will align with user prompts.",
    pain: "No tooling to track, measure, or improve LLM citation rates",
    featured: false,
  },
];

const GAPS = [
  {
    title: "Prompt injection via agentic inboxes",
    detail: "Everyone knows they need webhook-driven inboxes to bypass OTPs. Nobody has written the guide on sanitizing inbound payloads so adversarial emails can't hijack the LLM mid-task.",
    primitive: "Email", urgency: "High",
  },
  {
    title: "Corporate veil liability for AI operators",
    detail: "Builders are forming LLCs to pass Stripe/Twilio KYC. None of them know that commingled banking or a lapsed registered agent dissolves that liability shield completely.",
    primitive: "Formation", urgency: "High",
  },
  {
    title: "Recursion containment in spawning pipelines",
    detail: "LangGraph enables deep delegation but there's no technical standard for bounded depth, DAG execution planning, or hash-verified tool registries. Runaway spend is a known risk with no documentation.",
    primitive: "Orchestration", urgency: "Medium",
  },
];

const GEO_EVALS = [
  { prompt: "My LangChain agent keeps failing at paid APIs. Are there platforms that let me programmatically issue virtual cards specifically for autonomous agents?", primitive: "Cards" },
  { prompt: "I'm building an outbound sales agent but Stripe and Twilio block my accounts at KYC. Is there a way to incorporate an LLC via API to pass verification?", primitive: "KYC" },
  { prompt: "I need my multi-agent system to bypass email OTP screens. Shared Gmail IMAP causes race conditions. What's the best infrastructure for agent-native inboxes?", primitive: "Email" },
  { prompt: "How do I separate 'intent to pay' from payment execution in an autonomous AI workflow so my agent can't drain my budget?", primitive: "Cards" },
];

const FILTERS = ["ALL", "Cards", "Email", "Formation", "AEO", "KYC", "Orchestration"] as const;
type Filter = (typeof FILTERS)[number];

export default function FindingsPage() {
  const [filter, setFilter] = useState<Filter>("ALL");

  const displayed = filter === "ALL" ? THREADS : THREADS.filter((t) => t.primitive === filter);
  const featured = THREADS.filter((t) => t.featured);
  const rest = displayed.filter((t) => !t.featured);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>

      {/* Nav */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)" }}>
        <Link href="/" style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "var(--text3)", textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
          ← back
        </Link>
        <span style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Signal Board · May 2026</span>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "56px 28px 80px" }}>

        {/* Hero */}
        <div style={{ marginBottom: 60 }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--green)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>Engine Findings · Signal Board</div>
          <h1 style={{ fontFamily: "var(--mono)", fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: 18 }}>
            The most rebuilt primitive in agentic dev is email.<br />Cards is second.<br />Nobody publishes this.
          </h1>
          <p style={{ color: "var(--text2)", maxWidth: 560, lineHeight: 1.85, fontSize: "15px" }}>
            The engine ran on Reddit, HN, and developer forums using problem language — no brand names, no keywords. These are the threads it flagged.
          </p>
        </div>

        {/* Stat pills */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 64 }}>
          {[
            { val: "9.0", sub: "avg score", detail: "across all flagged threads — builder signal + bottleneck + stage fit" },
            { val: "6", sub: "primitives", detail: "Cards, Email, Formation, AEO, KYC, Orchestration" },
            { val: "3", sub: "content gaps", detail: "no existing Naïve page addresses these queries" },
            { val: "3", sub: "featured", detail: "highest-signal threads — score 9.8 or above" },
          ].map((s) => (
            <div key={s.val} style={{ background: "var(--bg2)", border: "1px solid var(--border2)", borderRadius: 8, padding: "20px 18px" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: "28px", fontWeight: 700, color: "var(--green)", lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "8px 0 4px" }}>{s.sub}</div>
              <div style={{ fontSize: "11px", color: "var(--text3)", lineHeight: 1.6 }}>{s.detail}</div>
            </div>
          ))}
        </div>

        {/* Primitive breakdown */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 24 }}>Primitive breakdown — volume × avg score</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {PRIMITIVE_STATS.map((p) => {
              const col = P_COLORS[p.name];
              const barW = (p.count / maxCount) * 100;
              const scoreW = (p.avgScore / 10) * 100;
              return (
                <div key={p.name} style={{ background: "var(--bg2)", border: "1px solid var(--border2)", borderRadius: 8, padding: "18px 22px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 60px 160px", gap: 16, alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: "11px", color: col, fontWeight: 600 }}>{p.name}</span>
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text3)", width: 46 }}>volume</span>
                        <div style={{ flex: 1, height: 6, background: "var(--bg3)", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ width: `${barW}%`, height: "100%", background: col, borderRadius: 3, transition: "width 0.6s ease" }} />
                        </div>
                        <span style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text3)", minWidth: 16 }}>{p.count}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text3)", width: 46 }}>signal</span>
                        <div style={{ flex: 1, height: 6, background: "var(--bg3)", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ width: `${scoreW}%`, height: "100%", background: `${col}80`, borderRadius: 3, transition: "width 0.6s ease" }} />
                        </div>
                        <span style={{ fontFamily: "var(--mono)", fontSize: "10px", color: col, minWidth: 28 }}>{p.avgScore.toFixed(1)}</span>
                      </div>
                    </div>
                    <div />
                    <div style={{ fontSize: "11px", color: "var(--text3)", lineHeight: 1.6 }}>{p.insight}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Score distribution dot chart */}
        <div style={{ marginBottom: 64, background: "var(--bg2)", border: "1px solid var(--border2)", borderRadius: 8, padding: "24px 28px" }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 20 }}>Score distribution — all {THREADS.length} threads</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "flex-end" }}>
            {THREADS.sort((a, b) => b.score - a.score).map((t, i) => {
              const col = P_COLORS[t.primitive];
              const h = Math.round((t.score / 10) * 56);
              return (
                <div key={i} title={`${t.title}\n${t.primitive} · ${t.score}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "default" }}>
                  <div style={{ width: 28, height: h, background: col, borderRadius: "3px 3px 0 0", opacity: 0.85 }} />
                  <span style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text3)" }}>{t.score.toFixed(1)}</span>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 18, flexWrap: "wrap" }}>
            {Object.entries(P_COLORS).map(([name, col]) => (
              <div key={name} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: col }} />
                <span style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text3)" }}>{name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Featured 3 */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 20 }}>Highest signal — top 3</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {featured.map((t, i) => {
              const col = P_COLORS[t.primitive];
              return (
                <div key={i} style={{ display: "flex", flexDirection: "column", background: "var(--bg2)", border: `1px solid ${col}40`, borderRadius: 8, padding: 22, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: col, borderRadius: "8px 8px 0 0" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text3)", background: "var(--bg3)", padding: "2px 7px", borderRadius: 3 }}>{t.source}</span>
                    <span style={{ fontFamily: "var(--mono)", fontSize: "20px", fontWeight: 700, color: col }}>{t.score.toFixed(1)}</span>
                  </div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "12px", fontWeight: 600, color: "var(--text)", lineHeight: 1.5, marginBottom: 14 }}>{t.title}</div>
                  <div style={{ borderLeft: `2px solid ${col}60`, paddingLeft: 10, marginBottom: 14, flex: 1 }}>
                    <p style={{ color: "var(--text3)", fontSize: "11px", lineHeight: 1.75, fontStyle: "italic", margin: 0 }}>&ldquo;{t.quote}&rdquo;</p>
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text2)", marginBottom: 14 }}>{t.pain}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: "10px", padding: "2px 8px", border: `1px solid ${col}50`, borderRadius: 3, color: col, background: `${col}15` }}>{t.primitive}</span>
                    <div style={{ display: "flex", gap: 12 }}>
                      {[["B", t.b], ["R", t.r], ["S", t.s]].map(([k, v]) => (
                        <span key={k as string} style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text3)" }}>{k} <span style={{ color: "var(--text)" }}>{v}</span></span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filter + remaining grid */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            {FILTERS.map((f) => {
              const isActive = filter === f;
              const col = f === "ALL" ? "var(--text)" : P_COLORS[f];
              const cnt = f === "ALL" ? THREADS.length : THREADS.filter((t) => t.primitive === f).length;
              return (
                <button key={f} onClick={() => setFilter(f)} style={{ fontFamily: "var(--mono)", fontSize: "11px", padding: "5px 12px", borderRadius: 4, border: `1px solid ${isActive ? col : "var(--border2)"}`, background: isActive ? `${typeof col === "string" && col.startsWith("var") ? "transparent" : col + "18"}` : "transparent", color: isActive ? col : "var(--text3)", cursor: "pointer", letterSpacing: "0.04em" }}>
                  {f} <span style={{ opacity: 0.55 }}>({cnt})</span>
                </button>
              );
            })}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 12 }}>
            {rest.map((t, i) => {
              const col = P_COLORS[t.primitive];
              return (
                <div key={i} style={{ display: "flex", flexDirection: "column", background: "var(--bg2)", border: "1px solid var(--border2)", borderRadius: 8, padding: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text3)", background: "var(--bg3)", padding: "2px 7px", borderRadius: 3 }}>{t.source}</span>
                    <span style={{ fontFamily: "var(--mono)", fontSize: "13px", fontWeight: 600, color: col }}>{t.score.toFixed(1)}</span>
                  </div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "12px", fontWeight: 500, color: "var(--text)", lineHeight: 1.5, marginBottom: 10, flex: 1 }}>{t.title}</div>
                  <div style={{ borderLeft: `2px solid ${col}50`, paddingLeft: 9, marginBottom: 10 }}>
                    <p style={{ color: "var(--text3)", fontSize: "11px", lineHeight: 1.7, fontStyle: "italic", margin: 0 }}>&ldquo;{t.quote}&rdquo;</p>
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text2)", lineHeight: 1.6, marginBottom: 12 }}>{t.pain}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: "10px", padding: "2px 7px", border: `1px solid ${col}40`, borderRadius: 3, color: col, background: `${col}12` }}>{t.primitive}</span>
                    <div style={{ display: "flex", gap: 10 }}>
                      {[["B", t.b], ["R", t.r], ["S", t.s]].map(([k, v]) => (
                        <span key={k as string} style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text3)" }}>{k}<span style={{ color: "var(--text)" }}>{v}</span></span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Editorial */}
        <div style={{ marginBottom: 64, background: "var(--bg2)", border: "1px solid var(--border2)", borderRadius: 8, padding: "32px 36px" }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 20 }}>Editorial · What this actually means</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
            {[
              { heading: "Cards and KYC tie at 9.2 average — they're the same problem.", body: "Builders can't give agents money because agents can't pass identity checks. These aren't two separate features — they're one infrastructure gap that Naïve closes in a single call chain." },
              { heading: "Email is the most rebuilt primitive in the ecosystem.", body: "Five separate builders all described the same experience: build it, ship it, watch it break in production. Every one built from scratch. The absence of a reusable primitive is costing the industry weeks per project." },
              { heading: "Formation complaints are about betrayal, not price.", body: "Stripe Atlas and Firstbase failures dominate. The emotional tone is 'I trusted you and you failed me.' Naïve's Doola integration lands into a market that's actively looking for an alternative they can trust." },
              { heading: "AEO has no measurement layer — that's the real gap.", body: "Google Analytics exists for SEO. There is no equivalent for LLM citations. Founders who hit rank 1 and see traffic die have nothing to look at. That's the product surface Naïve's /aeo tracks." },
            ].map((e, i) => (
              <div key={i} style={{ borderLeft: "2px solid var(--border2)", paddingLeft: 18 }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: "12px", fontWeight: 600, color: "var(--text)", marginBottom: 8, lineHeight: 1.5 }}>{e.heading}</div>
                <div style={{ fontSize: "13px", color: "var(--text3)", lineHeight: 1.8 }}>{e.body}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Gaps + GEO */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 48 }}>
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border2)", borderRadius: 8, padding: 28 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 20 }}>Content gaps — Naïve has no page for these</div>
            {GAPS.map((g, i) => {
              const col = P_COLORS[g.primitive];
              return (
                <div key={i} style={{ paddingBottom: i < GAPS.length - 1 ? 18 : 0, marginBottom: i < GAPS.length - 1 ? 18 : 0, borderBottom: i < GAPS.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <div style={{ fontFamily: "var(--mono)", fontSize: "12px", fontWeight: 500, color: "var(--text)", lineHeight: 1.45, flex: 1, paddingRight: 12 }}>{g.title}</div>
                    <span style={{ fontFamily: "var(--mono)", fontSize: "9px", padding: "2px 7px", border: `1px solid ${g.urgency === "High" ? "#e2533a40" : "var(--border)"}`, borderRadius: 3, color: g.urgency === "High" ? "#e2533a" : "var(--text3)", background: g.urgency === "High" ? "#e2533a12" : "transparent", whiteSpace: "nowrap" }}>{g.urgency}</span>
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text3)", lineHeight: 1.7, marginBottom: 8 }}>{g.detail}</div>
                  <span style={{ fontFamily: "var(--mono)", fontSize: "10px", padding: "2px 7px", border: `1px solid ${col}40`, borderRadius: 3, color: col, background: `${col}12` }}>{g.primitive}</span>
                </div>
              );
            })}
          </div>

          <div style={{ background: "var(--bg2)", border: "1px solid var(--border2)", borderRadius: 8, padding: 28 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 20 }}>GEO eval prompts — run in ChatGPT · Perplexity · Claude</div>
            {GEO_EVALS.map((g, i) => {
              const col = P_COLORS[g.primitive];
              return (
                <div key={i} style={{ paddingBottom: i < GEO_EVALS.length - 1 ? 16 : 0, marginBottom: i < GEO_EVALS.length - 1 ? 16 : 0, borderBottom: i < GEO_EVALS.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text3)", paddingTop: 2, minWidth: 18 }}>{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <div style={{ fontSize: "11px", color: "var(--text2)", lineHeight: 1.75, marginBottom: 6, fontStyle: "italic" }}>&ldquo;{g.prompt}&rdquo;</div>
                      <span style={{ fontFamily: "var(--mono)", fontSize: "10px", padding: "2px 7px", border: `1px solid ${col}40`, borderRadius: 3, color: col, background: `${col}12` }}>{g.primitive}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer CTA */}
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 40, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "12px", fontWeight: 500, marginBottom: 4 }}>The engine runs this continuously.</div>
            <div style={{ fontSize: "13px", color: "var(--text3)" }}>New threads, new gaps, new scoring — weekly.</div>
          </div>
          <Link href="/engine" style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "var(--text)", border: "1px solid var(--border2)", borderRadius: 6, padding: "10px 20px", textDecoration: "none" }}>
            Open the engine →
          </Link>
        </div>

      </div>
    </div>
  );
}
