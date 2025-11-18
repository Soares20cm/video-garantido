# 🔧 Debug Helper - Resolva Problemas Rapidamente

## 🚨 PROBLEMAS COMUNS E SOLUÇÕES

---

## ❌ PROBLEMA 1: Página Inicial Não Carrega Vídeos

### Sintomas:
- Página carrega mas não mostra vídeos
- Spinner infinito
- Mensagem "No videos yet"

### Diagnóstico:
```bash
# 1. Verifique se o backend está rodando
# Abra: http://localhost:4000/health
# Deve retornar: {"status":"ok"}

# 2. Verifique se o banco tem dados
# Abra: http://localhost:4000/api/videos/recent
# Deve retornar lista de vídeos
```

### Solução:
```bash
# Se não tem vídeos, rode o seed:
cd backend
npx prisma db seed

# Reinicie o backend
# Ctrl+C no terminal do backend
npm run dev
```

---

## ❌ PROBLEMA 2: Erro ao Fazer Login

### Sintomas:
- "Invalid email or password"
- Erro 401
- Não redireciona após login

### Diagnóstico:
```bash
# Teste a API diretamente:
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@videohub.com","password":"password123"}'
```

### Solução A: Usuário não existe
```bash
cd backend
npx prisma db seed
```

### Solução B: Senha incorreta
```
Use: demo@videohub.com / password123
```

### Solução C: Backend não está rodando
```bash
cd backend
npm run dev
```

---

## ❌ PROBLEMA 3: Comentários Não Aparecem

### Sintomas:
- Seção de comentários vazia
- Erro ao postar comentário
- Comentário não aparece após postar

### Diagnóstico:
```javascript
// Abra o console (F12) e execute:
fetch('http://localhost:4000/api/videos/VIDEO_ID/comments')
  .then(r => r.json())
  .then(console.log)
```

### Solução A: Rota não existe
```bash
# Verifique se o arquivo existe:
# backend/src/controllers/comment.controller.ts
# backend/src/routes/comment.routes.ts

# Se não existir, me avise!
```

### Solução B: Erro de CORS
```bash
# Adicione no backend/.env:
CORS_ORIGIN=http://localhost:3000
```

### Solução C: Não está logado
```
1. Faça login primeiro
2. Tente comentar novamente
```

---

## ❌ PROBLEMA 4: Likes Não Funcionam

### Sintomas:
- Botão de like não responde
- Contador não aumenta
- Erro 401 ou 403

### Diagnóstico:
```javascript
// Console (F12):
localStorage.getItem('token')
// Se retornar null, você não está logado
```

### Solução:
```
1. Faça login
2. Recarregue a página
3. Tente dar like novamente
```

---

## ❌ PROBLEMA 5: Upload de Vídeo Falha

### Sintomas:
- Erro ao fazer upload
- Barra de progresso trava
- Timeout

### Diagnóstico:
```bash
# Verifique o tamanho do arquivo
# Limite: 5GB

# Verifique o formato
# Suportados: MP4, MOV, AVI, MKV, WEBM
```

### Solução:
```
1. Use vídeo menor (< 100MB para teste)
2. Converta para MP4 se necessário
3. Verifique se está logado
```

---

## ❌ PROBLEMA 6: Erro de CORS

### Sintomas:
- "CORS policy blocked"
- "Access-Control-Allow-Origin"
- Requisições falham

### Diagnóstico:
```javascript
// Console (F12):
// Veja se há erros de CORS
```

### Solução:
```bash
# 1. Adicione no backend/.env:
CORS_ORIGIN=http://localhost:3000,http://localhost:4000

# 2. Reinicie o backend
```

---

## ❌ PROBLEMA 7: Erro 500 (Internal Server Error)

### Sintomas:
- Erro 500 em qualquer requisição
- Backend crashou
- Logs de erro no terminal

### Diagnóstico:
```bash
# Veja os logs do backend no terminal
# Procure por stack traces
```

### Solução:
```bash
# 1. Reinicie o backend
cd backend
npm run dev

# 2. Se persistir, veja os logs
# 3. Me envie o erro completo
```

---

## ❌ PROBLEMA 8: Frontend Não Conecta ao Backend

### Sintomas:
- Todas as requisições falham
- "Network Error"
- "Failed to fetch"

### Diagnóstico:
```bash
# 1. Verifique se o backend está rodando
curl http://localhost:4000/health

# 2. Verifique a variável de ambiente
# frontend/.env.local deve ter:
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Solução:
```bash
# 1. Crie frontend/.env.local:
echo "NEXT_PUBLIC_API_URL=http://localhost:4000" > frontend/.env.local

# 2. Reinicie o frontend
cd frontend
npm run dev
```

---

## ❌ PROBLEMA 9: Banco de Dados Desconectado

### Sintomas:
- "Database connection failed"
- Erro ao iniciar backend
- Timeout ao conectar

### Diagnóstico:
```bash
# Teste a connection string:
cd backend
npx prisma db push
```

### Solução:
```bash
# 1. Verifique backend/.env
# DATABASE_URL deve estar correto

# 2. Teste a conexão:
npx prisma studio
# Se abrir, o banco está OK
```

---

## ❌ PROBLEMA 10: Erro de TypeScript

### Sintomas:
- Erros de tipo no console
- Build falha
- "Property does not exist"

### Diagnóstico:
```bash
# Veja os erros:
cd frontend
npm run build
```

### Solução:
```bash
# 1. Limpe e reinstale:
rm -rf node_modules
rm package-lock.json
npm install

# 2. Se persistir, me envie o erro
```

---

## 🔍 FERRAMENTAS DE DEBUG

### 1. Console do Navegador (F12)

```javascript
// Ver token JWT
localStorage.getItem('token')

// Ver usuário logado
JSON.parse(localStorage.getItem('user') || '{}')

// Limpar tudo
localStorage.clear()
location.reload()

// Testar API manualmente
fetch('http://localhost:4000/api/videos/recent')
  .then(r => r.json())
  .then(console.log)
```

### 2. Network Tab (F12)

```
1. Abra DevTools (F12)
2. Vá para "Network"
3. Recarregue a página
4. Veja todas as requisições
5. Clique em uma para ver detalhes
```

### 3. Logs do Backend

```bash
# Terminal do backend mostra:
- Requisições recebidas
- Erros de banco
- Stack traces
- Status codes
```

### 4. Prisma Studio

```bash
cd backend
npx prisma studio
# Abre em http://localhost:5555
# Veja e edite dados do banco
```

---

## 🧪 SCRIPTS DE TESTE

### Teste Rápido da API

```bash
# Health check
curl http://localhost:4000/health

# Listar vídeos
curl http://localhost:4000/api/videos/recent

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@videohub.com","password":"password123"}'
```

### Reset Completo

```bash
# 1. Pare tudo (Ctrl+C nos terminais)

# 2. Limpe o banco
cd backend
npx prisma migrate reset --force

# 3. Rode o seed
npx prisma db seed

# 4. Reinicie backend
npm run dev

# 5. Reinicie frontend
cd ../frontend
npm run dev
```

---

## 📊 CHECKLIST DE DEBUG

Quando algo não funciona:

- [ ] Backend está rodando?
- [ ] Frontend está rodando?
- [ ] Banco está conectado?
- [ ] Estou logado?
- [ ] Token JWT é válido?
- [ ] CORS está configurado?
- [ ] Variáveis de ambiente corretas?
- [ ] Dados existem no banco?
- [ ] Console tem erros?
- [ ] Network tab mostra erros?

---

## 🆘 AINDA COM PROBLEMAS?

### Me envie estas informações:

1. **Qual erro está acontecendo?**
   - Descreva o problema

2. **Console do navegador (F12)**
   - Copie os erros em vermelho

3. **Logs do backend**
   - Copie do terminal

4. **Network tab**
   - Status code da requisição
   - Response da API

5. **O que você estava fazendo?**
   - Passo a passo

---

## 🔧 COMANDOS ÚTEIS

### Reiniciar Tudo
```bash
# Backend
cd backend
npm run dev

# Frontend (novo terminal)
cd frontend
npm run dev
```

### Ver Dados do Banco
```bash
cd backend
npx prisma studio
```

### Recriar Banco
```bash
cd backend
npx prisma db push
npx prisma db seed
```

### Limpar Cache
```bash
# Frontend
cd frontend
rm -rf .next
npm run dev

# Backend
cd backend
rm -rf dist
npm run dev
```

---

## ✅ TUDO FUNCIONANDO?

Se resolveu o problema:
1. ✅ Marque como resolvido
2. 🧪 Continue testando
3. 🚀 Próximo: Deploy!

Se ainda tem problema:
1. 📝 Anote o erro
2. 🔍 Use as ferramentas acima
3. 💬 Me envie os detalhes

---

**Estou aqui para ajudar!** 🚀

Me diga qual erro você está enfrentando! 😊
