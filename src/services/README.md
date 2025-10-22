# API Services

This directory contains centralized API management for the PixelStream application.

## Structure

### `apiService.js`

Main API service file containing all API calls organized by functionality.

#### User Authentication APIs (`userAPI`)

- `register(userData)` - Register new user
- `login(credentials)` - Login user
- `logout()` - Logout current user
- `getCurrentUser()` - Get current logged-in user
- `isAuthenticated()` - Check if user is authenticated

#### Video APIs (`videoAPI`)

- `getAllVideos()` - Fetch all videos
- `getVideoById(videoId)` - Get video details by ID
- `createVideo(videoData)` - Create new video
- `updateVideo(videoId, videoData)` - Update existing video
- `deleteVideo(videoId)` - Delete video
- `searchVideos(query)` - Search videos by query
- `filterByCategory(category)` - Filter videos by category

#### Admin APIs (`adminAPI`)

- `getAllUsers()` - Get all users (admin only)
- `getDashboardStats()` - Get dashboard statistics

#### Utility Functions (`apiUtils`)

- `handleError(error)` - Handle API errors consistently
- `formatVideoData(video)` - Format video data for display

## Usage Example

```javascript
import { videoAPI, userAPI } from "../services/apiService";

// Fetch all videos
const result = await videoAPI.getAllVideos();
if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error);
}

// Check authentication
if (userAPI.isAuthenticated()) {
  // User is logged in
}
```

## Response Format

All API calls return a standardized response:

```javascript
{
  success: boolean,  // true if successful, false if error
  data: any,         // response data (if successful)
  error: string      // error message (if unsuccessful)
}
```

## Adding New APIs

To add new API endpoints:

1. Add the endpoint to the appropriate API object (userAPI, videoAPI, etc.)
2. Follow the existing error handling pattern
3. Return standardized response format

Example:

```javascript
export const videoAPI = {
  // ... existing methods

  // New method
  getRecommendedVideos: async (userId) => {
    try {
      const response = await api.get(`/api/videos/recommended/${userId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Failed to fetch recommendations",
      };
    }
  },
};
```

## Authentication

The API service automatically includes the authentication token from `localStorage` in all requests via an Axios interceptor.

## Base Configuration

- Base URL is set from `config.api`
- Default headers include `Content-Type: application/json`
- Authentication token is automatically added to requests
