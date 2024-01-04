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

const getAllDepartments = async (pool) => {
    // Insert data into the database
    const query = "SELECT * FROM department;";

    let connection;

    try {
        connection = await pool.getConnection();
        const [result] = await connection.execute(query);
        return result;
    } catch (error) {
        console.error("Error adding vital sign:", error.message);
        throw error;
    } finally {
        if (connection) connection.release();
    }
};

module.exports = { addVitalSign, getAllDepartments };
