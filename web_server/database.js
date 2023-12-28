const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Create MySQL connection pool
const pool = mysql.createPool({
    host: process.env.SQL_DB_HOST,
    user: process.env.SQL_DB_USER,
    password: process.env.SQL_DB_PASSWORD,
    database: process.env.SQL_DB_NAME,
    waitForConnections: true,
    connectionLimit: process.env.SQL_DB_CONNECTION_LIMIT,
    queueLimit: process.env.SQL_DB_QUEUE_LIMIT,
});

// Export the MySQL connection pool
module.exports = pool;
