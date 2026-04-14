import {
  buildDownloadResponse,
  handleRouteError,
  normalizeUrl,
  readJsonBody,
  requestExtractor,
  sanitizeFilename
} from '../../_lib/video.js';

export async function onRequestPost(context) {
  try {
    const body = await readJsonBody(context.request);
    const url = normalizeUrl(body?.url);
    const quality = body?.quality || '360p';

    const extraction = await requestExtractor(url, { type: 'video', quality }, context.env);
    const filename = `${sanitizeFilename(extraction.filenameBase, 'video-download')}.mp4`;

    return await buildDownloadResponse(extraction.downloadUrl, filename, 'video/mp4');
  } catch (error) {
    return handleRouteError(error);
  }
}

export function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
      'Access-Control-Max-Age': '86400'
    }
  });
}

