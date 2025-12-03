const axios = require('axios');

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

async function checkSpaces() {
  try {
    console.log('Verificando espacios en Anytype...');
    
    // Intentar diferentes endpoints
    const endpoints = [
      '/wallet/query',
      '/object/search',
      '/space/list',
      '/spaces',
      '/api/spaces'
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`Probando endpoint: ${endpoint}`);
        const response = await client.post(endpoint, {
          type: 'object',
          query: { filters: [] }
        });
        console.log(`✅ Endpoint ${endpoint} funciona:`, response.data);
      } catch (error) {
        console.log(`❌ Endpoint ${endpoint} error:`, error.response?.status || error.message);
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkSpaces();
