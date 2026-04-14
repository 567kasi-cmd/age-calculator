#!/bin/bash

# Video Downloader Setup Test Script (Cloudflare Pages Functions)
echo "Video Downloader Setup Test"
echo "================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

echo "Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed."
    exit 1
fi

echo "npm version: $(npm --version)"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "package.json not found. Please ensure you're in the correct directory."
    exit 1
fi

echo "package.json found"

# Check Cloudflare Functions files
if [ ! -f "functions/api/video-info.js" ]; then
    echo "functions/api/video-info.js not found."
    exit 1
fi

echo "functions/api/video-info.js found"

if [ ! -f "functions/api/download/video.js" ]; then
    echo "functions/api/download/video.js not found."
    exit 1
fi

echo "functions/api/download/video.js found"

if [ ! -f "functions/api/download/audio.js" ]; then
    echo "functions/api/download/audio.js not found."
    exit 1
fi

echo "functions/api/download/audio.js found"

# Check if video downloader HTML exists
if [ ! -f "downloaders/video-downloader.html" ]; then
    echo "downloaders/video-downloader.html not found."
    exit 1
fi

echo "downloaders/video-downloader.html found"

echo ""
echo "To run locally:"
echo "  npm install"
echo "  npm run dev"
echo ""
echo "Then open the URL shown by Wrangler and test:"
echo "  POST /api/video-info"
echo "  POST /api/download/video"
echo "  POST /api/download/audio"
