const fs = require('fs');
const path = require('path');

const anytypeDataPath = '/Users/wilfredy/anytype-mcp-full-control';
const spaceId = 'bafyreibjdygbtr6zofhqcoqdducdzr6sq7wo3bndj3alzeb52hwuqtncba.2e36sx2wuh2iy';

function cleanSpaceObjects() {
  const objectStorePath = '/Users/wilfredy/Library/Application Support/anytype/data/A6gvjv4cbaXVbVYK5Rx5uSS3g8TzNzytmXjkpwHx4opMZEds/objectstore';
  
  if (!fs.existsSync(objectStorePath)) {
    console.log('❌ ObjectStore no encontrado');
    return;
  }
  
  const objects = fs.readdirSync(objectStorePath);
  let deletedCount = 0;
  
  console.log(`🗑️ Limpiando objetos del espacio: ${spaceId}`);
  console.log(`Total objetos en objectstore: ${objects.length}`);
  
  objects.forEach(objId => {
    const objPath = path.join(objectStorePath, objId);
    
    try {
      if (fs.statSync(objPath).isDirectory()) {
        // Intentar leer el objeto para ver si pertenece al espacio
        const objFiles = fs.readdirSync(objPath);
        
        // Buscar archivos que puedan indicar el espacio
        let belongsToSpace = false;
        
        for (const file of objFiles) {
          const filePath = path.join(objPath, file);
          try {
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Buscar el spaceId en el contenido
            if (content.includes(spaceId)) {
              belongsToSpace = true;
              break;
            }
          } catch (e) {
            // Ignorar archivos que no se pueden leer
          }
        }
        
        // Si el objeto ID coincide con el spaceId, eliminarlo
        if (objId === spaceId || belongsToSpace) {
          try {
            // Eliminar recursivamente el directorio del objeto
            fs.rmSync(objPath, { recursive: true, force: true });
            console.log(`  ✅ Eliminado objeto: ${objId}`);
            deletedCount++;
          } catch (error) {
            console.log(`  ❌ Error eliminando ${objId}: ${error.message}`);
          }
        }
      }
    } catch (error) {
      console.log(`  ❌ Error procesando ${objId}: ${error.message}`);
    }
  });
  
  console.log(`\n📊 RESUMEN:`);
  console.log(`✅ Objetos eliminados: ${deletedCount}`);
  console.log(`📁 Espacio ${spaceId} completamente limpio`);
}

cleanSpaceObjects();
