const rt = require("./recordType");
const { ObjectId } = require("mongodb");

class RecordController {
    async upload(client, requestUser, records) {
        try {
            const database = client.db("IHIES");
            const recordCollection = database.collection("Record");

            // Iterate through each record and store metadata in the "Record" collection
            for (const record of records) {
                console.log(record);
                const recordType = record.recordType;
                const recordMetadata = {
                    id: requestUser.id,
                    type: rt.IR,
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

    async get_all_filename_by_id(client, id) {
        await client.connect();
        try {
            const database = client.db("IHIES");
            const recordCollection = database.collection("Record");

            // Retrieve all records for the given user ID
            const records = await recordCollection
                .find({ id: id })
                .project({ type: 1, "file.originalname": 1, _id: 1 })
                .toArray();

            records.map((obj) => {
                obj.name = obj.file.originalname;
                delete obj.file;
            });
            console.log(records);

            return records;
        } catch (error) {
            console.error("Error retrieving medical records:", error);
            return false;
        }
    }

    async get_record_by_id(client, id) {
        try {
            const database = client.db("IHIES");
            const recordCollection = database.collection("Record");

            // Retrieve the record with the given _id
            const record = await recordCollection.findOne(
                { _id: new ObjectId(id) },
                { projection: { "file.buffer": 1, "file.mimetype": 1 } }
            );

            if (record) {
                record.buffer = record.file.buffer;
                record.mimetype = record.file.mimetype;

                delete record.file;
                delete record._id;
                return record;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error retrieving medical record:", error);
            return false;
        }
    }
}

module.exports = { RecordController };
