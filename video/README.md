# 🎥 VideoHub - Plataforma de Vídeos

Uma plataforma completa de compartilhamento de vídeos construída com Next.js, Node.js, PostgreSQL e TypeScript.

![Status](https://img.shields.io/badge/status-online-success)
![License](https://img.shields.io/badge/license-MIT-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Node.js](https://img.shields.io/badge/Node.js-20-green)

## ✨ Funcionalidades

### 🎬 Vídeos
- Upload de vídeos (MP4, MOV, AVI, MKV, WEBM)
- Player HTML5 com controles nativos
- Thumbnails automáticas
- Processamento de vídeo
- Busca de vídeos
- Contador de visualizações

### 👤 Usuários & Canais
- Registro e login com JWT
- Perfil personalizável (foto, nome, bio)
- Criação de canais
- Avatar e banner do canal
- Gerenciamento de vídeos

### 💬 Interações
- 👍 Like e 👎 Dislike em vídeos
- 🔔 Sistema de inscrições
- 📤 Compartilhamento (Facebook, Twitter, WhatsApp, Telegram)
- 📊 Contadores em tempo real

### 🎨 Design
- Interface moderna com cor salmão
- Design responsivo (mobile, tablet, desktop)
- Animações suaves
- Dark mode ready

## 🚀 Deploy

### Produção
- **Frontend:** Vercel
- **Backend:** Railway
- **Banco de Dados:** Neon.tech (PostgreSQL)
- **Storage:** Local / AWS S3 / Cloudflare R2

### Custo
- **$0/mês** no tier gratuito
- Escalável conforme necessário

## 🛠️ Tecnologias

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS
- **Estado:** React Context API
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js 20
- **Framework:** Express.js
- **Linguagem:** TypeScript
- **ORM:** Prisma
- **Autenticação:** JWT + bcrypt
- **Upload:** Multer
- **Processamento:** FFmpeg

### Banco de Dados
- **Database:** PostgreSQL 15
- **ORM:** Prisma
- **Migrations:** Prisma Migrate
- **Hosting:** Neon.tech

### DevOps
- **CI/CD:** GitHub Actions (automático)
- **Frontend Deploy:** Vercel
- **Backend Deploy:** Railway
- **Containerização:** Docker

## 📦 Instalação Local

### Pré-requisitos
- Node.js 20+
- PostgreSQL 15+
- npm ou yarn

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/video-platform.git
cd video-platform
```

### 2. Instale as dependências

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 3. Configure as variáveis de ambiente

**Backend (.env):**
```env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://user:password@localhost:5432/videodb
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 4. Configure o banco de dados

```bash
cd backend
npx prisma migrate dev
npx prisma db seed
```

### 5. Inicie os servidores

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### 6. Acesse a aplicação

- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- Prisma Studio: `npx prisma studio`

### 7. Login de demonstração

```
Email: demo@videohub.com
Senha: password123
```

## 📁 Estrutura do Projeto

```
video-platform/
├── backend/
│   ├── src/
│   │   ├── config/          # Configurações
│   │   ├── controllers/     # Controllers
│   │   ├── middleware/      # Middlewares
│   │   ├── routes/          # Rotas da API
│   │   ├── services/        # Lógica de negócio
│   │   ├── types/           # Tipos TypeScript
│   │   └── utils/           # Utilitários
│   ├── prisma/
│   │   ├── schema.prisma    # Schema do banco
│   │   └── seed.ts          # Dados iniciais
│   └── package.json
├── frontend/
│   ├── app/                 # Pages (App Router)
│   ├── components/          # Componentes React
│   ├── contexts/            # Context API
│   ├── lib/                 # Bibliotecas
│   ├── types/               # Tipos TypeScript
│   └── package.json
├── docker-compose.yml       # Docker setup
└── README.md
```

## 🔌 API Endpoints

### Autenticação
```
POST   /api/auth/register       # Registrar usuário
POST   /api/auth/login          # Login
GET    /api/auth/me             # Usuário atual
GET    /api/auth/profile        # Ver perfil
PUT    /api/auth/profile        # Atualizar perfil
```

### Vídeos
```
GET    /api/videos/recent       # Vídeos recentes
GET    /api/videos/search       # Buscar vídeos
GET    /api/videos/:id          # Detalhes do vídeo
POST   /api/videos              # Upload de vídeo
PUT    /api/videos/:id          # Atualizar vídeo
DELETE /api/videos/:id          # Deletar vídeo
POST   /api/videos/:id/view     # Registrar visualização
POST   /api/videos/:id/like     # Dar like
POST   /api/videos/:id/dislike  # Dar dislike
GET    /api/videos/:id/like-status  # Status do like
```

### Canais
```
GET    /api/channels/:id        # Detalhes do canal
POST   /api/channels            # Criar canal
PUT    /api/channels/:id        # Atualizar canal
POST   /api/channels/:id/subscribe      # Inscrever
DELETE /api/channels/:id/subscribe      # Cancelar inscrição
GET    /api/channels/:id/subscription-status  # Status
```

## 🎨 Personalização

### Cores
Edite `frontend/tailwind.config.ts`:
```typescript
colors: {
  salmon: {
    50: '#fff5f3',
    500: '#ff7a5c',
    600: '#fa6347',
  }
}
```

### Logo
Substitua o SVG em `frontend/components/Header.tsx`

### Nome da plataforma
Busque e substitua "VideoHub" em todo o projeto

## 🧪 Testes

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 📈 Monitoramento

### Vercel Analytics
Adicione no `frontend/app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Logs
- **Vercel:** Dashboard → Logs
- **Railway:** Dashboard → Deployments → Logs
- **Neon:** Dashboard → Monitoring

## 🔒 Segurança

- ✅ Senhas hasheadas com bcrypt (cost 12)
- ✅ JWT para autenticação
- ✅ CORS configurado
- ✅ Helmet.js para headers de segurança
- ✅ Rate limiting
- ✅ Validação de inputs
- ✅ SQL injection protection (Prisma)
- ✅ XSS protection

## 🚀 Performance

- ✅ Next.js SSR e SSG
- ✅ Image optimization
- ✅ Code splitting automático
- ✅ Compression (gzip)
- ✅ CDN (Vercel Edge Network)
- ✅ Database connection pooling

## 📝 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes

## 👥 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📞 Suporte

- **Issues:** [GitHub Issues](https://github.com/seu-usuario/video-platform/issues)
- **Email:** seu-email@example.com
- **Discord:** [Link do servidor]

## 🎯 Roadmap

### Em Desenvolvimento
- [ ] Comentários em vídeos
- [ ] Playlists
- [ ] Notificações
- [ ] Chat ao vivo
- [ ] Monetização

### Futuro
- [ ] App mobile (React Native)
- [ ] Transmissão ao vivo
- [ ] Shorts (vídeos curtos)
- [ ] Sistema de recomendação com IA
- [ ] Legendas automáticas

## 🌟 Agradecimentos

- Next.js team
- Vercel
- Railway
- Neon.tech
- Prisma
- Comunidade open source

## 📊 Status do Projeto

- ✅ MVP completo
- ✅ Deploy em produção
- ✅ Documentação completa
- 🚧 Testes em andamento
- 🚧 Melhorias de performance

---

**Feito com ❤️ e ☕**

⭐ Se este projeto te ajudou, considere dar uma estrela!

[Demo](https://seu-site.vercel.app) • [Documentação](./docs) • [Changelog](./CHANGELOG.md)
