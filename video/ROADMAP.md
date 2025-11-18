# 🗺️ Roadmap Completo - Do Deploy à Escala

## 🎯 Objetivo: Site no ar e indexado pelo Google

---

## 📍 FASE 1: DEPLOY E INDEXAÇÃO (1-2 dias)

### ✅ Passo 1: Deploy do Backend (30 min)

#### 1.1 Preparar Banco de Dados (Neon.tech)
```bash
# 1. Acesse https://neon.tech
# 2. Crie conta gratuita
# 3. Create New Project
# 4. Copie a Connection String
```

**Connection String exemplo:**
```
postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

#### 1.2 Deploy no Railway
```bash
# 1. Acesse https://railway.app
# 2. Login com GitHub
# 3. New Project → Deploy from GitHub repo
# 4. Selecione seu repositório
# 5. Configure:
```

**Variáveis de Ambiente (Railway):**
```env
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://... (do Neon.tech)
JWT_SECRET=gere-um-secret-super-seguro-aqui-min-32-chars
AWS_ACCESS_KEY_ID=sua-key (se usar S3)
AWS_SECRET_ACCESS_KEY=sua-secret (se usar S3)
AWS_REGION=us-east-1
S3_BUCKET=seu-bucket
CDN_URL=https://seu-cdn.com
```

**Gerar JWT_SECRET seguro:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 1.3 Rodar Migrações
```bash
# No Railway, vá em Settings → Deploy
# Adicione comando de deploy:
npx prisma migrate deploy && npm start
```

**Verificar:**
- Acesse: `https://seu-projeto.up.railway.app/health`
- Deve retornar: `{"status":"ok","database":"connected"}`

---

### ✅ Passo 2: Deploy do Frontend (20 min)

#### 2.1 Deploy na Vercel
```bash
# 1. Acesse https://vercel.com
# 2. Login com GitHub
# 3. Add New Project
# 4. Import seu repositório
# 5. Configure:
```

**Configurações Vercel:**
- Framework Preset: **Next.js**
- Root Directory: **frontend**
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

**Variáveis de Ambiente (Vercel):**
```env
NEXT_PUBLIC_API_URL=https://seu-projeto.up.railway.app
NEXT_PUBLIC_SITE_URL=https://seu-projeto.vercel.app
```

**Verificar:**
- Acesse: `https://seu-projeto.vercel.app`
- Teste registro e login

---

### ✅ Passo 3: Configurar Storage (30 min)

#### Opção A: Cloudflare R2 (Recomendado - Mais Barato)

```bash
# 1. Acesse https://dash.cloudflare.com
# 2. R2 → Create Bucket
# 3. Nome: seu-projeto-videos
# 4. Manage R2 API Tokens → Create API Token
```

**Adicione no Railway:**
```env
AWS_ACCESS_KEY_ID=seu-r2-access-key
AWS_SECRET_ACCESS_KEY=seu-r2-secret-key
S3_ENDPOINT=https://account-id.r2.cloudflarestorage.com
S3_BUCKET=seu-projeto-videos
CDN_URL=https://pub-xxx.r2.dev
```

**Configurar CORS no R2:**
```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedHeaders": ["*"]
  }
]
```

#### Opção B: AWS S3

```bash
# 1. AWS Console → S3 → Create Bucket
# 2. Nome: seu-projeto-videos
# 3. Region: us-east-1
# 4. Desmarque "Block all public access"
# 5. IAM → Create User → Attach AmazonS3FullAccess
```

**Adicione no Railway:**
```env
AWS_ACCESS_KEY_ID=sua-aws-key
AWS_SECRET_ACCESS_KEY=sua-aws-secret
AWS_REGION=us-east-1
S3_BUCKET=seu-projeto-videos
```

---

### ✅ Passo 4: Configurar Domínio (30 min)

#### 4.1 Comprar Domínio
- **Namecheap:** https://namecheap.com (~$10/ano)
- **Google Domains:** https://domains.google
- **GoDaddy:** https://godaddy.com

#### 4.2 Configurar DNS

**Para Frontend (Vercel):**
```
# No seu provedor de domínio:
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Para Backend (Railway):**
```
Type: CNAME
Name: api
Value: seu-projeto.up.railway.app
```

#### 4.3 Adicionar Domínio na Vercel
```bash
# Vercel Dashboard → Settings → Domains
# Add: suaplataforma.com
# Add: www.suaplataforma.com
```

#### 4.4 Adicionar Domínio no Railway
```bash
# Railway → Settings → Domains
# Add: api.suaplataforma.com
```

#### 4.5 Atualizar Variáveis
**Vercel:**
```env
NEXT_PUBLIC_API_URL=https://api.suaplataforma.com
NEXT_PUBLIC_SITE_URL=https://suaplataforma.com
```

**Redeploy:** Vercel e Railway

---

### ✅ Passo 5: Google Search Console (15 min)

#### 5.1 Verificar Propriedade
```bash
# 1. Acesse https://search.google.com/search-console
# 2. Add Property → suaplataforma.com
# 3. Escolha método de verificação:
```

**Método DNS (Recomendado):**
```
Type: TXT
Name: @
Value: google-site-verification=xxx
```

#### 5.2 Enviar Sitemap
```bash
# No Search Console:
# Sitemaps → Add new sitemap
# URL: https://suaplataforma.com/sitemap.xml
```

#### 5.3 Solicitar Indexação
```bash
# URL Inspection → Digite sua URL
# Request Indexing
```

**URLs importantes para indexar:**
- `https://suaplataforma.com`
- `https://suaplataforma.com/search`
- Páginas de vídeos individuais

---

### ✅ Passo 6: Google Analytics (10 min)

#### 6.1 Criar Conta
```bash
# 1. Acesse https://analytics.google.com
# 2. Create Account
# 3. Create Property
# 4. Copie Measurement ID (G-XXXXXXXXXX)
```

#### 6.2 Instalar no Frontend

Atualize `frontend/app/layout.tsx`:

```typescript
import Script from 'next/script';

// Adicione antes do </body>
{process.env.NODE_ENV === 'production' && (
  <>
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
  </>
)}
```

**Adicione na Vercel:**
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

### ✅ Checklist Fase 1

- [ ] Backend deployado no Railway
- [ ] Banco de dados Neon.tech conectado
- [ ] Migrações executadas
- [ ] Frontend deployado na Vercel
- [ ] Storage (S3/R2) configurado
- [ ] Domínio configurado e funcionando
- [ ] HTTPS funcionando
- [ ] Google Search Console verificado
- [ ] Sitemap enviado
- [ ] Google Analytics instalado
- [ ] Teste completo: registro → upload → visualização

**Tempo estimado:** 2-3 horas  
**Custo:** $5-15/mês

---

## 📍 FASE 2: EVOLUÇÃO DO PRODUTO (1-2 semanas)

### 🎯 Objetivo: Criar engajamento e retenção

### ✅ Feature 1: Sistema de Comentários (2-3 dias)

#### Backend

**1. Atualizar Schema Prisma:**
```prisma
model Comment {
  id        String   @id @default(uuid())
  videoId   String   @map("video_id")
  userId    String   @map("user_id")
  content   String
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  
  video     Video    @relation(fields: [videoId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([videoId])
  @@index([userId])
  @@map("comments")
}

// Adicionar em Video model:
comments Comment[]

// Adicionar em User model:
comments Comment[]
```

**2. Criar Endpoints:**
```typescript
// POST /api/videos/:id/comments - Criar comentário
// GET /api/videos/:id/comments - Listar comentários
// PUT /api/comments/:id - Editar comentário
// DELETE /api/comments/:id - Deletar comentário
```

#### Frontend

**3. Componente de Comentários:**
```typescript
// frontend/components/Comments.tsx
// - Lista de comentários
// - Formulário de novo comentário
// - Editar/deletar próprios comentários
```

**4. Integrar na página de vídeo**

---

### ✅ Feature 2: Sistema de Inscrições (2-3 dias)

#### Backend

**1. Atualizar Schema:**
```prisma
model Subscription {
  id          String   @id @default(uuid())
  subscriberId String   @map("subscriber_id")
  channelId   String   @map("channel_id")
  createdAt   DateTime @default(now()) @map("created_at")
  
  subscriber  User     @relation("Subscriptions", fields: [subscriberId], references: [id], onDelete: Cascade)
  channel     Channel  @relation(fields: [channelId], references: [id], onDelete: Cascade)
  
  @@unique([subscriberId, channelId])
  @@index([subscriberId])
  @@index([channelId])
  @@map("subscriptions")
}

// Adicionar em Channel:
subscribers Subscription[]
subscriberCount Int @default(0) @map("subscriber_count")

// Adicionar em User:
subscriptions Subscription[] @relation("Subscriptions")
```

**2. Criar Endpoints:**
```typescript
// POST /api/channels/:id/subscribe - Inscrever
// DELETE /api/channels/:id/subscribe - Desinscrever
// GET /api/subscriptions - Meus canais inscritos
// GET /api/subscriptions/feed - Feed de vídeos dos inscritos
```

#### Frontend

**3. Botão de Inscrição:**
```typescript
// Adicionar na página do canal
// Adicionar na página de vídeo
// Criar página de feed de inscrições
```

---

### ✅ Feature 3: Sistema de Likes (1-2 dias)

#### Backend

**1. Atualizar Schema:**
```prisma
model VideoLike {
  id        String   @id @default(uuid())
  videoId   String   @map("video_id")
  userId    String   @map("user_id")
  type      LikeType
  createdAt DateTime @default(now()) @map("created_at")
  
  video     Video    @relation(fields: [videoId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([videoId, userId])
  @@index([videoId])
  @@map("video_likes")
}

enum LikeType {
  LIKE
  DISLIKE
}

// Adicionar em Video:
likes VideoLike[]
likeCount Int @default(0) @map("like_count")
dislikeCount Int @default(0) @map("dislike_count")
```

**2. Criar Endpoints:**
```typescript
// POST /api/videos/:id/like - Like
// POST /api/videos/:id/dislike - Dislike
// DELETE /api/videos/:id/like - Remover like/dislike
// GET /api/videos/:id/like-status - Status do usuário
```

#### Frontend

**3. Botões de Like/Dislike:**
```typescript
// Adicionar na página de vídeo
// Mostrar contadores
// Highlight se usuário já deu like
```

---

### ✅ Feature 4: Playlists (2-3 dias)

#### Backend

**1. Atualizar Schema:**
```prisma
model Playlist {
  id          String   @id @default(uuid())
  channelId   String   @map("channel_id")
  name        String
  description String?
  isPublic    Boolean  @default(true) @map("is_public")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  channel     Channel  @relation(fields: [channelId], references: [id], onDelete: Cascade)
  videos      PlaylistVideo[]
  
  @@index([channelId])
  @@map("playlists")
}

model PlaylistVideo {
  id         String   @id @default(uuid())
  playlistId String   @map("playlist_id")
  videoId    String   @map("video_id")
  position   Int
  addedAt    DateTime @default(now()) @map("added_at")
  
  playlist   Playlist @relation(fields: [playlistId], references: [id], onDelete: Cascade)
  video      Video    @relation(fields: [videoId], references: [id], onDelete: Cascade)
  
  @@unique([playlistId, videoId])
  @@index([playlistId])
  @@map("playlist_videos")
}
```

**2. Criar Endpoints:**
```typescript
// POST /api/playlists - Criar playlist
// GET /api/playlists/:id - Ver playlist
// PUT /api/playlists/:id - Editar playlist
// DELETE /api/playlists/:id - Deletar playlist
// POST /api/playlists/:id/videos - Adicionar vídeo
// DELETE /api/playlists/:id/videos/:videoId - Remover vídeo
```

---

### ✅ Checklist Fase 2

- [ ] Comentários implementados
- [ ] Inscrições implementadas
- [ ] Likes/Dislikes implementados
- [ ] Playlists implementadas
- [ ] Testes de todas as features
- [ ] Deploy das atualizações

**Tempo estimado:** 1-2 semanas  
**Impacto:** Alto engajamento e retenção

---

## 📍 FASE 3: OTIMIZAÇÃO E ESCALA (1-2 semanas)

### 🎯 Objetivo: Performance e escalabilidade

### ✅ Otimização 1: Processamento de Vídeo com FFmpeg (3-4 dias)

#### 1. Setup do Worker

**Criar `backend/src/services/video-processor.service.ts`:**
```typescript
import ffmpeg from 'fluent-ffmpeg';
import { Queue, Worker } from 'bullmq';

// Criar fila de processamento
const videoQueue = new Queue('video-processing', {
  connection: { host: 'redis', port: 6379 }
});

// Worker para processar vídeos
const worker = new Worker('video-processing', async (job) => {
  const { videoId, filePath } = job.data;
  
  // Transcodificar para múltiplas resoluções
  await transcodeVideo(filePath, videoId);
  
  // Gerar thumbnail
  await generateThumbnail(filePath, videoId);
  
  // Atualizar status no banco
  await updateVideoStatus(videoId, 'READY');
});
```

#### 2. Implementar Transcoding

**Resoluções:**
- 1080p (1920x1080) @ 5000 kbps
- 720p (1280x720) @ 2500 kbps
- 480p (854x480) @ 1000 kbps
- 360p (640x360) @ 500 kbps

#### 3. Gerar HLS

```typescript
// Gerar playlist HLS adaptativa
ffmpeg(inputPath)
  .outputOptions([
    '-c:v libx264',
    '-c:a aac',
    '-hls_time 10',
    '-hls_playlist_type vod',
    '-hls_segment_filename segment_%03d.ts'
  ])
  .output('playlist.m3u8');
```

#### 4. Deploy Worker

**Railway:** Adicionar novo serviço para worker

---

### ✅ Otimização 2: Cache com Redis (1-2 dias)

#### 1. Adicionar Redis

**Railway:** Add Redis database

#### 2. Implementar Cache

```typescript
// Cache de vídeos recentes (5 min)
// Cache de dados de canal (10 min)
// Cache de resultados de busca (1 min)
// Cache de contadores (views, likes)
```

#### 3. Invalidação de Cache

```typescript
// Invalidar ao criar/atualizar/deletar
```

---

### ✅ Otimização 3: Monitoramento (1 dia)

#### 1. Sentry (Erros)

```bash
npm install @sentry/nextjs @sentry/node
npx @sentry/wizard@latest -i nextjs
```

#### 2. Uptime Robot (Disponibilidade)

```bash
# https://uptimerobot.com
# Monitorar:
# - Frontend
# - Backend /health
# - Banco de dados
```

#### 3. Logs Estruturados

```typescript
// Winston ou Pino para logs
// Enviar para serviço de logs
```

---

### ✅ Checklist Fase 3

- [ ] FFmpeg worker implementado
- [ ] Transcodificação funcionando
- [ ] HLS adaptativo funcionando
- [ ] Redis cache implementado
- [ ] Sentry configurado
- [ ] Uptime monitoring ativo
- [ ] Logs estruturados
- [ ] Performance melhorada

**Tempo estimado:** 1-2 semanas  
**Impacto:** Melhor experiência e escalabilidade

---

## 📊 Cronograma Completo

| Fase | Duração | Custo | Prioridade |
|------|---------|-------|------------|
| **Fase 1: Deploy** | 1-2 dias | $5-15/mês | 🔴 Crítica |
| **Fase 2: Features Sociais** | 1-2 semanas | $0 | 🟡 Alta |
| **Fase 3: Otimização** | 1-2 semanas | +$10/mês | 🟢 Média |

**Total:** 3-5 semanas para plataforma completa

---

## 💰 Custos por Fase

### Fase 1 (MVP no ar):
- Railway: $5/mês
- Neon.tech: Grátis
- Cloudflare R2: $0-5/mês
- Domínio: $1/mês
- **Total: ~$10/mês**

### Fase 2 (Com features sociais):
- Mesmo custo
- **Total: ~$10/mês**

### Fase 3 (Otimizado):
- Railway: $10/mês (worker)
- Redis: $5/mês
- Sentry: Grátis (tier free)
- **Total: ~$20/mês**

---

## 🎯 Métricas de Sucesso

### Fase 1:
- [ ] Site acessível 24/7
- [ ] Indexado no Google
- [ ] Tempo de carregamento < 3s
- [ ] Uptime > 99%

### Fase 2:
- [ ] Taxa de engajamento > 20%
- [ ] Usuários retornam 3x/semana
- [ ] Média de 5+ comentários/vídeo
- [ ] Taxa de inscrição > 10%

### Fase 3:
- [ ] Tempo de processamento < 5min
- [ ] Cache hit rate > 80%
- [ ] Erro rate < 0.1%
- [ ] Suporta 1000+ usuários simultâneos

---

## 🚀 Começar AGORA

### Próximos Passos Imediatos:

1. **Hoje:** Deploy Fase 1 (2-3 horas)
2. **Amanhã:** Testar e ajustar
3. **Semana 1:** Implementar comentários
4. **Semana 2:** Implementar inscrições
5. **Semana 3:** Implementar likes e playlists
6. **Semana 4:** Otimizações

---

**Boa sorte! Seu site estará no ar em poucas horas! 🚀**
