class IncidentReportController {
    constructor() {}

    async getIncidentType(pool, requestUser) {
        let connection;
        try {
            if (requestUser.role === "patient") return false;
            connection = await pool.getConnection();

            // [1] get institution id
            const query = `SELECT * FROM incident_type `;
            const [r] = await connection.query(query);
            return r;
        } catch (error) {
            console.error("Error retrieving schedule:", error);
            throw error;
        } finally {
            // Release the MySQL connection back to the pool
            if (connection) connection.release();
        }
    }

    async getIncidents(pool, requestUser) {
        let connection;
        try {
            if (requestUser.role === "patient") return false;
            connection = await pool.getConnection();
            const query = `SELECT * FROM incident`;
            const [r] = await connection.query(query);
            return r;
        } catch (error) {
            console.error("Error retrieving schedule:", error);
            throw error;
        } finally {
            // Release the MySQL connection back to the pool
            if (connection) connection.release();
        }
    }

    async update(pool, requestUser, id, status) {
        let connection;
        try {
            if (requestUser.role === "patient") return false;
            connection = await pool.getConnection();
            const query = `UPDATE incident SET status =? WHERE id = ?`;
            const [r] = await connection.query(query, [status, id]);
            return r.affectedRows > 0;
        } catch (error) {
            console.error("Error retrieving schedule:", error);
            throw error;
        } finally {
            // Release the MySQL connection back to the pool
            if (connection) connection.release();
        }
    }

    async add(pool, requestUser, data) {
        let connection;
        try {
            if (requestUser.role === "patient") return false;
            connection = await pool.getConnection();
            const query = `INSERT INTO incident (type_id, description, created_timestamp) VALUES (?,?,now())`;
            const [r] = await connection.query(query, [
                data.type_id,
                data.description,
            ]);
            return r.affectedRows > 0;
        } catch (error) {
            console.error("Error retrieving schedule:", error);
            throw error;
        } finally {
            // Release the MySQL connection back to the pool
            if (connection) connection.release();
        }
    }
}

module.exports = { IncidentReportController };
