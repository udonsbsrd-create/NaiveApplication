"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "bug",     label: "Bug Report", color: "var(--amber)" },
  { id: "engine",  label: "Engine",     color: "var(--blue)"  },
  { id: "results", label: "Results",    color: "var(--green)" },
  { id: "blog",    label: "Blog",       color: "var(--blue)"  },
  { id: "geo",     label: "GEO",        color: "#a78bfa"      },
  { id: "roadmap", label: "Roadmap",    color: "var(--amber)" },
];

export default function StickyNav() {
  const [active, setActive] = useState("");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: "-25% 0px -65% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(245,243,238,0.92)", backdropFilter: "blur(10px)",
      borderBottom: "1px solid var(--border)",
      display: "flex", justifyContent: "center",
    }}>
      <div style={{ maxWidth: 880, width: "100%", display: "flex", alignItems: "stretch", padding: "0 28px", height: 40 }}>
        {SECTIONS.map(({ id, label, color }, i) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
              style={{
                fontFamily: "var(--mono)", fontSize: "11px", letterSpacing: "0.06em",
                background: "none", border: "none", cursor: "pointer",
                padding: i === 0 ? "0 16px 0 0" : "0 16px",
                color: isActive ? color : "var(--text3)",
                fontWeight: isActive ? 600 : 400,
                borderBottom: isActive ? "2px solid " + color : "2px solid transparent",
                borderTop: "2px solid transparent",
                transition: "color 0.18s, border-color 0.18s",
                display: "flex", alignItems: "center", gap: 8,
                whiteSpace: "nowrap",
              }}
            >
              {i > 0 && <span style={{ color: "var(--border2)", fontSize: "10px", fontWeight: 400 }}>·</span>}
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
