class ScheduleController {
    constructor() {}
    async getScheduleByUserId(pool, requestUser) {
        let connection;
        try {
            connection = await pool.getConnection();
            const userId = requestUser.id;

            const query = `
                    SELECT * 
                    FROM schedule
                    WHERE patient_id = ?;
                  `;
            const [rows] = await pool.query(query, [userId]);

            return rows;
        } catch (error) {
            console.error("Error retrieving schedule:", error);
            throw error;
        } finally {
            // Release the MySQL connection back to the pool
            if (connection) connection.release();
        }
    }
}

module.exports = { ScheduleController };
