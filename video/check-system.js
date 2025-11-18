// Script de Diagnóstico Automático
// Execute: node check-system.js

const http = require('http');

console.log('🔍 Iniciando diagnóstico do sistema...\n');

// Cores para o terminal
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m'
};

const checks = [];

// Função para fazer requisição HTTP
function checkEndpoint(url, name) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`${colors.green}✅ ${name}: OK${colors.reset}`);
          checks.push({ name, status: 'OK', code: res.statusCode });
        } else {
          console.log(`${colors.yellow}⚠️  ${name}: Status ${res.statusCode}${colors.reset}`);
          checks.push({ name, status: 'WARNING', code: res.statusCode });
        }
        resolve();
      });
    });

    req.on('error', (err) => {
      console.log(`${colors.red}❌ ${name}: FALHOU${colors.reset}`);
      console.log(`   Erro: ${err.message}`);
      checks.push({ name, status: 'FAILED', error: err.message });
      resolve();
    });

    req.on('timeout', () => {
      req.destroy();
      console.log(`${colors.red}❌ ${name}: TIMEOUT${colors.reset}`);
      checks.push({ name, status: 'TIMEOUT' });
      resolve();
    });

    req.end();
  });
}

// Executar todos os checks
async function runDiagnostics() {
  console.log('📡 Verificando servidores...\n');

  await checkEndpoint('http://localhost:4000/health', 'Backend Health');
  await checkEndpoint('http://localhost:4000/api/videos/recent', 'API Videos');
  await checkEndpoint('http://localhost:3000', 'Frontend');

  console.log('\n📊 Resumo do Diagnóstico:\n');

  const ok = checks.filter(c => c.status === 'OK').length;
  const failed = checks.filter(c => c.status === 'FAILED' || c.status === 'TIMEOUT').length;
  const warnings = checks.filter(c => c.status === 'WARNING').length;

  console.log(`✅ Funcionando: ${ok}`);
  console.log(`❌ Com problemas: ${failed}`);
  console.log(`⚠️  Avisos: ${warnings}`);

  console.log('\n💡 Recomendações:\n');

  if (failed > 0) {
    console.log('❌ Alguns serviços não estão respondendo:');
    checks.filter(c => c.status === 'FAILED' || c.status === 'TIMEOUT').forEach(c => {
      console.log(`   - ${c.name}`);
      if (c.name.includes('Backend')) {
        console.log('     Solução: cd backend && npm run dev');
      }
      if (c.name.includes('Frontend')) {
        console.log('     Solução: cd frontend && npm run dev');
      }
    });
  } else if (ok === checks.length) {
    console.log('🎉 Tudo funcionando perfeitamente!');
    console.log('   Você pode começar a testar: http://localhost:3000');
  }

  console.log('\n✨ Diagnóstico completo!\n');
}

runDiagnostics();
