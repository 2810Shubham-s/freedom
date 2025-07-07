const mysql = require('mysql2/promise');

// Database connection configuration using default values
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'freedom_db',
  port: 3306
};

async function setupDatabase() {
  console.log('Setting up database...');
  
  // Create a connection to the database
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to database');
  } catch (err) {
    console.error('Error connecting to database:', err);
    console.log('Please make sure MySQL is running and the database exists');
    return;
  }
  
  try {
    // Create minutes_1 table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`minutes_1\` (
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`id_product\` varchar(100) NOT NULL DEFAULT '0',
        \`phone\` varchar(20) NOT NULL DEFAULT '0',
        \`code\` varchar(30) NOT NULL DEFAULT '0',
        \`invite\` varchar(30) NOT NULL DEFAULT '0',
        \`stage\` varchar(255) NOT NULL DEFAULT '0',
        \`result\` int(11) NOT NULL DEFAULT 0,
        \`more\` int(11) NOT NULL DEFAULT 0,
        \`level\` int(11) NOT NULL DEFAULT 0,
        \`money\` int(11) NOT NULL DEFAULT 0,
        \`amount\` int(11) NOT NULL DEFAULT 0,
        \`fee\` int(11) NOT NULL DEFAULT 0,
        \`get\` int(11) NOT NULL DEFAULT 0,
        \`game\` varchar(50) NOT NULL DEFAULT '0',
        \`bet\` varchar(10) NOT NULL DEFAULT '0',
        \`status\` int(11) NOT NULL DEFAULT 0,
        \`today\` varchar(50) NOT NULL DEFAULT '0',
        \`time\` varchar(30) NOT NULL DEFAULT '0',
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
    `);
    
    console.log('minutes_1 table created successfully');
    
    // Create wingo table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`wingo\` (
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`period\` bigint(20) DEFAULT 0,
        \`result\` varchar(5) NOT NULL DEFAULT '0',
        \`game\` varchar(50) NOT NULL DEFAULT '0',
        \`status\` int(11) DEFAULT 0,
        \`time\` varchar(50) NOT NULL DEFAULT '0',
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
    `);
    
    console.log('wingo table created successfully');
    
    // Create admin table if it doesn't exist
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
    
    console.log('admin table created successfully');
    
    // Insert default admin data if not exists
    const [adminExists] = await connection.query('SELECT COUNT(*) as count FROM admin');
    if (adminExists[0].count === 0) {
      await connection.query(`
        INSERT INTO \`admin\` (\`id\`, \`wingo1\`, \`wingo3\`, \`wingo5\`, \`wingo10\`, \`k5d\`, \`k5d3\`, \`k5d5\`, \`k5d10\`, \`win_rate\`, \`app\`, \`cskh\`) 
        VALUES (1, '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '80', 'Win Go', 'https://t.me/wingo');
      `);
      console.log('Default admin data inserted');
    }
    
    // Create users table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`users\` (
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`phone\` varchar(20) NOT NULL,
        \`token\` varchar(255) DEFAULT NULL,
        \`veri\` int(11) DEFAULT 1,
        \`level\` int(11) DEFAULT 0,
        \`status\` int(11) DEFAULT 1,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
    `);
    
    console.log('users table created successfully');
    
    console.log('Database setup completed successfully!');
    
  } catch (err) {
    console.error('Error setting up database:', err);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

// Run the function
setupDatabase().catch(err => {
  console.error('Unhandled error:', err);
}); 