# Video Downloader - Age Calculator Project

A comprehensive web application featuring an age calculator with additional tools including BMI calculator, date difference calculator, EMI calculator, and a **Video Downloader** for YouTube and Instagram content.

## 🎬 Video Downloader Features

- **YouTube Video Download**: Download videos in multiple qualities (144p, 360p, 720p, 1080p)
- **Instagram Reels Download**: Download Instagram Reels (basic implementation)
- **MP3 Audio Extraction**: Extract audio from videos as MP3 files
- **Video Preview**: Shows video title and thumbnail before download
- **Progress Tracking**: Real-time download progress indicator
- **Quality Selection**: Choose desired video quality
- **Error Handling**: Comprehensive error messages and validation

## 🛠️ Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Responsive design with glassmorphism effects
- Progressive Web App features

### Backend
- Node.js + Express.js
- YouTube downloading: `@distube/ytdl-core`
- Audio processing: `fluent-ffmpeg`
- CORS enabled for cross-origin requests

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- FFmpeg (for audio processing)
- npm or yarn

### Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone https://github.com/567kasi-cmd/age-calculator.git
   cd age-calculator
   ```

2. **Install backend dependencies**:
   ```bash
   npm install
   ```

3. **Install FFmpeg** (required for audio processing):
   - **Windows**: Download from https://ffmpeg.org/download.html
   - **macOS**: `brew install ffmpeg`
   - **Linux**: `sudo apt install ffmpeg`

4. **Start the backend server**:
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

5. **Open the frontend**:
   - Open `index.html` in your browser, or
   - Serve the static files using a local server

## 📁 Project Structure

```
age-calculator/
├── index.html                 # Main age calculator page
├── server.js                  # Backend API server
├── package.json               # Node.js dependencies
├── _redirects                 # URL redirects for deployment
├── downloaders/
│   └── video-downloader.html  # Video downloader interface
├── bmi-calculator/
│   └── index.html
├── date-difference/
│   └── index.html
├── emi-calculator/
│   ├── index.html
│   └── emi.js
└── README.md
```

## 🔧 API Endpoints

### Video Download
```http
POST /api/download/video
Content-Type: application/json

{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "quality": "360p"
}
```

### Audio Extraction
```http
POST /api/download/audio
Content-Type: application/json

{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

### Video Information
```http
POST /api/video-info
Content-Type: application/json

{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

## 🎯 Usage

1. **Access the Video Downloader**:
   - Navigate to the main page
   - Click on "Video Downloader" card
   - Or go directly to `/downloaders/video-downloader.html`

2. **Download a Video**:
   - Paste YouTube or Instagram URL
   - Select desired quality
   - Click "Download Video"
   - Wait for download to complete

3. **Extract Audio**:
   - Paste video URL
   - Click "Download MP3"
   - Audio file will be downloaded

## 🔒 Security & Legal Notes

- **Educational Purpose**: This tool is for educational and personal use only
- **Copyright Compliance**: Ensure you have rights to download content
- **Rate Limiting**: Consider implementing rate limiting for production use
- **API Keys**: No external API keys required for basic functionality

## 🐛 Troubleshooting

### Common Issues:

1. **"FFmpeg not found"**:
   - Ensure FFmpeg is installed and in your PATH
   - On Windows, add FFmpeg to system PATH

2. **"Video unavailable"**:
   - Some YouTube videos have download restrictions
   - Try a different video or quality

3. **CORS errors**:
   - Ensure backend is running on the correct port
   - Check CORS configuration in server.js

4. **Download fails**:
   - Check console for error messages
   - Verify URL is valid and accessible

## 🚀 Deployment

### Backend Deployment
- Deploy to services like Heroku, Railway, or Vercel
- Ensure FFmpeg is available on the server
- Set appropriate environment variables

### Frontend Deployment
- Static files can be deployed to Netlify, Vercel, or Cloudflare Pages
- Update API endpoints to point to deployed backend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Ensure all dependencies are properly installed

---

**Note**: This project includes multiple calculators and tools. The video downloader is one of the featured tools alongside age, BMI, date difference, and EMI calculators.
