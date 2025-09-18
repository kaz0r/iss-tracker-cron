# ISS Tracker Cron Job

A TypeScript application that tracks the International Space Station (ISS) position in real-time and stores the data in Redis.

## Features

- Fetches ISS position every 5 seconds from the Open Notify API
- Stores latest position with 24-hour TTL in Redis
- Maintains a path history of the last 4,000 positions
- Containerized with Docker and Docker Compose
- Built with TypeScript for type safety

## Prerequisites

- Node.js 18+ (for local development)
- Docker and Docker Compose
- Redis instance

## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/kaz0r/iss-tracker-cron.git
   cd iss-tracker-cron
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   ```

3. **Configure Redis connection**
   Edit `.env` with your Redis credentials:
   ```
   REDIS_HOST=your_redis_host
   REDIS_PORT=6379
   REDIS_PASSWORD=your_redis_password
   ```

## Running the Application

### With Docker (Recommended)

```bash
# Build and start the container
docker-compose up --build

# Run in background
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

### Local Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Run built application
npm start
```

## Redis Data Structure

The application stores two types of data in Redis:

- **`iss:latest`**: Latest ISS position (expires after 24 hours)
  ```json
  {
    "latitude": "-37.4678",
    "longitude": "-140.3463",
    "timestamp": 1726689065511
  }
  ```

- **`iss:path`**: List of last 4,000 positions for path tracking
  - Each entry contains latitude, longitude, and timestamp
  - Automatically trimmed to maintain size limit

## Configuration

| Environment Variable | Description | Default |
|---------------------|-------------|---------|
| `REDIS_HOST` | Redis server hostname | - |
| `REDIS_PORT` | Redis server port | - |
| `REDIS_PASSWORD` | Redis password | - |
| `NODE_ENV` | Node environment | production |

## API Reference

The application fetches data from:
- **ISS Position API**: `http://api.open-notify.org/iss-now.json`

## Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the built application
- `npm run dev` - Run with ts-node for development
- `npm run clean` - Remove build directory

## Monitoring

The application logs:
- Startup confirmation
- Each position update with coordinates
- Any errors during execution

Example output:
```
ISS Tracker cron job started - running every 5 seconds
Running ISS tracker at: 2025-09-18T20:29:20.424Z
ISS position updated: -41.2196, -146.4951
```