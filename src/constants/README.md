# Constants & Mock Data

This directory contains mock data and constants for the anime streaming website. This data structure is designed to be easily replaced with CMS API calls.

## File Structure

### `mockData.js`

Contains mock anime data for different sections of the website:

- `featuredAnime` - Main carousel items (4 items)
- `trendingAnime` - Trending section (6+ items)
- `popularAnime` - Popular section (6+ items)
- `newReleases` - New releases section (6+ items)
- `genres` - Available genre filters

## Data Structure

### Featured Anime (Carousel Items)

```javascript
{
  id: string,              // Unique identifier
  title: string,           // Anime title
  description: string,     // Full description (for carousel)
  thumbnail: string,       // Image URL (portrait)
  backdrop: string,        // Background image URL (landscape)
  rating: number,          // Rating (0-10)
  year: number,           // Release year
  episodes: string,        // Episode count
  genre: string[],        // Array of genres
  status: string          // "Ongoing" | "Completed"
}
```

### Regular Anime Items (Rows)

```javascript
{
  id: string,              // Unique identifier
  title: string,           // Anime title
  thumbnail: string,       // Image URL
  rating: number,          // Rating (0-10)
  episodes: string,        // Episode count
  year: number            // Release year
}
```

## CMS Integration Guide

### Step 1: Replace Mock Data with CMS API

The app is designed to automatically merge API data with mock data:

```javascript
import { videoAPI } from "../services/apiService";
import { mergeWithAPIData, formatAnimeData } from "../constants/mockData";

// Fetch from CMS
const result = await videoAPI.getAllVideos();
const formattedData = result.data.map(formatAnimeData);

// Merge with mock data (uses API if available, falls back to mock)
const featured = mergeWithAPIData(formattedData, featuredAnime);
```

### Step 2: Add CMS Categories

Update your CMS to include categories:

```javascript
// In your CMS, add category fields:
-featured(boolean) -
  trending(boolean) -
  popular(boolean) -
  new_release(boolean);
```

Then filter in your component:

```javascript
const featured = apiData.filter((item) => item.featured).slice(0, 4);
const trending = apiData.filter((item) => item.trending);
const popular = apiData.filter((item) => item.popular);
```

### Step 3: Update API Service

Add category-specific endpoints in `services/apiService.js`:

```javascript
export const videoAPI = {
  // ... existing methods

  getFeatured: async () => {
    try {
      const response = await api.get("/api/videos/featured");
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  getTrending: async () => {
    try {
      const response = await api.get("/api/videos/trending");
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // ... add more endpoints
};
```

### Step 4: Update Home Component

Replace mock data with CMS data:

```javascript
useEffect(() => {
  const fetchData = async () => {
    // Fetch from different endpoints
    const [featuredResult, trendingResult, popularResult] = await Promise.all([
      videoAPI.getFeatured(),
      videoAPI.getTrending(),
      videoAPI.getPopular(),
    ]);

    // Use API data or fallback to mock
    setFeatured(mergeWithAPIData(featuredResult.data, featuredAnime));
    setTrending(mergeWithAPIData(trendingResult.data, trendingAnime));
    setPopular(mergeWithAPIData(popularResult.data, popularAnime));
  };

  fetchData();
}, []);
```

## Image Requirements

### Carousel/Featured Images

- **Backdrop**: 1920x1080px (16:9 aspect ratio)
- **Thumbnail**: 300x450px (2:3 aspect ratio)
- Format: JPG or WebP
- Max size: 500KB

### Row Items

- **Size**: 300x450px (2:3 aspect ratio)
- Format: JPG or WebP
- Max size: 200KB

## Placeholder Images

Currently using Unsplash placeholders. Replace with actual anime images:

```javascript
// Replace
thumbnail: "https://images.unsplash.com/...";

// With
thumbnail: "https://your-cdn.com/anime/one-piece-thumb.jpg";
```

## Adding New Sections

To add a new section (e.g., "Recommended for You"):

1. Add mock data in `mockData.js`:

```javascript
export const recommendedAnime = [
  // ... items
];
```

2. Add state in Home component:

```javascript
const [recommended, setRecommended] = useState(recommendedAnime);
```

3. Fetch from API:

```javascript
const recResult = await videoAPI.getRecommended();
setRecommended(mergeWithAPIData(recResult.data, recommendedAnime));
```

4. Add to render:

```javascript
<AnimeRow
  title="Recommended for You"
  items={recommended}
  seeAllLink="/browse/recommended"
/>
```

## Environment Variables

For CMS integration, add to `.env`:

```env
REACT_APP_CMS_API_URL=https://your-cms-api.com
REACT_APP_CDN_URL=https://your-cdn.com
REACT_APP_IMAGE_BASE_URL=https://images.your-site.com
```

## Testing

Test with mock data:

1. All sections should display
2. Carousel should auto-advance
3. Rows should scroll horizontally
4. Search should work with API data

Then test with real CMS:

1. Replace one section at a time
2. Ensure fallback to mock data works
3. Test error handling

## Notes

- Mock data uses Unsplash images as placeholders
- All anime titles and data are examples
- Structure supports both YouTube URLs and direct video links
- Ready for Strapi, Contentful, or custom CMS integration
