# AI SEO Audit MCP

**AI-powered SEO audit tools for Claude & Claude Code — by [Webseotrends](https://webseotrends.com)**

[![CI](https://github.com/manipathaktech/ai-seo-audit-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/manipathaktech/ai-seo-audit-mcp/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-compatible-blue)](https://modelcontextprotocol.io)
[![Node](https://img.shields.io/badge/node-%3E%3D18-green)](https://nodejs.org)

Run SEO audits, analyse keywords, check technical SEO, evaluate content, and analyse GEO / AI-search visibility — all directly through Claude or Claude Code.

No API keys needed. Works on any public URL.

---

## Tools

| Tool | What it does |
|------|-------------|
| `seo_audit` | Full SEO audit — meta tags, headings, images, links, content, technical (score 0–100) |
| `keyword_analysis` | Keyword prominence, density, and placement analysis for any target keyword |
| `geo_analysis` | AI-search visibility (GEO) for ChatGPT, Gemini, Claude, Perplexity |
| `seo_score` | Quick SEO score with letter grade (A+ to F) |
| `on_page_seo` | Focused on-page analysis: title, description, headings, content |
| `technical_seo` | Technical checks: HTTPS, canonical, viewport, structured data, load time |

---

## Quick Start

### 1. Clone & Build

```bash
git clone https://github.com/manipathaktech/ai-seo-audit-mcp.git
cd ai-seo-audit-mcp
npm install
npm run build
```

### 2. Add to Claude Code

Edit your Claude Code MCP config file:

**Mac/Linux:** `~/.claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "ai-seo-audit": {
      "command": "node",
      "args": ["/absolute/path/to/ai-seo-audit-mcp/dist/index.js"]
    }
  }
}
```

Replace `/absolute/path/to/` with where you cloned the repo.

### 3. Restart Claude Code

Once restarted, ask Claude:

> **"Audit the SEO of https://webseotrends.com"**

---

## Usage Examples

### Full SEO Audit
```
Audit the SEO of https://example.com
```

### Keyword Analysis
```
Analyse how well "SEO tools" is optimised on https://example.com/page
```

### GEO / AI-Search Analysis
```
Is https://example.com optimised for ChatGPT and Google Gemini?
```

### Quick SEO Score
```
What is the SEO score of https://example.com?
```

### On-Page SEO
```
Run an on-page SEO check on https://example.com/blog/post
```

### Technical SEO
```
Check the technical SEO of https://example.com
```

---

## What is GEO?

**Generative Engine Optimisation (GEO)** ensures your content is cited and surfaced by AI-powered search engines — ChatGPT, Google Gemini, Claude, Perplexity, and Microsoft Copilot.

The `geo_analysis` tool checks your pages for:

- Q&A format content AI engines can extract
- FAQPage, HowTo, and Article schema markup
- Author information and E-E-A-T signals
- Clear topic structure via headings
- Citation-friendly content (statistics, data, sources)
- Sentence-level readability for AI parsers

---

## Requirements

- Node.js 18+
- Claude Code (or any MCP-compatible client)

---

## Roadmap

- [ ] Backlink analysis
- [ ] Sitemap & robots.txt validation
- [ ] Competitor SEO comparison
- [ ] Core Web Vitals integration
- [ ] Content gap analysis
- [ ] Batch URL auditing

---

## Contributing

Pull requests are welcome. Please open an issue first for major changes.

---

## License

MIT © [Mani Pathak](https://webseotrends.com)

---

## About

Built by **Mani Pathak**, SEO expert and digital marketing strategist at [Webseotrends](https://webseotrends.com).

- Website: [webseotrends.com](https://webseotrends.com)
- GitHub: [@manipathaktech](https://github.com/manipathaktech)
- YouTube: [@manipathaktech](https://www.youtube.com/@manipathaktech)
