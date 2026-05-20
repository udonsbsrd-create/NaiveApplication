import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Naïve Growth Engineer Application — 48h Sprint",
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
            <a href="https://github.com" target="_blank" rel="noopener" style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "var(--text3)" }}>GitHub ↗</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener" style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "var(--text3)" }}>LinkedIn ↗</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 880, margin: "0 auto", padding: "80px 28px 64px" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--green)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 28 }}>
          Growth Engineer Application
        </div>
        <h1 style={{ fontFamily: "var(--mono)", fontSize: "clamp(26px, 5vw, 46px)", fontWeight: 600, lineHeight: 1.18, marginBottom: 24, letterSpacing: "-0.02em" }}>
          I found a bug, built an engine,<br />
          and shipped three content pages.
        </h1>
        <p style={{ color: "var(--text2)", fontSize: "17px", maxWidth: 560, marginBottom: 36, lineHeight: 1.75 }}>
          This is what a growth engineer produces before hearing back from a recruiter.
          The full receipt is below.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { label: "Engine Built", c: "#3ecf78" },
            { label: "Bug Documented", c: "#e8a23a" },
            { label: "3 Pages Shipped", c: "#4a9eff" },
            { label: "GEO Evals Ready", c: "#a78bfa" },
          ].map((b) => (
            <span key={b.label} style={{ fontFamily: "var(--mono)", fontSize: "11px", padding: "5px 12px", border: `1px solid ${b.c}50`, borderRadius: 4, color: b.c, background: `${b.c}12` }}>
              {b.label}
            </span>
          ))}
        </div>
      </section>

      {/* Stats */}
      <div style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--bg2)" }}>
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "36px 28px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {[
            { val: "47+", label: "Threads Scraped" },
            { val: "6", label: "Content Gaps" },
            { val: "3", label: "Pages Shipped" },
            { val: "1", label: "Platform Bug" },
          ].map((s) => (
            <div key={s.label}>
              <div style={{ fontFamily: "var(--mono)", fontSize: "30px", fontWeight: 600 }}>{s.val}</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.09em", marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bug Report */}
      <section style={{ maxWidth: 880, margin: "0 auto", padding: "72px 28px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--amber)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 18 }}>
          Bug Report · P1
        </div>
        <h2 style={{ fontFamily: "var(--mono)", fontSize: "26px", fontWeight: 600, marginBottom: 14, letterSpacing: "-0.01em" }}>
          Auth loop: two domains, zero session sharing
        </h2>
        <p style={{ color: "var(--text2)", marginBottom: 40, maxWidth: 640, lineHeight: 1.8 }}>
          Logged-in users get kicked back to the login page every time they try to select a template. A Reddit user
          reported hitting it 5–6 times before giving up. That's new-user activation revenue leaking daily.
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
          <p style={{ color: "var(--text3)", fontSize: "13px", fontStyle: "italic", lineHeight: 1.7 }}>
            "I signed up, verified email and logged in. Selected a template to look at and the system bounces me out to the login page..
            tried around 5-6 times and then gave up 🤷‍♂️ Not a great first impression."
          </p>
          <p style={{ color: "var(--text3)", fontSize: "11px", marginTop: 6, fontFamily: "var(--mono)" }}>— Reddit user, r/aicuriosity · publicly reported</p>
        </div>
      </section>

      {/* Findings Teaser */}
      <section style={{ maxWidth: 880, margin: "0 auto", padding: "0 28px 72px" }}>
        <Link href="/findings" style={{ textDecoration: "none", display: "block" }}>
          <div style={{ border: "1px solid var(--border2)", borderRadius: 10, padding: "32px 36px", background: "var(--bg2)", display: "grid", gridTemplateColumns: "1fr auto", gap: 32, alignItems: "center", transition: "border-color 0.15s", cursor: "pointer" }}>
            <div>
              <div style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--green)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>Signal Board · Deep Research</div>
              <h3 style={{ fontFamily: "var(--mono)", fontSize: "20px", fontWeight: 600, marginBottom: 10, letterSpacing: "-0.01em" }}>Look what it found.</h3>
              <p style={{ color: "var(--text3)", fontSize: "13px", lineHeight: 1.75, maxWidth: 480, margin: 0 }}>
                19 real threads from Reddit and Hacker News. Builders blocked by missing infrastructure. The engine scored each one — by urgency, by stage, by exactly what Naïve solves.
              </p>
              <div style={{ display: "flex", gap: 16, marginTop: 18, flexWrap: "wrap" }}>
                {[["19", "threads found"], ["9.0", "avg signal score"], ["7", "primitives hit"], ["3", "content gaps"]].map(([val, label]) => (
                  <div key={label}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: "16px", fontWeight: 600, color: "var(--green)" }}>{val}</span>
                    <span style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text3)", marginLeft: 6 }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "var(--green)", border: "1px solid var(--green)", borderRadius: 6, padding: "10px 20px", whiteSpace: "nowrap" }}>Explore findings →</div>
            </div>
          </div>
        </Link>
      </section>

      {/* Engine */}
      <section style={{ maxWidth: 880, margin: "0 auto", padding: "72px 28px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--blue)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 18 }}>
          Tool Built
        </div>
        <h2 style={{ fontFamily: "var(--mono)", fontSize: "26px", fontWeight: 600, marginBottom: 14, letterSpacing: "-0.01em" }}>
          Naïve Query Discovery Engine
        </h2>
        <p style={{ color: "var(--text2)", maxWidth: 620, marginBottom: 44, lineHeight: 1.8 }}>
          A full-stack SEO/GEO intelligence system that finds what Naïve should publish, where it should comment, and how LLMs currently answer queries in the problem space.
          Built to run weekly — not as a one-off.
        </p>

        {/* Architecture card */}
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border2)", borderRadius: 8, padding: 32, marginBottom: 32 }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 24 }}>Architecture</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 32px 1fr", gap: 16, alignItems: "center", marginBottom: 28 }}>
            <div style={{ background: "var(--bg3)", border: "1px solid var(--border2)", borderRadius: 6, padding: "18px 22px" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Backend</div>
              {["FastAPI + Python", "SQLite persistence", "scrapers.py — Reddit · HN · SO", "query_signals.py — PRIMARY/SECONDARY/SKIP", "classifier.py — opportunity scoring"].map((l) => (
                <div key={l} style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "var(--text2)", marginBottom: 5, lineHeight: 1.5 }}>{l}</div>
              ))}
            </div>
            <div style={{ textAlign: "center", color: "var(--text3)", fontSize: "20px" }}>→</div>
            <div style={{ background: "var(--bg3)", border: "1px solid var(--border2)", borderRadius: 6, padding: "18px 22px" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Frontend</div>
              {["Next.js + TypeScript", "Scraper config panel", "Filterable opportunity table", "Content brief generator (Claude)", "AI Scan via GPT-4o-mini", "Export CSV / Growth Sprint MD"].map((l) => (
                <div key={l} style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "var(--text2)", marginBottom: 5, lineHeight: 1.5 }}>{l}</div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 24 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>3-Dimension Scoring (0–100)</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {[
                { axis: "Builder Signal (B)", desc: "Is someone actively building an agent or automation?", w: "× 0.30" },
                { axis: "Bottleneck Signal (R)", desc: "Are they hitting a real-world infra problem Naïve solves?", w: "× 0.50" },
                { axis: "Stage Fit (S)", desc: "Are they in production / deployment, not just ideating?", w: "× 0.20" },
              ].map((s) => (
                <div key={s.axis} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 5, padding: 14 }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "var(--text)", marginBottom: 6 }}>{s.axis}</div>
                  <div style={{ fontSize: "12px", color: "var(--text3)", lineHeight: 1.65, marginBottom: 10 }}>{s.desc}</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "var(--green)" }}>{s.w}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
          {["FastAPI", "Python", "SQLite", "Next.js 15", "TypeScript", "Claude Sonnet", "GPT-4o-mini", "Serper API", "Reddit API", "HN Algolia API"].map((t) => (
            <span key={t} style={{ fontFamily: "var(--mono)", fontSize: "11px", padding: "4px 10px", border: "1px solid var(--border2)", borderRadius: 3, color: "var(--text3)" }}>{t}</span>
          ))}
        </div>

        <div style={{ background: "var(--bg2)", border: "1px solid var(--border2)", borderRadius: 8, padding: "24px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "var(--text)", marginBottom: 6 }}>The engine is live. You can run it yourself.</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--text3)" }}>Open the interactive dashboard — scrape, score, and export content gaps in real time.</div>
          </div>
          <Link
            href="/engine"
            style={{
              fontFamily: "var(--mono)",
              fontSize: "12px",
              fontWeight: 600,
              padding: "10px 20px",
              background: "#4f46e5",
              color: "#fff",
              borderRadius: 5,
              textDecoration: "none",
              whiteSpace: "nowrap",
              letterSpacing: "0.02em",
            }}
          >
            Open the engine →
          </Link>
        </div>
      </section>

      {/* Opportunities */}
      <section style={{ maxWidth: 880, margin: "0 auto", padding: "72px 28px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--green)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 18 }}>
          Sprint Results
        </div>
        <h2 style={{ fontFamily: "var(--mono)", fontSize: "26px", fontWeight: 600, marginBottom: 14, letterSpacing: "-0.01em" }}>
          What it found this week
        </h2>
        <p style={{ color: "var(--text2)", marginBottom: 36, lineHeight: 1.8, maxWidth: 620 }}>
          Every row is a real thread from Reddit. Every gap is a query Naïve has zero indexed content for.
          Score is a weighted blend of builder intent, bottleneck relevance, and deployment stage.
        </p>

        <div style={{ border: "1px solid var(--border2)", borderRadius: 8, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "52px 1fr 110px 110px 90px", background: "var(--bg2)", borderBottom: "1px solid var(--border2)", padding: "10px 18px", fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
            <span>Score</span><span>Query</span><span>Category</span><span>Source</span><span>Asset</span>
          </div>
          {OPPORTUNITIES.map((op, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "52px 1fr 110px 110px 90px", padding: "16px 18px", borderBottom: i < OPPORTUNITIES.length - 1 ? "1px solid var(--border)" : "none", alignItems: "start", background: i % 2 ? "var(--bg2)" : "transparent" }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: "14px", fontWeight: 600, color: op.scoreColor, paddingTop: 2 }}>{op.score}</span>
              <div>
                <div style={{ fontSize: "13px", color: "var(--text)", marginBottom: 6, lineHeight: 1.5 }}>{op.query}</div>
                <div style={{ display: "flex", gap: 6 }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: "10px", padding: "1px 6px", background: "#3ecf7812", border: "1px solid #3ecf7830", borderRadius: 2, color: "var(--green)" }}>PRIMARY</span>
                  {op.gap && <span style={{ fontFamily: "var(--mono)", fontSize: "10px", padding: "1px 6px", background: "#e2533a12", border: "1px solid #e2533a30", borderRadius: 2, color: "var(--red)" }}>content gap</span>}
                </div>
              </div>
              <span style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--text3)", paddingTop: 2 }}>{op.category}</span>
              <span style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--text3)", paddingTop: 2 }}>{op.source}</span>
              <span style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--text3)", paddingTop: 2 }}>{op.asset}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Blog Posts */}
      <section style={{ maxWidth: 880, margin: "0 auto", padding: "72px 28px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--blue)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 18 }}>
          Content Assets
        </div>
        <h2 style={{ fontFamily: "var(--mono)", fontSize: "26px", fontWeight: 600, marginBottom: 14, letterSpacing: "-0.01em" }}>
          Three pages ready to publish
        </h2>
        <p style={{ color: "var(--text2)", marginBottom: 40, lineHeight: 1.8, maxWidth: 620 }}>
          Written for real search intent found by the engine. Each post stays within Naïve's guardrails —
          Naïve is not a bank, no invented pricing, SECONDARY-tier content keeps Naïve as a footnote rather than the main answer.
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
      </section>

      {/* GEO */}
      <section style={{ maxWidth: 880, margin: "0 auto", padding: "72px 28px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "#a78bfa", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 18 }}>
          GEO / AEO
        </div>
        <h2 style={{ fontFamily: "var(--mono)", fontSize: "26px", fontWeight: 600, marginBottom: 14, letterSpacing: "-0.01em" }}>
          Are agents recommending Naïve?
        </h2>
        <p style={{ color: "var(--text2)", marginBottom: 40, lineHeight: 1.8, maxWidth: 620 }}>
          GEO is in the job description for a reason. These 8 prompts test whether ChatGPT, Claude, and Perplexity cite Naïve — and where.
          Run them, log positions, set a baseline. Then track movement weekly as content ships.
        </p>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {GEO_PROMPTS.map((item, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "28px 1fr", gap: 20, padding: "16px 0", borderBottom: i < GEO_PROMPTS.length - 1 ? "1px solid var(--border)" : "none", alignItems: "start" }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--text3)", paddingTop: 3 }}>{String(i + 1).padStart(2, "0")}</span>
              <div>
                <div style={{ fontSize: "14px", color: "var(--text)", marginBottom: 5 }}>&ldquo;{item.prompt}&rdquo;</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--text3)" }}>{item.note}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Week 2 */}
      <section style={{ maxWidth: 880, margin: "0 auto", padding: "72px 28px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--amber)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 18 }}>
          Roadmap
        </div>
        <h2 style={{ fontFamily: "var(--mono)", fontSize: "26px", fontWeight: 600, marginBottom: 14, letterSpacing: "-0.01em" }}>
          What Week 2 looks like
        </h2>
        <p style={{ color: "var(--text2)", marginBottom: 40, lineHeight: 1.8, maxWidth: 620 }}>
          The engine is the repeatable system. The three posts above are the first sprint output. Here's what compounds next.
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

      {/* Footer */}
      <footer style={{ background: "var(--bg2)", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "36px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "13px", color: "var(--text)", marginBottom: 6 }}>Built for Naïve · 48-hour growth sprint</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--text3)" }}>
              Engine at{" "}
              <a href="https://github.com" target="_blank" rel="noopener" style={{ color: "var(--green)" }}>github.com ↗</a>
              {"  ·  "}
              <a href="https://linkedin.com/in/prajeesh" target="_blank" rel="noopener" style={{ color: "var(--green)" }}>linkedin.com/in/prajeesh ↗</a>
            </div>
          </div>
          <div style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--text3)" }}>May 2026</div>
        </div>
      </footer>

    </div>
  );
}
