const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Ensure downloads directory exists
const downloadsDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

// Helper function to validate URLs
function isValidYouTubeUrl(url) {
  const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  return youtubeRegex.test(url);
}

function isValidInstagramUrl(url) {
  const instagramRegex = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/reel\/([A-Za-z0-9_-]+)/;
  return instagramRegex.test(url);
}

// API Routes
app.post('/api/download/video', async (req, res) => {
  try {
    const { url, quality = '360p' } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    let videoInfo;
    let downloadUrl;

    if (isValidYouTubeUrl(url)) {
      // YouTube download
      videoInfo = await ytdl.getInfo(url);
      const format = ytdl.chooseFormat(videoInfo.formats, {
        quality: quality === '1080p' ? 'highest' :
                quality === '720p' ? 'highestvideo' :
                quality === '360p' ? '18' : '17'
      });

      downloadUrl = format.url;
    } else if (isValidInstagramUrl(url)) {
      // Instagram download (simplified - would need proper Instagram scraper)
      return res.status(400).json({ error: 'Instagram download not fully implemented yet' });
    } else {
      return res.status(400).json({ error: 'Invalid URL. Only YouTube URLs are supported.' });
    }

    const fileName = `video_${Date.now()}.mp4`;
    const filePath = path.join(downloadsDir, fileName);

    // Set headers for download
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'video/mp4');

    // Stream the video
    const stream = ytdl(url, { format: 'mp4' });
    stream.pipe(res);

    stream.on('error', (error) => {
      console.error('Download error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Download failed' });
      }
    });

  } catch (error) {
    console.error('Video download error:', error);
    res.status(500).json({ error: 'Failed to process video download' });
  }
});

app.post('/api/download/audio', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    if (!isValidYouTubeUrl(url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    const videoInfo = await ytdl.getInfo(url);
    const audioFormat = ytdl.chooseFormat(videoInfo.formats, { quality: 'highestaudio' });

    const fileName = `audio_${Date.now()}.mp3`;
    const filePath = path.join(downloadsDir, fileName);

    // Set headers for download
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'audio/mpeg');

    // Convert to MP3 using ffmpeg
    const stream = ytdl(url, { filter: 'audioonly' });

    ffmpeg(stream)
      .audioCodec('libmp3lame')
      .audioBitrate(128)
      .format('mp3')
      .on('error', (err) => {
        console.error('FFmpeg error:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Audio conversion failed' });
        }
      })
      .pipe(res, { end: true });

  } catch (error) {
    console.error('Audio download error:', error);
    res.status(500).json({ error: 'Failed to process audio download' });
  }
});

// Get video info for preview
app.post('/api/video-info', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || !isValidYouTubeUrl(url)) {
      return res.status(400).json({ error: 'Valid YouTube URL required' });
    }

    const info = await ytdl.getInfo(url);
    const videoDetails = info.videoDetails;

    res.json({
      title: videoDetails.title,
      thumbnail: videoDetails.thumbnails[0].url,
      duration: videoDetails.lengthSeconds,
      author: videoDetails.author.name
    });

  } catch (error) {
    console.error('Video info error:', error);
    res.status(500).json({ error: 'Failed to get video information' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Video Downloader API is running' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Video Downloader API running on port ${PORT}`);
  console.log(`📁 Downloads will be saved to: ${downloadsDir}`);
});
