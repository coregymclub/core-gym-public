
# Deployment Guide - Core Gym Public

**Project:** `core-gym-public` (Nuxt 3)
**Target:** Cloudflare Pages (`coregymclub.se`)

## 1. Build Project
Nuxt will generate the static/server-side rendered files in `.output/public` or `dist/`. With `nitro.preset: 'cloudflare-pages'`, it prepares everything for Pages.

```bash
cd /Users/gustav/Projects/core-gym-public
npm install
npm run build
```

## 2. Deploy to Cloudflare Pages
Using the Global API Key found in `.env`.

```bash
# Set credentials (temporarily for the command)
export CLOUDFLARE_ACCOUNT_ID="78a426893ed5c4b72712d4312f3559ab" # Core Gym Account ID
export CLOUDFLARE_API_KEY="6405e164bc33d312d811a53e13ab0b1732ee7"
export CLOUDFLARE_EMAIL="gustav.brydner@gmail.com"

# Create project (if not exists) & Deploy
npx wrangler pages project create core-gym-public --production-branch main
npx wrangler pages deploy dist --project-name core-gym-public --branch main
```

## 3. DNS Configuration (One-time)
Point `coregymclub.se` to the Cloudflare Pages project.
1. Go to Cloudflare Dashboard > Pages > `core-gym-public` > Custom Domains.
2. Add `coregymclub.se` (and `www.coregymclub.se`).
3. Cloudflare handles the DNS records automatically.

## Content Update Strategy
1. Edit text in `app.vue` or `pages/`.
2. Run `npm run build`.
3. Run `npx wrangler pages deploy dist`.


