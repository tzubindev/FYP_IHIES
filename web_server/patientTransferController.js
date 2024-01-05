const { request } = require("express");

class PatientTransferController {
    constructor() {}

    async getBeds(pool, requestUser) {
        let connection;
        try {
            if (requestUser.role === "patient") return false;
            connection = await pool.getConnection();

            // [1] get institution id
            const query = `SELECT institution_id FROM mp_profile WHERE id = ?`;
            const [r] = await connection.query(query, [requestUser.id]);
            const institution_id = r[0].institution_id;

            // [2] user ins_id to get beds from beds table
            const query_b = `SELECT * FROM beds WHERE institution_id = ?`;
            const [r_b] = await connection.query(query_b, [institution_id]);
            return r_b;
        } catch (error) {
            console.error("Error retrieving schedule:", error);
            throw error;
        } finally {
            // Release the MySQL connection back to the pool
            if (connection) connection.release();
        }
    }

    async getTransferring(pool, requestUser) {
        let connection;
        try {
            if (requestUser.role === "patient") return false;
            connection = await pool.getConnection();

            // [1] get institution id
            const query = `SELECT institution_id FROM mp_profile WHERE id = ?`;
            const [r] = await connection.query(query, [requestUser.id]);
            const institution_id = r[0].institution_id;

            // [2]
            const query_b = `SELECT * FROM patient_transfer_request WHERE (from_institution_id = ? OR to_institution_id = ?) AND transferred = FALSE AND to_institution_id IS NOT NULL`;
            const [r_b] = await connection.query(query_b, [
                institution_id,
                institution_id,
            ]);

            return r_b;
        } catch (error) {
            console.error("Error retrieving schedule:", error);
            throw error;
        } finally {
            // Release the MySQL connection back to the pool
            if (connection) connection.release();
        }
    }
    async getRequested(pool, requestUser) {
        let connection;
        try {
            if (requestUser.role === "patient") return false;
            connection = await pool.getConnection();

            // [1] get institution id
            const query = `SELECT institution_id FROM mp_profile WHERE id = ?`;
            const [r] = await connection.query(query, [requestUser.id]);
            const institution_id = r[0].institution_id;

            // [2]
            const query_b = `SELECT * FROM patient_transfer_request WHERE from_institution_id = ? AND to_institution_id IS NULL AND transferred = FALSE`;
            const [r_b] = await connection.query(query_b, [institution_id]);

            return r_b;
        } catch (error) {
            console.error("Error retrieving schedule:", error);
            throw error;
        } finally {
            // Release the MySQL connection back to the pool
            if (connection) connection.release();
        }
    }
}

module.exports = { PatientTransferController };
