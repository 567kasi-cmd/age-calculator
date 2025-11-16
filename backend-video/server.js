// server.js - Express backend for video downloads
const express = require('express')
const bodyParser = require('body-parser')
const ytdl = require('ytdl-core')
const ffmpeg = require('fluent-ffmpeg')
const stream = require('stream')
const app = express()
app.use(bodyParser.json())

const API_KEY = process.env.MY_API_KEY || 'sometestkey'
const ORIGIN = process.env.ORIGIN || 'https://theagefinder.pages.dev'

// simple CORS & api-key middleware
app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin', ORIGIN)
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key')
  if(req.method === 'OPTIONS') return res.sendStatus(200)
  const k = req.header('x-api-key') || ''
  if(k !== API_KEY) return res.status(401).json({error:'unauthorized'})
  next()
})

/**
 * GET /youtube/info?url=...
 * Return basic metadata and available formats
 */
app.get('/youtube/info', async (req,res)=>{
  const url = req.query.url
  if(!url) return res.status(400).json({error:'missing url'})
  if(!ytdl.validateURL(url)) return res.status(400).json({error:'invalid url'})
  try {
    const info = await ytdl.getInfo(url)
    const videoDetails = info.videoDetails || {}
    // expose some formats (resolution / audio) to help the frontend
    const formats = info.formats
      .filter(f => f.container === 'mp4' || f.mimeType)
      .map(f => ({ itag: f.itag, mimeType: f.mimeType, qualityLabel: f.qualityLabel, hasAudio: !!f.audioBitrate, hasVideo: !!f.qualityLabel, contentLength: f.contentLength || null }))
    res.json({
      title: videoDetails.title,
      lengthSeconds: videoDetails.lengthSeconds,
      author: videoDetails.author && videoDetails.author.name ? videoDetails.author.name : (videoDetails.ownerChannelName || null),
      thumbnails: videoDetails.thumbnails,
      formats
    })
  } catch(err){
    res.status(500).json({error: err.message})
  }
})

/**
 * POST /youtube/download
 * body: { url, quality, format }
 * quality: 'highest'|'high'|'medium'|'low'
 * format: 'mp4'|'video-only'|'mp3'
 */
app.post('/youtube/download', async (req,res)=>{
  const { url, quality = 'highest', format = 'mp4' } = req.body || {}
  if(!url) return res.status(400).json({error:'missing url'})
  if(!ytdl.validateURL(url)) return res.status(400).json({error:'invalid url'})

  try {
    const info = await ytdl.getInfo(url)
    const titleSafe = (info.videoDetails.title || 'video').replace(/[^a-z0-9_\-\.]/gi,'_').slice(0,120)

    // audio-only (MP3)
    if(format === 'mp3'){
      res.setHeader('Content-Disposition', `attachment; filename="${titleSafe}.mp3"`)
      res.setHeader('Content-Type', 'audio/mpeg')
      // create audio stream from ytdl and pipe to ffmpeg for mp3
      const audioStream = ytdl(url, { quality: 'highestaudio' })
      const ff = ffmpeg(audioStream)
        .format('mp3')
        .audioBitrate(128)
        .on('error', err => {
          console.error('FFmpeg error', err)
          if(!res.headersSent) res.status(500).json({error: 'ffmpeg error', detail: err.message})
        })
      ff.pipe(res, { end: true })
      return
    }

    // video (with or without audio)
    // choose filter depending on requested quality
    // We'll choose combined format where possible, otherwise fall back to highest.
    let filterOptions = format === 'video-only' ? (format => format.hasVideo && !format.hasAudio) : (format => format.hasVideo)
    // ytdl format selection: try to match quality preference by qualityLabel
    const formats = ytdl.filterFormats((await ytdl.getInfo(url)).formats, 'videoandaudio')
    let chosenFormat = null

    // prefer video+audio combined formats first for mp4
    if(format === 'mp4'){
      // try quality labels
      const order = quality === 'highest' ? ['2160p','1440p','1080p','720p','480p','360p'] :
                    quality === 'high' ? ['1080p','720p','480p','360p'] :
                    quality === 'medium' ? ['480p','360p','240p'] : ['360p','240p','144p']
      for(const q of order){
        chosenFormat = formats.find(f => f.qualityLabel === q && f.container === 'mp4')
        if(chosenFormat) break
      }
      if(!chosenFormat) chosenFormat = formats.find(f => f.container === 'mp4') || formats[0]
    } else if(format === 'video-only'){
      // choose video-only format by resolution
      const videoFormats = (await ytdl.getInfo(url)).formats.filter(f => f.hasVideo && !f.hasAudio && f.container === 'mp4')
      if(videoFormats.length){
        const order = quality === 'highest' ? ['2160p','1440p','1080p','720p','480p'] : (quality === 'high' ? ['1080p','720p','480p'] : ['480p','360p'])
        for(const q of order){
          chosenFormat = videoFormats.find(f => f.qualityLabel === q)
          if(chosenFormat) break
        }
        if(!chosenFormat) chosenFormat = videoFormats[0]
      } else {
        // fallback to highest combined and let ffmpeg drop audio
        chosenFormat = formats[0]
      }
    }

    // If we didn't select by label, use ytdl default 'highest'
    if(!chosenFormat){
      // stream default
      res.setHeader('Content-Disposition', `attachment; filename="${titleSafe}.mp4"`)
      res.setHeader('Content-Type', 'video/mp4')
      ytdl(url, { quality: 'highest' }).pipe(res)
      return
    }

    // If requested video-only but chosenFormat has audio, we will use ffmpeg to strip audio
    if(format === 'video-only' && chosenFormat.hasAudio){
      res.setHeader('Content-Disposition', `attachment; filename="${titleSafe}_video-only.mp4"`)
      res.setHeader('Content-Type', 'video/mp4')
      const source = ytdl(url, { quality: chosenFormat.itag })
      const ff = ffmpeg(source)
        .noAudio()
        .format('mp4')
        .on('error', err => {
          console.error('ffmpeg error', err)
          if(!res.headersSent) res.status(500).json({error: 'ffmpeg error', detail: err.message})
        })
      ff.pipe(res, { end: true })
      return
    }

    // For normal mp4 download with chosen format
    res.setHeader('Content-Disposition', `attachment; filename="${titleSafe}.mp4"`)
    res.setHeader('Content-Type', 'video/mp4')
    ytdl(url, { quality: chosenFormat.itag }).pipe(res)

  } catch(err){
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

const port = process.env.PORT || 3000
app.listen(port, ()=>console.log('server listening on', port))
