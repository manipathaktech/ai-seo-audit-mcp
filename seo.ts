// ============================================================
// Claude SEO MCP — Shared Types
// By Mani Pathak / Webseotrends (https://webseotrends.com)
// ============================================================

export interface SeoScore {
  overall: number;        // 0–100
  technical: number;
  onPage: number;
  content: number;
  performance: number;
}

export interface SeoIssue {
  type: "critical" | "warning" | "info";
  category: string;
  message: string;
  recommendation: string;
}

export interface MetaTagAnalysis {
  title: string | null;
  titleLength: number;
  titleOptimal: boolean;
  description: string | null;
  descriptionLength: number;
  descriptionOptimal: boolean;
  canonical: string | null;
  robots: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  twitterCard: string | null;
}

export interface HeadingAnalysis {
  h1Count: number;
  h1Texts: string[];
  h2Count: number;
  h2Texts: string[];
  h3Count: number;
  headingStructureValid: boolean;
  issues: string[];
}

export interface ImageAnalysis {
  total: number;
  withAlt: number;
  withoutAlt: number;
  withoutAltSrcs: string[];
  largeImages: string[];
}

export interface LinkAnalysis {
  internal: number;
  external: number;
  broken: string[];
  nofollowExternal: number;
}

export interface ContentAnalysis {
  wordCount: number;
  readabilityScore: number;
  keywordDensity: Record<string, number>;
  paragraphCount: number;
  avgSentenceLength: number;
  issues: string[];
}

export interface TechnicalSeoAnalysis {
  url: string;
  statusCode: number;
  loadTime: number;
  hasHttps: boolean;
  hasSitemap: boolean;
  hasRobotsTxt: boolean;
  isCanonicalSelf: boolean;
  hasMobileViewport: boolean;
  hasStructuredData: boolean;
  structuredDataTypes: string[];
  issues: SeoIssue[];
}

export interface FullSeoAudit {
  url: string;
  timestamp: string;
  score: SeoScore;
  meta: MetaTagAnalysis;
  headings: HeadingAnalysis;
  images: ImageAnalysis;
  links: LinkAnalysis;
  content: ContentAnalysis;
  technical: TechnicalSeoAnalysis;
  topIssues: SeoIssue[];
  recommendations: string[];
}

export interface KeywordAnalysis {
  keyword: string;
  density: number;
  count: number;
  inTitle: boolean;
  inDescription: boolean;
  inH1: boolean;
  inFirstParagraph: boolean;
  prominence: number;   // 0–100
  recommendations: string[];
}

export interface GeoAnalysis {
  url: string;
  aiSearchReadiness: number;   // 0–100
  hasQAFormat: boolean;
  hasFAQSchema: boolean;
  hasHowToSchema: boolean;
  hasArticleSchema: boolean;
  hasAuthorInfo: boolean;
  hasClearTopics: boolean;
  readabilityForAI: number;
  citationFriendly: boolean;
  recommendations: string[];
}

export interface SeoScoreResult {
  url: string;
  overallScore: number;
  grade: string;          // A–F
  breakdown: SeoScore;
  summary: string;
  topWins: string[];
  topIssues: string[];
}
