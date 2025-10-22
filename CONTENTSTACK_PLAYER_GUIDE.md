# 🎬 Contentstack Player - Complete Guide

## ✅ Video Player with Episode Switching

Your PixelStream app now includes a dedicated video player for Contentstack entries with full episode switching capabilities!

---

## 🎯 Features

### **1. Video Playback**

- ✅ Plays videos from Contentstack entry `video_link` field
- ✅ Supports YouTube, Vimeo, and direct video URLs
- ✅ Full player controls (play, pause, volume, fullscreen)
- ✅ Graceful handling when video is not available

### **2. Episode Switching**

- ✅ Shows all episodes from the same series below the player
- ✅ Highlights currently playing episode with "Now Playing" badge
- ✅ One-click switching to any episode
- ✅ Smooth transitions between episodes
- ✅ Thumbnail previews for each episode

### **3. Entry Details**

- ✅ Title, description, and synopsis
- ✅ Published date and content type
- ✅ Series information
- ✅ Cast information (if available)
- ✅ All custom fields from Contentstack

---

## 🔌 How It Works

### **User Flow:**

```
User browses Home Page
       ↓
Clicks on "One Piece" (content type)
       ↓
Sees all One Piece episodes
       ↓
Clicks "Episode 1" card
       ↓
Navigates to: /contentstack/one_piece/entry_123
       ↓
ContentstackPlayer loads:
  • Fetches entry details
  • Fetches all episodes for series
  • Displays video player
  • Shows episode list below
       ↓
User clicks "Episode 2"
       ↓
Page updates with Episode 2
       ↓
Episodes list updates "Now Playing" badge
```

---

## 📁 Files Created/Modified

### **1. New File: `src/screens/ContentstackPlayer.js`**

**Purpose:** Video player for Contentstack entries

**Key Features:**

- Fetches entry by ID from Contentstack
- Fetches all entries from same content type
- Displays video player with ReactPlayer
- Shows episode switching grid
- Handles missing videos gracefully
- Authentication check before playing

### **2. Modified: `src/App.js`**

**Added Route:**

```javascript
<Route
  path="/contentstack/:contentType/:entryId"
  element={<ContentstackPlayer />}
/>
```

**Route Parameters:**

- `:contentType` - The content type UID (e.g., "one_piece")
- `:entryId` - The entry UID to play

### **3. Modified: `src/index.css`**

**Added Styles:**

- `.player-back-nav` - Back button container
- `.no-video-available` - No video message
- `.no-video-icon` - Icon for missing videos
- Responsive styles for mobile devices

---

## 🎨 UI Components

### **Player Page Structure:**

```
┌─────────────────────────────────────────────────┐
│  ← Back to Home                                 │
└─────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────┐
│                                                 │
│         🎬 Video Player (ReactPlayer)           │
│                                                 │
└─────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────┐
│  One Piece: Episode 1                           │
│  ───────────────────────────────────────────   │
│  📅 Jan 01, 2024  |  📺 One Piece              │
│  📁 one_piece     |  👤 Contentstack CMS       │
└─────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────┐
│  📝 Description                                 │
│  Luffy begins his journey...                    │
└─────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────┐
│  🎬 All Episodes from One Piece                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ EP 1     │  │ EP 2     │  │ EP 3     │     │
│  │ PLAYING  │  │          │  │          │     │
│  └──────────┘  └──────────┘  └──────────┘     │
└─────────────────────────────────────────────────┘
```

---

## 🔧 API Calls Made

### **On Page Load:**

**1. Get Content Type Details:**

```javascript
contentstackAPI.getContentType(contentType);
```

**Returns:**

```json
{
  "success": true,
  "data": {
    "uid": "one_piece",
    "title": "One Piece",
    "description": "One Piece anime series"
  }
}
```

**2. Get All Entries:**

```javascript
contentstackAPI.getEntriesByContentType(contentType);
```

**Returns:**

```json
{
  "success": true,
  "data": [
    {
      "uid": "entry_123",
      "title": "Episode 1",
      "description": "First episode",
      "video_link": "https://youtube.com/watch?v=...",
      "thumbnail": {
        "url": "https://..."
      },
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 24
}
```

---

## 📝 Entry Data Structure

### **Expected Fields from Contentstack:**

```javascript
{
  uid: "entry_123",           // Entry unique ID
  title: "Episode 1",         // Entry title
  description: "...",         // Short description
  synopsis: "...",            // Long description (optional)
  video_link: "https://...",  // Video URL (YouTube, Vimeo, direct)
  thumbnail: {                // Thumbnail image (optional)
    url: "https://..."
  },
  cast: "...",               // Cast information (optional)
  created_at: "2024-01-01...", // Creation date
  updated_at: "2024-01-01...", // Update date

  // Any other custom fields will be included
}
```

### **Transformed to App Format:**

```javascript
{
  id: "entry_123",
  contentType: "one_piece",
  title: "Episode 1",
  description: "...",
  thumbnail: "https://...",
  video_link: "https://...",
  created_at: "2024-01-01...",
  // All original fields preserved
  synopsis: "...",
  cast: "...",
  // etc.
}
```

---

## 🎯 Video Link Support

### **Supported Video Sources:**

**1. YouTube:**

```javascript
video_link: "https://www.youtube.com/watch?v=VIDEO_ID";
video_link: "https://youtu.be/VIDEO_ID";
```

**2. Vimeo:**

```javascript
video_link: "https://vimeo.com/VIDEO_ID";
```

**3. Direct Video Files:**

```javascript
video_link: "https://example.com/video.mp4";
video_link: "https://example.com/video.webm";
```

**4. Streaming URLs:**

```javascript
video_link: "https://example.com/hls/stream.m3u8";
```

### **No Video Available:**

If `video_link` is missing or null, displays:

```
┌─────────────────────────────────────────┐
│         🎬 (Large Icon)                 │
│                                         │
│    Video Not Available                  │
│                                         │
│  This entry doesn't have a video        │
│  link configured.                       │
└─────────────────────────────────────────┘
```

---

## 💡 Usage Examples

### **Basic Video Entry:**

```javascript
// In Contentstack CMS:
{
  "title": "One Piece Episode 1",
  "description": "Luffy starts his adventure",
  "video_link": "https://www.youtube.com/watch?v=ABC123",
  "thumbnail": {
    "url": "https://example.com/episode1.jpg"
  }
}
```

**Result:**

- Plays video in ReactPlayer
- Shows thumbnail in episode list
- Displays description below player

### **Entry Without Video:**

```javascript
{
  "title": "One Piece Episode 2",
  "description": "Coming soon...",
  "video_link": null,
  "thumbnail": {
    "url": "https://example.com/episode2.jpg"
  }
}
```

**Result:**

- Shows "Video Not Available" message
- Still appears in episode list
- User can click to view entry details

### **Entry with Extra Fields:**

```javascript
{
  "title": "One Piece Episode 3",
  "description": "Battle at the village",
  "synopsis": "Long detailed synopsis here...",
  "cast": "Luffy, Zoro, Nami",
  "video_link": "https://youtube.com/...",
  "duration": "24 minutes",
  "rating": "PG-13"
}
```

**Result:**

- All fields displayed in appropriate sections
- Synopsis shown separately from description
- Cast information displayed
- Custom fields accessible in entry object

---

## 🛠️ Customization

### **Add Custom Fields Display:**

```javascript
// In ContentstackPlayer.js, add after existing details:

{
  currentEntry.duration && (
    <div className="video-details-section">
      <h3 className="details-title">Duration</h3>
      <p className="details-text">{currentEntry.duration}</p>
    </div>
  );
}

{
  currentEntry.rating && (
    <div className="video-details-section">
      <h3 className="details-title">Rating</h3>
      <p className="details-text">{currentEntry.rating}</p>
    </div>
  );
}
```

### **Change Video Player Config:**

```javascript
// In ContentstackPlayer.js, modify ReactPlayer config:

<ReactPlayer
  controls
  url={currentEntry.video_link}
  width="100%"
  height="100%"
  playing={true} // Auto-play
  volume={0.8} // Default volume
  muted={false} // Unmuted
  config={{
    youtube: {
      playerVars: {
        showinfo: 1,
        autoplay: 1, // Auto-play
        modestbranding: 1, // Hide YouTube logo
      },
    },
  }}
/>
```

### **Customize Episode Grid:**

```javascript
// In index.css, modify:

.episodes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); /* Smaller cards */
  gap: 16px; /* Less spacing */
}
```

---

## 🐛 Troubleshooting

### **Video Not Playing:**

**Check:**

1. Verify `video_link` field exists in Contentstack
2. Ensure URL is valid and accessible
3. Check if video is public (not private)
4. Test URL directly in browser
5. Check browser console for errors

**Solutions:**

- For YouTube: Ensure video is not age-restricted
- For Vimeo: Check privacy settings
- For direct files: Verify CORS headers

### **Episodes Not Showing:**

**Check:**

1. Verify content type has multiple entries
2. Check Contentstack API response in console
3. Ensure entries are published (not draft)
4. Verify API credentials are correct

**Debug:**

```javascript
// Check allEntries in browser console
console.log("All Entries:", allEntries);
```

### **Thumbnails Not Loading:**

**Check:**

1. Verify `thumbnail` field in Contentstack
2. Check image URL is accessible
3. Verify image format (jpg, png, webp)
4. Check browser console for 404 errors

**Fallback:**

- Uses content type poster if thumbnail missing
- Placeholder shown if both unavailable

### **"Entry Not Found" Error:**

**Causes:**

1. Entry doesn't exist in Contentstack
2. Entry ID in URL is incorrect
3. Entry is not published
4. API credentials issue

**Solutions:**

- Check entry exists in Contentstack dashboard
- Verify URL has correct entry ID
- Publish entry in Contentstack
- Test API directly with curl

---

## 🎨 CSS Classes Reference

### **Player Specific:**

- `.player-back-nav` - Back button container
- `.no-video-available` - No video message box
- `.no-video-icon` - Large icon for missing video

### **Reused from Player.js:**

- `.player-wrapper` - Main container
- `.player-container` - Content wrapper
- `.video-section` - Video area
- `.video-player-modern` - Player container
- `.video-info-section` - Info section
- `.video-header` - Title area
- `.video-meta-grid` - Metadata grid
- `.episodes-section` - Episodes section
- `.episodes-grid` - Episodes grid
- `.episode-card` - Individual episode card
- `.currently-playing-badge` - Now playing indicator

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────┐
│          User Clicks Episode Card               │
│      /contentstack/one_piece/entry_123          │
└──────────────┬──────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────┐
│      ContentstackPlayer Component               │
│                                                 │
│  1. Extract params:                             │
│     - contentType: "one_piece"                  │
│     - entryId: "entry_123"                      │
└──────────────┬──────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────┐
│          Parallel API Calls                     │
│                                                 │
│  ┌─────────────────┐  ┌────────────────────┐  │
│  │ getContentType  │  │ getEntriesByType  │  │
│  │   ("one_piece") │  │   ("one_piece")    │  │
│  └────────┬────────┘  └──────────┬─────────┘  │
└───────────┼──────────────────────┼─────────────┘
            │                      │
            ▼                      ▼
  ┌──────────────────┐   ┌──────────────────┐
  │ Content Type     │   │ All Entries      │
  │ Title & Info     │   │ (24 episodes)    │
  └──────────────────┘   └────────┬─────────┘
                                  │
                                  ▼
                    ┌──────────────────────────────┐
                    │  Find Current Entry in List  │
                    │  entry.id === "entry_123"    │
                    └─────────────┬────────────────┘
                                  │
                                  ▼
                    ┌──────────────────────────────┐
                    │     Display UI               │
                    │  • Video Player              │
                    │  • Entry Details             │
                    │  • Episodes Grid             │
                    │  • Highlight Current         │
                    └──────────────────────────────┘
```

---

## 🚀 Next Steps

### **Content Creation in Contentstack:**

**1. Ensure Entry Has Video Link:**

```javascript
// In your Contentstack content type schema:
{
  "field": "video_link",
  "data_type": "text",
  "display_name": "Video URL",
  "mandatory": false,
  "help_text": "YouTube, Vimeo, or direct video URL"
}
```

**2. Add Thumbnail Field:**

```javascript
{
  "field": "thumbnail",
  "data_type": "file",
  "display_name": "Thumbnail Image",
  "mandatory": false
}
```

**3. Add Description Fields:**

```javascript
{
  "field": "description",
  "data_type": "text",
  "display_name": "Short Description"
},
{
  "field": "synopsis",
  "data_type": "text",
  "display_name": "Full Synopsis"
}
```

---

## ✨ Summary

### **What You Get:**

**Player Features:**

- ✅ Full video playback with ReactPlayer
- ✅ Support for YouTube, Vimeo, direct URLs
- ✅ Episode information display
- ✅ Graceful no-video handling

**Episode Switching:**

- ✅ Grid of all episodes below player
- ✅ "Now Playing" indicator
- ✅ Thumbnail previews
- ✅ One-click episode change

**User Experience:**

- ✅ Smooth navigation
- ✅ Authentication check
- ✅ Loading states
- ✅ Error handling
- ✅ Mobile responsive

---

## 🎊 You're All Set!

Your Contentstack-powered video player is ready!

```bash
# Test it:
1. Start app: npm start
2. Click any series on home page
3. Click any episode card
4. Watch video play
5. Click another episode to switch
6. Verify "Now Playing" badge updates
```

**Happy streaming! 🎬🎌✨**
