// server.js - Express backend for video downloads
const express = require('express')
const bodyParser = require('body-parser')
const ytdl = require('ytdl-core')
const ffmpeg = require('fluent-ffmpeg')
const stream = require('stream')
const app = express()
app.use(bodyParser.json({ limit: '1mb' }))

// Configuration
const API_KEY = process.env.MY_API_KEY || 'sometestkey' // set this on Render/Railway
const ORIGIN = process.env.ORIGIN || 'https://theagefinder.pages.dev' // frontend origin

// CORS and API-key middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', ORIGIN)
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  const k = req.header('x-api-key') || ''
  if (k !== API_KEY) return res.status(401).json({ error: 'unauthorized' })
  next()
})

/**
 * GET /youtube/info?url=...
 */
app.get('/youtube/info', async (req, res) => {
  const url = req.query.url
  if (!url) return res.status(400).json({ error: 'missing url' })
  if (!ytdl.validateURL(url)) return res.status(400).json({ error: 'invalid url' })
  try {
    const info = await ytdl.getInfo(url)
    const videoDetails = info.videoDetails || {}
    const formats = info.formats
      .filter(f => f.container === 'mp4' || f.hasAudio || f.hasVideo)
      .map(f => ({ itag: f.itag, qualityLabel: f.qualityLabel, hasAudio: !!f.audioBitrate, hasVideo: !!f.qualityLabel, contentLength: f.contentLength || null }))
    res.json({
      title: videoDetails.title,
      lengthSeconds: videoDetails.lengthSeconds,
      author: (videoDetails.author && videoDetails.author.name) || videoDetails.ownerChannelName || null,
      thumbnails: videoDetails.thumbnails || [],
      formats
    })
  } catch (err) {
    console.error('info error', err)
    res.status(500).json({ error: err.message })
  }
})

/**
 * POST /youtube/download
 * body: { url, quality, format }
 * format: 'mp4' | 'video-only' | 'mp3'
 */
app.post('/youtube/download', async (req, res) => {
  const { url, quality = 'highestaudio', format = 'mp4' } = req.body || {}
  if (!url) return res.status(400).json({ error: 'missing url' })
  if (!ytdl.validateURL(url)) return res.status(400).json({ error: 'invalid url' })

  try {
    const info = await ytdl.getInfo(url)
    const titleSafe = (info.videoDetails.title || 'video').replace(/[^a-z0-9_\-\.]/gi, '_').slice(0, 120)

    // MP3 export (audio only) using ffmpeg -> streams mp3
    if (format === 'mp3') {
      res.setHeader('Content-Disposition', `attachment; filename="${titleSafe}.mp3"`)
      res.setHeader('Content-Type', 'audio/mpeg')

      const audioStream = ytdl(url, { quality: 'highestaudio' })
      const ff = ffmpeg(audioStream)
        .format('mp3')
        .audioBitrate(128)
        .on('error', err => {
          console.error('ffmpeg error', err)
          if (!res.headersSent) res.status(500).json({ error: 'ffmpeg error', detail: err.message })
        })
      ff.pipe(res, { end: true })
      return
    }

    // For mp4 or video-only: try to pick a combined (audio+video) format when possible
    const infoFull = await ytdl.getInfo(url)
    const combined = infoFull.formats.filter(f => f.hasVideo && f.hasAudio && f.container === 'mp4')

    let chosenFormat = null
    // quality may be '2160p','1080p','720p','highestaudio', etc.
    if (format === 'video-only') {
      // prefer video-only formats then strip audio
      const videoOnly = infoFull.formats.filter(f => f.hasVideo && !f.hasAudio && f.container === 'mp4')
      if (videoOnly.length) {
        // pick best by qualityLabel
        const order = ['2160p','1440p','1080p','720p','480p','360p','240p']
        for (const q of order) {
          chosenFormat = videoOnly.find(f => f.qualityLabel === q)
          if (chosenFormat) break
        }
        if (!chosenFormat) chosenFormat = videoOnly[0]
      } else {
        // fallback to combined
        chosenFormat = combined[0]
      }
    } else {
      // format === 'mp4'
      const order = ['2160p','1440p','1080p','720p','480p','360p','240p']
      for (const q of order) {
        chosenFormat = combined.find(f => f.qualityLabel === q)
        if (chosenFormat) break
      }
      if (!chosenFormat) chosenFormat = combined[0] || infoFull.formats[0]
    }

    // If chosen format has audio and we need video-only -> transcode to remove audio
    if (format === 'video-only' && chosenFormat && chosenFormat.hasAudio) {
      res.setHeader('Content-Disposition', `attachment; filename="${titleSafe}_video-only.mp4"`)
      res.setHeader('Content-Type', 'video/mp4')
      const source = ytdl(url, { quality: chosenFormat.itag })
      const ff = ffmpeg(source)
        .noAudio()
        .format('mp4')
        .on('error', err => {
          console.error('ffmpeg error', err)
          if (!res.headersSent) res.status(500).json({ error: 'ffmpeg error', detail: err.message })
        })
      ff.pipe(res, { end: true })
      return
    }

    // Normal mp4: stream selected itag if available, otherwise highest combined
    res.setHeader('Content-Disposition', `attachment; filename="${titleSafe}.mp4"`)
    res.setHeader('Content-Type', 'video/mp4')
    if (chosenFormat && chosenFormat.itag) {
      ytdl(url, { quality: chosenFormat.itag }).pipe(res)
    } else {
      ytdl(url, { quality: 'highest' }).pipe(res)
    }

  } catch (err) {
    console.error('download error', err)
    if (!res.headersSent) res.status(500).json({ error: err.message })
  }
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log('server listening on', port))
