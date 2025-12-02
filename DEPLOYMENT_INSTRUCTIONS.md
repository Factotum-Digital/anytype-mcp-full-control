# Pasos para subir a GitHub

1. Ve a https://github.com y crea un nuevo repositorio llamado 'anytype-mcp-full-control'
2. Copia el URL del repositorio (ej: https://github.com/tuusuario/anytype-mcp-full-control.git)
3. Ejecuta los siguientes comandos:

git remote add origin https://github.com/tuusuario/anytype-mcp-full-control.git
git branch -M main
git push -u origin main

4. El proyecto estará disponible en GitHub

## Para probar el proyecto localmente:

1. Configura tu API key de Anytype en el archivo .env
2. Ejecuta: npm run dev
3. El servidor iniciará en http://localhost:31009

## Para desplegar con Docker:

1. docker build -t anytype-mcp .
2. docker run -d --name anytype-mcp -p 31009:31009 -e ANYTYPE_API_KEY=tu_api_key anytype-mcp

## Para desplegar con docker-compose:

1. Configura tu API key en el archivo .env
2. docker-compose up -d --build

El proyecto MCP para Anytype está completo y listo para usar!
