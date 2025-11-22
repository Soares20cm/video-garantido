# FFmpeg Setup Guide

Para gerar thumbnails automaticamente dos vídeos, você precisa instalar o FFmpeg no seu sistema.

## Windows

### Opção 1: Usando Chocolatey (Recomendado)
```bash
choco install ffmpeg
```

### Opção 2: Download Manual
1. Baixe o FFmpeg em: https://www.gyan.dev/ffmpeg/builds/
2. Escolha "ffmpeg-release-essentials.zip"
3. Extraia o arquivo
4. Adicione a pasta `bin` ao PATH do Windows:
   - Abra "Variáveis de Ambiente"
   - Edite a variável "Path"
   - Adicione o caminho para a pasta `bin` do FFmpeg (ex: `C:\ffmpeg\bin`)
5. Reinicie o terminal

### Opção 3: Usando Scoop
```bash
scoop install ffmpeg
```

## Verificar Instalação

Após instalar, verifique se funcionou:
```bash
ffmpeg -version
```

## Como Funciona

Quando o FFmpeg estiver instalado:
- ✅ Thumbnails serão geradas automaticamente do primeiro frame do vídeo
- ✅ Thumbnails personalizadas podem ser enviadas manualmente

Quando o FFmpeg NÃO estiver instalado:
- ⚠️  Um placeholder SVG será usado como thumbnail
- ✅ Thumbnails personalizadas ainda podem ser enviadas manualmente
