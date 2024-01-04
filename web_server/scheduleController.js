const { ProfileController } = require("./profileController");
const profileController = new ProfileController();

class ScheduleController {
    constructor() {}

    async change_status(pool, scheduleId, action) {
        let connection, status;
        try {
            connection = await pool.getConnection();
            switch (action) {
                case "cancel":
                    status = "is_cancelled";
                    break;
                case "process":
                    status = "is_processing";
                    break;
                case "complete":
                    status = "is_completed";
                    break;
                case "reschedule":
                    status = "is_rescheduled";
                    break;
                case "approve":
                    status = "is_approved";
                    break;
                case "deny":
                    status = "is_denied";
                    break;
            }

            // Update the assignment table to set is_cancelled to true
            const updateQuery = `
                UPDATE assignment
                SET ${status} = true
                WHERE schedule_id = ?;
            `;
            const [result] = await pool.query(updateQuery, [scheduleId]);

            return result.affectedRows ? true : false;
        } catch (error) {
            console.error("Error updating assignment:", error);
            throw error;
        } finally {
            // Release the MySQL connection back to the pool
            if (connection) connection.release();
        }
    }

    async get_schedule_by_user_id(pool, requestUser) {
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

    async get_schedule_management_by_user_id(pool, requestUser) {
        let connection;
        try {
            connection = await pool.getConnection();
            const userId = requestUser.id;

            const query = `
                SELECT * 
                FROM assignment
                WHERE mp_id = ?;
            `;
            const [rows_asm] = await pool.query(query, [userId]);

            // Use Promise.all to wait for all asynchronous operations inside the loop
            await Promise.all(
                rows_asm.map(async (d) => {
                    const query_patient_id = `SELECT patient_id, timestamp from schedule where id = ?`;
                    const [rows_pid] = await pool.query(query_patient_id, [
                        d.schedule_id,
                    ]);

                    d.patient_id = rows_pid[0].patient_id;
                    d.timestamp = rows_pid[0].timestamp;

                    const [pname] = await profileController.get_name_by_id(
                        pool,
                        d.patient_id,
                        "patient"
                    );
                    d.name = pname.name;
                })
            );

            return rows_asm;
        } catch (error) {
            console.error("Error retrieving schedule:", error);
            throw error;
        } finally {
            // Release the MySQL connection back to the pool
            if (connection) connection.release();
        }
    }

    async get_pending_schedule(pool, requestUser) {
        // 1. after today
        // 2. !isapproved
        let connection;
        try {
            connection = await pool.getConnection();
            const userId = requestUser.id;

            const query = `
                SELECT * 
                FROM assignment
                WHERE is_approved = FALSE AND is_denied = FALSE;
            `;
            const [rows_asm] = await pool.query(query, [userId]);

            // Use Promise.all to wait for all asynchronous operations inside the loop
            await Promise.all(
                rows_asm.map(async (d) => {
                    const query_patient_id = `SELECT patient_id, timestamp, symptoms from schedule where id = ?`;
                    const [rows_pid] = await pool.query(query_patient_id, [
                        d.schedule_id,
                    ]);

                    d.patient_id = rows_pid[0].patient_id;
                    d.timestamp = rows_pid[0].timestamp;
                    d.symptoms = rows_pid[0].symptoms;

                    const [pname] = await profileController.get_name_by_id(
                        pool,
                        d.patient_id,
                        "patient"
                    );
                    d.name = pname.name;
                    if (!d.mp_id) delete d.mp_id;
                })
            );

            return rows_asm;
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
