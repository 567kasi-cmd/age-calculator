// workers/trending-worker.js
export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      const region = url.searchParams.get("region") || "world";
      // Map region to GNews query params
      // GNews supports country=us,in, ... or use topic parameter
      let gnewsUrl = `https://gnews.io/api/v4/top-headlines?token=${env.GNEWS_KEY}&lang=en&max=30`;

      // if region param is a country code (in, us)
      const countryCodes = ["us","in","gb","ca","au","de","fr","it","es"];
      if (countryCodes.includes(region)) {
        gnewsUrl += `&country=${region}`;
      } else if (region === "tech") {
        gnewsUrl += `&topic=technology`;
      } else if (region === "entertainment") {
        gnewsUrl += `&topic=entertainment`;
      } else {
        // world -> no country filter
      }

      const r = await fetch(gnewsUrl);
      if (!r.ok) {
        const text = await r.text();
        return new Response(JSON.stringify({ error: "GNews error", details: text }), {
          status: 502,
          headers: { "Content-Type": "application/json" },
        });
      }
      const j = await r.json();
      // map GNews articles -> our expected shape
      const items = (j.articles || []).map((a, idx) => ({
        id: a.url || `gnews-${idx}`,
        title: a.title,
        source: a.source?.name || "GNews",
        publishedAt: a.publishedAt,
        summary: a.description || a.content || "",
        url: a.url,
      }));

      return new Response(JSON.stringify({ items }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: String(err) }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};

