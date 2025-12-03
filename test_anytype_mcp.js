// Usar el MCP oficial de Anytype para listar espacios
const { exec } = require('child_process');

const command = `OPENAPI_MCP_HEADERS='{"Authorization":"Bearer Dz0Adot2t7O7EStoyQBCHfQvZXZtpiotKZ+UBuh32Sk=","Anytype-Version":"2025-05-20"}' npx -y @anyproto/anytype-mcp list-spaces`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error('Error:', error.message);
    return;
  }
  if (stderr) {
    console.error('Stderr:', stderr);
    return;
  }
  console.log('Espacios encontrados:');
  console.log(stdout);
});
