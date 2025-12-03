const axios = require('axios');
const fs = require('fs');

const API_KEY = 'Bearer Dz0Adot2t7O7EStoyQBCHfQvZXZtpiotKZ+UBuh32Sk=';
const BASE_URL = 'http://localhost:31009';

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': API_KEY,
    'Anytype-Version': '2025-05-20',
    'Content-Type': 'application/json'
  }
});

// 1. Investigar endpoints posibles
const possibleEndpoints = [
  // GraphQL
  '/graphql',
  '/api/graphql',
  '/v1/graphql',
  
  // REST endpoints comunes
  '/api/v1',
  '/api',
  '/v1',
  '/rest',
  '/rpc',
  
  // Anytype específicos
  '/wallet',
  '/space',
  '/spaces',
  '/object',
  '/objects',
  '/type',
  '/types',
  '/relation',
  '/relations',
  
  // Métodos RPC
  '/rpc/query',
  '/rpc/search',
  '/rpc/list',
  '/method/query',
  '/method/search',
  
  // Query endpoints
  '/query',
  '/search',
  '/list',
  '/explore'
];

async function discoverEndpoints() {
  console.log('🔍 Investigando endpoints de Anytype...\n');
  
  const workingEndpoints = [];
  
  for (const endpoint of possibleEndpoints) {
    try {
      // Probar GET
      try {
        await client.get(endpoint);
        workingEndpoints.push({ endpoint, method: 'GET', status: '✅' });
        console.log(`✅ GET ${endpoint} - Funciona`);
        continue;
      } catch (e) {}
      
      // Probar POST con query vacía
      try {
        await client.post(endpoint, { query: {} });
        workingEndpoints.push({ endpoint, method: 'POST', status: '✅' });
        console.log(`✅ POST ${endpoint} - Funciona`);
        continue;
      } catch (e) {}
      
      // Probar POST con estructura de Anytype
      try {
        await client.post(endpoint, {
          type: 'object',
          query: { filters: [] }
        });
        workingEndpoints.push({ endpoint, method: 'POST', status: '✅' });
        console.log(`✅ POST ${endpoint} - Funciona (query object)`);
        continue;
      } catch (e) {}
      
      console.log(`❌ ${endpoint} - No funciona`);
      
    } catch (error) {
      // Ignorar errores esperados
    }
  }
  
  return workingEndpoints;
}

// 2. Buscar base de datos de Anytype
async function findAnytypeDatabase() {
  console.log('\n🗂️ Buscando base de datos de Anytype...\n');
  
  const possiblePaths = [
    '/Users/wilfredy/Library/Application Support/anytype',
    '/Users/wilfredy/.anytype',
    '/Applications/Anytype.app/Contents/Resources',
    process.env.HOME + '/Library/Application Support/anytype'
  ];
  
  for (const path of possiblePaths) {
    try {
      if (fs.existsSync(path)) {
        console.log(`✅ Encontrado: ${path}`);
        
        // Listar archivos importantes
        const files = fs.readdirSync(path, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory() || dirent.name.endsWith('.db') || dirent.name.endsWith('.sqlite'))
          .map(dirent => dirent.name);
          
        if (files.length > 0) {
          console.log(`   Archivos: ${files.join(', ')}`);
        }
      }
    } catch (error) {
      // Ignorar permisos denegados
    }
  }
}

// 3. Revisar documentación y logs
async function checkDocumentation() {
  console.log('\n📚 Revisando documentación y logs...\n');
  
  // Buscar logs de Anytype
  const logPaths = [
    '/Users/wilfredy/Library/Logs/anytype',
    process.env.HOME + '/Library/Logs/anytype'
  ];
  
  for (const logPath of logPaths) {
    try {
      if (fs.existsSync(logPath)) {
        console.log(`✅ Logs encontrados: ${logPath}`);
        const logFiles = fs.readdirSync(logPath).filter(f => f.endsWith('.log'));
        console.log(`   Archivos de log: ${logFiles.join(', ')}`);
        
        // Buscar pistas en el log más reciente
        if (logFiles.length > 0) {
          const latestLog = logPath + '/' + logFiles[logFiles.length - 1];
          try {
            const logContent = fs.readFileSync(latestLog, 'utf8');
            const apiMatches = logContent.match(/\/api\/[a-zA-Z\/]+|\/[a-zA-Z\/]+/g);
            if (apiMatches) {
              console.log(`   Posibles endpoints en logs: ${[...new Set(apiMatches)].slice(0, 5).join(', ')}`);
            }
          } catch (e) {}
        }
      }
    } catch (error) {
      // Ignorar errores
    }
  }
}

async function main() {
  try {
    const endpoints = await discoverEndpoints();
    await findAnytypeDatabase();
    await checkDocumentation();
    
    console.log('\n🎯 RESUMEN:');
    console.log(`Endpoints encontrados: ${endpoints.length}`);
    endpoints.forEach(e => console.log(`  ${e.method} ${e.endpoint}`));
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
