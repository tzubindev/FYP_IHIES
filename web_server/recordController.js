const { ObjectId } = require("mongodb");

class RecordController {
    async upload(client, requestUser, records, id, type) {
        try {
            if (requestUser.role == "patient") return false;

            const database = client.db("IHIES");
            const recordCollection = database.collection("Record");

            // Iterate through each record and store metadata in the "Record" collection
            for (const record of records) {
                const recordMetadata = {
                    id: id,
                    type: type,
                    file: record,
                };

                // Insert the record metadata into the "Record" collection
                await recordCollection.insertOne(recordMetadata);
            }

            return true; // Indicates successful upload
        } catch (error) {
            console.error("Error uploading medical records:", error);
            return false;
        }
    }

    async get_all_type(pool) {
        let connection;
        try {
            connection = await pool.getConnection();

            const query = `
                    SELECT * 
                    FROM record_type;
                  `;
            const [rows] = await connection.query(query);

            return rows;
        } catch (error) {
            console.error("Error retrieving schedule:", error);
            throw error;
        } finally {
            // Release the MySQL connection back to the pool
            if (connection) connection.release();
        }
    }

    async add_type(pool, name) {
        let connection;
        try {
            connection = await pool.getConnection();

            const query = `INSERT INTO record_type (name) VALUES(?)`;
            const [rows] = await connection.query(query, [name]);

            return rows.affectedRows > 0;
        } catch (error) {
            console.error("Error retrieving schedule:", error);
            throw error;
        } finally {
            // Release the MySQL connection back to the pool
            if (connection) connection.release();
        }
    }

    async get_all_filename_by_id(recordBlockchain, id) {
        try {
            const files = await recordBlockchain.getBlocks(id);
            return files;
        } catch (error) {
            console.error("Error retrieving medical records:", error);
            return false;
        }
    }

    async get_record_by_index(recordBlockchain, index) {
        try {
            const bufferData = await recordBlockchain.getBlock(index);
            return bufferData;
        } catch (error) {
            console.error("Error retrieving medical record:", error);
            return false;
        }
    }
}

module.exports = { RecordController };
