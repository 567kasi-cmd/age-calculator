@echo off
REM Video Downloader Setup Test Script for Windows (Cloudflare Pages Functions)
echo Video Downloader Setup Test
echo ================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed. Please install Node.js v18 or higher.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo Node.js version: %NODE_VERSION%

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo npm is not installed.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo npm version: %NPM_VERSION%

REM Check if package.json exists
if not exist "package.json" (
    echo package.json not found. Please ensure you're in the correct directory.
    pause
    exit /b 1
)
echo package.json found

REM Check Cloudflare Functions files
if not exist "functions\api\video-info.js" (
    echo functions\api\video-info.js not found.
    pause
    exit /b 1
)
echo functions\api\video-info.js found

if not exist "functions\api\download\video.js" (
    echo functions\api\download\video.js not found.
    pause
    exit /b 1
)
echo functions\api\download\video.js found

if not exist "functions\api\download\audio.js" (
    echo functions\api\download\audio.js not found.
    pause
    exit /b 1
)
echo functions\api\download\audio.js found

REM Check frontend file
if not exist "downloaders\video-downloader.html" (
    echo downloaders\video-downloader.html not found.
    pause
    exit /b 1
)
echo downloaders\video-downloader.html found

echo.
echo To run locally:
echo   npm install
echo   npm run dev
echo.
echo Then open the URL shown by Wrangler and test:
echo   POST /api/video-info
echo   POST /api/download/video
echo   POST /api/download/audio
echo.
pause
