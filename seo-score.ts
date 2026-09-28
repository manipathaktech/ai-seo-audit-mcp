// ============================================================
// AI SEO Audit MCP — SEO Score Tool
// By Mani Pathak / Webseotrends (https://webseotrends.com)
// ============================================================

import { runSeoAudit } from "./seo-audit.js";
import { SeoScoreResult } from "../types/seo.js";

export async function getSeoScore(url: string): Promise<SeoScoreResult> {
  const audit = await runSeoAudit(url);

  const score = audit.score.overall;

  let grade: string;
  if (score >= 90) grade = "A+";
  else if (score >= 80) grade = "A";
  else if (score >= 70) grade = "B";
  else if (score >= 60) grade = "C";
  else if (score >= 50) grade = "D";
  else grade = "F";

  // Top wins: things that are already good
  const topWins: string[] = [];
  if (audit.technical.hasHttps) topWins.push("HTTPS enabled ✓");
  if (audit.meta.titleOptimal) topWins.push("Title tag is optimal length ✓");
  if (audit.meta.descriptionOptimal) topWins.push("Meta description is optimal length ✓");
  if (audit.headings.headingStructureValid) topWins.push("Heading structure is valid ✓");
  if (audit.technical.hasStructuredData) topWins.push(`Structured data present (${audit.technical.structuredDataTypes.join(", ")}) ✓`);
  if (audit.technical.hasMobileViewport) topWins.push("Mobile viewport configured ✓");
  if (audit.images.withoutAlt === 0 && audit.images.total > 0) topWins.push("All images have alt text ✓");
  if (audit.content.wordCount >= 600) topWins.push(`Good content length (${audit.content.wordCount} words) ✓`);

  const topIssues = audit.topIssues
    .filter((i) => i.type !== "info")
    .slice(0, 5)
    .map((i) => `[${i.type.toUpperCase()}] ${i.message}`);

  let summary = `Your page scores ${score}/100 (Grade: ${grade}). `;
  if (score >= 80) summary += "Strong SEO foundation — focus on the remaining issues to push further.";
  else if (score >= 60) summary += "Decent base but several important issues need fixing.";
  else if (score >= 40) summary += "Significant SEO problems detected — prioritise critical issues first.";
  else summary += "Major SEO issues found — immediate attention required.";

  return {
    url,
    overallScore: score,
    grade,
    breakdown: audit.score,
    summary,
    topWins: topWins.slice(0, 5),
    topIssues,
  };
}
