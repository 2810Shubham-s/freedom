const fs = require('fs');
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config();

// Database connection configuration from environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'freedom_db',
  port: parseInt(process.env.DB_PORT || '3306')
};

async function importSqlFile() {
  console.log('Starting database import...');
  
  // Read the SQL file
  const sqlFilePath = path.join(__dirname, 'Freeandcollege.sql');
  let sqlContent;
  
  try {
    sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    console.log('SQL file read successfully');
  } catch (err) {
    console.error('Error reading SQL file:', err);
    return;
  }
  
  // Create a connection to the database
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to database');
  } catch (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  
  // Split the SQL content into separate statements
  // This is a simple split and might not work for all SQL files
  // It assumes statements are separated by semicolons
  const statements = sqlContent
    .replace(/\/\*.*?\*\//gs, '') // Remove comments
    .replace(/--.*?\n/g, '\n')    // Remove single-line comments
    .split(';')
    .filter(stmt => stmt.trim() !== '');
  
  console.log(`Found ${statements.length} SQL statements to execute`);
  
  // Execute each statement
  try {
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      if (stmt.trim()) {
        try {
          await connection.query(stmt);
          if (i % 10 === 0) {
            console.log(`Executed statement ${i + 1}/${statements.length}`);
          }
        } catch (err) {
          console.error(`Error executing statement ${i + 1}:`, err.message);
          console.error('Statement:', stmt.substring(0, 150) + '...');
        }
      }
    }
    console.log('Database import completed successfully');
  } catch (err) {
    console.error('Error during import:', err);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

// Run the import function
importSqlFile().catch(err => {
  console.error('Unhandled error:', err);
});
