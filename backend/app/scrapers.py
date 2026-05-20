from __future__ import annotations

from concurrent.futures import TimeoutError, ThreadPoolExecutor, as_completed
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from html import unescape
from urllib.parse import quote_plus
import re

import requests

from .classifier import classify_category, competition_score, naive_has_content, normalize_raw_score, opportunity
from .models import ScrapeOptions
from .query_signals import allowed_post_type, classify_fit, is_relevant_query, relevance_score, three_dim_score

CATEGORY_KEYWORDS = {
    "formation": [
        "stripe atlas vs doola",
        "stripe atlas vs firstbase",
        "doola vs firstbase",
        "best llc formation non-us",
        "us llc non resident",
        "non-us founder llc",
        "indian founder us llc",
        "open us company from abroad",
        "dissolve doola llc",
        "dissolve us llc foreign",
        "ein for llc non resident",
        "ein without ssn",
        "delaware llc non resident",
        "registered agent address",
        "company formation for ai agent",
        "incorporate llc api",
        "stripe atlas alternative",
        "form us llc remotely",
        "foreign founder us company",
        "us company formation abroad",
        "llc as non resident",
        "american company foreign founder",
        "form llc india",
    ],
    "banking": [
        "us business bank account non resident",
        "mercury bank non us",
        "mercury rejected non resident",
        "relay business account",
        "wise business account us llc",
        "open bank account for llc",
        "virtual card for startup",
        "stripe issuing llc",
        "ai agent bank account",
        "business bank account for llc india",
        "mercury vs relay",
        "virtual card for agents",
        "give agent payment card",
        "corporate card ai agent",
        "issue card to agent",
        "give my agent a credit card",
        "agent needs to make purchases",
        "autonomous spending limits",
        "agent spend money",
        "card for my agent",
        "virtual card for ai",
    ],
    "identity": [
        "business email domain llc",
        "email for us llc",
        "domain for startup llc",
        "agent business email",
        "professional email non us founder",
        "business email for ai agent",
    ],
    "kyc": [
        "kyc for us llc",
        "beneficial ownership report",
        "boi filing llc",
        "footprint kyc startup",
        "identity verification for company formation",
        "kyc non us founder",
        "fema odi us llc india",
        "kyc for ai agent",
        "kyc for ai platform",
        "verify agent identity",
        "kyc without ssn",
    ],
    "infrastructure": [
        "ai agent real world",
        "langchain real world actions",
        "crewai production",
        "autonomous agent tools",
        "agentic workflow production",
        "ai agent take actions",
        "give my agent",
        "agent access to",
        "ai agent money",
        "autonomous company",
        "ai coworker",
        "ai agent framework production",
        "agent business actions",
        "my agent needs to",
        "agent hits a wall",
        "agent can't do",
        "agent cannot",
        "real world action bottleneck",
        "agent operate in the real world",
        "autonomous agent needs",
        "give my bot",
        "multi-agent task delegation",
        "spawn sub-agents",
        "autonomous workforce",
    ],
    "deployment": [
        "run company with ai",
        "ai agents run business",
        "autonomous business",
        "ai worker startup",
        "deploy ai agent",
        "ai automate company",
        "run startup with ai",
        "headless company",
    ],
    "mcp-discovery": [
        "model context protocol",
        "mcp server",
        "mcp tools",
        "connect mcp",
        "claude mcp",
        "cursor mcp",
        "mcp integration",
        "mcp for",
    ],
    "aeo": [
        "answer engine optimization",
        "llm mentions",
        "get cited by chatgpt",
        "cited by ai",
        "brand mentions ai",
        "ai brand visibility",
        "perplexity optimization",
        "chatgpt mentions brand",
        "llm seo",
        "geo seo ai",
        "ai search optimization",
        "track ai mentions",
        "ai keyword research",
    ],
}

REDDIT_SOURCES = {
    "r/entrepreneur": "entrepreneur",
    "r/startups": "startups",
    "r/smallbusiness": "smallbusiness",
    "r/legaladvice": "legaladvice",
    "r/indiehackers": "indiehackers",
    "r/SaaS": "SaaS",
    "r/AIAgents": "AIAgents",
    "r/LangChain": "LangChain",
    "r/ClaudeAI": "ClaudeAI",
    "r/AutoGPT": "AutoGPT",
    "r/SideProject": "SideProject",
    "r/LocalLLaMA": "LocalLLaMA",
    "r/digitalnomad": "digitalnomad",
    "r/IndiaStartups": "IndiaStartups",
}

HEADERS = {"User-Agent": "naive-query-discovery/0.3 (naive-geo-discovery)"}

DEFAULT_SOURCE_FLOORS = {
    "r/entrepreneur": 5,
    "r/startups": 5,
    "r/smallbusiness": 4,
    "r/legaladvice": 3,
    "r/indiehackers": 4,
    "r/SaaS": 4,
    "r/AIAgents": 3,
    "Hacker News": 5,
    "Stack Overflow": 1,
    "r/LangChain": 3,
    "r/ClaudeAI": 3,
    "r/AutoGPT": 2,
    "r/SideProject": 3,
    "r/LocalLLaMA": 3,
    "r/digitalnomad": 4,
    "r/IndiaStartups": 2,
}

PRESETS = {
    "tight": {
        "recency_days": 90,
        "max_results": 15,
        "post_types": ["questions", "help", "ask_hn"],
        "floors": {**DEFAULT_SOURCE_FLOORS, "r/entrepreneur": 8, "r/startups": 8, "Hacker News": 8},
    },
    "balanced": {
        "recency_days": 180,
        "max_results": 60,
        "post_types": ["questions", "help", "ask_hn"],
        "floors": DEFAULT_SOURCE_FLOORS,
    },
    "wide": {
        "recency_days": 365,
        "max_results": 120,
        "post_types": ["questions", "help", "discussion", "ask_hn"],
        "floors": {**DEFAULT_SOURCE_FLOORS, "r/entrepreneur": 2, "r/startups": 2, "r/smallbusiness": 2, "r/legaladvice": 1, "Hacker News": 2, "r/LangChain": 1, "r/ClaudeAI": 1, "r/digitalnomad": 2, "r/IndiaStartups": 1},
    },
}


@dataclass
class ScrapedItem:
    text: str
    source: str
    url: str
    activity_score: int


def resolve_options(options: ScrapeOptions | None) -> ScrapeOptions:
    resolved = options or ScrapeOptions()
    preset = PRESETS.get(resolved.intent_mode, PRESETS["balanced"])
    if not resolved.user_overrides:
        resolved.recency_days = preset["recency_days"]
        resolved.max_results = preset["max_results"]
        resolved.post_types = list(preset["post_types"])
        resolved.source_floors = dict(preset["floors"])
    return resolved


def selected_keywords(categories: list[str]) -> list[str]:
    keywords: list[str] = []
    for category in categories:
        keywords.extend(CATEGORY_KEYWORDS.get(category, []))
    return sorted(set(keywords))


def cutoff_for(days: int) -> int:
    return int((datetime.now(timezone.utc) - timedelta(days=days)).timestamp())


def clean_title(title: str) -> str:
    title = unescape(re.sub(r"<[^>]+>", "", title or ""))
    if "â" in title or "Ã" in title:
        try:
            title = title.encode("latin1").decode("utf-8")
        except UnicodeError:
            pass
    return re.sub(r"\s+", " ", title).strip()


def collect_parallel(tasks, fetch, max_workers: int, timeout: int) -> list[ScrapedItem]:
    executor = ThreadPoolExecutor(max_workers=max_workers)
    futures = [executor.submit(fetch, *task) if isinstance(task, tuple) else executor.submit(fetch, task) for task in tasks]
    items: list[ScrapedItem] = []
    try:
        for future in as_completed(futures, timeout=timeout):
            try:
                items.extend(future.result())
            except Exception:
                continue
    except TimeoutError:
        for future in futures:
            future.cancel()
    finally:
        executor.shutdown(wait=False, cancel_futures=True)
    return items


def scrape_reddit(options: ScrapeOptions, keywords: list[str], cutoff: int) -> list[ScrapedItem]:
    active_sources = [source for source in options.sources if source in REDDIT_SOURCES]

    def fetch(source: str, keyword: str) -> list[ScrapedItem]:
        subreddit = REDDIT_SOURCES[source]
        response = requests.get(
            f"https://www.reddit.com/r/{subreddit}/search.json",
            params={"q": keyword, "restrict_sr": 1, "sort": "top", "limit": 25, "t": "year"},
            headers=HEADERS,
            timeout=8,
        )
        response.encoding = "utf-8"
        response.raise_for_status()
        found: list[ScrapedItem] = []
        floor = options.source_floors.get(source, 5)
        for child in response.json().get("data", {}).get("children", []):
            data = child.get("data", {})
            title = clean_title(data.get("title") or "")
            upvotes = int(data.get("ups") or 0)
            comments = int(data.get("num_comments") or 0)
            created_utc = int(data.get("created_utc") or 0)
            if not title or created_utc < cutoff or upvotes < floor:
                continue
            if not allowed_post_type(title, options.post_types) or not is_relevant_query(title, options.intent_mode):
                continue
            permalink = data.get("permalink") or ""
            found.append(
                ScrapedItem(
                    text=title,
                    source=source,
                    url=f"https://www.reddit.com{permalink}" if permalink else data.get("url") or "",
                    activity_score=upvotes + comments,
                )
            )
        return found

    return collect_parallel([(source, keyword) for source in active_sources for keyword in keywords], fetch, 10, 24)


def scrape_hn(options: ScrapeOptions, keywords: list[str], cutoff: int) -> list[ScrapedItem]:
    if "Hacker News" not in options.sources:
        return []
    ask_only = "ask_hn" in options.post_types

    def fetch(keyword: str) -> list[ScrapedItem]:
        params = {"query": keyword, "numericFilters": f"created_at_i>={cutoff}"}
        if ask_only:
            params["tags"] = "ask_hn"
        response = requests.get("https://hn.algolia.com/api/v1/search", params=params, headers=HEADERS, timeout=8)
        response.encoding = "utf-8"
        response.raise_for_status()
        found: list[ScrapedItem] = []
        floor = options.source_floors.get("Hacker News", 10)
        for hit in response.json().get("hits", []):
            title = clean_title(hit.get("title") or hit.get("story_title") or "")
            points = int(hit.get("points") or 0)
            created = int(hit.get("created_at_i") or 0)
            if not title or created < cutoff or points < floor:
                continue
            if ask_only and not title.startswith("Ask HN:"):
                continue
            cleaned = title.removeprefix("Ask HN:").strip()
            if not allowed_post_type(cleaned, options.post_types) and not ask_only:
                continue
            if not is_relevant_query(cleaned, options.intent_mode):
                continue
            object_id = hit.get("objectID")
            found.append(
                ScrapedItem(
                    text=title,
                    source="Hacker News",
                    url=hit.get("url") or f"https://news.ycombinator.com/item?id={object_id}",
                    activity_score=points + int(hit.get("num_comments") or 0),
                )
            )
        return found

    return collect_parallel(keywords, fetch, 6, 18)


def scrape_stackoverflow(options: ScrapeOptions, keywords: list[str], cutoff: int) -> list[ScrapedItem]:
    if "Stack Overflow" not in options.sources:
        return []

    def fetch(keyword: str) -> list[ScrapedItem]:
        response = requests.get(
            "https://api.stackexchange.com/2.3/search/advanced",
            params={"order": "desc", "sort": "relevance", "q": keyword, "site": "stackoverflow", "pagesize": 20, "filter": "default", "fromdate": cutoff},
            headers=HEADERS,
            timeout=8,
        )
        response.encoding = "utf-8"
        response.raise_for_status()
        found: list[ScrapedItem] = []
        floor = options.source_floors.get("Stack Overflow", 2)
        for entry in response.json().get("items", []):
            title = clean_title(entry.get("title") or "")
            score = int(entry.get("score") or 0)
            created = int(entry.get("creation_date") or 0)
            if not title or created < cutoff or score < floor:
                continue
            if not is_relevant_query(title, options.intent_mode):
                continue
            found.append(
                ScrapedItem(
                    text=title,
                    source="Stack Overflow",
                    url=entry.get("link") or f"https://stackoverflow.com/search?q={quote_plus(keyword)}",
                    activity_score=score + int(entry.get("answer_count") or 0),
                )
            )
        return found

    return collect_parallel(keywords, fetch, 6, 18)


def scrape_all(options: ScrapeOptions | None = None) -> tuple[list[dict], list[str]]:
    options = resolve_options(options)
    keywords = selected_keywords(options.categories)
    cutoff = cutoff_for(options.recency_days)
    errors: list[str] = []
    scraped: list[ScrapedItem] = []
    for name, scraper in [("reddit", scrape_reddit), ("hacker_news", scrape_hn), ("stackoverflow", scrape_stackoverflow)]:
        try:
            scraped.extend(scraper(options, keywords, cutoff))
        except Exception as exc:
            errors.append(f"{name}: {exc}")

    seen: set[str] = set()
    unique_items: list[ScrapedItem] = []
    for item in scraped:
        key = item.text.lower()
        if key in seen:
            continue
        seen.add(key)
        unique_items.append(item)
    active_source_count = max(1, len([source for source in options.sources if source in {item.source for item in unique_items}]))
    per_source_cap = max(5, options.max_results // active_source_count)
    by_source: dict[str, list[ScrapedItem]] = {}
    for source in options.sources:
        items = [item for item in unique_items if item.source == source]
        items.sort(key=lambda item: item.activity_score, reverse=True)
        by_source[source] = items
    balanced_items: list[ScrapedItem] = []
    overflow: list[ScrapedItem] = []
    for source, items in by_source.items():
        balanced_items.extend(items[:per_source_cap])
        overflow.extend(items[per_source_cap:])
    if len(balanced_items) < options.max_results and overflow:
        overflow.sort(key=lambda item: (relevance_score(item.text), item.activity_score), reverse=True)
        balanced_items.extend(overflow[: options.max_results - len(balanced_items)])
    balanced_items.sort(
        key=lambda item: (relevance_score(item.text), item.activity_score),
        reverse=True,
    )
    unique_items = balanced_items[: options.max_results]

    def classify_item(item: ScrapedItem) -> dict:
        raw = normalize_raw_score(item.activity_score)
        comp = competition_score(item.text)
        rel = relevance_score(item.text)
        fit_tier, fit_reason = classify_fit(item.text)
        b, r, s, _ = three_dim_score(item.text)
        base_opp = opportunity(raw, comp)
        tier_boost = {"PRIMARY": 1.0, "SECONDARY": 0.75, "SKIP": 0.2}[fit_tier]
        blended_opp = round((base_opp * 0.5 + rel * 0.5) * tier_boost, 2)
        return {
            "text": item.text[:1200],
            "source": item.source,
            "url": item.url,
            "raw_score": raw,
            "category": classify_category(item.text),
            "competition_score": comp,
            "opportunity_score": min(100.0, blended_opp),
            "naive_has_content": naive_has_content(item.text),
            "fit_tier": fit_tier,
            "fit_reason": fit_reason,
            "builder_signal": b,
            "bottleneck_signal": r,
            "stage_fit": s,
        }

    rows: list[dict] = []
    executor = ThreadPoolExecutor(max_workers=8)
    futures = [executor.submit(classify_item, item) for item in unique_items]
    try:
        for future in as_completed(futures, timeout=60):
            try:
                rows.append(future.result())
            except Exception as exc:
                errors.append(f"classifier: {exc}")
    except TimeoutError:
        errors.append("classifier: timed out before all rows finished scoring")
        for future in futures:
            future.cancel()
    finally:
        executor.shutdown(wait=False, cancel_futures=True)
    return rows, errors
