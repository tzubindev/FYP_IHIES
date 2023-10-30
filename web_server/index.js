const express = require("express");
const mongodb = require("mongodb");
const formattedResponse = require("./formattedJsonData");
const authentication = require("./authentication");

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
const ServerApiVersion = mongodb.ServerApiVersion;
const client = new MongoClient(process.env.MONGODB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});

// Login end point
app.post("/login", async (request, response) => {
    try {
        // Get request data
        const requestData = request.body;
        response.send(await authentication.authenticate(client, requestData));
    } catch (e) {
        response.send(
            formattedResponse.errorMsg("Authentication Error", "/login")
        );
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
});

// Two factor authentication
app.post("/otp", async (request, response) => {
    try {
        // Get Request Details
        console.log(
            "\n[OTP REQUEST]",
            `
IP                ${request.ip}
Method            ${request.method}
Query Params      ${JSON.stringify(request.query)}
Cookies           ${JSON.stringify(request.cookies)}
URL               ${request.url}
Path              ${request.path}
Host Name         ${request.hostname}
Protocol          ${request.protocol}
            `
        );

        // Get request data
        const requestData = request.body;

        response.send(
            await authentication.two_factor_authenticate(client, requestData)
        );
    } catch (e) {
        response.send(
            formattedResponse.errorMsg("Authentication Error", "/login")
        );
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
});
