# Deployment Checklist

Production domain: `https://theagefinder.online`

## Before Deploying

- [ ] Run `npm install` if dependencies are not installed.
- [ ] Run `npm run check`.
- [ ] Confirm the custom domain `theagefinder.online` is attached in Cloudflare Pages.
- [ ] Confirm DNS points to Cloudflare Pages.

## Deploy

Automatic deployment:

```bash
git add .
git commit -m "Prepare production domain deployment"
git push origin main
```

Manual deployment:

```bash
npm run deploy
```

## After Deploying

Check these URLs:

```bash
curl -I https://theagefinder.online/
curl -I https://theagefinder.online/sitemap.xml
curl -I https://theagefinder.online/robots.txt
curl -I https://theagefinder.online/bmi-calculator/
curl -I https://theagefinder.online/date-difference/
curl -I https://theagefinder.online/emi-calculator/
```

Expected result: pages return `200` and old `.html` URLs return `301` redirects where configured.

## Search Console

- [ ] Add or verify `https://theagefinder.online` in Google Search Console.
- [ ] Submit `https://theagefinder.online/sitemap.xml`.
- [ ] Request indexing for the homepage after deployment.
- [ ] Monitor indexing and redirect reports for the first few days.
