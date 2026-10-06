# Project Context

Last maintained: 2026-10-06

## Project

The Age Finder is a static calculator website for:

```text
https://theagefinder.online
```

The site is intended to deploy on Cloudflare Pages from the repository root. It does not require a build step for the main static site.

## Current Production Status

- Production domain is `theagefinder.online`.
- Old Cloudflare Pages preview-domain references were replaced.
- `robots.txt` points to the production sitemap.
- `sitemap.xml` uses production URLs.
- `_redirects` keeps legacy clean-up redirects for old calculator URLs.
- `_headers` provides basic security and cache headers.
- The unused video downloader feature was removed.
- The unused Express server was removed.
- IDE files and generated dependency folders are ignored.

## Main User-Facing Tools

- Age calculator homepage: `/`
- BMI calculator: `/bmi-calculator/`
- Date difference calculator: `/date-difference/`
- EMI calculator hub: `/emi-calculator/`
- EMI loan pages:
  - `/emi-calculator/home-loan`
  - `/emi-calculator/personal-loan`
  - `/emi-calculator/car-loan`
  - `/emi-calculator/business-loan`
  - `/emi-calculator/education-loan`
  - `/emi-calculator/credit-card`
  - `/emi-calculator/gold-loan`
  - `/emi-calculator/loan-comparison/`
- Hidden charges tools exist under `hidden-charges/`.

## Important Files

```text
index.html                       Main age calculator homepage
robots.txt                       Search crawler configuration
sitemap.xml                      Production sitemap
_redirects                       Cloudflare Pages redirect rules
_headers                         Cloudflare Pages response headers
package.json                     npm scripts and Wrangler dependency
package-lock.json                Locked dependency versions
README.md                        Project overview and local/deploy commands
DEPLOYMENT_CHECKLIST.md          Deployment checklist
scripts/check-production.mjs     Production validation script
styles/shared.css                Shared site styling
scripts/                         Calculator and page JavaScript
```

## Local Commands

Install dependencies:

```bash
npm install
```

Run production checks:

```bash
npm run check
```

Run Cloudflare Pages locally:

```bash
npm run dev
```

Deploy manually with Wrangler:

```bash
npm run deploy
```

On Windows PowerShell, if script execution blocks `npm`, use:

```bash
npm.cmd run check
npm.cmd run deploy
```

## Production Validation

`npm run check` currently verifies:

- Required production files exist.
- The previous Cloudflare Pages preview domain is absent from deployable files.
- `robots.txt` references `https://theagefinder.online/sitemap.xml`.
- `sitemap.xml` contains `https://theagefinder.online/`.
- JavaScript files pass Node syntax checks.

## Cleanup History

2026-10-06:

- Updated project metadata and SEO URLs for `theagefinder.online`.
- Added `.gitignore`.
- Added `_headers`.
- Added `package-lock.json`.
- Added `scripts/check-production.mjs`.
- Updated Wrangler to v4.
- Removed tracked `.idea` files.
- Removed historical generated report markdown files.
- Removed unused `server.js`.
- Removed unused video downloader frontend and Cloudflare Function code.
- Removed video downloader setup scripts.
- Removed local generated folders from workspace.

## Deployment Notes

Cloudflare Pages should use:

```text
Project root: repository root
Build command: none required
Output directory: repository root
```

After deploying, verify:

```bash
curl -I https://theagefinder.online/
curl -I https://theagefinder.online/sitemap.xml
curl -I https://theagefinder.online/robots.txt
curl -I https://theagefinder.online/bmi-calculator/
curl -I https://theagefinder.online/date-difference/
curl -I https://theagefinder.online/emi-calculator/
```

Submit this sitemap in Google Search Console:

```text
https://theagefinder.online/sitemap.xml
```

## Future Scope

### 2026 Q4

- Add automated link checking for internal pages.
- Add a lightweight HTML validation step to `npm run check`.
- Normalize page metadata across all calculators.
- Review and improve mobile layout consistency across calculator pages.
- Add Open Graph preview image assets if missing.

### 2027 Q1

- Consider consolidating duplicate BMI paths so only `/bmi-calculator/` remains public.
- Add a shared header/footer component strategy if pages keep growing.
- Improve accessibility:
  - form labels
  - keyboard focus states
  - color contrast
  - result announcements
- Add structured data consistently for all calculator tools.

### 2027 Q2

- Add basic analytics events for calculator usage without collecting personal data.
- Review Core Web Vitals after production traffic starts.
- Add screenshots or visual regression checks for key pages.
- Consider splitting common inline styles into `styles/shared.css`.

## Maintenance Rules

- Run `npm run check` before every deploy.
- Keep production URLs on `https://theagefinder.online`.
- Do not reintroduce unused backend code unless there is a clear deployment target.
- Keep generated folders like `node_modules/`, `.wrangler/`, `dist/`, and IDE state out of git.
- Update the `Last maintained` date at the top of this file when making meaningful repo changes.
