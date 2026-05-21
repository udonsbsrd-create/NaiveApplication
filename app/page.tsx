import type { Metadata } from "next";
import Link from "next/link";
import StickyNav from "./sticky-nav";

export const metadata: Metadata = {
  title: "Naïve Growth Engineer Application – 48h Sprint",
  description:
    "Query discovery engine, platform bug report, and three growth-ready blog posts — shipped in 48 hours.",
};

const OPPORTUNITIES = [
  { score: 91, scoreColor: "#3ecf78", query: "How do I give my AI agent a bank account and virtual card?", category: "agent-identity", source: "r/AIAgents", gap: true, asset: "docs + blog" },
  { score: 88, scoreColor: "#3ecf78", query: "Best way to run a business autonomously with AI employees", category: "deployment", source: "r/SaaS", gap: true, asset: "landing page" },
  { score: 82, scoreColor: "#3ecf78", query: "Sole proprietor vs LLC banking — does it actually matter?", category: "formation", source: "r/entrepreneur", gap: true, asset: "blog post" },
  { score: 79, scoreColor: "#e8a23a", query: "Is opening a US LLC as a non-US founder actually worth it?", category: "formation", source: "r/entrepreneur", gap: true, asset: "blog post" },
  { score: 79, scoreColor: "#e8a23a", query: "Did you form an LLC before turning on payments?", category: "formation", source: "r/entrepreneur", gap: true, asset: "blog post" },
  { score: 78, scoreColor: "#e8a23a", query: "What is the best option for a remote LLC?", category: "formation", source: "r/entrepreneur", gap: true, asset: "comparison" },
];

const GEO_PROMPTS = [
  { prompt: "How do I form a company for an AI agent?", note: "Naïve currently absent from most LLM answers" },
  { prompt: "What's the best way to give an AI agent a bank account and virtual card?", note: "Naïve /cards is the only direct answer — not yet cited" },
  { prompt: "How do I incorporate a US LLC as a non-US founder without an SSN?", note: "Naïve competes with Doola/Firstbase/Stripe Atlas here" },
  { prompt: "What tools let me run a business autonomously with AI employees?", note: "Category-creating query — Naïve should own this" },
  { prompt: "How do I get cited by ChatGPT and Perplexity for my SaaS?", note: "Meta-GEO — Naïve SEO/AEO endpoints are differentiated" },
  { prompt: "What's the best API for autonomous company formation?", note: "High-intent developer query" },
  { prompt: "How do I do KYC verification for an AI agent platform?", note: "Footprint-backed /kyc is a direct answer" },
  { prompt: "What is usenaive.ai and what does it do?", note: "Brand awareness baseline eval" },
];

const WEEK2 = [
  { label: "Expand to agent ICPs", detail: "Add r/LangChain, r/AIAgents, r/ClaudeAI, Indie Hackers, GitHub Discussions. Agent-builder ICP has near-zero scraper coverage today." },
  { label: "Run GEO eval script", detail: "Script the 8 prompts above against Claude, ChatGPT, and Perplexity. Log Naïve position, which competitors appear first, gap by category." },
  { label: "Programmatic LLC pages", detail: "State-by-state LLC formation comparison (Wyoming vs Delaware vs Nevada). 10k+ URL surface with real, measurable search demand." },
  { label: "Stripe Atlas vs Doola vs Naïve", detail: "High-intent comparison page. Naïve's API-first angle is differentiated enough to win the bottom half of the funnel." },
  { label: "evals/ automation script", detail: "Query → LLM API → extract Naïve mention + rank → log to SQLite. Runs weekly, tracks movement across models." },
];

export default function Home() {
  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>

      {/* Banner */}
      <div style={{ borderBottom: "1px solid var(--border)", background: "var(--bg2)" }}>
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "8px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--text3)", letterSpacing: "0.05em" }}>
            48-hour sprint · Growth Engineer Application
          </span>
          <a href="https://usenaive.ai" target="_blank" rel="noopener" style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--green)" }}>
            usenaive.ai ↗
          </a>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "18px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: "15px", fontWeight: 600 }}>
            naïve <span style={{ color: "var(--text3)" }}>×</span> <span style={{ color: "var(--green)" }}>prajeesh</span>
          </span>
          <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
            <a href="https://github.com/Prajeesh-Meethale" target="_blank" rel="noopener" style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "var(--text3)" }}>GitHub ↗</a>
            <a href="https://www.linkedin.com/in/prajeesh-pm/" target="_blank" rel="noopener" style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "var(--text3)" }}>LinkedIn ↗</a>
          </div>
        </div>
      </nav>

      <StickyNav />

      {/* Hero */}
      <section style={{ maxWidth: 880, margin: "0 auto", padding: "80px 28px 64px", paddingTop: "120px" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--green)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 28 }}>
          Growth Engineer Application
        </div>
        <h1 style={{ fontFamily: "var(--mono)", fontSize: "clamp(26px, 5vw, 46px)", fontWeight: 600, lineHeight: 1.18, marginBottom: 24, letterSpacing: "-0.02em" }}>
          I found a bug, built an engine,<br />
          and generated thirty content briefs.
        </h1>
        <p style={{ color: "var(--text2)", fontSize: "17px", maxWidth: 560, marginBottom: 36, lineHeight: 1.75 }}>
          Cross-domain auth bug — fires on every new user, right after email verification. A query discovery engine that scores content gaps weekly across Reddit and HN. Thirty SEO briefs produced by the engine, each mapped to a real query with no existing answer.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { label: "Engine Built", c: "#3ecf78" },
            { label: "Bug Documented", c: "#e8a23a" },
            { label: "30 Pages Generated", c: "#4a9eff" },
            { label: "Roadmap Written", c: "#a78bfa" },
          ].map((b) => (
            <span key={b.label} style={{ fontFamily: "var(--mono)", fontSize: "11px", padding: "5px 12px", border: `1px solid ${b.c}50`, borderRadius: 4, color: b.c, background: `${b.c}12` }}>
              {b.label}
            </span>
          ))}
        </div>
      </section>

      {/* Bug Report */}
      <section id="bug" style={{ maxWidth: 880, margin: "0 auto", padding: "72px 28px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--amber)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 18 }}>
          Bug Report · P1
        </div>
        <h2 style={{ fontFamily: "var(--mono)", fontSize: "26px", fontWeight: 600, marginBottom: 14, letterSpacing: "-0.01em" }}>
          Auth loop: two domains, zero session sharing
        </h2>
        <p style={{ color: "var(--text2)", marginBottom: 40, maxWidth: 640, lineHeight: 1.8 }}>
          Logged in at app.usenaive.ai. Hit Browse Templates. The marketing site loaded with no session — like the login never happened. Tried re-authenticating. Still nothing. Took three loops to map it: the app subdomain and the templates page are different origins with no cookie bridge. This fires every time, for every new user, right after they verify their email.
        </p>

        {/* Flow diagram */}
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border2)", borderRadius: 8, padding: 28, marginBottom: 32 }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 22 }}>Reproduction flow</div>
          {[
            { n: "1", text: "User logs in at app.usenaive.ai", badge: "✓ Authenticated", bc: "#3ecf78" },
            { n: "2", text: 'Clicks "Browse templates" — navigates to usenaive.ai/templates (different origin)', badge: "↗ Cross-domain", bc: "#4a9eff" },
            { n: "3", text: "Templates page loads — header shows Log in button, no session detected", badge: "✗ Session lost", bc: "#e2533a" },
            { n: "4", text: 'User clicks "Get" on any template — redirected to /login', badge: "∞ Loop begins", bc: "#e8a23a" },
            { n: "5", text: "User logs in → redirected back to templates → still not authenticated → /login again", badge: "", bc: "" },
          ].map((row, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 20, padding: "12px 0", borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--text3)", minWidth: 14, paddingTop: 2 }}>{row.n}</span>
              <span style={{ color: "var(--text2)", fontSize: "13px", flex: 1, lineHeight: 1.6 }}>{row.text}</span>
              {row.badge && (
                <span style={{ fontFamily: "var(--mono)", fontSize: "10px", padding: "2px 8px", border: `1px solid ${row.bc}40`, borderRadius: 3, color: row.bc, background: `${row.bc}12`, whiteSpace: "nowrap", marginTop: 2 }}>
                  {row.badge}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Root cause + fix */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border2)", borderRadius: 6, padding: 22 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--red)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Root Cause</div>
            <p style={{ color: "var(--text2)", fontSize: "13px", lineHeight: 1.75 }}>
              Auth cookies are scoped to{" "}
              <code style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "var(--text)", background: "var(--bg3)", padding: "1px 5px", borderRadius: 3 }}>app.usenaive.ai</code>.
              The marketing site at{" "}
              <code style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "var(--text)", background: "var(--bg3)", padding: "1px 5px", borderRadius: 3 }}>usenaive.ai</code>{" "}
              is a different origin. Browsers block cookies from being shared cross-origin by default — so the marketing site never sees the session.
            </p>
          </div>
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border2)", borderRadius: 6, padding: 22 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--green)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Recommended Fix</div>
            <p style={{ color: "var(--text2)", fontSize: "13px", lineHeight: 1.75, marginBottom: 12 }}>
              <strong style={{ color: "var(--text)" }}>Option A (simplest):</strong> Set cookie domain to{" "}
              <code style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "var(--text)", background: "var(--bg3)", padding: "1px 5px", borderRadius: 3 }}>.usenaive.ai</code>.
              Both subdomains share the session automatically — zero UI changes needed.
            </p>
            <p style={{ color: "var(--text2)", fontSize: "13px", lineHeight: 1.75 }}>
              <strong style={{ color: "var(--text)" }}>Option B:</strong> When a logged-in user navigates from app to templates, append a short-lived signed token in the URL for the marketing site to consume.
            </p>
          </div>
        </div>

        <div style={{ borderLeft: "2px solid var(--amber)", paddingLeft: 18 }}>
          <p style={{ color: "var(--text3)", fontSize: "13px", lineHeight: 1.75 }}>
            Tested across Chrome, Firefox, and Safari. Reproducible every time. Not a fluke.
          </p>
        </div>
      </section>

      {/* Engine */}
      <section id="engine" style={{ maxWidth: 880, margin: "0 auto", padding: "72px 28px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--blue)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 18 }}>
          Tool Built
        </div>
        <h2 style={{ fontFamily: "var(--mono)", fontSize: "26px", fontWeight: 600, marginBottom: 14, letterSpacing: "-0.01em" }}>
          Naïve Query Discovery Engine
        </h2>
        <p style={{ color: "var(--text2)", maxWidth: 620, marginBottom: 44, lineHeight: 1.8 }}>
          Scrapes Reddit, HN, and Stack Overflow weekly. Scores every thread by how urgently Naïve solves the problem. Spits out ranked content gaps.
        </p>

        {/* What it found card */}
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border2)", borderRadius: 8, padding: "28px 32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--green)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14 }}>Engine Findings</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "17px", fontWeight: 600, lineHeight: 1.45, marginBottom: 12 }}>Six builders independently rebuilt agent email. None knew about the others.</div>
            <p style={{ color: "var(--text3)", fontSize: "12px", lineHeight: 1.8, marginBottom: 20 }}>
              The engine surfaced the same three infrastructure gaps across unconnected threads — cards, email, KYC. Each team solved it from scratch.
            </p>
            <Link href="/findings" style={{ fontFamily: "var(--mono)", fontSize: "12px", fontWeight: 600, padding: "9px 18px", background: "var(--green)", color: "#0a1a0f", borderRadius: 5, textDecoration: "none", display: "inline-block", letterSpacing: "0.02em" }}>See the findings →</Link>
          </div>
          <div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Threads by primitive</div>
            {[
              { name: "Cards", count: 6, color: "#2d7a4f" },
              { name: "Email", count: 5, color: "#2563a8" },
              { name: "Orchestration", count: 3, color: "#b91c1c" },
              { name: "AEO", count: 3, color: "#9a6800" },
              { name: "Formation", count: 3, color: "#6d28d9" },
              { name: "KYC", count: 2, color: "#b45309" },
            ].map((p) => (
              <div key={p.name} style={{ display: "grid", gridTemplateColumns: "80px 1fr 20px", gap: 8, alignItems: "center", marginBottom: 7 }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text3)" }}>{p.name}</span>
                <div style={{ height: 6, background: "var(--bg3)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${(p.count / 6) * 100}%`, height: "100%", background: p.color, borderRadius: 3 }} />
                </div>
                <span style={{ fontFamily: "var(--mono)", fontSize: "10px", color: p.color }}>{p.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Engine live card */}
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border2)", borderRadius: 8, padding: "24px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
          <div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "var(--text)", marginBottom: 6 }}>The engine is live. You can run it yourself.</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--text3)" }}>Open the interactive dashboard — scrape, score, and export content gaps in real time.</div>
          </div>
          <Link href="/engine" style={{ fontFamily: "var(--mono)", fontSize: "12px", fontWeight: 600, padding: "10px 20px", background: "#4f46e5", color: "#fff", borderRadius: 5, textDecoration: "none", whiteSpace: "nowrap", letterSpacing: "0.02em" }}>
            Open the engine →
          </Link>
        </div>

        {/* Architecture card */}
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border2)", borderRadius: 8, padding: 32, marginBottom: 32 }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 24 }}>Architecture</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 32px 1fr", gap: 16, alignItems: "center", marginBottom: 28 }}>
            <div style={{ background: "var(--bg3)", borderRadius: 6, padding: "14px 18px" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text3)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.07em" }}>Frontend</div>
              {["Next.js 14 · App Router", "TypeScript", "Inline styles (no framework)"].map((t) => (
                <div key={t} style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--text2)", marginBottom: 4 }}>— {t}</div>
              ))}
            </div>
            <div style={{ textAlign: "center", fontFamily: "var(--mono)", fontSize: "14px", color: "var(--text3)" }}>→</div>
            <div style={{ background: "var(--bg3)", borderRadius: 6, padding: "14px 18px" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text3)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.07em" }}>Backend</div>
              {["FastAPI · Python", "Reddit + HN scrapers", "OpenRouter (Claude/GPT scoring)"].map((t) => (
                <div key={t} style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--text2)", marginBottom: 4 }}>— {t}</div>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {[
              { label: "Data sources", val: "Reddit · HN · Stack Overflow" },
              { label: "Scoring", val: "Builder signal · Bottleneck · Stage fit" },
              { label: "Output", val: "Content briefs · Gap scores · GEO evals" },
            ].map((s) => (
              <div key={s.label} style={{ borderTop: "1px solid var(--border2)", paddingTop: 12 }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--text2)" }}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section id="blog" style={{ maxWidth: 880, margin: "0 auto", padding: "72px 28px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--blue)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 18 }}>
          Content Assets
        </div>
        <h2 style={{ fontFamily: "var(--mono)", fontSize: "26px", fontWeight: 600, marginBottom: 14, letterSpacing: "-0.01em" }}>
          30 briefs. 3 published. All engine output.
        </h2>
        <p style={{ color: "var(--text2)", marginBottom: 40, lineHeight: 1.8, maxWidth: 620 }}>
          The engine found 30 queries worth writing for. I reviewed each one and picked three to write first. The rest are in Google Drive — brief, angle, and target query already done.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[
            {
              tag: "Formation SEO",
              tagColor: "var(--green)",
              title: "How to Form a US LLC as a Non-US Founder (Without an SSN)",
              desc: "Step-by-step for international founders — EIN without SSN, registered agent, banking setup, and the API-first option.",
              meta: "2 ranking opportunities",
              href: "/blog/non-us-llc-no-ssn",
            },
            {
              tag: "Agent ICP",
              tagColor: "var(--amber)",
              title: "How to Give Your AI Agent a Virtual Card and Real-World Spending Power",
              desc: "Why agents need real-world financial identity, how /cards solves it, and a code walkthrough for issuing per-agent virtual cards.",
              meta: "Category-creating query",
              href: "/blog/ai-agent-virtual-card",
            },
            {
              tag: "Formation SEO",
              tagColor: "var(--green)",
              title: "Sole Proprietor vs LLC: Does It Actually Matter for Your Bank Account?",
              desc: "The honest answer to the most-asked formation question on r/entrepreneur — what banks actually care about, and when to stop delaying.",
              meta: "High-volume query",
              href: "/blog/sole-proprietor-vs-llc-banking",
            },
          ].map((post) => (
            <Link key={post.href} href={post.href} style={{ display: "flex", flexDirection: "column", background: "var(--bg2)", border: "1px solid var(--border2)", borderRadius: 8, padding: 26, textDecoration: "none" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: "10px", color: post.tagColor, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>{post.tag}</div>
              <h3 style={{ fontFamily: "var(--mono)", fontSize: "13px", fontWeight: 600, color: "var(--text)", lineHeight: 1.55, marginBottom: 14, flex: 1 }}>{post.title}</h3>
              <p style={{ color: "var(--text3)", fontSize: "12px", lineHeight: 1.7, marginBottom: 22 }}>{post.desc}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: 14 }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text3)" }}>{post.meta}</span>
                <span style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "var(--green)" }}>Read →</span>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: 28, paddingTop: 24, borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--text3)" }}>27 more briefs available · cards · email · kyc · orchestration · aeo</span>
          <a href="https://drive.google.com/drive/folders/1m2ok6_ltVZC4po0Cav7jiPD1DigUiqHS?usp=drive_link" target="_blank" rel="noopener" style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "var(--blue)", textDecoration: "none" }}>Full pipeline (Google Drive) ↗</a>
        </div>
      </section>

      {/* Roadmap */}
      <section id="roadmap" style={{ maxWidth: 880, margin: "0 auto", padding: "72px 28px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--amber)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 18 }}>
          Roadmap
        </div>
        <h2 style={{ fontFamily: "var(--mono)", fontSize: "26px", fontWeight: 600, marginBottom: 14, letterSpacing: "-0.01em" }}>
          What Week 2 looks like
        </h2>
        <p style={{ color: "var(--text2)", marginBottom: 40, lineHeight: 1.8, maxWidth: 620 }}>
          The engine runs weekly. Three posts are the first round of output. Here&rsquo;s what I&rsquo;d build next.
        </p>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {WEEK2.map((item, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "28px 180px 1fr", gap: 24, padding: "18px 0", borderBottom: i < WEEK2.length - 1 ? "1px solid var(--border)" : "none", alignItems: "start" }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--text3)", paddingTop: 2 }}>{String(i + 1).padStart(2, "0")}</span>
              <span style={{ fontFamily: "var(--mono)", fontSize: "12px", fontWeight: 500, color: "var(--text)", paddingTop: 2, lineHeight: 1.5 }}>{item.label}</span>
              <span style={{ color: "var(--text3)", fontSize: "13px", lineHeight: 1.75 }}>{item.detail}</span>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section style={{ maxWidth: 880, margin: "0 auto", padding: "56px 28px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--text3)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 20 }}>About</div>
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border2)", borderRadius: 8, padding: "32px 36px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 28, alignItems: "start", marginBottom: 24 }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "var(--bg3)", border: "1px solid var(--border2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: "20px", fontWeight: 600, color: "var(--green)" }}>P</span>
            </div>
            <div>
              <div style={{ fontFamily: "var(--mono)", fontSize: "15px", fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>Prajeesh Meethale</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--text3)", marginBottom: 18 }}>Growth Engineer</div>
              <p style={{ color: "var(--text2)", fontSize: "13px", lineHeight: 1.85, maxWidth: 520, margin: 0, marginBottom: 14 }}>
                I&apos;m a growth engineer with a background in systems, automation, and developer-focused growth. I studied at Indian Institute of Technology Madras, and I tend to work on the infrastructure behind modern growth operations — scrapers, scoring systems, research pipelines, and publishing workflows.
              </p>
              <p style={{ color: "var(--text2)", fontSize: "13px", lineHeight: 1.85, maxWidth: 520, margin: 0, marginBottom: 14 }}>
                I was also a National Mathematics Olympiad runner-up, which probably explains why I enjoy growth problems that are really ranking, data, or optimization problems underneath.
              </p>
              <p style={{ color: "var(--text2)", fontSize: "13px", lineHeight: 1.85, maxWidth: 520, margin: 0, marginBottom: 14 }}>
                My stack is mostly Next.js, TypeScript, Python, and LLM tooling. I use AI where it actually helps, not as decoration.
              </p>
              <p style={{ color: "var(--text2)", fontSize: "13px", lineHeight: 1.85, maxWidth: 520, margin: 0 }}>
                Right now, I&apos;m organizing <em>The Modern AI Stack</em> in Hyderabad — a gathering of 100+ AI practitioners around AI workflows, agent security, and vibe coding. I&apos;ve been involved in developer community and ecosystem work for a while, and I enjoy building things that make technical ideas easier to use and scale.
              </p>
            </div>
          </div>
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 20, marginBottom: 20 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Past Work</div>
            <a href="https://www.meethale.com/work/signal-led-outbound" target="_blank" rel="noopener" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, textDecoration: "none", flexWrap: "wrap" }}>
              <div>
                <div style={{ fontFamily: "var(--mono)", fontSize: "12px", fontWeight: 600, color: "var(--text)", marginBottom: 5 }}>Signal-Led Outbound Engine</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--text3)", lineHeight: 1.7 }}>Python scrapers + Claude 3.5 + Clay — replaced firmographic targeting with job-board intent signals</div>
              </div>
              <div style={{ display: "flex", gap: 16, flexShrink: 0, alignItems: "center", flexWrap: "wrap" }}>
                {[
                  { label: "Reply rate", val: "0.4% → 4.2%" },
                  { label: "CPL", val: "−70.8%" },
                ].map((m) => (
                  <div key={m.label} style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "var(--mono)", fontSize: "13px", fontWeight: 600, color: "var(--green)" }}>{m.val}</div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{m.label}</div>
                  </div>
                ))}
                <span style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--text3)" }}>Case study ↗</span>
              </div>
            </a>
          </div>
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["Growth Engineering", "SEO / AEO", "Full-Stack", "Content Systems"].map((tag) => (
                <span key={tag} style={{ fontFamily: "var(--mono)", fontSize: "10px", padding: "4px 10px", border: "1px solid var(--border2)", borderRadius: 4, color: "var(--text3)" }}>{tag}</span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <a href="https://github.com/Prajeesh-Meethale" target="_blank" rel="noopener" style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--green)", textDecoration: "none" }}>GitHub ↗</a>
              <a href="https://www.linkedin.com/in/prajeesh-pm/" target="_blank" rel="noopener" style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--green)", textDecoration: "none" }}>LinkedIn ↗</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "var(--bg2)", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "36px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "13px", color: "var(--text)", marginBottom: 6 }}>Built for Naïve · 48-hour growth sprint</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--text3)" }}>
              Engine at{" "}
              <a href="https://github.com/Prajeesh-Meethale" target="_blank" rel="noopener" style={{ color: "var(--green)" }}>github.com/Prajeesh-Meethale ↗</a>
              {"  ·  "}
              <a href="https://www.linkedin.com/in/prajeesh-pm/" target="_blank" rel="noopener" style={{ color: "var(--green)" }}>linkedin.com/in/prajeesh-pm ↗</a>
            </div>
          </div>
          <div style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--text3)" }}>May 2026</div>
        </div>
      </footer>

    </div>
  );
}
