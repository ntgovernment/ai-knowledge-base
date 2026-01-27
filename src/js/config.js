/**
 * Configuration Module
 * Centralized environment detection and API endpoint configuration
 */

/**
 * Detect if the application is running in production environment
 * @returns {boolean} True if running on ntgcentral.nt.gov.au
 */
export function isProduction() {
  return window.location.hostname === "ntgcentral.nt.gov.au";
}

/**
 * Get the appropriate data source URL based on environment
 * @returns {Object} Configuration object with data source URLs
 */
export function getConfig() {
  const config = {
    isProduction: isProduction(),
    liveApiUrl:
      "https://ntgcentral.nt.gov.au/services-and-support/ict-services-websites/artificial-intelligence/ai-knowledge-base/configuration/listing/articles/_nocache",
    fallbackJsonUrl: "./dist/search.json",
    workAreasUrl: isProduction()
      ? "https://ntgcentral.nt.gov.au/services-and-support/ict-services-websites/artificial-intelligence/ai-knowledge-base/configuration/listing/work-areas/_nocache"
      : "./src/data/work-areas.json",
  };

  return config;
}

/**
 * Get the primary data source URL for the current environment
 * Production: Live API
 * Development: Local JSON file
 * @returns {string} The primary data source URL
 */
export function getPrimaryDataSource() {
  const config = getConfig();
  return config.isProduction ? config.liveApiUrl : config.fallbackJsonUrl;
}

/**
 * Get the fallback data source URL
 * Only used in production when live API fails
 * @returns {string|null} The fallback URL or null for dev environment
 */
export function getFallbackDataSource() {
  const config = getConfig();
  return config.isProduction ? config.fallbackJsonUrl : null;
}

/**
 * Get the work areas data source URL for the current environment
 * Production: Live API
 * Development: Local JSON file
 * @returns {string} The work areas data source URL
 */
export function getWorkAreasDataSource() {
  const config = getConfig();
  return config.workAreasUrl;
}

/**
 * Common noise words to filter from search queries
 * Reused from Funnelback implementation for consistency
 */
export const NOISE_WORDS = new Set([
  "a",
  "au",
  "all",
  "am",
  "an",
  "and",
  "any",
  "are",
  "as",
  "at",
  "be",
  "been",
  "but",
  "by",
  "can",
  "cant",
  "co",
  "com",
  "de",
  "do",
  "eg",
  "else",
  "etc",
  "for",
  "from",
  "get",
  "go",
  "had",
  "has",
  "hasnt",
  "have",
  "he",
  "hence",
  "her",
  "here",
  "hers",
  "him",
  "his",
  "how",
  "http",
  "https",
  "i",
  "ie",
  "if",
  "in",
  "is",
  "it",
  "its",
  "la",
  "me",
  "my",
  "nor",
  "not",
  "now",
  "of",
  "off",
  "on",
  "or",
  "our",
  "ours",
  "pm",
  "put",
  "re",
  "she",
  "so",
  "than",
  "that",
  "the",
  "their",
  "them",
  "then",
  "there",
  "these",
  "they",
  "this",
  "those",
  "thus",
  "to",
  "too",
  "uk",
  "un",
  "until",
  "up",
  "upon",
  "us",
  "very",
  "via",
  "was",
  "we",
  "well",
  "were",
  "what",
  "when",
  "where",
  "which",
  "while",
  "who",
  "why",
  "www",
  "you",
  "your",
  "yours",
]);
