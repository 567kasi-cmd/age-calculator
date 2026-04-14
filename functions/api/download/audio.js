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

    const extraction = await requestExtractor(url, { type: 'audio' }, context.env);
    const filename = `${sanitizeFilename(extraction.filenameBase, 'audio-download')}.mp3`;

    return await buildDownloadResponse(extraction.downloadUrl, filename, 'audio/mpeg');
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

