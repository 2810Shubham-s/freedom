import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Use environment variables or fallback values (for development only)
const connection = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "freedom_db",
  port: parseInt(process.env.DB_PORT || "3306"),
  //   ssl: {
  //     rejectUnauthorized: true,
  //   },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test database connection
const testConnection = async () => {
  try {
    const conn = await connection.getConnection();
    console.log("Database connected successfully");
    conn.release();
  } catch (error) {
    console.error("Error connecting to database:", error.message);
    process.exit(1);
  }
};

testConnection();

export default connection;
