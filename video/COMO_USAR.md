# 🎥 Como Usar a Plataforma de Vídeos

## 🚀 Servidores Rodando

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:4000

## 👤 Conta de Demonstração

Use estas credenciais para fazer login:

- **Email:** `demo@videohub.com`
- **Senha:** `password123`

## 📺 Como Ver Vídeos

### Opção 1: Página Inicial (Sem Login)
1. Abra http://localhost:3000
2. Você verá 8 vídeos na página inicial
3. Clique em qualquer vídeo para assistir
4. O player abrirá automaticamente

### Opção 2: Após Login
1. Clique em "Sign In" no canto superior direito
2. Use as credenciais acima
3. Navegue pelos vídeos
4. Clique para assistir

## 🎬 Vídeos Disponíveis

1. **Introduction to React Hooks** - 15.4K views
2. **Building a REST API with Node.js** - 8.9K views
3. **CSS Grid Layout** - 12.5K views
4. **TypeScript for Beginners** - 23.8K views
5. **Docker Crash Course** - 19.2K views
6. **Git and GitHub for Beginners** - 31.2K views
7. **Next.js 14 - Build Full-Stack Apps** - 17.8K views
8. **PostgreSQL Database Design** - 9.8K views

## 📤 Como Fazer Upload de Vídeo

1. **Faça login** com a conta demo
2. Clique no botão **"Upload"** no header
3. Selecione um arquivo de vídeo (MP4, MOV, AVI, etc.)
4. Preencha:
   - Título do vídeo
   - Descrição
   - Thumbnail (opcional)
5. Clique em **"Upload Video"**
6. Aguarde o upload completar

## 👥 Como Ver Seu Canal

1. **Faça login**
2. Clique no **avatar** (círculo com inicial) no canto superior direito
3. Selecione **"My Channel"**
4. Você verá todos os vídeos do canal "Tech Tutorials"

## 🔍 Como Buscar Vídeos

1. Use a **barra de busca** no topo da página
2. Digite o que procura (ex: "React", "Node", "CSS")
3. Pressione Enter
4. Veja os resultados

## ⚙️ Como Editar Canal

1. **Faça login**
2. Clique no **avatar** → **"Settings"**
3. Edite:
   - Nome do canal
   - Descrição
   - Avatar (upload de imagem)
4. Clique em **"Save Changes"**

## 🎨 Recursos da Interface

- **Cor Salmão:** Tema principal da plataforma
- **Design Responsivo:** Funciona em desktop, tablet e mobile
- **Player HTML5:** Controles nativos de vídeo
- **Grid de Vídeos:** Layout moderno e limpo
- **Contadores:** Views, data de publicação

## 🛠️ Comandos Úteis

### Parar os Servidores
```bash
# No terminal onde estão rodando, pressione Ctrl+C
```

### Reiniciar Backend
```bash
cd backend
npm run dev
```

### Reiniciar Frontend
```bash
cd frontend
npm run dev
```

### Ver Banco de Dados (Prisma Studio)
```bash
cd backend
npx prisma studio
```
Abre em: http://localhost:5555

### Adicionar Mais Dados
```bash
cd backend
npm run prisma:seed
```

## 🐛 Problemas Comuns

### Vídeo não carrega?
- Verifique se o backend está rodando (http://localhost:4000)
- Verifique o console do navegador (F12)
- Certifique-se que o vídeo tem status "READY"

### Não consigo fazer login?
- Verifique as credenciais: `demo@videohub.com` / `password123`
- Limpe o cache do navegador
- Verifique se o backend está conectado ao banco

### Upload não funciona?
- Verifique o tamanho do arquivo (limite: 5GB)
- Formatos suportados: MP4, MOV, AVI, MKV, WEBM
- Certifique-se que está logado

## 📊 Estrutura do Banco de Dados

- **1 Usuário:** demo@videohub.com
- **1 Canal:** Tech Tutorials
- **8 Vídeos:** Prontos para assistir

## 🎯 Próximos Passos

1. ✅ Explore a plataforma localmente
2. ✅ Teste upload de vídeos
3. ✅ Personalize seu canal
4. 🚀 Faça deploy seguindo o guia DEPLOY_NOW.md

## 💡 Dicas

- Os vídeos de exemplo usam URLs públicas do Google Cloud
- Você pode adicionar seus próprios vídeos via upload
- O sistema suporta storage local, AWS S3 ou Cloudflare R2
- Redis é opcional (usado para cache)

---

**Divirta-se explorando sua plataforma de vídeos!** 🎉
