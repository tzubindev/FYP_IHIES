const express = require("express");
const mongodb = require("mongodb");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const MongoClient = mongodb.MongoClient;
const client = new MongoClient(process.env.MONGODB_URI, {
    // useNewUrlParser: true,
});

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});

app.get("/status", async (request, response) => {
    try {
        await client.connect();
        const db = client.db("test");
        const coll = db.collection("test");
        const cursor = coll.find();

        const data = await cursor.toArray();

        response.send({
            data,
        });
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
});
