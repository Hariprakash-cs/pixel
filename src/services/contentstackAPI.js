// Contentstack CMS API Service
// Documentation: https://www.contentstack.com/docs/developers/apis/content-delivery-api/

import { config } from "../config";

const CONTENTSTACK_CONFIG = {
  baseURL: "https://cdn.contentstack.io/v3",
  apiKey: config.contentstack.apiKey,
  accessToken: config.contentstack.accessToken,
};

// Helper function to make API calls
const contentstackFetch = async (endpoint, options = {}) => {
  try {
    const url = `${CONTENTSTACK_CONFIG.baseURL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        api_key: CONTENTSTACK_CONFIG.apiKey,
        access_token: CONTENTSTACK_CONFIG.accessToken,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Contentstack API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Contentstack API Error:", error);
    return { success: false, error: error.message };
  }
};

// ============================================
// CONTENTSTACK API METHODS
// ============================================

export const contentstackAPI = {
  /**
   * Get all content types
   * Returns list of available content types
   */
  getAllContentTypes: async () => {
    try {
      const result = await contentstackFetch("/content_types");

      if (result.success && result.data.content_types) {
        return {
          success: true,
          data: result.data.content_types,
        };
      }

      return result;
    } catch (error) {
      console.error("Error fetching content types:", error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get specific content type details
   * @param {string} uid - Content type UID (e.g., 'one_piece')
   */
  getContentType: async (uid) => {
    try {
      const result = await contentstackFetch(`/content_types/${uid}`);

      if (result.success && result.data.content_type) {
        return {
          success: true,
          data: result.data.content_type,
        };
      }

      return result;
    } catch (error) {
      console.error(`Error fetching content type ${uid}:`, error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get all entries for a specific content type
   * @param {string} contentTypeUid - Content type UID
   * @param {object} query - Additional query parameters (skip, limit, etc.)
   */
  getEntriesByContentType: async (contentTypeUid, query = {}) => {
    try {
      // Build query string with skip and limit support
      const queryParams = new URLSearchParams();

      // Add skip parameter if provided
      if (query.skip !== undefined) {
        queryParams.append("skip", query.skip);
      }

      // Add limit parameter if provided
      if (query.limit !== undefined) {
        queryParams.append("limit", query.limit);
      }

      // Add sort parameter (default to ascending by episode_number)
      const sortOrder = query.sortOrder || "asc";
      queryParams.append("asc", sortOrder === "asc" ? "episode_number" : "");
      queryParams.append("desc", sortOrder === "desc" ? "episode_number" : "");

      // Add count parameter to get total count
      queryParams.append("include_count", "true");

      const queryString = queryParams.toString()
        ? `?${queryParams.toString()}`
        : "";

      const result = await contentstackFetch(
        `/content_types/${contentTypeUid}/entries${queryString}`
      );

      if (result.success && result.data.entries) {
        return {
          success: true,
          data: result.data.entries,
          count: result.data.count || result.data.entries.length,
          total: result.data.count || result.data.entries.length,
        };
      }

      return result;
    } catch (error) {
      console.error(`Error fetching entries for ${contentTypeUid}:`, error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get a specific entry by UID
   * @param {string} contentTypeUid - Content type UID
   * @param {string} entryUid - Entry UID
   */
  getEntryByUid: async (contentTypeUid, entryUid) => {
    try {
      const result = await contentstackFetch(
        `/content_types/${contentTypeUid}/entries/${entryUid}`
      );

      if (result.success && result.data.entry) {
        return {
          success: true,
          data: result.data.entry,
        };
      }

      return result;
    } catch (error) {
      console.error(`Error fetching entry ${entryUid}:`, error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Search entries across content types
   * @param {string} contentTypeUid - Content type UID
   * @param {string} searchQuery - Search term
   */
  searchEntries: async (contentTypeUid, searchQuery) => {
    try {
      const query = {
        query: JSON.stringify({
          title: { $regex: searchQuery, $options: "i" },
        }),
      };

      return await contentstackAPI.getEntriesByContentType(
        contentTypeUid,
        query
      );
    } catch (error) {
      console.error("Error searching entries:", error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get entry by field value (query)
   * @param {string} contentTypeUid - Content type UID
   * @param {string} field - Field name to query
   * @param {string} value - Field value to match
   */
  getEntryByField: async (contentTypeUid, field, value) => {
    try {
      const query = {
        query: JSON.stringify({
          [field]: value,
        }),
      };

      const queryString = new URLSearchParams(query).toString();
      const result = await contentstackFetch(
        `/content_types/${contentTypeUid}/entries?${queryString}`
      );

      if (
        result.success &&
        result.data.entries &&
        result.data.entries.length > 0
      ) {
        return {
          success: true,
          data: result.data.entries[0], // Return first matching entry
        };
      }

      return { success: false, error: "No matching entry found" };
    } catch (error) {
      console.error(`Error fetching entry by ${field}:`, error);
      return { success: false, error: error.message };
    }
  },
};

// ============================================
// DATA TRANSFORMATION UTILITIES
// ============================================

/**
 * Transform Contentstack content type to app format
 */
export const transformContentType = (contentType) => {
  return {
    uid: contentType.uid,
    title: contentType.title || contentType.uid,
    description:
      contentType.description ||
      `Browse ${contentType.title || contentType.uid} content`,
    created_at: contentType.created_at,
    updated_at: contentType.updated_at,
    schema: contentType.schema || [],
  };
};

/**
 * Transform Contentstack entry to app format
 */
export const transformEntry = (entry, contentTypeUid) => {
  // Extract video URL from nested structure
  let videoLink = null;
  if (entry.url && typeof entry.url === "object" && entry.url.url) {
    // Handle nested url object: entry.url.url
    videoLink = entry.url.url;
    console.log("🎥 Extracted video URL from entry.url.url:", videoLink);
  } else if (typeof entry.url === "string") {
    // Handle direct url string
    videoLink = entry.url;
    console.log("🎥 Using direct URL string:", videoLink);
  } else if (entry.video_link) {
    videoLink = entry.video_link;
    console.log("🎥 Using video_link:", videoLink);
  } else if (entry.video_url) {
    videoLink = entry.video_url;
    console.log("🎥 Using video_url:", videoLink);
  } else {
    console.warn("⚠️ No video URL found for entry:", entry.title || entry.uid);
  }

  // Extract poster URL from nested structure
  const posterUrl =
    entry.poster_url?.url ||
    entry.thumbnail?.url ||
    entry.image?.url ||
    entry.poster?.url ||
    null;

  const transformed = {
    id: entry.uid,
    contentType: contentTypeUid,
    title: entry.title || entry.name || "Untitled",
    description: entry.description || entry.synopsis || "",
    synopsis: entry.synopsis || entry.description || "",
    thumbnail: posterUrl,
    poster_url: entry.poster_url || null,
    poster_image: entry.poster_image || entry.poster || null,
    video_link: videoLink,
    episode_number: entry.episode_number || null,
    current_episode: entry.current_episode || null,
    total_episode: entry.total_episode || null,
    title_ct: entry.title_ct || null, // Content type UID for video entries
    series_content_type:
      entry.series_content_type || entry.title_ct || contentTypeUid,
    content_type_uid: contentTypeUid,
    created_at: entry.created_at,
    updated_at: entry.updated_at,
    // Preserve all original fields
    ...entry,
  };

  console.log("✅ Transformed entry:", {
    id: transformed.id,
    title: transformed.title,
    title_ct: transformed.title_ct,
    video_link: transformed.video_link,
    episode_number: transformed.episode_number,
  });

  return transformed;
};

/**
 * Bulk transform content types
 */
export const transformContentTypes = (contentTypes) => {
  if (!Array.isArray(contentTypes)) return [];
  return contentTypes.map(transformContentType);
};

/**
 * Bulk transform entries
 */
export const transformEntries = (entries, contentTypeUid) => {
  if (!Array.isArray(entries)) return [];
  return entries.map((entry) => transformEntry(entry, contentTypeUid));
};

export default contentstackAPI;
