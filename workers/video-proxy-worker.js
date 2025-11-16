/*
FILE: workers/video-proxy-worker.js
Place this Worker in your Cloudflare account and bind a secret "MY_API_KEY" if needed.
This Worker demonstrates a secured proxy that forwards requests to your backend (or to third-party
APIs you are allowed to call). It does NOT perform video downloading itself.
*/


addEventListener('fetch', event => {
event.respondWith(handle(event.request))
})


async function handle(request){
const url = new URL(request.url)
// Example: route requests under /api/youtube/* to an external backend
if(url.pathname.startsWith('/api/')){
// Basic API key check (replace with better auth in production)
const key = request.headers.get('x-api-key')
if(key !== MY_API_KEY) return new Response('Unauthorized', {status:401})


// Proxy the request to your backend server
const backendBase = 'https://your-backend.example.com'
const upstream = backendBase + url.pathname.replace('/api','') + (url.search || '')


const init = {
method: request.method,
headers: request.headers,
body: request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.clone().arrayBuffer()
}


const resp = await fetch(upstream, init)
// copy response headers and body
const headers = new Headers(resp.headers)
return new Response(resp.body, {status: resp.status, headers})
}


// otherwise: serve 404
return new Response('Not found', {status:404})
}

