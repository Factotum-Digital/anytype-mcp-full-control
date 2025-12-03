const fs = require('fs');

const spaceStorePath = '/Users/wilfredy/Library/Application Support/anytype/data/A6gvjv4cbaXVbVYK5Rx5uSS3g8TzNzytmXjkpwHx4opMZEds/spaceStoreNew';

console.log('🔍 VERIFICANDO ESTADO DE ESPACIOS');

try {
  const spaces = fs.readdirSync(spaceStorePath);
  console.log(`\n📁 Espacios encontrados: ${spaces.length}`);
  
  spaces.forEach((space, index) => {
    const spacePath = `${spaceStorePath}/${space}`;
    try {
      const files = fs.readdirSync(spacePath);
      console.log(`Espacio ${index + 1}: ${space}`);
      console.log(`  Archivos: ${files.length}`);
      
      if (files.length > 0) {
        console.log(`  Contenido: ${files.join(', ')}`);
      }
    } catch (e) {
      console.log(`Espacio ${index + 1}: ${space} - ERROR al leer`);
    }
  });
  
  // Buscar específicamente espacio con "2" en el nombre o contenido
  console.log('\n🎯 BUSCANDO ESPACIO "2":');
  const spaceWithTwo = spaces.find(s => s.includes('2'));
  if (spaceWithTwo) {
    console.log(`✅ Encontrado: ${spaceWithTwo}`);
  } else {
    console.log('❌ Espacio con "2" no encontrado en el nombre');
  }
  
} catch (error) {
  console.error('❌ Error:', error.message);
}
