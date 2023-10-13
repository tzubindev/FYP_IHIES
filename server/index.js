const express = require("express");
const mongodb = require("mongodb");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const MongoClient = mongodb.MongoClient;
const client = new MongoClient(process.env.MONGODB_URI, {});

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});

app.get("/status", async (request, response) => {
    try {
        await client.connect();
        const db = client.db("FYP-IHIES");
        const coll = db.collection("Authentication");
        const cursor = coll.find({ "user.id": "01234567891" });

        const data = await cursor.toArray();

        response.send({
            data,
        });
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
});
