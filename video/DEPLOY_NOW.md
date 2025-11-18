# 🚀 DEPLOY AGORA - Guia Interativo

## ⏱️ Tempo Total: 1-2 horas

---

## 📋 CHECKLIST PRÉ-DEPLOY

Antes de começar, certifique-se de ter:

- [ ] Conta no GitHub (para conectar aos serviços)
- [ ] Código commitado no Git
- [ ] Email válido para criar contas
- [ ] Cartão de crédito (opcional, para upgrades futuros)

---

## 🎯 PASSO 1: BANCO DE DADOS (10 minutos)

### 1.1 Criar Conta no Neon.tech

1. **Acesse:** https://neon.tech
2. **Clique em:** "Sign Up"
3. **Use:** Sua conta do GitHub (mais rápido)
4. **Confirme** seu email

### 1.2 Criar Projeto

1. **Clique em:** "Create a project"
2. **Nome do projeto:** `video-platform-db`
3. **Region:** Escolha a mais próxima (ex: US East)
4. **Clique em:** "Create Project"

### 1.3 Copiar Connection String

1. **Na dashboard**, você verá "Connection Details"
2. **Copie** a connection string que parece com:
   ```
   postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
3. **Cole** em um arquivo temporário (vamos usar depois)

✅ **Pronto!** Banco de dados criado (GRÁTIS)

---

## 🎯 PASSO 2: DEPLOY DO BACKEND (20 minutos)

### 2.1 Criar Conta no Railway

1. **Acesse:** https://railway.app
2. **Clique em:** "Login"
3. **Use:** Sua conta do GitHub
4. **Autorize** o Railway a acessar seus repositórios

### 2.2 Criar Novo Projeto

1. **Clique em:** "New Project"
2. **Selecione:** "Deploy from GitHub repo"
3. **Escolha:** Seu repositório `video-platform`
4. **Clique em:** "Deploy Now"

### 2.3 Configurar o Backend

1. **Clique** no serviço criado
2. **Vá em:** "Settings"
3. **Root Directory:** Digite `backend`
4. **Start Command:** Digite `npm start`
5. **Clique em:** "Save"

### 2.4 Adicionar Variáveis de Ambiente

1. **Vá em:** "Variables"
2. **Clique em:** "New Variable"
3. **Adicione uma por uma:**

```env
NODE_ENV=production
PORT=4000
DATABASE_URL=cole-aqui-a-url-do-neon
JWT_SECRET=cole-aqui-um-secret-seguro
```

**Para gerar JWT_SECRET seguro:**
- Abra o terminal
- Execute: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Copie o resultado

### 2.5 Fazer Deploy

1. **Clique em:** "Deploy"
2. **Aguarde** ~3-5 minutos
3. **Verifique** os logs para ver se deu certo

### 2.6 Testar o Backend

1. **Vá em:** "Settings" → "Domains"
2. **Copie** a URL (algo como: `https://video-platform-production.up.railway.app`)
3. **Abra** no navegador: `SUA-URL/health`
4. **Deve mostrar:** `{"status":"ok","database":"connected"}`

✅ **Pronto!** Backend no ar!

**Guarde a URL do backend**, vamos usar no próximo passo.

---

## 🎯 PASSO 3: DEPLOY DO FRONTEND (15 minutos)

### 3.1 Criar Conta na Vercel

1. **Acesse:** https://vercel.com
2. **Clique em:** "Sign Up"
3. **Use:** Sua conta do GitHub
4. **Autorize** a Vercel

### 3.2 Importar Projeto

1. **Clique em:** "Add New..." → "Project"
2. **Selecione:** Seu repositório `video-platform`
3. **Clique em:** "Import"

### 3.3 Configurar o Frontend

1. **Framework Preset:** Next.js (já detectado)
2. **Root Directory:** Clique em "Edit" e digite `frontend`
3. **Build Command:** `npm run build` (já preenchido)
4. **Output Directory:** `.next` (já preenchido)

### 3.4 Adicionar Variáveis de Ambiente

1. **Expanda:** "Environment Variables"
2. **Adicione:**

```env
Name: NEXT_PUBLIC_API_URL
Value: cole-aqui-a-url-do-railway (sem barra no final)

Name: NEXT_PUBLIC_SITE_URL  
Value: deixe em branco por enquanto (vamos preencher depois)
```

### 3.5 Fazer Deploy

1. **Clique em:** "Deploy"
2. **Aguarde** ~2-3 minutos
3. **Verá** uma animação de foguete 🚀

### 3.6 Testar o Frontend

1. **Clique em:** "Visit" ou copie a URL
2. **Abra** no navegador
3. **Teste:** Criar conta → Criar canal → Upload de vídeo

✅ **Pronto!** Frontend no ar!

**Sua URL será algo como:** `https://video-platform-xxx.vercel.app`

---

## 🎯 PASSO 4: CONFIGURAR STORAGE (15 minutos)

### Opção A: Cloudflare R2 (Recomendado - Mais Barato)

#### 4.1 Criar Conta Cloudflare

1. **Acesse:** https://dash.cloudflare.com
2. **Sign Up** (se não tiver conta)
3. **Vá em:** R2 (no menu lateral)

#### 4.2 Criar Bucket

1. **Clique em:** "Create bucket"
2. **Nome:** `video-platform-videos`
3. **Location:** Automatic
4. **Clique em:** "Create bucket"

#### 4.3 Criar API Token

1. **Vá em:** "Manage R2 API Tokens"
2. **Clique em:** "Create API Token"
3. **Permissions:** Object Read & Write
4. **Clique em:** "Create API Token"
5. **Copie:**
   - Access Key ID
   - Secret Access Key
   - Endpoint URL

#### 4.4 Configurar CORS

1. **Abra** seu bucket
2. **Vá em:** "Settings" → "CORS Policy"
3. **Adicione:**

```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedHeaders": ["*"]
  }
]
```

#### 4.5 Adicionar no Railway

1. **Volte** ao Railway
2. **Vá em:** Variables
3. **Adicione:**

```env
AWS_ACCESS_KEY_ID=seu-r2-access-key
AWS_SECRET_ACCESS_KEY=seu-r2-secret-key
S3_ENDPOINT=seu-r2-endpoint
S3_BUCKET=video-platform-videos
CDN_URL=https://pub-xxx.r2.dev
```

4. **Redeploy** o backend

✅ **Pronto!** Storage configurado!

### Opção B: Usar Storage Local (Temporário)

Se quiser testar sem configurar storage externo:

1. **No Railway**, não adicione as variáveis AWS
2. **O sistema** usará storage local automaticamente
3. **Atenção:** Arquivos serão perdidos ao redeploy

---

## 🎯 PASSO 5: ATUALIZAR URL DO SITE (5 minutos)

### 5.1 Copiar URL da Vercel

1. **Na Vercel**, copie sua URL completa
2. **Exemplo:** `https://video-platform-xxx.vercel.app`

### 5.2 Atualizar Variável

1. **Na Vercel**, vá em: Settings → Environment Variables
2. **Edite** `NEXT_PUBLIC_SITE_URL`
3. **Cole** a URL completa
4. **Save**

### 5.3 Redeploy

1. **Vá em:** Deployments
2. **Clique** nos 3 pontinhos do último deploy
3. **Clique em:** "Redeploy"

✅ **Pronto!** Tudo configurado!

---

## 🎯 PASSO 6: TESTE COMPLETO (10 minutos)

### 6.1 Testar Funcionalidades

Acesse seu site e teste:

- [ ] **Página inicial** carrega
- [ ] **Registrar** nova conta
- [ ] **Fazer login**
- [ ] **Criar canal**
- [ ] **Upload de vídeo** (teste com vídeo pequeno)
- [ ] **Assistir vídeo**
- [ ] **Buscar vídeos**
- [ ] **Editar vídeo**

### 6.2 Verificar Logs

**Se algo não funcionar:**

1. **Railway:** Vá em "Deployments" → "View Logs"
2. **Vercel:** Vá em "Deployments" → Clique no deploy → "View Function Logs"

### 6.3 Problemas Comuns

**Erro de conexão com banco:**
- Verifique se DATABASE_URL está correto
- Certifique-se que tem `?sslmode=require` no final

**Erro de upload:**
- Verifique se configurou o storage
- Ou deixe sem configurar para usar local

**Erro 500:**
- Verifique os logs no Railway
- Certifique-se que JWT_SECRET está configurado

✅ **Tudo funcionando!** Site no ar!

---

## 🎯 PASSO 7: GOOGLE SEARCH CONSOLE (15 minutos)

### 7.1 Acessar Search Console

1. **Acesse:** https://search.google.com/search-console
2. **Login** com sua conta Google
3. **Clique em:** "Add property"

### 7.2 Adicionar Propriedade

1. **Escolha:** "URL prefix"
2. **Digite:** Sua URL da Vercel completa
3. **Clique em:** "Continue"

### 7.3 Verificar Propriedade

**Método HTML Tag (mais fácil):**

1. **Copie** a meta tag fornecida
2. **Na Vercel**, vá em seu projeto
3. **Crie** arquivo `frontend/app/layout.tsx` (já existe)
4. **Adicione** a meta tag no `<head>`
5. **Commit** e push
6. **Aguarde** deploy
7. **Volte** ao Search Console e clique "Verify"

### 7.4 Enviar Sitemap

1. **No Search Console**, vá em "Sitemaps"
2. **Digite:** `sitemap.xml`
3. **Clique em:** "Submit"

✅ **Pronto!** Google vai começar a indexar seu site!

---

## 🎯 PASSO 8: GOOGLE ANALYTICS (10 minutos)

### 8.1 Criar Conta

1. **Acesse:** https://analytics.google.com
2. **Clique em:** "Start measuring"
3. **Account name:** Video Platform
4. **Property name:** Video Platform
5. **Timezone:** Seu fuso horário
6. **Currency:** Sua moeda

### 8.2 Configurar Data Stream

1. **Platform:** Web
2. **Website URL:** Sua URL da Vercel
3. **Stream name:** Video Platform Web
4. **Clique em:** "Create stream"

### 8.3 Copiar Measurement ID

1. **Copie** o Measurement ID (G-XXXXXXXXXX)

### 8.4 Adicionar no Site

1. **Na Vercel**, vá em: Settings → Environment Variables
2. **Adicione:**

```env
Name: NEXT_PUBLIC_GA_ID
Value: G-XXXXXXXXXX
```

3. **Redeploy**

✅ **Pronto!** Analytics configurado!

---

## 🎉 PARABÉNS! SEU SITE ESTÁ NO AR!

### 📊 Resumo do que você tem:

- ✅ Backend rodando no Railway
- ✅ Frontend rodando na Vercel
- ✅ Banco de dados no Neon.tech
- ✅ Storage configurado (R2 ou local)
- ✅ Google Search Console ativo
- ✅ Google Analytics instalado

### 🔗 Suas URLs:

- **Site:** `https://seu-projeto.vercel.app`
- **API:** `https://seu-projeto.up.railway.app`
- **Health:** `https://seu-projeto.up.railway.app/health`

### 💰 Custos:

- **Neon.tech:** GRÁTIS
- **Railway:** $5/mês
- **Vercel:** GRÁTIS
- **Cloudflare R2:** $0-5/mês
- **Total:** ~$5-10/mês

---

## 📱 Compartilhe Seu Site!

Agora você pode compartilhar sua plataforma:

- Envie o link para amigos
- Poste nas redes sociais
- Adicione ao seu portfólio
- Comece a receber usuários!

---

## 🚀 Próximos Passos:

1. **Comprar domínio** (opcional): suaplataforma.com
2. **Adicionar features sociais**: Comentários, likes, inscrições
3. **Otimizar**: FFmpeg, Redis, cache
4. **Monetizar**: Anúncios, assinaturas, etc.

---

## 🆘 Precisa de Ajuda?

**Problemas comuns:**

1. **Erro de build:** Verifique os logs
2. **Erro de conexão:** Verifique variáveis de ambiente
3. **Upload não funciona:** Configure storage ou use local

**Documentação:**
- Railway: https://docs.railway.app
- Vercel: https://vercel.com/docs
- Neon: https://neon.tech/docs

---

**Parabéns pelo deploy! 🎉🚀**

*Seu site está oficialmente no ar e pronto para receber usuários!*
