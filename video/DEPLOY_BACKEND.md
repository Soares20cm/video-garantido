# 🚀 Deploy do Backend no Railway

## Opção 1: Via Dashboard (Recomendado)

### Passo 1: Acesse o Railway
1. Vá para: https://railway.app/
2. Faça login com GitHub

### Passo 2: Criar Novo Projeto
1. Clique em **"New Project"**
2. Selecione **"Deploy from GitHub repo"**
3. Escolha o repositório do seu projeto
4. Selecione a pasta **`video/backend`** como root directory

### Passo 3: Configurar Variáveis de Ambiente
No Railway Dashboard, adicione estas variáveis:

```env
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=seu-secret-super-seguro-aqui
NODE_ENV=production
PORT=4000
```

**Opcional** (se usar AWS S3):
```env
AWS_ACCESS_KEY_ID=sua-key
AWS_SECRET_ACCESS_KEY=seu-secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=seu-bucket
```

### Passo 4: Deploy
1. O Railway detectará automaticamente o `Dockerfile`
2. Fará o build (incluindo FFmpeg)
3. Executará as migrations do Prisma
4. Iniciará o servidor

### Passo 5: Obter URL
1. Após o deploy, vá em **Settings** → **Networking**
2. Clique em **Generate Domain**
3. Copie a URL (ex: `https://seu-app.railway.app`)

### Passo 6: Atualizar Frontend
No Vercel, atualize a variável de ambiente:
```env
NEXT_PUBLIC_API_URL=https://seu-app.railway.app
```

---

## Opção 2: Via Railway CLI

### Instalar Railway CLI

**Windows (PowerShell)**:
```powershell
iwr https://railway.app/install.ps1 | iex
```

**Ou via npm**:
```bash
npm install -g @railway/cli
```

### Fazer Login
```bash
railway login
```

### Deploy
```bash
cd video/backend
railway up
```

### Configurar Variáveis
```bash
railway variables set DATABASE_URL="postgresql://..."
railway variables set JWT_SECRET="seu-secret"
railway variables set NODE_ENV="production"
```

### Obter URL
```bash
railway domain
```

---

## ✅ Verificar Deploy

Após o deploy, teste:

```bash
curl https://seu-app.railway.app/health
```

Deve retornar:
```json
{
  "status": "ok",
  "timestamp": "...",
  "database": "connected"
}
```

---

## 🎬 FFmpeg no Railway

O Dockerfile já inclui FFmpeg:
```dockerfile
RUN apk add --no-cache ffmpeg
```

Isso significa que a geração automática de thumbnails funcionará em produção! ✅

---

## 🔄 Redeploy Automático

O Railway faz redeploy automático quando você faz push para o GitHub:

```bash
git add .
git commit -m "update backend"
git push
```

O Railway detecta e faz deploy automaticamente! 🚀

---

## 📊 Monitoramento

No Railway Dashboard você pode ver:
- 📈 Logs em tempo real
- 💾 Uso de memória/CPU
- 🌐 Tráfego de rede
- ⚡ Status do serviço

---

## ❓ Problemas Comuns

### Build falha
- Verifique se o `DATABASE_URL` está correto
- Verifique os logs no Railway Dashboard

### Migrations falham
- Certifique-se que o banco PostgreSQL está acessível
- Verifique se o `DATABASE_URL` tem permissões corretas

### FFmpeg não funciona
- O Dockerfile já instala o FFmpeg
- Se falhar, verifique os logs: `railway logs`

---

## 🎯 Checklist Final

- [ ] Backend deployado no Railway
- [ ] Variáveis de ambiente configuradas
- [ ] URL pública gerada
- [ ] Health check funcionando
- [ ] Frontend atualizado com nova URL
- [ ] Teste de upload de vídeo
- [ ] Thumbnail automática funcionando

**Pronto! Seu backend está em produção! 🎉**
