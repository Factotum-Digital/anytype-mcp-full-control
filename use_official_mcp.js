const { spawn } = require('child_process');
const axios = require('axios');

// Iniciar MCP oficial
const mcp = spawn('npx', ['-y', '@anyproto/anytype-mcp'], {
  env: {
    ...process.env,
    OPENAPI_MCP_HEADERS: JSON.stringify({
      "Authorization": "Bearer Dz0Adot2t7O7EStoyQBCHfQvZXZtpiotKZ+UBuh32Sk=",
      "Anytype-Version": "2025-05-20"
    })
  },
  stdio: 'pipe'
});

mcp.stdout.on('data', (data) => {
  console.log('MCP:', data.toString());
});

mcp.stderr.on('data', (data) => {
  console.log('MCP Error:', data.toString());
});

// Esperar a que MCP inicie y luego hacer una petición
setTimeout(async () => {
  try {
    console.log('Intentando usar MCP para listar espacios...');
    
    // El MCP oficial debería tener endpoints que funcionan
    const response = await axios.post('http://localhost:31009/wallet/query', {
      type: 'object',
      query: { filters: [] }
    }, {
      headers: {
        'Authorization': 'Bearer Dz0Adot2t7O7EStoyQBCHfQvZXZtpiotKZ+UBuh32Sk=',
        'Anytype-Version': '2025-05-20',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Respuesta:', response.data);
  } catch (error) {
    console.error('❌ Error:', error.response?.status || error.message);
  }
  
  mcp.kill();
}, 3000);
