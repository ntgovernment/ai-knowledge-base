/**
 * Offline Search Module
 *
 * Provides client-side search functionality when Funnelback API is unavailable.
 * Uses cached search results stored in window.aikbSearchCache.
 */

/**
 * Search through locally cached data using keywords
 *
 * Scoring algorithm:
 * - Title matches: 3 points per occurrence (prioritized)
 * - Summary matches: 1 point per occurrence
 * - Metadata matches: 2 points per keyword match
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

  // Normalize keywords for matching
  const normalizedKeywords = keywords
    .toLowerCase()
    .replace(/[^\w\s]/g, "") // Remove special characters
    .trim();

  if (!normalizedKeywords) {
    console.log("Offline search: Keywords empty after normalization");
    return [];
  }

  console.log(
    `Offline search: Searching for "${keywords}" in ${results.length} cached results`
  );

  // Create regex pattern for matching
  const keywordPattern = new RegExp(normalizedKeywords, "gi");

  // Score each result
  const scoredResults = results.map((result) => {
    let score = 0;
    let titleMatches = 0;
    let summaryMatches = 0;
    let metadataMatches = 0;

    // Score title matches (weight: 3)
    if (result.title) {
      const titleText = result.title.toLowerCase().replace(/[^\w\s]/g, "");
      const matches = titleText.match(keywordPattern);
      if (matches) {
        titleMatches = matches.length;
        score += titleMatches * 3;
      }
    }

    // Score summary matches (weight: 1)
    if (result.summary) {
      const summaryText = result.summary.toLowerCase().replace(/[^\w\s]/g, "");
      const matches = summaryText.match(keywordPattern);
      if (matches) {
        summaryMatches = matches.length;
        score += summaryMatches * 1;
      }
    }

    // Score metadata matches (weight: 2)
    if (result.metadata) {
      const metadataText = result.metadata
        .toLowerCase()
        .replace(/[^\w\s]/g, "");
      const matches = metadataText.match(keywordPattern);
      if (matches) {
        metadataMatches = matches.length;
        score += metadataMatches * 2;
      }
    }

    return {
      ...result,
      _offlineScore: score,
      _offlineMatches: {
        title: titleMatches,
        summary: summaryMatches,
        metadata: metadataMatches,
      },
    };
  });

  // Filter out results with no matches (score = 0)
  const matchedResults = scoredResults.filter(
    (result) => result._offlineScore > 0
  );

  // Sort by score descending (highest score first)
  matchedResults.sort((a, b) => b._offlineScore - a._offlineScore);

  console.log(
    `Offline search: Found ${matchedResults.length} results matching "${keywords}"`
  );

  // Log top 3 results for debugging
  if (matchedResults.length > 0) {
    console.log("Offline search: Top results:");
    matchedResults.slice(0, 3).forEach((result, index) => {
      console.log(
        `  ${index + 1}. "${result.title}" (score: ${
          result._offlineScore
        }, title:${result._offlineMatches.title}, summary:${
          result._offlineMatches.summary
        }, metadata:${result._offlineMatches.metadata})`
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
      `Offline search: Retrieved ${window.aikbSearchCache.length} cached results`
    );
    return window.aikbSearchCache;
  }

  console.log("Offline search: No cached data available");
  return null;
}
