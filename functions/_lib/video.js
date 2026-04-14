const DEFAULT_TIMEOUT_MS = 30000;
const DEFAULT_EXTRACTOR_URL = 'https://api.cobalt.tools/';

export const QUALITY_OPTIONS = {
  youtube: [
    { value: '144p', label: '144p (Low Quality)' },
    { value: '360p', label: '360p (Standard Quality)', default: true },
    { value: '720p', label: '720p (HD Quality)' },
    { value: '1080p', label: '1080p (Full HD)' }
  ],
  instagram: [
    { value: 'best', label: 'Best Available', default: true }
  ]
};

export class AppError extends Error {
  constructor(message, status = 400, code = 'bad_request') {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
  }
}

export function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...extraHeaders
    }
  });
}

export async function readJsonBody(request) {
  try {
    return await request.json();
  } catch {
    throw new AppError('Invalid JSON payload.', 400, 'invalid_json');
  }
}

export function normalizeUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') {
    throw new AppError('Please enter a valid video URL.', 400, 'invalid_url');
  }

  const trimmed = rawUrl.trim();
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  let url;
  try {
    url = new URL(withProtocol);
  } catch {
    throw new AppError('Please enter a valid video URL.', 400, 'invalid_url');
  }

  return url.toString();
}

export function isYouTubeUrl(url) {
  return /^(https?:\/\/)?(www\.|m\.|music\.)?(youtube\.com|youtu\.be)\/.+/i.test(url);
}

export function isInstagramUrl(url) {
  return /^(https?:\/\/)?(www\.)?instagram\.com\/(p|reel|reels|tv)\/.+/i.test(url);
}

export function detectPlatform(url) {
  if (isYouTubeUrl(url)) return 'youtube';
  if (isInstagramUrl(url)) return 'instagram';
  throw new AppError('Only YouTube and Instagram Reel URLs are supported right now.', 400, 'unsupported_url');
}

export function extractYouTubeId(url) {
  const patterns = [
    /[?&]v=([^&#]{11})/i,
    /youtu\.be\/([^?&#]{11})/i,
    /\/shorts\/([^?&#]{11})/i,
    /\/embed\/([^?&#]{11})/i,
    /\/v\/([^?&#]{11})/i
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

export function getQualityOptions(platform) {
  return QUALITY_OPTIONS[platform] || QUALITY_OPTIONS.youtube;
}

export function sanitizeFilename(name, fallback = 'download') {
  const cleaned = (name || fallback)
    .replace(/[<>:"/\\|?*]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned || fallback;
}

export async function withTimeout(task, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await task(controller.signal);
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new AppError('The request timed out. Please try again in a few moments.', 504, 'timeout');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchMetadata(url) {
  const platform = detectPlatform(url);

  if (platform === 'youtube') {
    const videoId = extractYouTubeId(url);
    let title = 'YouTube Video';
    let thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : 'https://via.placeholder.com/480x270/667eea/ffffff?text=YouTube+Video';

    try {
      const response = await withTimeout(signal => fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`, { signal }), 10000);
      if (response.ok) {
        const data = await response.json();
        title = data.title || title;
        thumbnail = data.thumbnail_url || thumbnail;
      }
    } catch {
      // Graceful fallback already prepared above.
    }

    return {
      platform,
      title,
      thumbnail,
      qualities: getQualityOptions(platform),
      qualityMessage: 'Available YouTube qualities loaded. Final availability depends on the source video.',
      supportsAudio: true
    };
  }

  return {
    platform,
    title: 'Instagram Reel',
    thumbnail: 'https://via.placeholder.com/480x270/e1306c/ffffff?text=Instagram+Reel',
    qualities: getQualityOptions(platform),
    qualityMessage: 'Instagram downloads are provided in the best available quality from the source.',
    supportsAudio: true
  };
}

function mapQuality(quality, platform) {
  if (platform === 'instagram') return '1080';

  const map = {
    '144p': '144',
    '360p': '360',
    '720p': '720',
    '1080p': '1080'
  };

  return map[quality] || '720';
}

function buildExtractorAuthHeader(env) {
  const rawValue = env.COBALT_API_AUTH || env.COBALT_API_TOKEN || env.COBALT_API_BEARER || '';
  if (!rawValue) return null;
  return /\s/.test(rawValue) ? rawValue : `Bearer ${rawValue}`;
}

function mapExtractorError(errorCode) {
  const normalized = (errorCode || '').toLowerCase();

  if (normalized.includes('auth.jwt.missing') || normalized.includes('auth') || normalized.includes('jwt')) {
    return ['Downloader service is not configured yet. Add the `COBALT_API_AUTH` secret in Cloudflare Pages settings and redeploy.', 503];
  }
  if (normalized.includes('rate')) return ['The downloader is temporarily rate-limited. Please wait a minute and try again.', 429];
  if (normalized.includes('private')) return ['This media is private or unavailable.', 403];
  if (normalized.includes('youtube')) return ['This YouTube video could not be processed right now.', 502];
  if (normalized.includes('instagram')) return ['This Instagram reel could not be processed right now.', 502];
  if (normalized.includes('audio')) return ['MP3 extraction is not available for this media right now.', 422];
  return ['The requested media could not be downloaded right now.', 502];
}

export async function requestExtractor(url, options = {}, env = {}) {
  const platform = detectPlatform(url);
  const endpoint = env.COBALT_API_BASE || DEFAULT_EXTRACTOR_URL;
  const metadata = await fetchMetadata(url);
  const authHeader = buildExtractorAuthHeader(env);

  const payload = {
    url,
    downloadMode: options.type === 'audio' ? 'audio' : 'auto',
    videoQuality: mapQuality(options.quality, platform),
    audioFormat: options.type === 'audio' ? 'mp3' : 'best',
    filenameStyle: 'pretty',
    disableMetadata: false,
    youtubeVideoCodec: 'h264'
  };

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'User-Agent': 'TheAgeFinder-Downloader/1.0'
  };

  if (authHeader) {
    headers.Authorization = authHeader;
  }

  const response = await withTimeout(signal => fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
    signal
  }), 25000);

  let data = null;
  try {
    data = await response.json();
  } catch {
    throw new AppError('The media service returned an invalid response.', 502, 'invalid_upstream_response');
  }

  if (!response.ok) {
    const [message, status] = mapExtractorError(data?.error?.code || data?.status || '');
    throw new AppError(message, status, data?.error?.code || 'extract_failed');
  }

  if (!data?.url || !['redirect', 'tunnel'].includes(data.status)) {
    const [message, status] = mapExtractorError(data?.error?.code || data?.status || 'extract_failed');
    throw new AppError(message, status, data?.error?.code || 'extract_failed');
  }

  return {
    downloadUrl: data.url,
    filenameBase: sanitizeFilename(data.filename || metadata.title || `${platform}-download`),
    metadata,
    platform
  };
}

export async function buildDownloadResponse(downloadUrl, filename, fallbackType) {
  const upstream = await withTimeout(signal => fetch(downloadUrl, {
    method: 'GET',
    redirect: 'follow',
    signal,
    headers: {
      'User-Agent': 'TheAgeFinder-Downloader/1.0'
    }
  }), 60000);

  if (!upstream.ok || !upstream.body) {
    throw new AppError('Unable to stream the media file right now. Please try again later.', 502, 'stream_failed');
  }

  const headers = new Headers();
  headers.set('Cache-Control', 'no-store');
  headers.set('Content-Type', upstream.headers.get('content-type') || fallbackType);
  headers.set('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`);

  const contentLength = upstream.headers.get('content-length');
  if (contentLength) {
    headers.set('Content-Length', contentLength);
  }

  return new Response(upstream.body, {
    status: 200,
    headers
  });
}

export function handleRouteError(error) {
  if (error instanceof AppError) {
    return json({ error: error.message, code: error.code }, error.status);
  }

  return json({ error: 'Unexpected server error. Please try again later.', code: 'internal_error' }, 500);
}
