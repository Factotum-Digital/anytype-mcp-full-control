const fs = require('fs');
const path = require('path');

const anytypeDataPath = '/Users/wilfredy/Library/Application Support/anytype/data/A6gvjv4cbaXVbVYK5Rx5uSS3g8TzNzytmXjkpwHx4opMZEds';

function readSpaceInfo(spaceDir) {
  try {
    const files = fs.readdirSync(spaceDir);
    const spaceInfo = { name: spaceDir.split('/').pop(), files: [] };
    
    for (const file of files) {
      const filePath = path.join(spaceDir, file);
      try {
        const stat = fs.statSync(filePath);
        if (stat.isFile()) {
          const content = fs.readFileSync(filePath, 'utf8');
          spaceInfo.files.push({ name: file, size: stat.size, preview: content.substring(0, 100) });
        }
      } catch (e) {
        spaceInfo.files.push({ name: file, error: 'Cannot read' });
      }
    }
    
    return spaceInfo;
  } catch (error) {
    return { error: error.message };
  }
}

function listSpaces() {
  const spaceStorePath = path.join(anytypeDataPath, 'spaceStoreNew');
  
  if (!fs.existsSync(spaceStorePath)) {
    console.log('❌ spaceStoreNew no encontrado');
    return;
  }
  
  const spaces = fs.readdirSync(spaceStorePath);
  
  console.log('🗂️ ESPACIOS ENCONTRADOS EN ANYTYPE:');
  console.log(`Total: ${spaces.length} espacios\n`);
  
  spaces.forEach((space, index) => {
    const spacePath = path.join(spaceStorePath, space);
    const spaceInfo = readSpaceInfo(spacePath);
    
    console.log(`📁 Espacio ${index + 1}: ${space}`);
    console.log(`   Archivos: ${spaceInfo.files.length}`);
    
    // Buscar nombre del espacio en los archivos
    const nameFile = spaceInfo.files.find(f => f.name.includes('name') || f.name.includes('info'));
    if (nameFile && nameFile.preview) {
      try {
        const cleanPreview = nameFile.preview.replace(/[^\w\s]/g, '').trim();
        if (cleanPreview.length > 0 && cleanPreview !== ' ') {
          console.log(`   Nombre posible: "${cleanPreview.substring(0, 30)}..."`);
        }
      } catch (e) {}
    }
    
    console.log('');
  });
  
  // Buscar específicamente el espacio "2"
  const spaceTwo = spaces.find(s => s.includes('2') || s.toLowerCase().includes('two'));
  if (spaceTwo) {
    console.log('🎯 ESPACIO "2" ENCONTRADO:');
    const spacePath = path.join(spaceStorePath, spaceTwo);
    const spaceInfo = readSpaceInfo(spacePath);
    
    console.log(`ID: ${spaceTwo}`);
    console.log('Archivos:');
    spaceInfo.files.forEach(f => {
      console.log(`  - ${f.name} (${f.size} bytes)`);
    });
    
    // Intentar leer objetos del espacio
    const objectStorePath = path.join(anytypeDataPath, 'objectstore');
    if (fs.existsSync(objectStorePath)) {
      console.log('\n📋 OBJETOS EN ESTE ESPACIO:');
      const objects = fs.readdirSync(objectStorePath).slice(0, 10); // Primeros 10 objetos
      objects.forEach(obj => {
        const objPath = path.join(objectStorePath, obj);
        try {
          const stat = fs.statSync(objPath);
          if (stat.isDirectory()) {
            const objFiles = fs.readdirSync(objPath);
            console.log(`  📄 ${obj} (${objFiles.length} archivos)`);
          }
        } catch (e) {}
      });
    }
  } else {
    console.log('❌ Espacio "2" no encontrado');
  }
}

function deleteSpaceContent(spaceId) {
  const spaceStorePath = path.join(anytypeDataPath, 'spaceStoreNew', spaceId);
  const objectStorePath = path.join(anytypeDataPath, 'objectstore');
  
  console.log(`🗑️ Eliminando contenido del espacio: ${spaceId}`);
  
  try {
    // Eliminar archivos del espacio en spaceStoreNew
    if (fs.existsSync(spaceStorePath)) {
      const files = fs.readdirSync(spaceStorePath);
      files.forEach(file => {
        const filePath = path.join(spaceStorePath, file);
        fs.unlinkSync(filePath);
        console.log(`  ✅ Eliminado: ${file}`);
      });
      console.log(`  📁 Espacio ${spaceId} vaciado`);
    }
    
    // Eliminar objetos relacionados (más complejo, requiere identificar qué objetos pertenecen al espacio)
    console.log('  ⚠️  Para eliminar objetos completamente se requiere más análisis de la estructura de datos');
    
  } catch (error) {
    console.error(`❌ Error eliminando espacio: ${error.message}`);
  }
}

// Ejecutar análisis
listSpaces();

// Preguntar si quiere eliminar el espacio "2"
const spaceStorePath = path.join(anytypeDataPath, 'spaceStoreNew');
const spaces = fs.readdirSync(spaceStorePath);
const spaceTwo = spaces.find(s => s.includes('2') || s.toLowerCase().includes('two'));

if (spaceTwo) {
  console.log('\n⚠️  ¿DESEA ELIMINAR EL CONTENIDO DEL ESPACIO "2"?');
  console.log('Ejecute: node read_anytype_direct.js delete');
  
  if (process.argv[2] === 'delete') {
    deleteSpaceContent(spaceTwo);
  }
}
