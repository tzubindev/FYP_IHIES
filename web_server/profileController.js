const { request } = require("express");
const formattedResponse = require("./formattedJsonData");

class ProfileController {
    async update_last_login(pool, requestUser) {
        let connection;
        try {
            connection = await pool.getConnection();
            const table =
                requestUser.role === "patient"
                    ? "patient_profile"
                    : "mp_profile";

            const r = await connection.execute(
                `UPDATE ${table} SET last_login = CURRENT_TIMESTAMP WHERE id = ?`,
                [requestUser.id]
            );

            // Process the query result as needed
            const result = {
                message: r,
            };
            return formattedResponse.successMsg(result);
        } catch (error) {
            return formattedResponse.errorMsg(
                "Profile Info Update Error",
                "/profile",
                error.message
            );
        } finally {
            // Release the MySQL connection back to the pool
            if (connection) connection.release();
        }
    }

    async get_all(pool, requestUser) {
        let connection;
        try {
            // Get a MySQL connection from the pool
            connection = await pool.getConnection();
            const table =
                requestUser.role === "patient"
                    ? "patient_profile"
                    : "mp_profile";

            // Profile data
            const [rows_pd] = await connection.execute(
                `SELECT * FROM ${table} WHERE id = ?`,
                [requestUser.id]
            );

            // Recent Vital sign data
            const [rows_vs] = await connection.execute(
                `SELECT sys, dia, pulse, breath
                FROM vital_sign
                WHERE patientid = ?
                ORDER BY timestamp DESC
                LIMIT 3;`,
                [requestUser.id]
            );

            // Process the query result as needed
            const result = {
                profile: {
                    name: rows_pd[0].name,
                    language: rows_pd[0].language,
                    sex: rows_pd[0].sex,
                    blood: rows_pd[0].blood,
                    weight: rows_pd[0].weight,
                    born_date: rows_pd[0].born_date,
                    height: rows_pd[0].height,
                    last: rows_pd[0].last_login,
                    address: rows_pd[0].address,
                    emergency_contact_no: rows_pd[0].emergency_contact_no,
                    emergency_contact_name: rows_pd[0].emergency_contact_name,
                    sys: [],
                    dia: [],
                    pulse: [],
                    breath: [],
                },
            };
            // Populate vital sign arrays
            for (const row of rows_vs) {
                result.profile.sys.push(row.sys);
                result.profile.dia.push(row.dia);
                result.profile.pulse.push(row.pulse);
                result.profile.breath.push(row.breath);
            }

            return formattedResponse.successMsg(result);
        } catch (error) {
            return formattedResponse.errorMsg(
                "Profile Info Retrieval Error",
                "/profile",
                error.message
            );
        } finally {
            // Release the MySQL connection back to the pool
            if (connection) connection.release();
        }
    }

    async update_language(pool, requestUser) {}
}

module.exports = { ProfileController };
