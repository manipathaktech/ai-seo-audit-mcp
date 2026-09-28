// ============================================================
// AI SEO Audit MCP — Keyword Analysis Tool
// By Mani Pathak / Webseotrends (https://webseotrends.com)
// ============================================================

import axios from "axios";
import * as cheerio from "cheerio";
import { KeywordAnalysis } from "../types/seo.js";

export async function analyzeKeyword(url: string, keyword: string): Promise<KeywordAnalysis> {
  if (!url.startsWith("http")) url = "https://" + url;
  const kw = keyword.toLowerCase().trim();

  let html = "";
  try {
    const res = await axios.get(url, {
      timeout: 15000,
      headers: { "User-Agent": "AISEOAudit-MCP/1.0 (+https://webseotrends.com)" },
    });
    html = res.data as string;
  } catch {
    return buildKeywordError(url, keyword, "Could not fetch URL");
  }

  const $ = cheerio.load(html);

  const title = $("title").text().toLowerCase();
  const description = $('meta[name="description"]').attr("content")?.toLowerCase() ?? "";
  const h1 = $("h1").first().text().toLowerCase();

  $("script, style").remove();
  const bodyText = $("body").text().toLowerCase().replace(/\s+/g, " ").trim();
  const words = bodyText.split(/\s+/).filter(Boolean);

  // Count keyword occurrences (exact phrase)
  const regex = new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
  const matches = bodyText.match(regex) ?? [];
  const count = matches.length;
  const density = words.length > 0 ? parseFloat(((count / words.length) * 100).toFixed(2)) : 0;

  // Prominence: is it in the first 100 words?
  const first100 = words.slice(0, 100).join(" ");
  const inFirstParagraph = first100.includes(kw);

  // Prominence score (0-100)
  let prominence = 0;
  if (title.includes(kw)) prominence += 30;
  if (description.includes(kw)) prominence += 15;
  if (h1.includes(kw)) prominence += 25;
  if (inFirstParagraph) prominence += 20;
  if (count > 0) prominence += Math.min(10, count);

  const recommendations: string[] = [];
  if (!title.includes(kw)) recommendations.push(`Add "${keyword}" to the page title`);
  if (!description.includes(kw)) recommendations.push(`Include "${keyword}" in the meta description`);
  if (!h1.includes(kw)) recommendations.push(`Use "${keyword}" in the H1 heading`);
  if (!inFirstParagraph) recommendations.push(`Mention "${keyword}" in the first paragraph`);
  if (density > 3) recommendations.push(`Keyword density is ${density}% — reduce to 1–2% to avoid over-optimisation`);
  if (density < 0.5 && count > 0) recommendations.push(`Keyword density is very low (${density}%) — use the keyword more naturally throughout the content`);
  if (count === 0) recommendations.push(`"${keyword}" is not found on this page — add it to your content`);

  return {
    keyword,
    density,
    count,
    inTitle: title.includes(kw),
    inDescription: description.includes(kw),
    inH1: h1.includes(kw),
    inFirstParagraph,
    prominence: Math.min(100, prominence),
    recommendations,
  };
}

function buildKeywordError(url: string, keyword: string, message: string): KeywordAnalysis {
  return {
    keyword,
    density: 0,
    count: 0,
    inTitle: false,
    inDescription: false,
    inH1: false,
    inFirstParagraph: false,
    prominence: 0,
    recommendations: [`Error: ${message}. Please check the URL and try again.`],
  };
}
