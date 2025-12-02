# Anytype MCP Server

A full-featured Model Context Protocol (MCP) server for Anytype, providing complete control over Anytype functionality.

## Features

- Complete CRUD operations for Anytype objects
- Search and filter objects
- Manage spaces, types, and relations
- Secure authentication with API keys
- Rate limiting and request validation
- Comprehensive error handling
- Logging and monitoring
- Docker support for easy deployment

## Prerequisites

- Node.js 18.0.0 or later
- Anytype desktop application running
- Anytype API key

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/anytype-mcp-full-control.git
cd anytype-mcp-full-control
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=31009
ANYTYPE_API_URL=http://localhost:31009
ANYTYPE_API_KEY=your_anytype_api_key_here
LOG_LEVEL=info
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

## Getting Your Anytype API Key

1. Open Anytype desktop application
2. Go to Settings > Advanced
3. Click on "Developer mode"
4. Click on "Generate API key"
5. Copy the API key and paste it in your `.env` file

## Running the Server

### Development Mode

```bash
npm run dev
```

### Production Mode

1. Build the application:

```bash
npm run build
```

2. Start the server:

```bash
npm start
```

## API Documentation

Once the server is running, you can access the API documentation at:

```
http://localhost:31009/api/docs
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment (development/production) | development |
| PORT | Port to run the server on | 31009 |
| ANYTYPE_API_URL | Base URL for Anytype API | http://localhost:31009 |
| ANYTYPE_API_KEY | Your Anytype API key | - |
| LOG_LEVEL | Logging level (error, warn, info, debug) | info |
| RATE_LIMIT_WINDOW_MS | Rate limiting window in milliseconds | 900000 (15 minutes) |
| RATE_LIMIT_MAX | Maximum number of requests per window | 100 |

## API Endpoints

### Objects

- `GET /api/objects` - Get all objects
- `GET /api/objects/:id` - Get object by ID
- `POST /api/objects` - Create new object
- `PATCH /api/objects/:id` - Update object
- `DELETE /api/objects/:id` - Delete object
- `POST /api/objects/search` - Search objects
- `GET /api/objects/:id/relations` - Get object relations

### Spaces

- `GET /api/spaces` - Get all spaces
- `GET /api/spaces/:id` - Get space by ID
- `POST /api/spaces` - Create new space
- `PATCH /api/spaces/:id` - Update space
- `DELETE /api/spaces/:id` - Delete space

### Types

- `GET /api/types` - Get all types
- `GET /api/types/:id` - Get type by ID
- `POST /api/types` - Create new type
- `PATCH /api/types/:id` - Update type
- `DELETE /api/types/:id` - Delete type

### Relations

- `GET /api/relations` - Get all relations
- `GET /api/relations/:id` - Get relation by ID
- `POST /api/relations` - Create new relation
- `PATCH /api/relations/:id` - Update relation
- `DELETE /api/relations/:id` - Delete relation

## Authentication

All API endpoints require authentication using an API key. Include the API key in the `Authorization` header:

```
Authorization: Bearer YOUR_API_KEY
```

or in the `X-API-Key` header:

```
X-API-Key: YOUR_API_KEY
```

## Error Handling

The API returns standard HTTP status codes:

- `200 OK` - Request was successful
- `201 Created` - Resource was created successfully
- `400 Bad Request` - Invalid request
- `401 Unauthorized` - Authentication failed
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

## Logging

Logs are output to the console with different log levels based on the `LOG_LEVEL` environment variable.

## Testing

To run tests:

```bash
npm test
```

## Linting

To check code style:

```bash
npm run lint
```

## Formatting

To format code:

```bash
npm run format
```

## Deployment

### Docker

1. Build the Docker image:

```bash
docker build -t anytype-mcp .
```

2. Run the container:

```bash
docker run -d \
  --name anytype-mcp \
  -p 31009:31009 \
  -e NODE_ENV=production \
  -e ANYTYPE_API_KEY=your_api_key_here \
  anytype-mcp
```

### Docker Compose

```bash
docker-compose up -d --build
```

### PM2 (Production)

1. Install PM2 globally:

```bash
npm install -g pm2
```

2. Start the application:

```bash
pm2 start dist/index.js --name "anytype-mcp"
```

3. Set up PM2 to start on boot:

```bash
pm2 startup
pm2 save
```

## Monitoring

### PM2

```bash
# List all processes
pm2 list

# View logs
pm2 logs anytype-mcp

# Monitor resources
pm2 monit

# Restart the application
pm2 restart anytype-mcp

# Stop the application
pm2 stop anytype-mcp

# Delete the application
pm2 delete anytype-mcp
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m "Add some amazing feature"`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue on the GitHub repository.
