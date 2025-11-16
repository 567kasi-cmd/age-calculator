addEventListener('fetch', event => { event.respondWith(handle(event.request)) })

async function handle(request){
  const url = new URL(request.url)
  if(!url.pathname.startsWith('/api/')) return fetch(request)

  // Simple API key check (for testing only). Replace with secure secret binding.
  const key = request.headers.get('x-api-key') || ''
  if(key !== 'test-token') {
    return new Response(JSON.stringify({ ok:false, error:'bad_api_key', got: key }), {
      status: 401, headers: {'Content-Type':'application/json'}
    })
  }

  // Debug stub: respond to POST /api/youtube/download so you can test end-to-end
  if(request.method === 'POST' && url.pathname === '/api/youtube/download'){
    const body = await request.text().catch(()=>null)
    return new Response(JSON.stringify({ ok:true, from:'worker-debug', received: body, downloadUrl: 'https://example.com/fake.mp4' }), {
      status:200, headers: {'Content-Type':'application/json'}
    })
  }

  // Unknown route
  return new Response(JSON.stringify({ ok:false, msg:'unknown api route' }), { status:404, headers:{'Content-Type':'application/json'} })
}
