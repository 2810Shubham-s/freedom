## Freedom Project Setup Guide

### Prerequisites
- Node.js (v14 or higher recommended)
- npm or yarn
- Docker & Docker Compose (for containerized setup)

### Local Development
1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd freedom
   ```
2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```
3. Set up the database:
   - You can use the provided SQL file (`Freeandcollege.sql`) to initialize your database.
   - Or use the Docker setup below for MySQL.

4. Start the development server:
   ```sh
   node src/server.js
   ```
   Or use any start script defined in `package.json`.

### Using Docker
1. Make sure Docker and Docker Compose are installed.
2. Start the services:
   ```sh
   docker-compose up --build
   ```
3. The web server will be available at [http://localhost](http://localhost).

### File Structure
- `src/` - Main application source code
- `public/` - Static assets
- `views/` - EJS templates
- `docker-compose.yml` - Docker Compose configuration
- `Freeandcollege.sql` - Database schema

### Troubleshooting
- Ensure all environment variables are set as needed.
- Check Docker logs for errors: `docker-compose logs`

---
For more details, see the code comments or contact the maintainer.
