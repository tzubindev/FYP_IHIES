const { exec } = require("child_process");

function runPythonScript(formattedData) {
    return new Promise((resolve, reject) => {
        // Construct the command to run the Python script
        const command = `py -u predict.py ${formattedData}`;

        // Execute the command
        exec(command, (err, stdout, stderr) => {
            if (err) {
                console.error("Error executing Python script:", err);
                reject(err);
                return;
            }

            // Try to parse the output
            try {
                const result = JSON.parse(stdout.trim());
                resolve(result[0]);
            } catch (parseError) {
                console.error("Error parsing JSON result:", parseError);
                reject(parseError);
            }
        });
    });
}

async function recommend(inputData) {
    // Replace 'inputData' with your actual input data
    const formattedData = JSON.stringify([inputData]);

    try {
        const result = await runPythonScript(formattedData);
        return result;
    } catch (error) {
        // Handle errors here
        console.error("Error in AI.recommend:", error);
        throw error;
    }
}

async function getAllSymptoms(pool) {
    let connection;

    try {
        // Get a connection from the pool
        connection = await pool.getConnection();

        // Fetch all data from the symptom table
        const [rows] = await connection.execute("SELECT * FROM symptom");

        // Return the results
        return rows;
    } catch (error) {
        console.error("Error executing query:", error);
        throw error;
    } finally {
        if (connection) {
            // Release the connection back to the pool
            connection.release();
        }
    }
}

async function getAllInstitutions(pool, postal = null) {
    let connection;

    try {
        // Get a connection from the pool
        connection = await pool.getConnection();

        if (postal) {
            const [rows] = await connection.execute(
                "SELECT * FROM healthcare_institution WHERE postal_code = ?",
                [postal]
            );

            // Return the results
            return rows;
        } else {
            const [rows] = await connection.execute(
                "SELECT * FROM healthcare_institution"
            );

            // Return the results
            return rows;
        }
    } catch (error) {
        console.error("Error executing query:", error);
        throw error;
    } finally {
        if (connection) {
            // Release the connection back to the pool
            connection.release();
        }
    }
}

module.exports = { recommend, getAllSymptoms, getAllInstitutions };
