// ============================================================
// AI SEO Audit MCP — GEO / AI-Search Analysis Tool
// (Generative Engine Optimisation for ChatGPT, Gemini, Claude, Perplexity)
// By Mani Pathak / Webseotrends (https://webseotrends.com)
// ============================================================

import axios from "axios";
import * as cheerio from "cheerio";
import { GeoAnalysis } from "../types/seo.js";

export async function runGeoAnalysis(url: string): Promise<GeoAnalysis> {
  if (!url.startsWith("http")) url = "https://" + url;

  let html = "";
  try {
    const res = await axios.get(url, {
      timeout: 15000,
      headers: { "User-Agent": "AISEOAudit-MCP/1.0 (+https://webseotrends.com)" },
    });
    html = res.data as string;
  } catch {
    return buildGeoError(url);
  }

  const $ = cheerio.load(html);
  $("script[src], style").remove();

  // ── Schema detection ─────────────────────────────────────
  let hasFAQSchema = false;
  let hasHowToSchema = false;
  let hasArticleSchema = false;

  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const json = JSON.parse($(el).html() ?? "{}");
      const type: string = json["@type"] ?? "";
      if (type === "FAQPage") hasFAQSchema = true;
      if (type === "HowTo") hasHowToSchema = true;
      if (["Article", "NewsArticle", "BlogPosting"].includes(type)) hasArticleSchema = true;
    } catch { /* ignore */ }
  });

  // ── Q&A format detection ─────────────────────────────────
  const bodyText = $("body").text();
  const qaPatterns = [
    /what is\s+/i, /how (do|does|to|can)\s+/i, /why (is|are|do|does)\s+/i,
    /when (is|are|do|does|should)\s+/i, /which\s+/i,
  ];
  const hasQAFormat = qaPatterns.some((p) => p.test(bodyText));

  // ── Author info ───────────────────────────────────────────
  const hasAuthorInfo =
    !!$('[class*="author"], [itemprop="author"], [rel="author"]').length ||
    $('meta[name="author"]').length > 0;

  // ── Topic clarity (headers present = clear topics) ────────
  const hasClearTopics = $("h2, h3").length >= 2;

  // ── Readability for AI ────────────────────────────────────
  const words = bodyText.split(/\s+/).filter(Boolean);
  const sentences = bodyText.split(/[.!?]+/).filter((s) => s.trim().length > 10);
  const avgSentLen = sentences.length > 0 ? words.length / sentences.length : 30;
  const readabilityForAI = Math.max(0, Math.min(100, Math.round(100 - (avgSentLen - 15) * 2)));

  // ── Citation friendliness (stats, sources, named entities) ─
  const citationPatterns = [/\d+%/, /according to/i, /study/i, /research/i, /data shows/i, /source:/i];
  const citationFriendly = citationPatterns.filter((p) => p.test(bodyText)).length >= 2;

  // ── Overall AI readiness score ────────────────────────────
  let score = 0;
  if (hasQAFormat) score += 20;
  if (hasFAQSchema) score += 15;
  if (hasHowToSchema) score += 10;
  if (hasArticleSchema) score += 10;
  if (hasAuthorInfo) score += 15;
  if (hasClearTopics) score += 15;
  if (readabilityForAI >= 60) score += 10;
  if (citationFriendly) score += 5;

  const recommendations: string[] = [];
  if (!hasQAFormat) recommendations.push("Add Q&A-style headings and answers that AI can extract and cite");
  if (!hasFAQSchema) recommendations.push("Implement FAQPage schema — AI search engines prioritise structured FAQ content");
  if (!hasArticleSchema) recommendations.push("Add Article or BlogPosting schema with author, datePublished, and dateModified");
  if (!hasAuthorInfo) recommendations.push("Add visible author information (name, credentials) for E-E-A-T and AI citations");
  if (!hasClearTopics) recommendations.push("Use more H2/H3 headings to create clear topical sections for AI parsers");
  if (!citationFriendly) recommendations.push("Include statistics, research references, and data — AI models prefer citable facts");
  if (readabilityForAI < 60) recommendations.push("Shorten sentences — aim for under 20 words per sentence for better AI readability");
  if (!hasHowToSchema && /how to/i.test(bodyText)) recommendations.push("You have how-to content — add HowTo schema to improve AI search visibility");

  return {
    url,
    aiSearchReadiness: Math.min(100, score),
    hasQAFormat,
    hasFAQSchema,
    hasHowToSchema,
    hasArticleSchema,
    hasAuthorInfo,
    hasClearTopics,
    readabilityForAI,
    citationFriendly,
    recommendations,
  };
}

function buildGeoError(url: string): GeoAnalysis {
  return {
    url,
    aiSearchReadiness: 0,
    hasQAFormat: false,
    hasFAQSchema: false,
    hasHowToSchema: false,
    hasArticleSchema: false,
    hasAuthorInfo: false,
    hasClearTopics: false,
    readabilityForAI: 0,
    citationFriendly: false,
    recommendations: ["Could not fetch URL — ensure it is publicly accessible"],
  };
}
