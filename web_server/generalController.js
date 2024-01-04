const addVitalSign = async (pool, data) => {
    // Insert data into the database
    const query =
        "INSERT INTO vital_sign (patient_id, timestamp, sys, dia, pulse, breath) VALUES (?, NOW(), ?, ?, ?, ?)";

    const values = [
        data.patient_id,
        data.sys,
        data.dia,
        data.pulse,
        data.breath,
    ];

    let connection;

    try {
        connection = await pool.getConnection();
        const [result] = await connection.execute(query, values);
        return result;
    } catch (error) {
        console.error("Error adding vital sign:", error.message);
        throw error;
    } finally {
        if (connection) connection.release();
    }
};

const getAllDepartments = async (pool, userId) => {
    // Insert data into the database
    const query = "SELECT * FROM department WHERE institution_id = ?;";

    let connection;

    try {
        connection = await pool.getConnection();

        // get institution id of the medial personnel
        const [insIdRows] = await connection.execute(
            `SELECT institution_id from mp_profile WHERE id = ?`,
            [userId]
        );

        const [result] = await connection.execute(query, [
            insIdRows[0].institution_id,
        ]);
        return result;
    } catch (error) {
        console.error("Error adding vital sign:", error.message);
        throw error;
    } finally {
        if (connection) connection.release();
    }
};

module.exports = { addVitalSign, getAllDepartments };
