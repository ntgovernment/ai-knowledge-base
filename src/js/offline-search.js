/**
 * Offline Search Module - Enhanced Multi-Word Search
 *
 * Features:
 * - Multi-word tokenization (queries split into individual terms)
 * - TF (Term Frequency) scoring with field weighting
 * - Noise word filtering
 * - Document length normalization
 * - Match tracking for result highlighting
 */

import { NOISE_WORDS } from "./config.js";

/**
 * Tokenize and normalize a search query
 * @param {string} query - Raw search query
 * @returns {Array<string>} Array of normalized tokens (noise words removed)
 */
function tokenizeQuery(query) {
  // Normalize: lowercase, remove special chars, split on whitespace
  const normalized = query
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .trim();

  if (!normalized) return [];

  // Split into words and filter out noise words
  const tokens = normalized
    .split(/\s+/)
    .filter((token) => token.length > 0 && !NOISE_WORDS.has(token));

  return tokens;
}

/**
 * Normalize text for searching (lowercase, remove special chars)
 * @param {string} text - Text to normalize
 * @returns {string} Normalized text
 */
function normalizeText(text) {
  if (!text) return "";
  return text.toLowerCase().replace(/[^\w\s]/g, " ");
}

/**
 * Count term frequency in text
 * @param {string} text - Text to search in
 * @param {string} term - Term to count
 * @returns {number} Number of occurrences
 */
function countTermFrequency(text, term) {
  if (!text || !term) return 0;

  const normalized = normalizeText(text);
  const regex = new RegExp(`\\b${term}\\b`, "gi");
  const matches = normalized.match(regex);

  return matches ? matches.length : 0;
}

/**
 * Extract all metadata as searchable text
 * @param {Object} result - Search result object
 * @returns {string} Concatenated metadata text
 */
function extractMetadata(result) {
  const parts = [];

  if (result.listMetadata) {
    // Work areas
    if (result.listMetadata["Work area"]) {
      parts.push(...result.listMetadata["Work area"]);
    }
    // Roles
    if (result.listMetadata["Roles"]) {
      parts.push(...result.listMetadata["Roles"]);
    }
    // Benefits
    if (result.listMetadata["Benefits"]) {
      parts.push(...result.listMetadata["Benefits"]);
    }
  }

  return parts.join(" ");
}

/**
 * Calculate TF score for a single term across all fields
 * @param {Object} result - Search result object
 * @param {string} term - Search term
 * @returns {Object} Score breakdown and total
 */
function scoreTermInResult(result, term) {
  const titleText = result.title || "";
  const summaryText = result.summary || "";
  const metadataText = extractMetadata(result);

  // Count term frequency in each field
  const titleTF = countTermFrequency(titleText, term);
  const summaryTF = countTermFrequency(summaryText, term);
  const metadataTF = countTermFrequency(metadataText, term);

  // Apply field weights (Title: 5x, Metadata: 3x, Summary: 2x)
  const titleScore = titleTF * 5;
  const summaryScore = summaryTF * 2;
  const metadataScore = metadataTF * 3;

  const totalScore = titleScore + summaryScore + metadataScore;

  return {
    titleTF,
    summaryTF,
    metadataTF,
    titleScore,
    summaryScore,
    metadataScore,
    totalScore,
    hasMatch: totalScore > 0,
  };
}

/**
 * Calculate document length for normalization
 * @param {Object} result - Search result object
 * @returns {number} Total character count
 */
function getDocumentLength(result) {
  const titleLength = (result.title || "").length;
  const summaryLength = (result.summary || "").length;
  const metadataLength = extractMetadata(result).length;

  return titleLength + summaryLength + metadataLength;
}

/**
 * Search through locally cached data using multi-word tokenization
 *
 * Scoring algorithm:
 * - Tokenizes query into individual terms (filters noise words)
 * - For each term, counts frequency in title/summary/metadata
 * - Applies field weights: Title (5x), Metadata (3x), Summary (2x)
 * - Normalizes by document length (× 1000 to keep scores readable)
 * - Tracks matched terms for result highlighting
 *
 * @param {string} keywords - Search keywords entered by user
 * @param {Array} results - Cached search results to filter
 * @returns {Array} Filtered and scored results, sorted by relevance
 */
export function searchLocalData(keywords, results) {
  if (!keywords || !results || results.length === 0) {
    console.log("Offline search: No keywords or no cached results available");
    return [];
  }

  // Tokenize query
  const terms = tokenizeQuery(keywords);

  if (terms.length === 0) {
    console.log(
      "Offline search: No valid search terms after filtering noise words",
    );
    return [];
  }

  console.log(
    `Offline search: Searching for terms [${terms.join(", ")}] in ${results.length} cached results`,
  );

  // Score each result
  const scoredResults = results.map((result) => {
    let totalScore = 0;
    const matchedTerms = [];
    const termScores = {};

    // Score each term independently
    terms.forEach((term) => {
      const termScore = scoreTermInResult(result, term);

      if (termScore.hasMatch) {
        matchedTerms.push(term);
        totalScore += termScore.totalScore;
        termScores[term] = termScore;
      }
    });

    // Normalize by document length to prevent long documents from dominating
    const docLength = getDocumentLength(result);
    const normalizedScore = docLength > 0 ? (totalScore / docLength) * 1000 : 0;

    return {
      ...result,
      _offlineScore: normalizedScore,
      _rawScore: totalScore,
      _matchedTerms: matchedTerms,
      _termScores: termScores,
      _docLength: docLength,
    };
  });

  // Filter: require at least one matched term
  const matchedResults = scoredResults.filter(
    (result) => result._matchedTerms.length > 0,
  );

  // Sort by normalized score descending (highest score first)
  matchedResults.sort((a, b) => b._offlineScore - a._offlineScore);

  console.log(
    `Offline search: Found ${matchedResults.length} results matching [${terms.join(", ")}]`,
  );

  // Log top 3 results for debugging
  if (matchedResults.length > 0) {
    console.log("Offline search: Top results:");
    matchedResults.slice(0, 3).forEach((result, index) => {
      console.log(
        `  ${index + 1}. "${result.title}" (score: ${result._offlineScore.toFixed(2)}, ` +
          `matched: [${result._matchedTerms.join(", ")}], ` +
          `raw: ${result._rawScore}, len: ${result._docLength})`,
      );
    });
  }

  return matchedResults;
}

/**
 * Get cached search data from global scope
 *
 * @returns {Array|null} Cached results or null if not available
 */
export function getCachedData() {
  if (window.aikbSearchCache && Array.isArray(window.aikbSearchCache)) {
    console.log(
      `Offline search: Retrieved ${window.aikbSearchCache.length} cached results`,
    );
    return window.aikbSearchCache;
  }

  console.log("Offline search: No cached data available");
  return null;
}
