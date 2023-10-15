const express = require("express");
const mongodb = require("mongodb");
const FormattedResponse = require("./formattedJsonData");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Middleware: To allow access from a specific address and port
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");

    // Request methods you wish to allow
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );

    // Request headers you wish to allow
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", true);

    // Pass to next layer of middleware
    next();
});

const MongoClient = mongodb.MongoClient;
const client = new MongoClient(process.env.MONGODB_URI, {});

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});

app.post("/login", async (request, response) => {
    try {
        // Get request data
        const requestData = request.body;

        // Connection to mongodb and send query
        await client.connect();
        const db = client.db("FYP-IHIES");
        const coll = db.collection("Authentication");
        const cursor = coll.find({ "user.id": requestData.id });

        // Get query result from mongodb
        const data = await cursor.toArray();

        // check uid, if no, respond
        if (!data.length) {
            response.send({});
        }

        // only one uid will be matched
        const salt = data[0].user.salt;

        // get salted -> hash request password
        // -> compare with fetched password

        response.send(FormattedResponse.errorMsg("something", "asd"));
    } catch (e) {
        response.send(
            FormattedResponse.errorMsg("Authentication Error", "/login")
        );
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
});
