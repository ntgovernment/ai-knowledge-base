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
