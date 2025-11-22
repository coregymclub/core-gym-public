# ☁️ Cloudflare Setup Guide - coregymclub.se

Detta dokument beskriver hur du konfigurerar Cloudflare för Core Gym Club's publika webbplats.

---

## 📋 Översikt

- **Domän:** coregymclub.se
- **Hosting:** Cloudflare Pages
- **Framework:** Nuxt 3
- **Deploy:** Automatisk via Git integration

---

## 🚀 Steg 1: Lägg till domänen i Cloudflare

### 1.1 Lägg till webbplatsen

1. Logga in på [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Klicka på **"Add a Site"**
3. Ange domänen: `coregymclub.se`
4. Välj plan (Free plan räcker för start)
5. Klicka på **"Add Site"**

### 1.2 Uppdatera namnservrar hos din domänregistrar

Cloudflare kommer att ge dig 2 namnservrar, t.ex.:
```
anya.ns.cloudflare.com
rick.ns.cloudflare.com
```

**Gå till din domänregistrar (t.ex. Loopia, Binero, etc.) och uppdatera namnservrarna:**

1. Logga in hos din registrar
2. Hitta DNS/Namnserver-inställningar för `coregymclub.se`
3. Ersätt befintliga namnservrar med Cloudflare's servrar
4. Spara ändringarna

**⏰ OBS:** Det kan ta 24-48 timmar innan namnserverbyte propagerar helt.

---

## 🔧 Steg 2: Konfigurera DNS-poster

När domänen är tillagd i Cloudflare, konfigurera följande DNS-poster:

### 2.1 För Cloudflare Pages

Gå till **DNS → Records** och lägg till:

| Type  | Name | Content                          | Proxy Status | TTL  |
|-------|------|----------------------------------|--------------|------|
| CNAME | @    | core-gym-public.pages.dev        | Proxied (🟠) | Auto |
| CNAME | www  | core-gym-public.pages.dev        | Proxied (🟠) | Auto |

**OBS:** `core-gym-public.pages.dev` är din Cloudflare Pages URL (uppdateras efter Pages-setup).

### 2.2 Alternativ: Om du använder A/AAAA records

Om Cloudflare Pages ger dig IP-adresser istället:

| Type | Name | Content       | Proxy Status | TTL  |
|------|------|---------------|--------------|------|
| A    | @    | [IP från CF]  | Proxied (🟠) | Auto |
| A    | www  | [IP från CF]  | Proxied (🟠) | Auto |

---

## 📦 Steg 3: Skapa Cloudflare Pages Project

### 3.1 Skapa nytt projekt

1. Gå till **Workers & Pages** i Cloudflare Dashboard
2. Klicka på **"Create application"** → **"Pages"** → **"Connect to Git"**
3. Välj din Git-provider (GitHub/GitLab)
4. Välj repository: `core-gym-public`
5. Välj branch: `main` (eller din produktionsbranch)

### 3.2 Build-inställningar

Använd följande konfiguration:

```
Framework preset:     Nuxt.js
Build command:        npm run build
Build output dir:     .output/public
Root directory:       /
```

### 3.3 Environment Variables

**Inga environment variables behövs initialt** (Zoezi API är publikt).

Om du senare behöver lägga till:
```
NODE_VERSION = 20
```

### 3.4 Deploy

Klicka på **"Save and Deploy"**

Första deploya sker automatiskt!

---

## 🌐 Steg 4: Koppla Custom Domain

### 4.1 Lägg till domänen i Pages

1. Gå till ditt Pages project → **"Custom domains"**
2. Klicka på **"Set up a custom domain"**
3. Ange: `coregymclub.se`
4. Cloudflare kommer automatiskt skapa DNS-posterna
5. Lägg även till `www.coregymclub.se` som alias

### 4.2 SSL/TLS

Cloudflare hanterar SSL automatiskt!

**Verifiera SSL-inställningar:**
1. Gå till **SSL/TLS** → **Overview**
2. Sätt till **"Full"** eller **"Full (strict)"**
3. Aktivera **"Always Use HTTPS"**

---

## 🔄 Steg 5: Migrera från Zoezi (senare)

När du är redo att flytta från Zoezi till den nya sidan:

### 5.1 Test-fas

1. Testa nya sidan på: `core-gym-public.pages.dev`
2. Eller använd en staging-domän: `staging.coregymclub.se`

### 5.2 DNS-uppdatering

När allt är testat, uppdatera DNS att peka på Cloudflare Pages (gjort i Steg 2).

### 5.3 Verifiera

```bash
# Kolla DNS
dig coregymclub.se

# Testa sidan
curl -I https://coregymclub.se
```

---

## ⚙️ Steg 6: Cloudflare Optimeringar

### 6.1 Performance

**Speed → Optimization**
- ✅ Auto Minify (JS, CSS, HTML)
- ✅ Brotli compression
- ✅ Early Hints

### 6.2 Caching

**Caching → Configuration**
```
Browser Cache TTL: 4 hours
```

**Page Rules** (valfritt):
```
URL: coregymclub.se/*
Setting: Cache Level = Standard
Browser Cache TTL: Respect Existing Headers
```

### 6.3 Security

**Security → Settings**
- ✅ Always Use HTTPS
- ✅ Automatic HTTPS Rewrites
- ✅ Security Level: Medium
- ✅ Challenge Passage: 30 minutes

---

## 📊 Steg 7: Analytics & Monitoring

### 7.1 Aktivera Web Analytics

1. Gå till **Analytics & Logs** → **Web Analytics**
2. Klicka **"Enable Web Analytics"**
3. Lägg till tracking script (görs automatiskt via Cloudflare)

### 7.2 Real-time monitoring

- **Analytics** → Se trafik, besökare, förfrågningar
- **Speed** → Core Web Vitals
- **Security** → Hot tracking

---

## 🧪 Testning

### Testa DNS

```bash
# Kolla namnservrar
dig NS coregymclub.se

# Kolla A/CNAME records
dig coregymclub.se
dig www.coregymclub.se
```

### Testa SSL

```bash
# Verifiera HTTPS
curl -I https://coregymclub.se

# SSL Labs test
# https://www.ssllabs.com/ssltest/analyze.html?d=coregymclub.se
```

### Testa Sidan

```bash
# Response time
curl -w "@-" -o /dev/null -s https://coregymclub.se <<'EOF'
time_namelookup:  %{time_namelookup}\n
time_connect:     %{time_connect}\n
time_total:       %{time_total}\n
EOF
```

---

## 📝 Checklista

### Före Go-Live

- [ ] Domän tillagd i Cloudflare
- [ ] Namnservrar uppdaterade hos registrar
- [ ] DNS-poster konfigurerade (A/CNAME)
- [ ] Cloudflare Pages project skapat
- [ ] Git integration funkar
- [ ] Custom domain kopplad (coregymclub.se + www)
- [ ] SSL aktiverat (Full mode)
- [ ] Always Use HTTPS aktiverat
- [ ] Deploy funkar (test på .pages.dev URL)

### Efter Go-Live

- [ ] DNS propagerat helt (24-48h)
- [ ] HTTPS fungerar på coregymclub.se
- [ ] www.coregymclub.se redirectar korrekt
- [ ] Web Analytics aktiverat
- [ ] Performance optimeringar aktiverade
- [ ] Zoezi-migration klar

---

## 🚨 Troubleshooting

### DNS propagerar inte

```bash
# Kolla nuvarande namnservrar
dig NS coregymclub.se +short

# Tvinga DNS flush (macOS)
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder

# Windows
ipconfig /flushdns
```

### SSL-fel

1. Kontrollera SSL/TLS mode är **Full** (inte Flexible)
2. Vänta 10-15 min för SSL-cert att genereras
3. Purge cache: **Caching** → **Purge Everything**

### Build-fel på Cloudflare Pages

1. Kolla **Build logs** i Pages dashboard
2. Verifiera `package.json` scripts
3. Testa lokalt: `npm run build`

### 502/504 errors

1. Kolla **Workers & Pages** → **Logs**
2. Verifiera Nitro preset: `cloudflare-pages`
3. Kontrollera output directory: `.output/public`

---

## 📞 Support

- **Cloudflare Docs:** https://developers.cloudflare.com/pages
- **Nuxt Cloudflare:** https://nuxt.com/deploy/cloudflare
- **Cloudflare Community:** https://community.cloudflare.com

---

## 📌 Viktiga länkar

- **Cloudflare Dashboard:** https://dash.cloudflare.com
- **Pages Dashboard:** https://dash.cloudflare.com/pages
- **DNS Management:** https://dash.cloudflare.com/dns
- **SSL/TLS:** https://dash.cloudflare.com/ssl-tls

---

**🎉 Lycka till med deploya!**

**Skapad:** 2025-11-22
**Status:** ✅ Redo för setup
