# The Age Finder

Static calculator website for `https://theagefinder.online`, deployed on Cloudflare Pages.

## What is included

- Age calculator homepage
- BMI calculator
- Date difference calculator
- EMI calculators
- Hidden charges tools
- Production SEO files: `robots.txt`, `sitemap.xml`, `_redirects`, `_headers`

## Local development

Requirements:

- Node.js 18+
- npm

Install dependencies:

```bash
npm install
```

Run the Cloudflare Pages development server:

```bash
npm run dev
```

Run production checks:

```bash
npm run check
```

## Deployment

The project is ready for Cloudflare Pages. Use one of these paths:

1. Push to the connected repository and let Cloudflare Pages deploy automatically.
2. Deploy manually with Wrangler:

```bash
npm run deploy
```

Cloudflare Pages should use the repository root as the deploy directory. No build command is required for the static site.

## Production checks

`npm run check` validates:

- Required production files exist
- The previous Cloudflare Pages preview domain is not present in deployable files
- `robots.txt` points to `https://theagefinder.online/sitemap.xml`
- `sitemap.xml` contains the production domain
- JavaScript files pass Node syntax checks

## Notes

- Video downloader code was removed because it is no longer used.
- `server.js` was removed because production is a static Cloudflare Pages deployment, not Express.
- IDE files are ignored through `.gitignore`.
- Historical generated report files were removed to keep the repository focused on deployable source and current docs.
