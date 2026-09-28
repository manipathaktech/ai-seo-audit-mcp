#!/usr/bin/env node
// ============================================================
// AI SEO Audit MCP — Main Server
// AI-powered SEO tools for Claude & Claude Code
// By Mani Pathak / Webseotrends (https://webseotrends.com)
// ============================================================

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { runSeoAudit } from "./tools/seo-audit.js";
import { analyzeKeyword } from "./tools/keyword-analysis.js";
import { runGeoAnalysis } from "./tools/geo-analysis.js";
import { getSeoScore } from "./tools/seo-score.js";

// ─── Tool Definitions ─────────────────────────────────────────────────────────

const tools: Tool[] = [
  {
    name: "seo_audit",
    description:
      "Run a full SEO audit on any URL. Analyses meta tags, headings, images, links, content quality, and technical SEO. Returns a score (0–100) with prioritised issues and actionable recommendations.",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "The full URL to audit (e.g. https://example.com/page)",
        },
      },
      required: ["url"],
    },
  },
  {
    name: "keyword_analysis",
    description:
      "Analyse how well a specific keyword is optimised on a page. Checks keyword presence in title, description, H1, first paragraph, and body. Returns density, prominence score, and recommendations.",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "The URL to analyse",
        },
        keyword: {
          type: "string",
          description: "The target keyword or phrase to check (e.g. 'best SEO tools')",
        },
      },
      required: ["url", "keyword"],
    },
  },
  {
    name: "geo_analysis",
    description:
      "Analyse a page's Generative Engine Optimisation (GEO) readiness for AI search engines (ChatGPT, Gemini, Claude, Perplexity). Checks for Q&A format, schema markup, author info, topic clarity, and citation-friendliness.",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "The URL to analyse for AI-search visibility",
        },
      },
      required: ["url"],
    },
  },
  {
    name: "seo_score",
    description:
      "Get a quick SEO score (0–100) and letter grade (A+ to F) for any URL. Returns a breakdown by category, top wins, and top issues to fix.",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "The URL to score",
        },
      },
      required: ["url"],
    },
  },
  {
    name: "on_page_seo",
    description:
      "Analyse the on-page SEO elements of a URL: title, meta description, headings structure, image alt text, and content length. Returns a focused on-page report.",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "The URL to analyse",
        },
      },
      required: ["url"],
    },
  },
  {
    name: "technical_seo",
    description:
      "Run a technical SEO check on a URL. Analyses HTTPS status, canonical tags, mobile viewport, structured data, response time, and key technical issues.",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "The URL to check for technical SEO issues",
        },
      },
      required: ["url"],
    },
  },
];

// ─── Input Schemas (Zod) ─────────────────────────────────────────────────────

const UrlSchema = z.object({ url: z.string().url() });
const KeywordSchema = z.object({ url: z.string().url(), keyword: z.string().min(1) });

// ─── Server Setup ─────────────────────────────────────────────────────────────

const server = new Server(
  {
    name: "ai-seo-audit-mcp",
    version: "1.0.0",
  },
  {
    capabilities: { tools: {} },
  }
);

// ─── List Tools ───────────────────────────────────────────────────────────────

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));

// ─── Call Tool ────────────────────────────────────────────────────────────────

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      // ── Full SEO Audit ─────────────────────────────────────
      case "seo_audit": {
        const { url } = UrlSchema.parse(args);
        const result = await runSeoAudit(url);
        return {
          content: [
            {
              type: "text",
              text: formatAudit(result),
            },
          ],
        };
      }

      // ── Keyword Analysis ────────────────────────────────────
      case "keyword_analysis": {
        const { url, keyword } = KeywordSchema.parse(args);
        const result = await analyzeKeyword(url, keyword);
        return {
          content: [
            {
              type: "text",
              text: formatKeyword(result, url),
            },
          ],
        };
      }

      // ── GEO / AI-Search Analysis ────────────────────────────
      case "geo_analysis": {
        const { url } = UrlSchema.parse(args);
        const result = await runGeoAnalysis(url);
        return {
          content: [
            {
              type: "text",
              text: formatGeo(result),
            },
          ],
        };
      }

      // ── SEO Score ───────────────────────────────────────────
      case "seo_score": {
        const { url } = UrlSchema.parse(args);
        const result = await getSeoScore(url);
        return {
          content: [
            {
              type: "text",
              text: formatScore(result),
            },
          ],
        };
      }

      // ── On-Page SEO ─────────────────────────────────────────
      case "on_page_seo": {
        const { url } = UrlSchema.parse(args);
        const audit = await runSeoAudit(url);
        return {
          content: [
            {
              type: "text",
              text: formatOnPage(audit),
            },
          ],
        };
      }

      // ── Technical SEO ───────────────────────────────────────
      case "technical_seo": {
        const { url } = UrlSchema.parse(args);
        const audit = await runSeoAudit(url);
        return {
          content: [
            {
              type: "text",
              text: formatTechnical(audit),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      content: [{ type: "text", text: `Error: ${message}` }],
      isError: true,
    };
  }
});

// ─── Formatters ──────────────────────────────────────────────────────────────

function formatAudit(r: Awaited<ReturnType<typeof runSeoAudit>>): string {
  const bar = (n: number) => "█".repeat(Math.round(n / 10)) + "░".repeat(10 - Math.round(n / 10));

  return `# SEO Audit Report — ${r.url}
Generated: ${new Date(r.timestamp).toLocaleString()}

## Overall Score: ${r.score.overall}/100

Technical  [${bar(r.score.technical)}] ${r.score.technical}/100
On-Page    [${bar(r.score.onPage)}] ${r.score.onPage}/100
Content    [${bar(r.score.content)}] ${r.score.content}/100
Performance[${bar(r.score.performance)}] ${r.score.performance}/100

---
## Meta Tags
- Title: ${r.meta.title ?? "❌ MISSING"} (${r.meta.titleLength} chars${r.meta.titleOptimal ? " ✓" : " — optimal: 50–60"})
- Description: ${r.meta.description ?? "❌ MISSING"} (${r.meta.descriptionLength} chars${r.meta.descriptionOptimal ? " ✓" : " — optimal: 140–160"})
- Canonical: ${r.meta.canonical ?? "❌ Not set"}
- Open Graph: ${r.meta.ogTitle ? "✓" : "❌ Missing og:title"} | ${r.meta.ogImage ? "✓" : "❌ Missing og:image"}
- Twitter Card: ${r.meta.twitterCard ?? "❌ Not set"}

---
## Headings
- H1: ${r.headings.h1Count} found${r.headings.h1Count === 1 ? " ✓" : r.headings.h1Count === 0 ? " ❌ MISSING" : " ⚠ Multiple H1s"}
${r.headings.h1Texts.map((h) => `  → "${h}"`).join("\n")}
- H2: ${r.headings.h2Count} found
- H3: ${r.headings.h3Count} found

---
## Content
- Word count: ${r.content.wordCount} words${r.content.wordCount >= 600 ? " ✓" : " ⚠ Consider expanding"}
- Paragraphs: ${r.content.paragraphCount}
- Avg sentence length: ${r.content.avgSentenceLength} words
- Readability: ${r.content.readabilityScore}/100
- Top keywords: ${Object.entries(r.content.keywordDensity).slice(0, 5).map(([k, v]) => `${k} (${v}%)`).join(", ")}

---
## Images
- Total: ${r.images.total} | With alt: ${r.images.withAlt} | Without alt: ${r.images.withoutAlt}${r.images.withoutAlt > 0 ? ` ⚠\n  Missing: ${r.images.withoutAltSrcs.slice(0, 5).join(", ")}` : " ✓"}

---
## Links
- Internal: ${r.links.internal} | External: ${r.links.external} | Nofollow external: ${r.links.nofollowExternal}

---
## Technical
- HTTPS: ${r.technical.hasHttps ? "✓" : "❌ Not using HTTPS"}
- Mobile viewport: ${r.technical.hasMobileViewport ? "✓" : "❌ Missing"}
- Canonical: ${r.technical.isCanonicalSelf ? "✓ Self-referencing" : "⚠ Not set or mismatched"}
- Structured data: ${r.technical.hasStructuredData ? `✓ (${r.technical.structuredDataTypes.join(", ")})` : "❌ None found"}
- Load time: ${r.technical.loadTime}ms${r.technical.loadTime > 3000 ? " ⚠ Slow" : " ✓"}

---
## Top Issues
${r.topIssues.slice(0, 8).map((i) => `[${i.type.toUpperCase()}] ${i.message}\n  → ${i.recommendation}`).join("\n\n")}

---
## Recommendations
${r.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join("\n")}

---
*AI SEO Audit MCP by Webseotrends — https://webseotrends.com*`;
}

function formatKeyword(r: Awaited<ReturnType<typeof analyzeKeyword>>, url: string): string {
  const bar = (n: number) => "█".repeat(Math.round(n / 10)) + "░".repeat(10 - Math.round(n / 10));
  return `# Keyword Analysis — "${r.keyword}"
URL: ${url}

## Prominence Score: ${r.prominence}/100
[${bar(r.prominence)}]

## Keyword Presence
- In title:           ${r.inTitle ? "✓ Yes" : "❌ No"}
- In meta description:${r.inDescription ? "✓ Yes" : "❌ No"}
- In H1:              ${r.inH1 ? "✓ Yes" : "❌ No"}
- In first paragraph: ${r.inFirstParagraph ? "✓ Yes" : "❌ No"}

## Usage
- Occurrences: ${r.count}
- Keyword density: ${r.density}%${r.density > 3 ? " ⚠ Over-optimised" : r.density < 0.5 && r.count > 0 ? " ⚠ Under-used" : " ✓"}

## Recommendations
${r.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join("\n")}

---
*AI SEO Audit MCP by Webseotrends — https://webseotrends.com*`;
}

function formatGeo(r: Awaited<ReturnType<typeof runGeoAnalysis>>): string {
  const bar = (n: number) => "█".repeat(Math.round(n / 10)) + "░".repeat(10 - Math.round(n / 10));
  return `# GEO / AI-Search Analysis — ${r.url}

## AI Search Readiness: ${r.aiSearchReadiness}/100
[${bar(r.aiSearchReadiness)}]
${r.aiSearchReadiness >= 70 ? "✓ Good AI search visibility" : r.aiSearchReadiness >= 40 ? "⚠ Moderate — significant improvements available" : "❌ Low AI search visibility — needs work"}

## Signal Checklist
- Q&A format content:    ${r.hasQAFormat ? "✓" : "❌"}
- FAQ schema markup:     ${r.hasFAQSchema ? "✓" : "❌"}
- HowTo schema markup:   ${r.hasHowToSchema ? "✓" : "❌"}
- Article schema:        ${r.hasArticleSchema ? "✓" : "❌"}
- Author information:    ${r.hasAuthorInfo ? "✓" : "❌"}
- Clear topic headings:  ${r.hasClearTopics ? "✓" : "❌"}
- Citation-friendly:     ${r.citationFriendly ? "✓" : "❌"}
- AI readability:        ${r.readabilityForAI}/100

## What is GEO?
Generative Engine Optimisation (GEO) ensures your content is cited and surfaced
by AI search engines: ChatGPT, Google Gemini, Claude, Perplexity, and Copilot.

## Recommendations
${r.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join("\n")}

---
*AI SEO Audit MCP by Webseotrends — https://webseotrends.com*`;
}

function formatScore(r: Awaited<ReturnType<typeof getSeoScore>>): string {
  return `# SEO Score — ${r.url}

## Score: ${r.overallScore}/100   Grade: ${r.grade}

${r.summary}

## Breakdown
- Technical:   ${r.breakdown.technical}/100
- On-Page:     ${r.breakdown.onPage}/100
- Content:     ${r.breakdown.content}/100
- Performance: ${r.breakdown.performance}/100

## What's Working ✓
${r.topWins.length > 0 ? r.topWins.map((w) => `  ${w}`).join("\n") : "  Nothing notable yet — start fixing issues below"}

## Top Issues to Fix
${r.topIssues.length > 0 ? r.topIssues.map((i) => `  ${i}`).join("\n") : "  No major issues found!"}

---
*AI SEO Audit MCP by Webseotrends — https://webseotrends.com*`;
}

function formatOnPage(r: Awaited<ReturnType<typeof runSeoAudit>>): string {
  return `# On-Page SEO Analysis — ${r.url}

## On-Page Score: ${r.score.onPage}/100

## Title Tag
${r.meta.title ? `"${r.meta.title}" (${r.meta.titleLength} chars)${r.meta.titleOptimal ? " ✓" : " — aim for 50–60 chars"}` : "❌ MISSING — Critical issue"}

## Meta Description
${r.meta.description ? `"${r.meta.description}" (${r.meta.descriptionLength} chars)${r.meta.descriptionOptimal ? " ✓" : " — aim for 140–160 chars"}` : "❌ MISSING"}

## Heading Structure
H1 (${r.headings.h1Count}): ${r.headings.h1Texts[0] ?? "❌ None"}
H2s (${r.headings.h2Count}): ${r.headings.h2Texts.slice(0, 3).join(" | ") || "❌ None"}
H3s (${r.headings.h3Count})
Structure: ${r.headings.headingStructureValid ? "✓ Valid" : "⚠ Needs improvement"}

## Content
Word count: ${r.content.wordCount} | Paragraphs: ${r.content.paragraphCount}
Readability: ${r.content.readabilityScore}/100

## Images
${r.images.total} total — ${r.images.withAlt} with alt text, ${r.images.withoutAlt} missing alt

## Open Graph / Social
- og:title: ${r.meta.ogTitle ?? "❌ Missing"}
- og:description: ${r.meta.ogDescription ?? "❌ Missing"}
- og:image: ${r.meta.ogImage ?? "❌ Missing"}
- twitter:card: ${r.meta.twitterCard ?? "❌ Missing"}

## Recommendations
${r.recommendations.filter((r) => ["Meta", "Headings", "Images", "Content"].some((c) => r.includes(`[${c}]`))).slice(0, 6).map((r, i) => `${i + 1}. ${r}`).join("\n") || r.recommendations.slice(0, 6).map((rec, i) => `${i + 1}. ${rec}`).join("\n")}

---
*AI SEO Audit MCP by Webseotrends — https://webseotrends.com*`;
}

function formatTechnical(r: Awaited<ReturnType<typeof runSeoAudit>>): string {
  return `# Technical SEO Analysis — ${r.url}

## Technical Score: ${r.score.technical}/100

## Core Checks
- HTTPS:            ${r.technical.hasHttps ? "✓ Secure" : "❌ Not using HTTPS — Critical"}
- HTTP Status:      ${r.technical.statusCode} ${r.technical.statusCode === 200 ? "✓" : "⚠"}
- Response time:    ${r.technical.loadTime}ms ${r.technical.loadTime <= 2000 ? "✓" : r.technical.loadTime <= 3000 ? "⚠ Slightly slow" : "❌ Slow"}
- Mobile viewport:  ${r.technical.hasMobileViewport ? "✓ Present" : "❌ Missing"}
- Canonical tag:    ${r.technical.isCanonicalSelf ? "✓ Self-referencing" : "⚠ Missing or mismatched"}

## Structured Data
${r.technical.hasStructuredData ? `✓ Found: ${r.technical.structuredDataTypes.join(", ")}` : "❌ No structured data / schema found"}

## Technical Issues
${r.technical.issues.length > 0
  ? r.technical.issues.map((i) => `[${i.type.toUpperCase()}] ${i.message}\n  → ${i.recommendation}`).join("\n\n")
  : "✓ No major technical issues found"}

---
*AI SEO Audit MCP by Webseotrends — https://webseotrends.com*`;
}

// ─── Start ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("AI SEO Audit MCP server running — by Webseotrends (https://webseotrends.com)");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
