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
            const [result] = await connection.query(updateQuery, [scheduleId]);

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
            const [rows] = await connection.query(query, [userId]);

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
            let [rows_asm] = await connection.query(query, [userId]);

            // Use Promise.all to wait for all asynchronous operations inside the loop
            await Promise.all(
                rows_asm.map(async (d) => {
                    const query_patient_id = `SELECT patient_id, timestamp,institution_id from schedule where id = ?`;
                    const [rows_pid] = await connection.query(
                        query_patient_id,
                        [d.schedule_id]
                    );

                    d.patient_id = rows_pid[0].patient_id;
                    d.timestamp = rows_pid[0].timestamp;
                    d.institution_id = rows_pid[0].institution_id;

                    const [pname] = await profileController.get_name_by_id(
                        pool,
                        d.patient_id,
                        "patient"
                    );
                    d.name = pname.name;
                })
            );

            // Get institution_id
            const [rows_iid] = await connection.query(
                `SELECT institution_id FROM mp_profile WHERE id = ?;`,
                [userId]
            );
            const mp_institution_id = rows_iid[0].institution_id;

            rows_asm = rows_asm.filter(
                (a) => a.institution_id === mp_institution_id
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
            let [rows_asm] = await connection.query(query, [userId]);

            // Use Promise.all to wait for all asynchronous operations inside the loop
            await Promise.all(
                rows_asm.map(async (d) => {
                    const query_patient_id = `SELECT patient_id, timestamp, symptoms, institution_id from schedule where id = ?`;
                    const [rows_pid] = await connection.query(
                        query_patient_id,
                        [d.schedule_id]
                    );

                    d.patient_id = rows_pid[0].patient_id;
                    d.timestamp = rows_pid[0].timestamp;
                    d.symptoms = rows_pid[0].symptoms;
                    d.institution_id = rows_pid[0].institution_id;

                    const [pname] = await profileController.get_name_by_id(
                        pool,
                        d.patient_id,
                        "patient"
                    );
                    d.name = pname.name;
                    if (!d.mp_id) delete d.mp_id;
                })
            );
            // Get institution_id
            const [rows_iid] = await connection.query(
                `SELECT institution_id FROM mp_profile WHERE id = ?;`,
                [userId]
            );
            const mp_institution_id = rows_iid[0].institution_id;

            // Correct filtering using entire date objects (ignoring time)
            const currentDate = new Date();
            rows_asm = rows_asm.filter((d) => {
                const scheduleDate = new Date(d.timestamp);
                return (
                    (scheduleDate.getFullYear() > currentDate.getFullYear() ||
                        (scheduleDate.getFullYear() ===
                            currentDate.getFullYear() &&
                            scheduleDate.getMonth() > currentDate.getMonth()) ||
                        (scheduleDate.getFullYear() ===
                            currentDate.getFullYear() &&
                            scheduleDate.getMonth() ===
                                currentDate.getMonth() &&
                            scheduleDate.getDate() > currentDate.getDate())) &&
                    d.institution_id === mp_institution_id
                );
            });

            return rows_asm;
        } catch (error) {
            console.error("Error retrieving schedule:", error);
            throw error;
        } finally {
            // Release the MySQL connection back to the pool
            if (connection) connection.release();
        }
    }

    async assign(pool, departmentId, scheduleId) {
        let connection;
        try {
            connection = await pool.getConnection();

            // [1] get mp_id where department_id === departmentId
            const query = `
            SELECT * 
            FROM mp_profile
            WHERE department_id = ?;
            `;
            const [rows] = await connection.query(query, [departmentId]);
            const selected_mpid =
                rows[Math.floor(Math.random() * rows.length)].id;

            // Assign mp_id to the schedule in the assignment
            const updateQuery = `
            UPDATE assignment
            SET mp_id = ${selected_mpid}, is_assigned = TRUE
            WHERE schedule_id = ?;
        `;
            const [update_rows] = await connection.query(updateQuery, [
                scheduleId,
            ]);
            return update_rows.affectedRows > 0;
        } catch (error) {
            console.error("Error retrieving schedule:", error);
            throw error;
        } finally {
            // Release the MySQL connection back to the pool
            if (connection) connection.release();
        }
    }

    async add(pool, scheduleData) {
        let connection;
        try {
            connection = await pool.getConnection();

            // [0] get institution id
            const query_ins = `
            SELECT institution_id FROM mp_profile where id = ?
            `;
            const [rows_ins] = await connection.query(query_ins, [
                scheduleData.mp_id,
            ]);

            // [0.5] check if patient id exists
            const [rows_exist] = await connection.query(
                `SELECT * FROM patient_profile WHERE id = ?`,
                [scheduleData.patient_id]
            );

            if (!rows_exist.length) return false;

            // [1] add record to schedule
            const query = `
            INSERT INTO schedule (timestamp, institution_id, patient_id, symptoms)
            VALUES (?,?,?,?);
            `;
            const [rows] = await connection.query(query, [
                scheduleData.timestamp,
                rows_ins[0].institution_id,
                scheduleData.patient_id,
                scheduleData.symptoms,
            ]);

            if (!rows || !rows.affectedRows) return false;
            const schedule_id = rows.insertId;
            console.log("SCHEDULE", schedule_id);

            const query_asm = `
                    INSERT INTO assignment (schedule_id)
                    VALUES (?);
                    `;
            const [rows_asm] = await connection.query(query_asm, [schedule_id]);

            return rows_asm.affectedRows > 0;
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
