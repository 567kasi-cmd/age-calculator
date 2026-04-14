#!/bin/bash

# Video Downloader Setup Test Script
echo "🎬 Video Downloader Setup Test"
echo "================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v14 or higher."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Check if FFmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "⚠️  FFmpeg is not installed. Audio extraction will not work."
    echo "   Install FFmpeg from: https://ffmpeg.org/download.html"
else
    echo "✅ FFmpeg version: $(ffmpeg -version | head -1)"
fi

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Please ensure you're in the correct directory."
    exit 1
fi

echo "✅ package.json found"

# Check if server.js exists
if [ ! -f "server.js" ]; then
    echo "❌ server.js not found."
    exit 1
fi

echo "✅ server.js found"

# Check if video downloader HTML exists
if [ ! -f "downloaders/video-downloader.html" ]; then
    echo "❌ video-downloader.html not found."
    exit 1
fi

echo "✅ video-downloader.html found"

echo ""
echo "🚀 To start the server:"
echo "   npm install"
echo "   npm start"
echo ""
echo "📱 Then open index.html in your browser and click 'Video Downloader'"
echo ""
echo "🔗 API will be available at: http://localhost:3000"
echo "   - POST /api/download/video"
echo "   - POST /api/download/audio"
echo "   - POST /api/video-info"
