const mysql = require('mysql2/promise');
require('dotenv').config();

// Database connection configuration using environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'freedom_db',
  port: parseInt(process.env.DB_PORT || '3306')
};

async function createAdminTable() {
  console.log('Creating admin table...');
  
  // Create a connection to the database
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to database');
  } catch (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  
  try {
    // Check if table exists
    const [tables] = await connection.query(
      "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'admin'",
      [dbConfig.database]
    );
    
    if (tables.length > 0) {
      console.log('Admin table already exists, dropping it first...');
      await connection.query('DROP TABLE IF EXISTS `admin`');
    }
    
    // Create the admin table with the necessary columns
    // Based on the error and the controller code, we know it needs at least app and cskh columns
    // We're creating TEXT columns without default values to avoid the MySQL error
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`admin\` (
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`wingo1\` text,
        \`wingo3\` text,
        \`wingo5\` text,
        \`wingo10\` text,
        \`k5d\` text,
        \`k5d3\` text,
        \`k5d5\` text,
        \`k5d10\` text,
        \`k3d\` text,
        \`k3d3\` text,
        \`k3d5\` text,
        \`k3d10\` text,
        \`win_rate\` text,
        \`app\` varchar(255) DEFAULT 'Win Go',
        \`cskh\` varchar(255) DEFAULT 'https://t.me/wingo',
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
    `);
    
    console.log('Admin table created successfully');
    
    // Insert default data
    await connection.query(`
      INSERT INTO \`admin\` (\`id\`, \`app\`, \`cskh\`) 
      VALUES (1, 'Win Go', 'https://t.me/wingo');
    `);
    
    console.log('Default data inserted into admin table');
    
  } catch (err) {
    console.error('Error creating admin table:', err);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

// Run the function
createAdminTable().catch(err => {
  console.error('Unhandled error:', err);
});
