@echo off
REM Video Downloader Setup Test Script for Windows
echo 🎬 Video Downloader Setup Test
echo ================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v14 or higher.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js version: %NODE_VERSION%

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm version: %NPM_VERSION%

REM Check if FFmpeg is installed
ffmpeg -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  FFmpeg is not installed. Audio extraction will not work.
    echo    Install FFmpeg from: https://ffmpeg.org/download.html
) else (
    for /f "tokens=*" %%i in ('ffmpeg -version ^| findstr /B "ffmpeg version"') do set FFMPEG_VERSION=%%i
    echo ✅ FFmpeg found: %FFMPEG_VERSION%
)

REM Check if package.json exists
if not exist "package.json" (
    echo ❌ package.json not found. Please ensure you're in the correct directory.
    pause
    exit /b 1
)
echo ✅ package.json found

REM Check if server.js exists
if not exist "server.js" (
    echo ❌ server.js not found.
    pause
    exit /b 1
)
echo ✅ server.js found

REM Check if video downloader HTML exists
if not exist "downloaders\video-downloader.html" (
    echo ❌ video-downloader.html not found.
    pause
    exit /b 1
)
echo ✅ video-downloader.html found

echo.
echo 🚀 To start the server:
echo    npm install
echo    npm start
echo.
echo 📱 Then open index.html in your browser and click 'Video Downloader'
echo.
echo 🔗 API will be available at: http://localhost:3000
echo    - POST /api/download/video
echo    - POST /api/download/audio
echo    - POST /api/video-info
echo.
pause
