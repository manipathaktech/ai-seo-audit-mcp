# AI SEO Audit MCP

**AI-powered SEO audit, SEO analysis, GEO, and AI-search optimization tools for Claude and Claude Code — by [Webseotrends](https://webseotrends.com/).**

[![CI](https://github.com/manipathaktech/ai-seo-audit-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/manipathaktech/ai-seo-audit-mcp/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-compatible-blue.svg)](https://modelcontextprotocol.io/)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-green.svg)](https://nodejs.org/)

**AI SEO tools for Claude, Claude Code, and MCP-compatible AI clients.**

Run SEO audits, analyze keywords, evaluate on-page and technical SEO, score webpages, and assess GEO/AI-search readiness directly through Claude.

The **AI SEO Audit MCP** turns Claude into an AI-powered SEO analysis assistant that can inspect public webpages and provide actionable SEO recommendations.

**No paid API key is required for the core audits. The MCP works with publicly accessible URLs.**

---

## What Is AI SEO Audit MCP?

AI SEO Audit MCP is an open-source **Claude SEO tool** built using the Model Context Protocol (MCP).

It gives Claude access to practical SEO analysis capabilities, allowing you to ask Claude to:

* Run a complete SEO audit
* Analyze target keyword usage
* Check title tags and meta descriptions
* Analyze headings and page structure
* Review content optimization
* Check technical SEO elements
* Evaluate structured data
* Analyze internal and external links
* Generate an overall SEO score
* Analyze GEO and AI-search readiness
* Identify potential SEO issues and improvement opportunities

Instead of switching between multiple SEO tools, you can use natural-language prompts in Claude or Claude Code to perform SEO analysis.

---

## Features

### 🔍 Claude SEO Audit

Run a complete SEO audit of a public webpage.

The `seo_audit` tool can evaluate:

* Title tag
* Meta description
* Headings
* Content
* Images and alt text
* Internal links
* External links
* Canonical URL
* HTTPS
* Viewport configuration
* Structured data
* Basic technical SEO signals
* Keyword usage
* Overall SEO score

Example:

```text
Audit the SEO of https://example.com
```

---

### 🎯 Keyword Analysis

Use Claude to analyze how effectively a target keyword is used on a webpage.

The `keyword_analysis` tool evaluates factors such as:

* Keyword presence
* Title placement
* Meta description
* Heading usage
* Content prominence
* Keyword distribution
* Basic keyword density
* URL usage
* Image alt text
* Related on-page signals

Example:

```text
Analyze the keyword "Claude SEO tools" on https://example.com/seo-tools
```

This makes the project useful for **SEO keyword analysis, Claude SEO analysis, and AI-assisted on-page optimization**.

---

### 🤖 GEO & AI-Search Analysis

The `geo_analysis` tool evaluates signals that can make content easier for AI systems and answer engines to understand and potentially use.

It checks for factors such as:

* Clear topic structure
* Question-and-answer content
* Useful definitions
* Supporting facts and data
* Author information
* Structured content
* FAQ and Article schema
* Citation-friendly information
* Readability
* Explicit entity and topic relationships

The goal is to help identify areas that may improve **GEO (Generative Engine Optimization)** and AI-search readiness.

> GEO analysis provides optimization recommendations. It does not guarantee rankings, citations, or inclusion in ChatGPT, Gemini, Claude, Perplexity, Google AI Overviews, or other AI systems.

---

### 📊 SEO Score

Get a quick SEO score for a webpage.

Example:

```text
What is the SEO score of https://example.com?
```

The `seo_score` tool provides a simplified score and identifies important areas that may require attention.

---

### 📝 On-Page SEO Analysis

The `on_page_seo` tool focuses specifically on page-level SEO.

It analyzes:

* SEO title
* Meta description
* H1
* H2/H3 structure
* Content
* Keyword usage
* Images
* Links
* Page structure

Example:

```text
Run an on-page SEO analysis for https://example.com/blog/seo-guide
```

---

### ⚙️ Technical SEO Analysis

The `technical_seo` tool checks important technical signals that can affect how search engines understand and crawl a webpage.

Checks include:

* HTTPS
* Canonical URL
* Viewport
* Robots directives
* Structured data
* Basic page response information
* Technical HTML signals
* Link accessibility

Example:

```text
Check the technical SEO of https://example.com
```

---

## Available MCP Tools

| Tool               | Description                                                                       |
| ------------------ | --------------------------------------------------------------------------------- |
| `seo_audit`        | Complete SEO audit with an overall score and recommendations                      |
| `keyword_analysis` | Analyze target keyword usage and on-page prominence                               |
| `geo_analysis`     | Analyze GEO and AI-search readiness signals                                       |
| `seo_score`        | Generate a quick SEO score for a webpage                                          |
| `on_page_seo`      | Analyze titles, descriptions, headings, content, links, and other on-page factors |
| `technical_seo`    | Check important technical SEO signals                                             |

---

# Quick Start

## 1. Requirements

Before installing, make sure you have:

* Node.js 18 or newer
* npm
* Git
* Claude Code or another MCP-compatible client

Check Node.js:

```bash
node --version
```

Check npm:

```bash
npm --version
```

---

## 2. Clone the Repository

```bash
git clone https://github.com/manipathaktech/ai-seo-audit-mcp.git
cd ai-seo-audit-mcp
```

Install dependencies:

```bash
npm install
```

Build the project:

```bash
npm run build
```

---

## 3. Configure the MCP Server

Add the built MCP server to your MCP-compatible client.

Example configuration:

```json
{
  "mcpServers": {
    "ai-seo-audit": {
      "command": "node",
      "args": [
        "/absolute/path/to/ai-seo-audit-mcp/dist/index.js"
      ]
    }
  }
}
```

Replace:

```text
/absolute/path/to/
```

with the actual location of your cloned repository.

> MCP client configuration paths can vary by client and version. Check the documentation for the MCP client you are using.

---

## 4. Restart Your MCP Client

After adding the server configuration, restart your MCP-compatible client.

Then try:

```text
Audit the SEO of https://webseotrends.com
```

You should be able to access the SEO analysis tools through your MCP client.

---

# Usage Examples

## Complete Claude SEO Audit

```text
Run a complete SEO audit of https://example.com
```

## Claude SEO Keyword Analysis

```text
Analyze how well the keyword "AI SEO tools" is optimized on https://example.com/ai-seo-tools
```

## Claude SEO Checker

```text
Check this webpage for common SEO issues:
https://example.com
```

## AI SEO Audit

```text
Perform an AI SEO audit of https://example.com
```

## Technical SEO

```text
Analyze the technical SEO of https://example.com
```

## On-Page SEO

```text
Analyze the on-page SEO of https://example.com/blog/example
```

## GEO SEO

```text
Analyze this page for GEO and AI-search optimization:
https://example.com
```

## SEO Score

```text
Give me an SEO score for https://example.com
```

## Combined SEO + GEO Analysis

```text
Analyze the SEO and GEO readiness of https://example.com.

Identify:
1. Technical SEO issues
2. On-page SEO issues
3. Keyword optimization opportunities
4. Content quality issues
5. Structured data opportunities
6. AI-search visibility improvements
```

---

# Claude SEO Tools

This project is designed to provide practical **SEO tools for Claude** rather than a single-purpose SEO checker.

Potential use cases include:

* Claude SEO audits
* AI SEO audits
* SEO analysis with Claude
* Technical SEO analysis
* Keyword analysis
* On-page SEO checks
* GEO analysis
* AI-search optimization
* Content optimization
* SEO scoring
* SEO recommendations

The MCP architecture also makes it possible to add additional SEO capabilities over time.

---

# Claude Code for SEO

The MCP can also be used with **Claude Code** for AI-assisted SEO workflows.

For example, you can use Claude Code to combine webpage analysis with your development and content workflow:

```text
Analyze the SEO of this page and identify the five most important
technical and on-page issues that should be fixed.
```

You can then ask Claude to explain the findings, prioritize implementation work, or help modify your website code and content.

This makes the project useful for developers, SEO professionals, agencies, content teams, and technical marketers.

---

# SEO Skills for Claude

The project can be extended with specialized SEO workflows or skills for Claude.

Potential skills include:

* SEO auditing
* Keyword research
* On-page SEO
* Technical SEO
* Content optimization
* Internal linking
* Schema analysis
* GEO optimization
* AI-search optimization
* Content gap analysis
* Competitor analysis
* SEO reporting

The goal is to make SEO analysis available through natural-language workflows instead of requiring users to manually navigate multiple tools.

---

# What Is GEO?

**GEO (Generative Engine Optimization)** is the practice of improving content so that it is easier for AI-powered search and answer systems to understand, retrieve, summarize, and potentially cite.

Modern search experiences increasingly include AI-generated answers and conversational search interfaces.

GEO-related optimization can include:

* Clear answers to common questions
* Strong topical organization
* Structured information
* Author and entity information
* Original data and useful facts
* Supporting sources
* Descriptive headings
* FAQ content where appropriate
* Structured data
* Concise, understandable explanations

This MCP does **not** claim that any specific optimization guarantees citations or visibility in an AI system.

---

# Supported AI & Search Ecosystem

The SEO and GEO concepts covered by this project are relevant to modern search and AI experiences including:

* Claude
* ChatGPT
* Google Search
* Google AI Overviews
* Google Gemini
* Perplexity
* Microsoft Copilot
* Other AI-powered search and answer systems

The MCP itself performs webpage analysis. It does not directly control how these external platforms rank, retrieve, summarize, or cite content.

---

# Who Is This For?

### SEO Professionals

Use Claude as an AI-assisted SEO analysis interface.

### SEO Agencies

Use the MCP as part of technical SEO and website auditing workflows.

### Developers

Integrate SEO analysis into development and code-review workflows.

### Content Teams

Analyze content structure, keyword usage, and optimization opportunities.

### AI SEO Professionals

Combine traditional SEO analysis with GEO and AI-search optimization workflows.

### Website Owners

Run practical SEO checks without needing to manually inspect every HTML element.

---

# Roadmap

The project is actively designed for expansion.

Potential future tools include:

* [ ] Backlink profile analysis
* [ ] Sitemap validation
* [ ] Robots.txt analysis
* [ ] XML sitemap auditing
* [ ] Schema markup validation
* [ ] Core Web Vitals integration
* [ ] PageSpeed analysis
* [ ] Content gap analysis
* [ ] Competitor SEO comparison
* [ ] Internal link analysis
* [ ] Broken-link detection
* [ ] Batch URL auditing
* [ ] Keyword clustering
* [ ] Search intent analysis
* [ ] Content brief generation
* [ ] AI-search visibility tracking
* [ ] Citation analysis
* [ ] Brand visibility analysis
* [ ] Automated SEO reports

---

# Project Architecture

The project is designed around the Model Context Protocol so SEO functionality can be exposed as structured tools to compatible AI clients.

```text
Website
   │
   ▼
MCP Client
   │
   ▼
AI SEO Audit MCP
   │
   ├── SEO Audit
   ├── Keyword Analysis
   ├── On-Page SEO
   ├── Technical SEO
   ├── GEO Analysis
   └── SEO Score
```

Additional tools can be added without rebuilding the entire architecture.

---

# Contributing

Contributions are welcome.

Before submitting a major change, please open an issue to discuss the proposed feature or architectural change.

Typical contribution areas include:

* New SEO tools
* Improved SEO checks
* GEO analysis
* Tests
* Documentation
* Performance improvements
* Bug fixes
* MCP compatibility

---

# Development

Install dependencies:

```bash
npm install
```

Build:

```bash
npm run build
```

Run tests:

```bash
npm test
```

Run the development environment, if configured:

```bash
npm run dev
```

---

# License

MIT License.

Copyright © [Mani Pathak](https://webseotrends.com)

---

# About Webseotrends

**Webseotrends** provides SEO, AI SEO, GEO, AEO, technical SEO, content marketing, link building, PPC, web design, and web development services.

This MCP project is part of Webseotrends' work around **AI-powered SEO and search visibility**.

### Webseotrends

* 🌐 [Website](https://webseotrends.com/)
* 🤖 [AI SEO Services](https://webseotrends.com/)
* 🔎 [Best Web Hosting](https://webseotrends.com/best-web-hosting/)
* 👤 [Mani Pathak on GitHub](https://github.com/manipathaktech)
* ▶️ [Mani Pathak on YouTube](https://www.youtube.com/@manipathaktech)


# Related Resources
* [Claude](https://claude.ai/)
* [Claude Code](https://docs.anthropic.com/en/docs/claude-code)




## Keywords

Claude SEO, Claude SEO tool, Claude SEO tools, Claude SEO software, Claude SEO audit, Claude SEO checker, Claude SEO analysis, Claude SEO analysis tools, Claude SEO analysis software, Claude SEO checking tool, Claude SEO tracking, Claude SEO tracker, Claude SEO rank tracking, Claude for SEO, SEO for Claude, SEO tools for Claude, SEO tool for Claude, Claude AI SEO tools, Claude AI for SEO, Claude Code SEO, Claude Code for SEO, SEO Claude skills, Claude SEO skills, SEO skills for Claude, AI SEO audit, AI SEO audits, AI SEO audit tool, AI SEO audit service, SEO audit AI, GEO SEO, GEO SEO Claude, GEO SEO tools, generative engine optimization, AI search optimization, AI-search visibility, SEO analysis tools, technical SEO analysis, on-page SEO analysis, SEO scoring tool, Claude SEO GitHub, Claude SEO MCP, SEO MCP, SEO MCP server, AI SEO MCP.
