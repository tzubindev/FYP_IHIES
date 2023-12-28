class Logger {
    constructor(connectionPool) {
        // Use the provided MySQL connection pool
        this.pool = connectionPool;
    }

    log(message) {
        this.addToDatabase("INFO", message);
        const parsedMessage = JSON.parse(message);
        console.log(`[INFO] ${new Date().toISOString()}:`, parsedMessage);
    }

    error(message) {
        this.addToDatabase("ERROR", message);
        console.error(`[ERROR] ${new Date().toISOString()} - ${message}`);
    }

    warn(message) {
        this.addToDatabase("WARNING", message);
        console.warn(`[WARNING] ${new Date().toISOString()} - ${message}`);
    }

    addToDatabase(level, message) {
        const query =
            "INSERT INTO log (level, message, timestamp) VALUES (?, ?, CURRENT_TIMESTAMP)";
        const values = [level, message];

        this.query(query, values);
    }

    query(query, values) {
        this.pool.query(query, values, (error, results, fields) => {
            if (error) {
                console.error("Error executing query:", error);
            }
        });
    }
}

// Export the Logger class
module.exports = Logger;
