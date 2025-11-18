# 🚀 Guia Completo de Deploy e SEO

## 📋 Índice
1. [Deploy do Frontend (Vercel)](#1-deploy-do-frontend-vercel)
2. [Deploy do Backend (Railway)](#2-deploy-do-backend-railway)
3. [Configuração de Storage (S3/R2)](#3-configuração-de-storage)
4. [SEO e Otimização](#4-seo-e-otimização)
5. [Domínio Personalizado](#5-domínio-personalizado)
6. [Monitoramento](#6-monitoramento)

---

## 1. Deploy do Frontend (Vercel)

### Passo 1: Preparar o Projeto

```bash
# Certifique-se de que está tudo commitado
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Passo 2: Deploy na Vercel

1. **Acesse:** https://vercel.com
2. **Crie conta** (pode usar GitHub)
3. **Clique em "New Project"**
4. **Importe seu repositório**
5. **Configure:**
   - Framework Preset: **Next.js**
   - Root Directory: **frontend**
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Passo 3: Variáveis de Ambiente

Na Vercel, adicione:

```env
NEXT_PUBLIC_API_URL=https://sua-api.railway.app
```

### Passo 4: Deploy

- Clique em **Deploy**
- Aguarde ~2 minutos
- Seu site estará em: `https://seu-projeto.vercel.app`

---

## 2. Deploy do Backend (Railway)

### Passo 1: Preparar o Backend

Crie `backend/Dockerfile`:

```dockerfile
FROM node:20-alpine

# Install FFmpeg
RUN apk add --no-cache ffmpeg

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 4000

CMD ["npm", "start"]
```

### Passo 2: Deploy no Railway

1. **Acesse:** https://railway.app
2. **Crie conta** (use GitHub)
3. **New Project** → **Deploy from GitHub repo**
4. **Selecione seu repositório**
5. **Configure:**
   - Root Directory: **backend**
   - Start Command: `npm start`

### Passo 3: Adicionar PostgreSQL

1. No Railway, clique em **+ New**
2. Selecione **Database** → **PostgreSQL**
3. Copie a `DATABASE_URL` gerada

### Passo 4: Variáveis de Ambiente

No Railway, adicione:

```env
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://... (copiado do Railway)
JWT_SECRET=seu-secret-super-seguro-aqui
REDIS_URL=redis://... (opcional)
AWS_ACCESS_KEY_ID=sua-key
AWS_SECRET_ACCESS_KEY=sua-secret
AWS_REGION=us-east-1
S3_BUCKET=seu-bucket
CDN_URL=https://seu-cdn.com
```

### Passo 5: Rodar Migrações

No Railway, vá em **Settings** → **Deploy Triggers** e adicione:

```bash
npx prisma migrate deploy
```

---

## 3. Configuração de Storage

### Opção A: AWS S3 (Recomendado)

1. **Criar Bucket:**
   - Acesse AWS Console → S3
   - Create Bucket
   - Nome: `seu-projeto-videos`
   - Region: `us-east-1`
   - Desmarque "Block all public access"

2. **Configurar CORS:**
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
       "AllowedOrigins": ["*"],
       "ExposeHeaders": ["ETag"]
     }
   ]
   ```

3. **Criar IAM User:**
   - IAM → Users → Add User
   - Attach policy: `AmazonS3FullAccess`
   - Copie Access Key e Secret Key

4. **CloudFront (CDN):**
   - CloudFront → Create Distribution
   - Origin: Seu bucket S3
   - Copie o domain name

### Opção B: Cloudflare R2 (Mais Barato)

1. **Criar Bucket:**
   - Cloudflare Dashboard → R2
   - Create Bucket
   - Nome: `seu-projeto-videos`

2. **Criar API Token:**
   - R2 → Manage R2 API Tokens
   - Create API Token
   - Permissions: Object Read & Write

3. **Configurar:**
   ```env
   AWS_ACCESS_KEY_ID=seu-r2-access-key
   AWS_SECRET_ACCESS_KEY=seu-r2-secret-key
   S3_ENDPOINT=https://account-id.r2.cloudflarestorage.com
   S3_BUCKET=seu-projeto-videos
   ```

---

## 4. SEO e Otimização

### 4.1 Metadados Dinâmicos

Já implementado! Mas vamos melhorar:

Atualize `frontend/app/video/[id]/page.tsx`:

```typescript
// Adicione no topo do arquivo
export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/${params.id}`);
    const video = await response.json();
    
    return {
      title: `${video.title} - VideoHub`,
      description: video.description || `Assista ${video.title} no VideoHub`,
      openGraph: {
        title: video.title,
        description: video.description,
        images: [video.thumbnailUrl],
        type: 'video.other',
      },
      twitter: {
        card: 'player',
        title: video.title,
        description: video.description,
        images: [video.thumbnailUrl],
      },
    };
  } catch {
    return {
      title: 'Vídeo - VideoHub',
    };
  }
}
```

### 4.2 Sitemap

Crie `frontend/app/sitemap.ts`:

```typescript
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://seu-dominio.com';
  
  // Buscar todos os vídeos
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/recent?limit=1000`);
  const data = await response.json();
  
  const videos = data.videos.map((video: any) => ({
    url: `${baseUrl}/video/${video.id}`,
    lastModified: new Date(video.updatedAt),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    ...videos,
  ];
}
```

### 4.3 Robots.txt

Crie `frontend/app/robots.ts`:

```typescript
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/channel/settings', '/upload'],
    },
    sitemap: 'https://seu-dominio.com/sitemap.xml',
  };
}
```

### 4.4 Google Search Console

1. **Acesse:** https://search.google.com/search-console
2. **Adicione sua propriedade** (seu domínio)
3. **Verifique propriedade** (via DNS ou HTML)
4. **Envie sitemap:** `https://seu-dominio.com/sitemap.xml`

### 4.5 Google Analytics

Crie `frontend/app/layout.tsx` e adicione:

```typescript
import Script from 'next/script';

// Dentro do <body>
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  `}
</Script>
```

---

## 5. Domínio Personalizado

### 5.1 Comprar Domínio

Recomendações:
- **Namecheap** (barato)
- **Google Domains**
- **GoDaddy**

### 5.2 Configurar DNS

**Para Frontend (Vercel):**
1. Vercel → Settings → Domains
2. Adicione seu domínio
3. Configure DNS:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

**Para Backend (Railway):**
1. Railway → Settings → Domains
2. Adicione subdomínio: `api.seu-dominio.com`
3. Configure DNS:
   ```
   Type: CNAME
   Name: api
   Value: seu-projeto.up.railway.app
   ```

---

## 6. Monitoramento

### 6.1 Sentry (Erros)

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### 6.2 Uptime Monitoring

Use **UptimeRobot** (gratuito):
1. Acesse: https://uptimerobot.com
2. Adicione monitors para:
   - Frontend: `https://seu-dominio.com`
   - Backend: `https://api.seu-dominio.com/health`

### 6.3 Analytics

- **Vercel Analytics** (já incluído)
- **Google Analytics** (configurado acima)
- **Plausible** (alternativa privacy-friendly)

---

## 📊 Checklist de Deploy

### Antes do Deploy:
- [ ] Código commitado no Git
- [ ] Variáveis de ambiente documentadas
- [ ] Testes básicos realizados localmente
- [ ] Banco de dados de produção criado
- [ ] Storage (S3/R2) configurado

### Deploy:
- [ ] Frontend deployado na Vercel
- [ ] Backend deployado no Railway
- [ ] Variáveis de ambiente configuradas
- [ ] Migrações do banco executadas
- [ ] Storage conectado e funcionando

### Pós-Deploy:
- [ ] Testar registro de usuário
- [ ] Testar upload de vídeo
- [ ] Testar playback de vídeo
- [ ] Testar busca
- [ ] Verificar logs de erro

### SEO:
- [ ] Sitemap.xml funcionando
- [ ] Robots.txt configurado
- [ ] Meta tags em todas as páginas
- [ ] Open Graph tags nos vídeos
- [ ] Google Search Console configurado
- [ ] Google Analytics instalado

### Domínio:
- [ ] Domínio comprado
- [ ] DNS configurado
- [ ] SSL/HTTPS funcionando
- [ ] Redirecionamento www → não-www (ou vice-versa)

---

## 💰 Custos Estimados

### Gratuito (Tier Free):
- **Vercel:** Grátis (100GB bandwidth/mês)
- **Railway:** $5/mês (500h de uso)
- **Neon.tech:** Grátis (0.5GB storage)
- **Cloudflare R2:** $0.015/GB (10GB grátis)

### Produção (Estimativa):
- **Domínio:** $10-15/ano
- **Vercel Pro:** $20/mês (opcional)
- **Railway:** $5-20/mês
- **PostgreSQL:** $0-25/mês
- **S3/R2:** $5-50/mês (depende do uso)
- **Total:** ~$50-100/mês

---

## 🚀 Comandos Rápidos

```bash
# Deploy Frontend (Vercel CLI)
npm i -g vercel
cd frontend
vercel --prod

# Deploy Backend (Railway CLI)
npm i -g @railway/cli
cd backend
railway up

# Verificar logs
railway logs

# Rodar migrações
railway run npx prisma migrate deploy
```

---

## 📚 Recursos Úteis

- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app
- **Next.js SEO:** https://nextjs.org/learn/seo/introduction-to-seo
- **Google Search Console:** https://search.google.com/search-console
- **Cloudflare R2:** https://developers.cloudflare.com/r2

---

## 🎯 Próximos Passos

Após o deploy básico:

1. **Monitoramento:** Configure alertas para downtime
2. **Backups:** Configure backups automáticos do banco
3. **CDN:** Otimize entrega de vídeos
4. **Cache:** Implemente Redis para performance
5. **Segurança:** Configure rate limiting e firewall
6. **Analytics:** Analise comportamento dos usuários
7. **Marketing:** Comece a divulgar sua plataforma!

---

**Boa sorte com o deploy! 🚀**
