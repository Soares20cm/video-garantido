# 🎬 Instalação do FFmpeg para Geração Automática de Thumbnails

## Por que instalar o FFmpeg?

Com o FFmpeg instalado, o sistema irá **automaticamente**:
- ✅ Extrair o primeiro frame de cada vídeo enviado
- ✅ Criar uma thumbnail de alta qualidade (1280x720)
- ✅ Salvar a thumbnail junto com o vídeo

**Sem o FFmpeg**: Um placeholder cinza será usado como thumbnail (mas você ainda pode enviar thumbnails personalizadas manualmente).

---

## 🪟 Instalação no Windows

### Opção 1: Chocolatey (Mais Fácil)

Se você tem o Chocolatey instalado:

```powershell
choco install ffmpeg -y
```

### Opção 2: Download Manual

1. **Baixe o FFmpeg**:
   - Acesse: https://www.gyan.dev/ffmpeg/builds/
   - Clique em **"ffmpeg-release-essentials.zip"**
   - Baixe o arquivo

2. **Extraia o arquivo**:
   - Extraia para `C:\ffmpeg`
   - Você deve ter uma pasta `C:\ffmpeg\bin` com os executáveis

3. **Adicione ao PATH**:
   - Pressione `Win + R` e digite: `sysdm.cpl`
   - Vá em **"Avançado"** → **"Variáveis de Ambiente"**
   - Em **"Variáveis do sistema"**, encontre **"Path"** e clique em **"Editar"**
   - Clique em **"Novo"** e adicione: `C:\ffmpeg\bin`
   - Clique em **"OK"** em todas as janelas

4. **Reinicie o terminal** (ou o VS Code)

### Opção 3: Scoop

Se você usa o Scoop:

```powershell
scoop install ffmpeg
```

---

## ✅ Verificar Instalação

Abra um **novo terminal** e execute:

```bash
ffmpeg -version
```

Se aparecer a versão do FFmpeg, está instalado corretamente! 🎉

---

## 🔄 Após Instalar

1. **Reinicie o backend**:
   - Pare o servidor backend (Ctrl+C)
   - Inicie novamente: `npm run dev`

2. **Teste fazendo upload de um vídeo**:
   - A thumbnail será gerada automaticamente do primeiro frame
   - Você verá no console: `🎬 Generating thumbnail from video...`
   - E depois: `✅ Thumbnail generated and uploaded successfully`

---

## 🎨 Thumbnail Personalizada

Mesmo com o FFmpeg instalado, você ainda pode:
- Enviar uma thumbnail personalizada manualmente
- A thumbnail personalizada substituirá a automática

---

## ❓ Problemas?

Se após instalar o FFmpeg ainda não funcionar:

1. **Verifique se está no PATH**:
   ```bash
   where ffmpeg
   ```
   Deve mostrar o caminho do executável

2. **Reinicie o computador** (às vezes necessário no Windows)

3. **Verifique os logs do backend** - deve aparecer:
   - ✅ `FFmpeg is available` (se instalado)
   - ⚠️  `FFmpeg is not installed` (se não instalado)

---

## 📝 Resumo

| Status | Thumbnail Automática | Thumbnail Manual |
|--------|---------------------|------------------|
| **Com FFmpeg** | ✅ Sim (primeiro frame) | ✅ Sim |
| **Sem FFmpeg** | ❌ Não (usa placeholder) | ✅ Sim |

**Recomendação**: Instale o FFmpeg para melhor experiência! 🚀
