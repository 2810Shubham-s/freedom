# Freedom Application - Docker Setup

This guide explains how to run your Freedom application using Docker.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Quick Start

1. **Build and start the containers**:

```bash
docker-compose up -d
```

This command builds the application image and starts both the Node.js application and MySQL database containers in detached mode.

2. **View logs**:

```bash
docker-compose logs -f
```

3. **Stop the application**:

```bash
docker-compose down
```

## Configuration

### Environment Variables

The application uses environment variables for configuration. These are defined in:
- `.env.docker` - Template file (copy to `.env` when running directly)
- In `docker-compose.yml` for Docker deployments

### Database

- The MySQL database runs in its own container
- Data is persisted in a Docker volume called `freedom_db_data`
- Database initialization happens automatically
- You can connect to it on port 3307 from your host machine

### Ports

- The web application is accessible on port 3005
- The socket server is accessible on port 7000

## Development with Docker

For development, you can mount your local code into the container:

```yaml
volumes:
  - ./src:/app/src
```

This is already configured in the docker-compose.yml file. When you change code in the src directory, the application will restart automatically.

## Production Deployment

For production deployment:

1. Modify the `DB_HOST`, `DB_USER`, `DB_PASSWORD`, and other sensitive environment variables
2. Use a reverse proxy like Nginx for HTTPS termination
3. Consider using Docker Swarm or Kubernetes for high availability

## Troubleshooting

- **Database connection issues**: Check the database credentials in the environment variables
- **Application not starting**: Check the logs with `docker-compose logs app`
- **Database not initializing**: Check the logs with `docker-compose logs db`
