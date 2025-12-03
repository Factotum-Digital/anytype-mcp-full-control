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

async function checkAnytypeDirect() {
  try {
    console.log('Conectando directamente con Anytype API...');
    
    // Intentar con el endpoint correcto según documentación
    const response = await client.post('/wallet/query', {
      type: 'object',
      query: {
        filters: []
      }
    });
    
    console.log('✅ Espacios encontrados:');
    console.log(JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('Error:', error.response?.status, error.response?.data || error.message);
    
    // Si falla, intentar otros métodos
    try {
      console.log('Intentando método alternativo...');
      const response2 = await client.get('/space/list');
      console.log('✅ Espacios (método 2):', response2.data);
    } catch (error2) {
      console.log('Método 2 también falló');
    }
  }
}

checkAnytypeDirect();
