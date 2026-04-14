# Age Calculator + Video Downloader

This project is a static Age Calculator site with extra tools, including a **Video Downloader** page powered by **Cloudflare Pages Functions**.

## Checklist

- Static homepage and calculators remain unchanged
- Video Downloader UI stays on-brand and same-origin
- Preview + title load through internal `/api/video-info`
- Direct file downloads happen through internal `/api/download/video`
- MP3 downloads happen through internal `/api/download/audio`
- No browser redirects to third-party download pages

## Architecture

The downloader now uses a **same-origin API flow**:

1. Frontend calls `/api/video-info`
2. Cloudflare Pages Function validates the URL and fetches metadata
3. Frontend calls `/api/download/video` or `/api/download/audio`
4. Cloudflare Pages Function requests a worker-compatible extractor upstream
5. The function **streams the file back through your own domain**
6. Frontend saves the streamed response as a download

### Why this approach?

Cloudflare Pages Functions do **not** support native `ffmpeg` binaries or a full Node runtime suitable for `@distube/ytdl-core` + server-side transcoding in the same way as a long-running Node server.

So the production-compatible solution here is:
- **Internal same-origin API** for the browser
- **Cloudflare-compatible worker code** on your domain
- **Streaming response back to the user without external redirects**

## Files Added / Updated

```text
age-calculator/
├── downloaders/video-downloader.html
├── functions/
│   ├── _lib/video.js
│   └── api/
│       ├── video-info.js
│       └── download/
│           ├── video.js
│           └── audio.js
├── package.json
├── test-setup.bat
├── test-setup.sh
└── README.md
```

## Local Development

### Requirements

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Run locally with Cloudflare Pages Functions

```bash
npm run dev
```

Wrangler will print a local URL. Open that URL and test:

```text
/api/video-info
/api/download/video
/api/download/audio
```

## Setup Validation

### Windows

```bat
test-setup.bat
```

### macOS / Linux

```bash
chmod +x test-setup.sh
./test-setup.sh
```

## API Endpoints

### `POST /api/video-info`
Returns preview metadata and supported qualities.

Request:

```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

### `POST /api/download/video`
Streams a video file through the function.

Request:

```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "quality": "720p"
}
```

### `POST /api/download/audio`
Streams MP3 audio through the function when supported.

Request:

```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

## Supported URLs

- `https://www.youtube.com/watch?v=...`
- `https://youtu.be/...`
- `https://www.youtube.com/shorts/...`
- `https://www.instagram.com/reel/...`
- `https://www.instagram.com/reels/...`
- `https://www.instagram.com/p/...`

## Error Handling

The UI now shows friendly in-app messages for:

- invalid URL
- unavailable/private media
- upstream rate limits
- timeout while streaming
- unsupported audio extraction
- general provider failures

## Important Notes

- Downloads are served through your domain via Cloudflare Functions
- The browser no longer redirects users to third-party download pages
- Cloudflare Pages Functions are best-effort for large media workloads
- Final media availability still depends on the source and extractor compatibility

## Deployment

Cloudflare Pages will automatically pick up the `functions/` directory and deploy these handlers as Pages Functions.

No Express server is required for production deployment.
