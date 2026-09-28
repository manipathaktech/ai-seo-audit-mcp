// ============================================================
// AI SEO Audit MCP — SEO Audit Tool
// By Mani Pathak / Webseotrends (https://webseotrends.com)
// ============================================================

import axios from "axios";
import * as cheerio from "cheerio";
import {
  FullSeoAudit,
  MetaTagAnalysis,
  HeadingAnalysis,
  ImageAnalysis,
  LinkAnalysis,
  ContentAnalysis,
  TechnicalSeoAnalysis,
  SeoScore,
  SeoIssue,
} from "../types/seo.js";

export async function runSeoAudit(url: string): Promise<FullSeoAudit> {
  const start = Date.now();

  // Normalise URL
  if (!url.startsWith("http")) url = "https://" + url;

  let html = "";
  let statusCode = 0;
  let loadTime = 0;

  try {
    const res = await axios.get(url, {
      timeout: 15000,
      headers: { "User-Agent": "AISEOAudit-MCP/1.0 (+https://webseotrends.com)" },
      maxRedirects: 5,
    });
    html = res.data as string;
    statusCode = res.status;
    loadTime = Date.now() - start;
  } catch (err: unknown) {
    const axiosErr = err as { response?: { status: number }; message: string };
    statusCode = axiosErr.response?.status ?? 0;
    loadTime = Date.now() - start;
    return buildErrorAudit(url, statusCode, axiosErr.message);
  }

  const $ = cheerio.load(html);

  const meta = analyzeMeta($);
  const headings = analyzeHeadings($);
  const images = analyzeImages($, url);
  const links = analyzeLinks($, url);
  const content = analyzeContent($);
  const technical = analyzeTechnical($, url, statusCode, loadTime);
  const topIssues = collectTopIssues(meta, headings, images, content, technical);
  const score = computeScore(meta, headings, images, content, technical, topIssues);
  const recommendations = buildRecommendations(topIssues);

  return {
    url,
    timestamp: new Date().toISOString(),
    score,
    meta,
    headings,
    images,
    links,
    content,
    technical,
    topIssues,
    recommendations,
  };
}

// ─── Meta ────────────────────────────────────────────────────

function analyzeMeta($: cheerio.CheerioAPI): MetaTagAnalysis {
  const title = $("title").first().text().trim() || null;
  const titleLength = title?.length ?? 0;
  const desc = $('meta[name="description"]').attr("content")?.trim() ?? null;
  const descLength = desc?.length ?? 0;

  return {
    title,
    titleLength,
    titleOptimal: titleLength >= 50 && titleLength <= 60,
    description: desc,
    descriptionLength: descLength,
    descriptionOptimal: descLength >= 140 && descLength <= 160,
    canonical: $('link[rel="canonical"]').attr("href") ?? null,
    robots: $('meta[name="robots"]').attr("content") ?? null,
    ogTitle: $('meta[property="og:title"]').attr("content") ?? null,
    ogDescription: $('meta[property="og:description"]').attr("content") ?? null,
    ogImage: $('meta[property="og:image"]').attr("content") ?? null,
    twitterCard: $('meta[name="twitter:card"]').attr("content") ?? null,
  };
}

// ─── Headings ────────────────────────────────────────────────

function analyzeHeadings($: cheerio.CheerioAPI): HeadingAnalysis {
  const h1s = $("h1").map((_, el) => $(el).text().trim()).get();
  const h2s = $("h2").map((_, el) => $(el).text().trim()).get();
  const h3s = $("h3").map((_, el) => $(el).text().trim()).get();
  const issues: string[] = [];

  if (h1s.length === 0) issues.push("Missing H1 tag");
  if (h1s.length > 1) issues.push(`Multiple H1 tags found (${h1s.length})`);
  if (h2s.length === 0) issues.push("No H2 tags — add section headings");

  return {
    h1Count: h1s.length,
    h1Texts: h1s,
    h2Count: h2s.length,
    h2Texts: h2s,
    h3Count: h3s.length,
    headingStructureValid: h1s.length === 1 && h2s.length > 0,
    issues,
  };
}

// ─── Images ──────────────────────────────────────────────────

function analyzeImages($: cheerio.CheerioAPI, baseUrl: string): ImageAnalysis {
  const imgs = $("img").get();
  const withoutAlt: string[] = [];

  imgs.forEach((img) => {
    const alt = $(img).attr("alt");
    if (!alt || alt.trim() === "") {
      const src = $(img).attr("src") ?? "unknown";
      withoutAlt.push(src);
    }
  });

  return {
    total: imgs.length,
    withAlt: imgs.length - withoutAlt.length,
    withoutAlt: withoutAlt.length,
    withoutAltSrcs: withoutAlt.slice(0, 10),
    largeImages: [],    // Would need HEAD requests — skipped for speed
  };
}

// ─── Links ───────────────────────────────────────────────────

function analyzeLinks($: cheerio.CheerioAPI, baseUrl: string): LinkAnalysis {
  const host = new URL(baseUrl).hostname;
  let internal = 0;
  let external = 0;
  let nofollowExternal = 0;

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") ?? "";
    const rel = $(el).attr("rel") ?? "";
    try {
      const parsed = new URL(href, baseUrl);
      if (parsed.hostname === host) {
        internal++;
      } else {
        external++;
        if (rel.includes("nofollow")) nofollowExternal++;
      }
    } catch {
      // relative or malformed
      internal++;
    }
  });

  return { internal, external, broken: [], nofollowExternal };
}

// ─── Content ─────────────────────────────────────────────────

function analyzeContent($: cheerio.CheerioAPI): ContentAnalysis {
  // Strip scripts/styles, get body text
  $("script, style, nav, header, footer").remove();
  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  const words = bodyText.split(/\s+/).filter(Boolean);
  const paragraphs = $("p").length;

  // Simple keyword density (top 10 words >4 chars)
  const freq: Record<string, number> = {};
  words.forEach((w) => {
    const clean = w.toLowerCase().replace(/[^a-z]/g, "");
    if (clean.length > 4) freq[clean] = (freq[clean] ?? 0) + 1;
  });
  const topKeywords = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .reduce<Record<string, number>>((acc, [k, v]) => {
      acc[k] = parseFloat(((v / words.length) * 100).toFixed(2));
      return acc;
    }, {});

  const issues: string[] = [];
  if (words.length < 300) issues.push("Thin content — fewer than 300 words");
  if (paragraphs < 3) issues.push("Very few paragraphs — add more structured content");

  // Rough readability: avg sentence length
  const sentences = bodyText.split(/[.!?]+/).filter((s) => s.trim().length > 10);
  const avgSentenceLength =
    sentences.length > 0
      ? Math.round(words.length / sentences.length)
      : 0;

  if (avgSentenceLength > 25) issues.push("Long average sentence length — aim for under 20 words");

  return {
    wordCount: words.length,
    readabilityScore: Math.max(0, 100 - avgSentenceLength * 2),
    keywordDensity: topKeywords,
    paragraphCount: paragraphs,
    avgSentenceLength,
    issues,
  };
}

// ─── Technical ───────────────────────────────────────────────

function analyzeTechnical(
  $: cheerio.CheerioAPI,
  url: string,
  statusCode: number,
  loadTime: number
): TechnicalSeoAnalysis {
  const hasHttps = url.startsWith("https://");
  const hasMobileViewport = !!$('meta[name="viewport"]').length;
  const canonicalHref = $('link[rel="canonical"]').attr("href") ?? "";
  const isCanonicalSelf =
    canonicalHref !== "" &&
    (canonicalHref === url || canonicalHref.replace(/\/$/, "") === url.replace(/\/$/, ""));

  // Structured data detection
  const structuredDataTypes: string[] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const json = JSON.parse($(el).html() ?? "{}");
      const type = json["@type"] ?? json.type;
      if (type && !structuredDataTypes.includes(type)) structuredDataTypes.push(type);
    } catch { /* ignore */ }
  });

  const issues: SeoIssue[] = [];
  if (!hasHttps) issues.push({ type: "critical", category: "Security", message: "Site not using HTTPS", recommendation: "Migrate to HTTPS immediately" });
  if (!hasMobileViewport) issues.push({ type: "critical", category: "Mobile", message: "Missing viewport meta tag", recommendation: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">' });
  if (loadTime > 3000) issues.push({ type: "warning", category: "Performance", message: `Slow response time: ${loadTime}ms`, recommendation: "Optimise server response, use caching and a CDN" });
  if (!isCanonicalSelf) issues.push({ type: "warning", category: "Canonicalisation", message: "Self-referencing canonical missing or mismatched", recommendation: "Add a self-referencing canonical tag" });
  if (structuredDataTypes.length === 0) issues.push({ type: "info", category: "Structured Data", message: "No structured data / schema markup found", recommendation: "Add relevant schema (Article, FAQ, BreadcrumbList, etc.)" });

  return {
    url,
    statusCode,
    loadTime,
    hasHttps,
    hasSitemap: false,      // Would need separate fetch
    hasRobotsTxt: false,    // Would need separate fetch
    isCanonicalSelf,
    hasMobileViewport,
    hasStructuredData: structuredDataTypes.length > 0,
    structuredDataTypes,
    issues,
  };
}

// ─── Score & Issues ──────────────────────────────────────────

function collectTopIssues(
  meta: MetaTagAnalysis,
  headings: HeadingAnalysis,
  images: ImageAnalysis,
  content: ContentAnalysis,
  technical: TechnicalSeoAnalysis
): SeoIssue[] {
  const issues: SeoIssue[] = [...technical.issues];

  if (!meta.title) issues.push({ type: "critical", category: "Meta", message: "Missing title tag", recommendation: "Add a descriptive title tag (50–60 characters)" });
  else if (!meta.titleOptimal) issues.push({ type: "warning", category: "Meta", message: `Title length is ${meta.titleLength} chars (optimal: 50–60)`, recommendation: "Adjust title to 50–60 characters" });

  if (!meta.description) issues.push({ type: "warning", category: "Meta", message: "Missing meta description", recommendation: "Add a meta description (140–160 characters)" });
  else if (!meta.descriptionOptimal) issues.push({ type: "info", category: "Meta", message: `Description length is ${meta.descriptionLength} chars (optimal: 140–160)`, recommendation: "Adjust meta description to 140–160 characters" });

  if (headings.h1Count === 0) issues.push({ type: "critical", category: "Headings", message: "No H1 tag found", recommendation: "Add exactly one H1 tag with your primary keyword" });
  if (headings.h1Count > 1) issues.push({ type: "warning", category: "Headings", message: `${headings.h1Count} H1 tags found`, recommendation: "Use exactly one H1 per page" });

  if (images.withoutAlt > 0) issues.push({ type: "warning", category: "Images", message: `${images.withoutAlt} image(s) missing alt text`, recommendation: "Add descriptive alt text to all images" });

  content.issues.forEach((msg) => {
    issues.push({ type: "warning", category: "Content", message: msg, recommendation: "Expand and improve your content quality" });
  });

  return issues.sort((a, b) => {
    const order = { critical: 0, warning: 1, info: 2 };
    return order[a.type] - order[b.type];
  });
}

function computeScore(
  meta: MetaTagAnalysis,
  headings: HeadingAnalysis,
  images: ImageAnalysis,
  content: ContentAnalysis,
  technical: TechnicalSeoAnalysis,
  issues: SeoIssue[]
): SeoScore {
  let technical_score = 100;
  let onPage = 100;
  let contentScore = 100;
  let performance = 100;

  issues.forEach((issue) => {
    const deduct = issue.type === "critical" ? 20 : issue.type === "warning" ? 10 : 3;
    if (["Security", "Mobile", "Canonicalisation", "Structured Data"].includes(issue.category)) {
      technical_score -= deduct;
    } else if (["Meta", "Headings", "Images"].includes(issue.category)) {
      onPage -= deduct;
    } else if (issue.category === "Content") {
      contentScore -= deduct;
    }
  });

  if (technical.loadTime > 3000) performance -= 20;
  if (technical.loadTime > 5000) performance -= 20;

  const clamp = (n: number) => Math.max(0, Math.min(100, n));
  const ts = clamp(technical_score);
  const op = clamp(onPage);
  const cs = clamp(contentScore);
  const perf = clamp(performance);
  const overall = Math.round((ts * 0.3 + op * 0.3 + cs * 0.25 + perf * 0.15));

  return { overall, technical: ts, onPage: op, content: cs, performance: perf };
}

function buildRecommendations(issues: SeoIssue[]): string[] {
  return issues
    .filter((i) => i.type !== "info")
    .slice(0, 8)
    .map((i) => `[${i.category}] ${i.recommendation}`);
}

// ─── Error fallback ──────────────────────────────────────────

function buildErrorAudit(url: string, statusCode: number, message: string): FullSeoAudit {
  return {
    url,
    timestamp: new Date().toISOString(),
    score: { overall: 0, technical: 0, onPage: 0, content: 0, performance: 0 },
    meta: { title: null, titleLength: 0, titleOptimal: false, description: null, descriptionLength: 0, descriptionOptimal: false, canonical: null, robots: null, ogTitle: null, ogDescription: null, ogImage: null, twitterCard: null },
    headings: { h1Count: 0, h1Texts: [], h2Count: 0, h2Texts: [], h3Count: 0, headingStructureValid: false, issues: [] },
    images: { total: 0, withAlt: 0, withoutAlt: 0, withoutAltSrcs: [], largeImages: [] },
    links: { internal: 0, external: 0, broken: [], nofollowExternal: 0 },
    content: { wordCount: 0, readabilityScore: 0, keywordDensity: {}, paragraphCount: 0, avgSentenceLength: 0, issues: [] },
    technical: { url, statusCode, loadTime: 0, hasHttps: url.startsWith("https://"), hasSitemap: false, hasRobotsTxt: false, isCanonicalSelf: false, hasMobileViewport: false, hasStructuredData: false, structuredDataTypes: [], issues: [{ type: "critical", category: "Fetch", message: `Failed to fetch URL: ${message}`, recommendation: "Check the URL is accessible and try again" }] },
    topIssues: [{ type: "critical", category: "Fetch", message: `Cannot audit — HTTP ${statusCode}: ${message}`, recommendation: "Ensure the URL is publicly accessible" }],
    recommendations: ["Fix the URL accessibility issue before running an SEO audit"],
  };
}
