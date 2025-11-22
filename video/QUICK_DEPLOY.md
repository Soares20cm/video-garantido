# ⚡ Deploy Rápido - 5 Minutos

## 🎯 Backend (Railway)

1. **Acesse**: https://railway.app/new
2. **Conecte** seu repositório GitHub
3. **Selecione** a pasta `video/backend`
4. **Adicione** variáveis de ambiente:
   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=seu-secret-aqui
   NODE_ENV=production
   ```
5. **Deploy** automático! ✅
6. **Copie** a URL gerada (ex: `https://seu-app.railway.app`)

## 🌐 Frontend (Vercel)

1. **Acesse**: https://vercel.com/
2. **Vá em** Settings → Environment Variables
3. **Atualize**:
   ```
   NEXT_PUBLIC_API_URL=https://seu-app.railway.app
   ```
4. **Redeploy** o frontend

## ✅ Pronto!

Seu app está no ar! 🚀

- Frontend: `https://seu-app.vercel.app`
- Backend: `https://seu-app.railway.app`

## 🧪 Teste

```bash
# Teste o backend
curl https://seu-app.railway.app/health

# Acesse o frontend
https://seu-app.vercel.app
```

---

**Nota**: O FFmpeg já está incluído no Dockerfile, então as thumbnails automáticas funcionarão em produção! 🎬
