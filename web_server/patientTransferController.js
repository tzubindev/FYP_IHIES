const { request } = require("express");

class PatientTransferController {
    constructor() {}

    async add(pool, requestUser, data) {
        let connection;
        try {
            connection = await pool.getConnection();
            const patientId = data.patient_id;
            const reason = data.reason;
            const currentCondition = data.current_condition;
            const note = data.note;

            // [1] get institution id
            const query = `SELECT institution_id FROM mp_profile WHERE id = ?`;
            const [r] = await connection.query(query, [requestUser.id]);
            const institutionId = r[0].institution_id;

            // check if current existing patient transfer request
            const query_ck = `
            SELECT * from patient_transfer_request 
            WHERE to_institution_id IS NULL AND transferred = FALSE AND patient_id = ? `;
            const [r_ck] = await connection.query(query_ck, [patientId]);

            if (r_ck.length) return false;

            // [2] add data to patient_transfer_request
            const query_pt = `
            INSERT INTO patient_transfer_request (
                from_institution_id, 
                to_institution_id,
                transferred, 
                transferred_timestamp, 
                patient_id, 
                reason, 
                note, 
                current_condition,
                created_timestamp,
                updated_timestamp
            ) VALUES (?,NULL, FALSE, NULL, ?, ?, ?, ?, now(), now())`;
            const [r_pt] = await connection.query(query_pt, [
                institutionId,
                patientId,
                reason,
                note,
                currentCondition,
            ]);

            return r_pt.affectedRows > 0;
        } catch (error) {
            console.error("Error retrieving schedule:", error);
            throw error;
        } finally {
            // Release the MySQL connection back to the pool
            if (connection) connection.release();
        }
    }

    async delete(pool, id) {
        let connection;
        try {
            connection = await pool.getConnection();

            const query = "DELETE FROM patient_transfer_request WHERE id = ?";
            const [r] = await connection.query(query, [id]);

            return r.affectedRows > 0;
        } catch (error) {
            console.error("Error retrieving schedule:", error);
            throw error;
        } finally {
            // Release the MySQL connection back to the pool
            if (connection) connection.release();
        }
    }

    async resolveBed(pool, requestUser, bedId) {
        let connection;
        try {
            connection = await pool.getConnection();

            // [1] get institution id
            const query = `SELECT institution_id FROM mp_profile WHERE id = ?`;
            const [r] = await connection.query(query, [requestUser.id]);
            const institution_id = r[0].institution_id;

            // [2] user ins_id to get beds from beds table
            const query_b = `UPDATE beds
            SET is_resolved = TRUE, is_reserved = FALSE patient_id = NULL
            WHERE institution_id = ? AND id = ?;`;
            const [r_b] = await connection.query(query_b, [
                institution_id,
                bedId,
            ]);

            return r_b.affectedRows > 0;
        } catch (error) {
            console.error("Error retrieving schedule:", error);
            throw error;
        } finally {
            // Release the MySQL connection back to the pool
            if (connection) connection.release();
        }
    }

    async reserveBed(pool, requestUser, bedId) {
        let connection;
        try {
            connection = await pool.getConnection();

            // [1] get institution id
            const query = `SELECT institution_id FROM mp_profile WHERE id = ?`;
            const [r] = await connection.query(query, [requestUser.id]);
            const institution_id = r[0].institution_id;

            // [2] user ins_id to get beds from beds table
            const query_b = `UPDATE beds
            SET is_reserved = TRUE
            WHERE institution_id = ? AND id = ?;`;
            const [r_b] = await connection.query(query_b, [
                institution_id,
                bedId,
            ]);

            return r_b.affectedRows > 0;
        } catch (error) {
            console.error("Error retrieving schedule:", error);
            throw error;
        } finally {
            // Release the MySQL connection back to the pool
            if (connection) connection.release();
        }
    }

    async accept(pool, requestUser, requestId) {
        let connection;
        try {
            connection = await pool.getConnection();

            // [1] get institution id
            const query = `SELECT institution_id FROM mp_profile WHERE id = ?`;
            const [r] = await connection.query(query, [requestUser.id]);
            const institution_id = r[0].institution_id;

            // [2] user ins_id to get beds from beds table
            const query_b = `UPDATE patient_transfer_request
            SET to_institution_id = ? WHERE id = ?;`;
            const [r_b] = await connection.query(query_b, [
                institution_id,
                requestId,
            ]);

            return r_b.affectedRows > 0;
        } catch (error) {
            console.error("Error retrieving schedule:", error);
            throw error;
        } finally {
            // Release the MySQL connection back to the pool
            if (connection) connection.release();
        }
    }

    async placePatient(pool, requestUser, bedId, patientId) {
        let connection;
        try {
            connection = await pool.getConnection();

            // [1] get institution id
            const query = `SELECT institution_id FROM mp_profile WHERE id = ?`;
            const [r] = await connection.query(query, [requestUser.id]);
            const institution_id = r[0].institution_id;

            // [2] user ins_id to get beds from beds table
            const query_ovw = `
                UPDATE beds
                SET is_resolved = TRUE, patient_id = NULL
                WHERE patient_id=?;
            `;
            const [r_ovw] = await connection.query(query_ovw, [patientId]);

            const query_b = `UPDATE beds
            SET is_resolved = FALSE, is_reserved = FALSE, patient_id = ?
            WHERE institution_id = ? AND id = ?;`;
            const [r_b] = await connection.query(query_b, [
                patientId,
                institution_id,
                bedId,
            ]);

            // [2] update patient transfer request if necessary
            const query_id = `
                SELECT id FROM patient_transfer_request 
                WHERE patient_id = ? AND transferred IS FALSE AND to_institution_id = ?
                ORDER BY updated_timestamp DESC
                LIMIT 1;`;
            const [r_id] = await connection.query(query_id, [
                patientId,
                institution_id,
            ]);

            let r_pt;
            if (r_id && r_id.length > 0) {
                const transferRequestId = r_id[0].id;
                const query_pt = `
                UPDATE patient_transfer_request
                SET transferred = TRUE, transferred_timestamp = NOW(), updated_timestamp = NOW()
                WHERE id = ?;
            `;
                [r_pt] = await connection.query(query_pt, [transferRequestId]);
            }

            return "B:" + r_b.affectedRows > 0 + ";PT:" + r_pt;
        } catch (error) {
            console.error("Error retrieving schedule:", error);
            throw error;
        } finally {
            // Release the MySQL connection back to the pool
            if (connection) connection.release();
        }
    }

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

    async getRequests(pool, requestUser) {
        let connection;
        try {
            if (requestUser.role === "patient") return false;
            connection = await pool.getConnection();

            // [1] get institution id
            const query = `SELECT institution_id FROM mp_profile WHERE id = ?`;
            const [r] = await connection.query(query, [requestUser.id]);
            const institution_id = r[0].institution_id;

            // [2]
            const query_b = `SELECT * FROM patient_transfer_request WHERE from_institution_id != ? AND to_institution_id IS NULL AND transferred = FALSE`;
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
