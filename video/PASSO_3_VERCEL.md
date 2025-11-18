# 🚀 PASSO 3: Deploy do Frontend no Vercel

## ✅ Pré-requisitos
- [x] Backend rodando no Railway
- [x] URL do backend salva (ex: https://seu-app.railway.app)
- [x] Código no GitHub
- [ ] Conta no Vercel

---

## 📦 PARTE 1: Preparar o Código (2 minutos)

### 1.1 Commit das últimas mudanças

Certifique-se que todas as mudanças estão no GitHub:

```bash
git add .
git commit -m "Add likes, subscriptions, and profile features"
git push origin main
```

✅ **Verificação:** Atualize o GitHub e veja as mudanças lá!

---

## ▲ PARTE 2: Deploy no Vercel (10 minutos)

### 2.1 Criar conta no Vercel

1. Vá para: https://vercel.com
2. Clique em **"Sign Up"** (canto superior direito)
3. Escolha **"Continue with GitHub"** (RECOMENDADO)
4. Autorize o Vercel a acessar seus repositórios
5. Você será redirecionado para o dashboard

### 2.2 Importar projeto

1. No dashboard, clique em **"Add New..."** → **"Project"**
2. Você verá uma lista dos seus repositórios do GitHub
3. Encontre **"video-platform"** (ou o nome que você deu)
4. Clique em **"Import"**

### 2.3 Configurar o projeto

Na tela de configuração:

**1. Configure o Framework:**
- Framework Preset: **Next.js** (detectado automaticamente)
- Root Directory: **frontend** ⚠️ IMPORTANTE!

**2. Build Settings:**
- Build Command: `npm run build` (já preenchido)
- Output Directory: `.next` (já preenchido)
- Install Command: `npm install` (já preenchido)

**3. Environment Variables:**

Clique em **"Environment Variables"** e adicione:

```env
NEXT_PUBLIC_API_URL=https://SEU-BACKEND-URL.railway.app
```

⚠️ **IMPORTANTE:** 
- Substitua `SEU-BACKEND-URL` pela URL real do seu backend no Railway
- NÃO adicione `/api` no final
- Exemplo: `https://video-platform-production.up.railway.app`

### 2.4 Deploy!

1. Clique em **"Deploy"**
2. O Vercel vai:
   - Clonar seu repositório
   - Instalar dependências
   - Fazer build do Next.js
   - Fazer deploy
3. Aguarde ~2-3 minutos
4. Você verá logs em tempo real

**Logs esperados:**
```
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
✓ Build completed
```

### 2.5 Obter a URL pública

Após o deploy:

1. Você verá uma tela de **"Congratulations!"**
2. Clique em **"Visit"** ou copie a URL
3. Sua URL será algo como:
   ```
   https://video-platform-abc123.vercel.app
   ```

✅ **Teste agora:** Abra a URL no navegador!

---

## 🔧 PARTE 3: Configurar CORS no Backend (5 minutos)

O backend precisa permitir requisições do frontend em produção.

### 3.1 Atualizar CORS no Railway

1. Vá para o dashboard do Railway
2. Clique no seu serviço de backend
3. Vá para **"Variables"**
4. Adicione uma nova variável:

```env
CORS_ORIGIN=https://seu-frontend.vercel.app
```

**Ou para permitir múltiplas origens:**

```env
CORS_ORIGIN=https://seu-frontend.vercel.app,http://localhost:3000
```

5. Salve e aguarde o redeploy (~30 segundos)

### 3.2 Verificar CORS no código (Opcional)

Se você quiser verificar o código do backend:

```typescript
// backend/src/index.ts
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
}));
```

---

## ✅ PARTE 4: Testar o Site em Produção (5 minutos)

### 4.1 Teste básico

Abra sua URL do Vercel e teste:

1. **Página inicial carrega?** ✅
2. **Vídeos aparecem?** ✅
3. **Consegue fazer login?** ✅
   - Email: demo@videohub.com
   - Senha: password123
4. **Consegue abrir um vídeo?** ✅
5. **Botões funcionam?** ✅
   - Like/Dislike
   - Subscribe
   - Share

### 4.2 Teste completo

**Registro:**
```
1. Clique em "Sign Up"
2. Crie uma conta nova
3. Faça login
```

**Upload:**
```
1. Clique em "Upload"
2. Selecione um vídeo pequeno
3. Preencha título e descrição
4. Faça upload
```

**Perfil:**
```
1. Clique no avatar
2. "Edit Profile"
3. Faça upload de foto
4. Salve
```

**Interações:**
```
1. Abra um vídeo
2. Dê like
3. Inscreva-se no canal
4. Compartilhe
```

---

## 🎨 PARTE 5: Configurar Domínio Personalizado (Opcional)

### 5.1 Adicionar domínio próprio

Se você tem um domínio (ex: meuvideo.com):

1. No dashboard do Vercel, vá para **"Settings"** → **"Domains"**
2. Clique em **"Add"**
3. Digite seu domínio: `meuvideo.com`
4. Siga as instruções para configurar DNS
5. Aguarde propagação (~5-30 minutos)

### 5.2 Configurar DNS

No seu provedor de domínio (GoDaddy, Namecheap, etc):

**Para domínio raiz (meuvideo.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**Para subdomínio (www.meuvideo.com):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## 🔒 PARTE 6: Configurações de Segurança (Opcional)

### 6.1 Variáveis de ambiente sensíveis

No Vercel, vá para **"Settings"** → **"Environment Variables"**

Adicione (se necessário):
```env
NEXT_PUBLIC_SITE_URL=https://seu-site.vercel.app
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX (Google Analytics)
```

### 6.2 Headers de segurança

O Vercel já adiciona headers de segurança automaticamente:
- HTTPS forçado
- HSTS
- X-Frame-Options
- X-Content-Type-Options

---

## 🎉 PASSO 3 COMPLETO!

Você agora tem:
- ✅ Frontend rodando no Vercel
- ✅ Backend rodando no Railway
- ✅ Banco de dados no Neon.tech
- ✅ Site público na internet!
- ✅ HTTPS automático
- ✅ Deploy automático (push → deploy)

**Sua plataforma está ONLINE!** 🚀

---

## 📊 Resumo dos Serviços

| Serviço | Plataforma | URL | Custo |
|---------|-----------|-----|-------|
| Frontend | Vercel | https://seu-site.vercel.app | $0/mês |
| Backend | Railway | https://seu-api.railway.app | $0/mês* |
| Banco | Neon.tech | (interno) | $0/mês |

*Railway oferece $5 de crédito grátis por mês

---

## 🔄 Deploy Automático

Agora, sempre que você fizer push para o GitHub:

```bash
git add .
git commit -m "Nova feature"
git push origin main
```

**O Vercel vai automaticamente:**
1. Detectar o push
2. Fazer build
3. Fazer deploy
4. Atualizar o site (~2 minutos)

**O Railway também faz deploy automático do backend!**

---

## 🐛 Problemas Comuns

### Site não carrega?
- Verifique se o Root Directory está como `frontend`
- Verifique se a variável `NEXT_PUBLIC_API_URL` está correta
- Veja os logs do build no Vercel

### Erro de CORS?
- Adicione a URL do Vercel no `CORS_ORIGIN` do Railway
- Certifique-se que não tem `/` no final da URL

### Vídeos não aparecem?
- Verifique se o backend está rodando (abra a URL do Railway)
- Teste a API: `https://seu-backend.railway.app/api/videos/recent`
- Verifique se o banco tem dados

### Build falhou?
- Veja os logs no Vercel
- Verifique erros de TypeScript
- Certifique-se que `npm run build` funciona localmente

---

## 🚀 Próximos Passos

**Seu site está online!** Agora você pode:

1. **Compartilhar:** Envie o link para amigos
2. **Personalizar:** Mude cores, logo, nome
3. **Adicionar features:** Comentários, playlists, etc.
4. **Monitorar:** Use Vercel Analytics
5. **Otimizar:** Adicione CDN para vídeos

---

## 📱 Compartilhe Seu Site!

Sua plataforma de vídeos está pronta para o mundo! 🌍

**URL do site:** https://seu-site.vercel.app

Compartilhe nas redes sociais:
- Twitter
- LinkedIn
- Facebook
- WhatsApp

---

**Parabéns! Você criou e deployou uma plataforma completa de vídeos!** 🎉🎊

**Custo total:** $0/mês
**Tempo total:** ~30 minutos
**Resultado:** Site profissional online!

---

**Precisa de ajuda?** Me avise se algo não funcionar! 🚀
