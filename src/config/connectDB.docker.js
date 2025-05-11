import mysql from 'mysql2/promise';
require('dotenv').config();

const connection = mysql.createPool({
    host: process.env.DB_HOST || 'db',
    user: process.env.DB_USER || 'freedom_user',
    password: process.env.DB_PASSWORD || 'freedom_password',
    database: process.env.DB_NAME || 'freedom_db',
    port: parseInt(process.env.DB_PORT || '3306'),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
const testConnection = async () => {
    try {
        const conn = await connection.getConnection();
        console.log('Database connected successfully');
        conn.release();
    } catch (error) {
        console.error('Database connection error:', error);
        // Don't exit process on error to allow retries in Docker
        setTimeout(testConnection, 5000); // Try reconnecting every 5 seconds
    }
};

testConnection();

export default connection;
