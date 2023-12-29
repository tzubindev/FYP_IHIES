const { request } = require("express");
const formattedResponse = require("./formattedJsonData");

class ProfileController {
    async get_all(pool, requestUser) {
        let connection;
        try {
            // Get a MySQL connection from the pool
            connection = await pool.getConnection();
            const table =
                requestUser.role === "patient"
                    ? "patient_profile"
                    : "mp_profile";

            // Query the MySQL database for all relevant data
            const [rows] = await connection.execute(
                `SELECT name, language, sex, blood, weight, born_date, height, last_login FROM ${table} WHERE id = ?`,
                [requestUser.id]
            );

            // Process the query result as needed
            const result = {
                profile: {
                    name: rows[0].name,
                    language: rows[0].language,
                    sex: rows[0].sex,
                    blood: rows[0].blood,
                    weight: rows[0].weight,
                    born_date: rows[0].born_date,
                    height: rows[0].height,
                    last: rows[0].last_login,
                },
            };
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
}

module.exports = { ProfileController };
