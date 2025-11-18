# 🚂 PASSO 2: Deploy do Backend no Railway

## ✅ Pré-requisitos
- [x] Banco de dados criado no Neon.tech
- [x] Connection string salva
- [ ] Conta no GitHub
- [ ] Código commitado no GitHub
- [ ] Conta no Railway

---

## 📦 PARTE 1: Preparar o Código (5 minutos)

### 1.1 Verificar se o Git está inicializado

Abra o terminal na pasta do projeto e execute:

```bash
git status
```

**Se aparecer erro "not a git repository":**
```bash
git init
git add .
git commit -m "Initial commit - Video platform"
```

**Se já estiver inicializado:**
```bash
git add .
git commit -m "Ready for deployment"
```

### 1.2 Criar repositório no GitHub

1. Vá para: https://github.com/new
2. Preencha:
   - **Repository name:** `video-platform` (ou outro nome)
   - **Description:** "Full-stack video platform with Next.js and Node.js"
   - **Visibility:** Private ou Public (sua escolha)
3. **NÃO marque** "Initialize with README"
4. Clique em **"Create repository"**

### 1.3 Fazer push para o GitHub

Copie os comandos que aparecem na tela do GitHub (algo como):

```bash
git remote add origin https://github.com/SEU-USUARIO/video-platform.git
git branch -M main
git push -u origin main
```

**Aguarde o upload completar** (~30 segundos)

✅ **Verificação:** Atualize a página do GitHub e veja seus arquivos lá!

---

## 🚂 PARTE 2: Deploy no Railway (10 minutos)

### 2.1 Criar conta no Railway

1. Vá para: https://railway.app
2. Clique em **"Login"** (canto superior direito)
3. Escolha **"Login with GitHub"** (RECOMENDADO)
4. Autorize o Railway a acessar seus repositórios
5. Você será redirecionado para o dashboard

### 2.2 Criar novo projeto

1. No dashboard, clique em **"New Project"**
2. Selecione **"Deploy from GitHub repo"**
3. Escolha o repositório **"video-platform"** (ou o nome que você deu)
4. O Railway vai detectar automaticamente que é um projeto Node.js

### 2.3 Configurar o serviço do Backend

1. Após criar o projeto, você verá um card com seu repositório
2. Clique no card do serviço
3. Vá para a aba **"Settings"**
4. Configure:

**Root Directory:**
```
backend
```

**Build Command:** (deixe vazio, o Railway usa o package.json)

**Start Command:**
```
npm start
```

**Port:** (deixe vazio, o Railway detecta automaticamente)

### 2.4 Adicionar variáveis de ambiente

1. Ainda em **Settings**, role até **"Variables"**
2. Clique em **"New Variable"**
3. Adicione TODAS estas variáveis:

```env
NODE_ENV=production
PORT=4000

# Database - Cole sua connection string do Neon
DATABASE_URL=postgresql://neondb_owner:npg_VRsecBMg19GU@ep-morning-frost-aer71rw8-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require

# JWT - IMPORTANTE: Mude este secret!
JWT_SECRET=seu-super-secret-jwt-key-mude-isso-12345678
JWT_EXPIRES_IN=24h

# AWS S3 / Cloudflare R2 (opcional por enquanto)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
S3_BUCKET=dev-videos
S3_ENDPOINT=https://s3.amazonaws.com

# Upload limits
MAX_FILE_SIZE=2147483648
MAX_VIDEO_SIZE=5368709120
```

**IMPORTANTE:** 
- Substitua `DATABASE_URL` pela SUA connection string do Neon
- Mude o `JWT_SECRET` para algo único e seguro

4. Clique em **"Add"** para cada variável

### 2.5 Deploy!

1. Vá para a aba **"Deployments"**
2. O Railway já deve estar fazendo o deploy automaticamente
3. Aguarde ~2-3 minutos
4. Você verá logs aparecendo na tela

**Logs esperados:**
```
✅ Database connection successful
🚀 Server running on http://localhost:4000
```

### 2.6 Obter a URL pública

1. Vá para a aba **"Settings"**
2. Role até **"Networking"**
3. Clique em **"Generate Domain"**
4. O Railway vai gerar uma URL tipo:
   ```
   https://video-platform-production.up.railway.app
   ```
5. **COPIE ESTA URL** - você vai precisar dela!

### 2.7 Testar o backend

Abra no navegador:
```
https://SUA-URL-DO-RAILWAY.railway.app/health
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2024-11-17T...",
  "database": "connected"
}
```

✅ **Se viu isso, o backend está funcionando!**

---

## 🔧 PARTE 3: Rodar Migrations no Banco (2 minutos)

O Railway precisa criar as tabelas no banco de dados.

### Opção 1: Via Railway CLI (Recomendado)

1. Instale o Railway CLI:
```bash
npm install -g @railway/cli
```

2. Faça login:
```bash
railway login
```

3. Link ao projeto:
```bash
railway link
```

4. Rode as migrations:
```bash
railway run npx prisma migrate deploy
```

### Opção 2: Via Dashboard do Railway

1. No dashboard do Railway, clique no seu serviço
2. Vá para **"Settings"** → **"Deploy"**
3. Em **"Custom Start Command"**, temporariamente mude para:
```
npx prisma migrate deploy && npm start
```
4. Salve e aguarde o redeploy
5. Depois volte para `npm start`

---

## ✅ Verificação Final

Teste estes endpoints no navegador:

1. **Health Check:**
   ```
   https://SUA-URL.railway.app/health
   ```
   ✅ Deve retornar `{"status":"ok"}`

2. **Vídeos Recentes:**
   ```
   https://SUA-URL.railway.app/api/videos/recent
   ```
   ✅ Deve retornar lista de vídeos

3. **Registro de usuário:**
   Use Postman ou curl:
   ```bash
   curl -X POST https://SUA-URL.railway.app/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@test.com","password":"password123"}'
   ```
   ✅ Deve retornar token e usuário

---

## 🎉 PASSO 2 COMPLETO!

Você agora tem:
- ✅ Backend rodando no Railway
- ✅ Conectado ao banco Neon.tech
- ✅ URL pública funcionando
- ✅ API REST acessível

**Guarde esta URL do Railway!** Você vai precisar dela no Passo 3.

---

## 🚀 Próximo Passo

Agora vamos fazer o deploy do Frontend no Vercel!

**Antes de continuar, certifique-se:**
- ✅ Backend está rodando (teste a URL)
- ✅ Você tem a URL do Railway salva
- ✅ O código está no GitHub

---

## 🐛 Problemas Comuns

### Deploy falhou?
- Verifique os logs na aba "Deployments"
- Certifique-se que o Root Directory está como `backend`
- Verifique se todas as variáveis de ambiente estão corretas

### Erro de conexão com banco?
- Verifique se a `DATABASE_URL` está correta
- Certifique-se que não tem espaços extras
- Teste a connection string localmente primeiro

### Migrations não rodaram?
- Use o Railway CLI: `railway run npx prisma migrate deploy`
- Ou adicione ao start command temporariamente

### Port error?
- O Railway detecta automaticamente a porta
- Certifique-se que seu código usa `process.env.PORT`

---

**Custo:** $0/mês (Railway oferece $5 de crédito grátis por mês)

**Tempo total:** ~15-20 minutos

**Pronto para o Passo 3?** Me avise quando terminar! 🚀
