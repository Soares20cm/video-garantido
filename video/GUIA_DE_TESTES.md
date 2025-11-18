# 🧪 Guia Completo de Testes - Plataforma de Vídeos

## 📋 Checklist de Testes

Use este guia para testar **TODAS** as funcionalidades da plataforma!

---

## 🚀 PREPARAÇÃO

### 1. Verificar Servidores

**Backend:**
```bash
# Deve estar rodando em http://localhost:4000
# Verifique no terminal se vê: "🚀 Server running on http://localhost:4000"
```

**Frontend:**
```bash
# Deve estar rodando em http://localhost:3000
# Abra: http://localhost:3000
```

**Banco de Dados:**
- ✅ Neon.tech online
- ✅ Connection string configurada
- ✅ Tabelas criadas

---

## ✅ TESTE 1: PÁGINA INICIAL

### O Que Testar:
1. Abra http://localhost:3000
2. Verifique se a página carrega
3. Veja se os 8 vídeos aparecem em grid
4. Verifique se as thumbnails carregam
5. Veja se os títulos aparecem
6. Verifique contadores de views

### ✅ Resultado Esperado:
- [ ] Página carrega em <3 segundos
- [ ] 8 vídeos visíveis
- [ ] Thumbnails carregadas
- [ ] Títulos e descrições visíveis
- [ ] Contadores de views funcionando
- [ ] Header com logo e busca visível

### ❌ Se Falhar:
- Verifique se o backend está rodando
- Verifique se o banco tem dados (rode o seed)
- Veja o console do navegador (F12)

---

## ✅ TESTE 2: AUTENTICAÇÃO

### 2.1 Login

**Passos:**
1. Clique em "Sign In" no header
2. Digite:
   - Email: `demo@videohub.com`
   - Senha: `password123`
3. Clique em "Sign in"

**✅ Resultado Esperado:**
- [ ] Redirecionado para home
- [ ] Avatar aparece no header
- [ ] Botão "Upload" visível
- [ ] Menu do usuário funciona

**❌ Se Falhar:**
- Verifique se o backend está rodando
- Verifique se o seed foi executado
- Veja o console (F12) para erros

### 2.2 Registro

**Passos:**
1. Clique em "Sign Up"
2. Digite um novo email e senha
3. Clique em "Create account"

**✅ Resultado Esperado:**
- [ ] Conta criada com sucesso
- [ ] Login automático
- [ ] Redirecionado para home

---

## ✅ TESTE 3: PLAYER DE VÍDEO

### Passos:
1. Na home, clique em qualquer vídeo
2. Aguarde o player carregar
3. Clique em play
4. Teste os controles (pause, volume, fullscreen)

### ✅ Resultado Esperado:
- [ ] Página do vídeo carrega
- [ ] Player HTML5 aparece
- [ ] Vídeo reproduz
- [ ] Controles funcionam
- [ ] Título e descrição visíveis
- [ ] Informações do canal visíveis

### ❌ Se Falhar:
- Verifique se a URL do vídeo está correta
- Veja se o status do vídeo é "READY"
- Teste com outro vídeo

---

## ✅ TESTE 4: LIKES E DISLIKES

### Passos:
1. Abra um vídeo (precisa estar logado)
2. Clique no botão 👍 (Like)
3. Veja o contador aumentar
4. Clique novamente para remover
5. Clique no botão 👎 (Dislike)
6. Veja o contador aumentar

### ✅ Resultado Esperado:
- [ ] Botão de like fica destacado (cor salmão)
- [ ] Contador aumenta
- [ ] Clicar novamente remove o like
- [ ] Dislike funciona igual
- [ ] Não pode dar like e dislike ao mesmo tempo

### ❌ Se Falhar:
- Verifique se está logado
- Veja o console para erros de API
- Verifique se o backend tem as rotas de like

---

## ✅ TESTE 5: INSCRIÇÕES

### Passos:
1. Abra um vídeo
2. Clique no botão "Subscribe"
3. Veja o botão mudar para "Subscribed"
4. Veja o contador de inscritos aumentar
5. Clique novamente para cancelar

### ✅ Resultado Esperado:
- [ ] Botão muda de cor
- [ ] Texto muda para "Subscribed"
- [ ] Contador aumenta
- [ ] Pode cancelar inscrição

### ❌ Se Falhar:
- Verifique se está logado
- Não pode se inscrever no próprio canal
- Veja o console para erros

---

## ✅ TESTE 6: COMPARTILHAMENTO

### Passos:
1. Abra um vídeo
2. Clique no botão "Share"
3. Veja o menu aparecer
4. Teste cada opção:
   - Facebook
   - Twitter
   - WhatsApp
   - Telegram
   - Copy link

### ✅ Resultado Esperado:
- [ ] Menu abre com 5 opções
- [ ] Cada opção abre em nova janela
- [ ] "Copy link" copia a URL
- [ ] Menu fecha ao clicar fora

---

## ✅ TESTE 7: COMENTÁRIOS

### 7.1 Adicionar Comentário

**Passos:**
1. Abra um vídeo (precisa estar logado)
2. Role até a seção de comentários
3. Digite um comentário
4. Clique em "Comment"

**✅ Resultado Esperado:**
- [ ] Comentário aparece imediatamente
- [ ] Avatar do usuário visível
- [ ] Nome do usuário visível
- [ ] Timestamp ("Today") visível
- [ ] Contador de comentários aumenta

### 7.2 Responder Comentário

**Passos:**
1. Clique em "Reply" em um comentário
2. Digite uma resposta
3. Clique em "Reply"

**✅ Resultado Esperado:**
- [ ] Resposta aparece indentada
- [ ] Resposta vinculada ao comentário pai
- [ ] Pode responder múltiplas vezes

### 7.3 Editar Comentário

**Passos:**
1. Clique em "Edit" no seu comentário
2. Modifique o texto
3. Clique em "Save"

**✅ Resultado Esperado:**
- [ ] Textarea aparece inline
- [ ] Texto pode ser editado
- [ ] Salva com sucesso
- [ ] Aparece "(edited)" ao lado do timestamp

### 7.4 Deletar Comentário

**Passos:**
1. Clique em "Delete" no seu comentário
2. Confirme a exclusão

**✅ Resultado Esperado:**
- [ ] Confirmação aparece
- [ ] Comentário é removido
- [ ] Contador diminui
- [ ] Respostas também são removidas

---

## ✅ TESTE 8: PERFIL DO USUÁRIO

### Passos:
1. Clique no avatar no header
2. Selecione "Edit Profile"
3. Faça upload de uma foto
4. Preencha nome e sobrenome
5. Adicione uma bio
6. Clique em "Save Changes"

### ✅ Resultado Esperado:
- [ ] Página de perfil carrega
- [ ] Upload de foto funciona
- [ ] Preview da foto aparece
- [ ] Campos salvam corretamente
- [ ] Mensagem de sucesso aparece
- [ ] Avatar atualiza no header

---

## ✅ TESTE 9: UPLOAD DE VÍDEO

### Passos:
1. Clique em "Upload" no header
2. Selecione um vídeo pequeno (< 100MB)
3. Preencha título e descrição
4. (Opcional) Faça upload de thumbnail
5. Clique em "Upload Video"

### ✅ Resultado Esperado:
- [ ] Formulário de upload aparece
- [ ] Arquivo é selecionado
- [ ] Barra de progresso aparece
- [ ] Upload completa
- [ ] Vídeo aparece na lista

### ⚠️ Nota:
- Use vídeos pequenos para teste
- Formatos suportados: MP4, MOV, AVI, MKV, WEBM

---

## ✅ TESTE 10: BUSCA

### Passos:
1. Digite algo na barra de busca
2. Pressione Enter
3. Veja os resultados

### ✅ Resultado Esperado:
- [ ] Página de busca carrega
- [ ] Resultados aparecem
- [ ] Busca por título funciona
- [ ] Busca por descrição funciona

---

## ✅ TESTE 11: CANAL

### Passos:
1. Clique no nome de um canal
2. Veja a página do canal
3. Veja os vídeos do canal
4. Teste o botão de inscrição

### ✅ Resultado Esperado:
- [ ] Página do canal carrega
- [ ] Avatar e banner visíveis
- [ ] Descrição visível
- [ ] Vídeos do canal listados
- [ ] Contador de inscritos visível

---

## ✅ TESTE 12: EDIÇÃO DE VÍDEO

### Passos:
1. Abra um vídeo seu
2. Clique em "Edit"
3. Modifique título ou descrição
4. Clique em "Save Changes"

### ✅ Resultado Esperado:
- [ ] Página de edição carrega
- [ ] Campos preenchidos
- [ ] Pode modificar
- [ ] Salva com sucesso

---

## ✅ TESTE 13: RESPONSIVIDADE

### Passos:
1. Abra o DevTools (F12)
2. Ative o modo responsivo
3. Teste em diferentes tamanhos:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1920px)

### ✅ Resultado Esperado:
- [ ] Layout se adapta
- [ ] Menu mobile funciona
- [ ] Grid de vídeos responsivo
- [ ] Player responsivo
- [ ] Botões acessíveis

---

## ✅ TESTE 14: PERFORMANCE

### Passos:
1. Abra o DevTools (F12)
2. Vá para a aba "Network"
3. Recarregue a página
4. Veja os tempos de carregamento

### ✅ Resultado Esperado:
- [ ] Página carrega em <3s
- [ ] Imagens otimizadas
- [ ] Sem erros 404
- [ ] Sem erros de CORS

---

## ✅ TESTE 15: SEGURANÇA

### Passos:
1. Tente acessar rotas protegidas sem login
2. Tente editar vídeo de outro usuário
3. Tente deletar comentário de outro usuário

### ✅ Resultado Esperado:
- [ ] Redirecionado para login
- [ ] Erro 403 (Forbidden)
- [ ] Botões não aparecem para não-donos

---

## 📊 RESUMO DOS TESTES

### Funcionalidades Principais
- [ ] 1. Página inicial
- [ ] 2. Login/Registro
- [ ] 3. Player de vídeo
- [ ] 4. Likes/Dislikes
- [ ] 5. Inscrições
- [ ] 6. Compartilhamento
- [ ] 7. Comentários
- [ ] 8. Perfil
- [ ] 9. Upload
- [ ] 10. Busca
- [ ] 11. Canal
- [ ] 12. Edição
- [ ] 13. Responsividade
- [ ] 14. Performance
- [ ] 15. Segurança

### Estatísticas
- **Total de testes:** 15
- **Testes passados:** ___/15
- **Taxa de sucesso:** ___%

---

## 🐛 PROBLEMAS COMUNS

### 1. Vídeos não aparecem
**Solução:**
```bash
cd backend
npx prisma db seed
```

### 2. Erro de CORS
**Solução:**
- Verifique se o backend está rodando
- Verifique a variável CORS_ORIGIN

### 3. Erro 401 (Unauthorized)
**Solução:**
- Faça login novamente
- Limpe o localStorage
- Verifique o token JWT

### 4. Upload falha
**Solução:**
- Verifique o tamanho do arquivo
- Verifique o formato
- Veja os logs do backend

### 5. Comentários não aparecem
**Solução:**
- Verifique se está logado
- Recarregue a página
- Veja o console para erros

---

## 🔧 FERRAMENTAS DE DEBUG

### Console do Navegador (F12)
```javascript
// Ver token JWT
localStorage.getItem('token')

// Ver usuário
localStorage.getItem('user')

// Limpar storage
localStorage.clear()
```

### Network Tab
- Veja todas as requisições
- Verifique status codes
- Veja payloads e responses

### React DevTools
- Instale a extensão
- Veja o estado dos componentes
- Debug props e state

---

## ✅ CHECKLIST FINAL

Antes de fazer deploy, certifique-se:

### Backend
- [ ] Servidor rodando sem erros
- [ ] Todas as rotas funcionando
- [ ] Banco de dados conectado
- [ ] Migrations aplicadas
- [ ] Seed executado

### Frontend
- [ ] Todas as páginas carregam
- [ ] Sem erros no console
- [ ] Todas as funcionalidades testadas
- [ ] Responsivo em todos os tamanhos
- [ ] Performance aceitável

### Integração
- [ ] Login funciona
- [ ] Upload funciona
- [ ] Comentários funcionam
- [ ] Likes funcionam
- [ ] Inscrições funcionam
- [ ] Compartilhamento funciona

---

## 🎯 PRÓXIMO PASSO

Depois de testar tudo:

1. **Corrija bugs** encontrados
2. **Otimize** o que for necessário
3. **Faça commit** das mudanças
4. **Deploy no Vercel** (Passo 3)

---

## 📝 RELATÓRIO DE TESTES

Use esta seção para anotar problemas:

### Bugs Encontrados:
1. 
2. 
3. 

### Melhorias Necessárias:
1. 
2. 
3. 

### Funcionalidades OK:
1. 
2. 
3. 

---

**Bons testes!** 🧪✨

Qualquer problema, me avise que eu te ajudo a resolver! 🚀
