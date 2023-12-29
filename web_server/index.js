// =====================================================================
// [IMPORTS]
const express = require("express");
const mongodb = require("mongodb");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const { Blockchain, Block } = require("./blockchain");

const Formatter = require("./formattedJsonData");
const Authentication = require("./authentication");
const Logger = require("./logger");
const MySQLPool = require("./database");
const RequestType = require("./requestType");
const { ProfileController } = require("./profileController");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const logger = new Logger(MySQLPool);
const blockchain = new Blockchain();

// =====================================================================
// [APP INITIATION]

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// =====================================================================
// [MIDDLEWARE] allow access from a specific address and port *** for dev
app.use(function (req, res, next) {
    // Website wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");

    // Request methods wish to allow
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );

    // Request headers wish to allow, including Authorization
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type,Authorization"
    );

    // Set to true if need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", true);

    // Pass to next layer of middleware
    next();
});

// =====================================================================
// [CONNECTION] mongodb
const MongoClient = mongodb.MongoClient;
const ServerApiVersion = mongodb.ServerApiVersion;
const client = new MongoClient(process.env.MONGODB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

// =====================================================================
// [TEST]

// =====================================================================
// [VERIFICATION & AUTHENTICATION]
app.post("/login", async (request, response) => {
    try {
        // Get request data
        const requestData = request.body;
        // Get Auth Result
        Authentication.authenticate(MySQLPool, requestData).then((result) => {
            console.log(result);

            // Log
            const logStr = Formatter.logJsonToString({
                type: RequestType.LOGIN,
                from: {
                    ID: requestData.id,
                    IP: request.ip,
                    Method: request.method,
                    "Query Params": JSON.stringify(request.query),
                    Cookies: JSON.stringify(request.cookies),
                    URL: request.url,
                    Path: request.path,
                    "Host Name": request.hostname,
                    Protocol: request.protocol,
                    Result: result,
                },
            });

            logger.log(logStr);

            response.send(result);
        });
    } catch (e) {
        response.send(Formatter.errorMsg("Authentication Error", "/login"));
    } finally {
        // Ensures that the client will close when  finish/error
        await client.close();
    }
});

app.post("/otp", async (request, response) => {
    try {
        // Get request data
        const requestData = request.body;
        // Get Auth result
        Authentication.two_factor_authenticate(MySQLPool, requestData).then(
            (result) => {
                // Log
                const logStr = Formatter.logJsonToString({
                    type: RequestType.OTP,
                    from: {
                        ID: requestData.id,
                        IP: request.ip,
                        Method: request.method,
                        "Query Params": JSON.stringify(request.query),
                        Cookies: JSON.stringify(request.cookies),
                        URL: request.url,
                        Path: request.path,
                        "Host Name": request.hostname,
                        Protocol: request.protocol,
                        Result: result,
                    },
                });
                logger.log(logStr);

                response.send(result);
            }
        );
    } catch (e) {
        response.send(Formatter.errorMsg("Authentication Error", "/login"));
    }
});

// =====================================================================
// [PROFILE INITIALISATION]
app.get("/profile", Authentication.verify_token, async (request, response) => {
    try {
        // Get request data
        response.send(
            await new ProfileController().get_all(MySQLPool, request.user)
        );
        console.log("Finished getting");
    } catch (e) {
        response.send(
            Formatter.errorMsg("Get Info Error", "/profile", e.message)
        );
    }
});

// =====================================================================
// [BLOCKCHAIN RECORD, INCOMPLETE]
app.get("/blocks", (req, res) => {
    res.json(blockchain.chain);
});

// Add a new block
app.post("/addBlock", (req, res) => {
    const newBlock = new Block(
        blockchain.chain.length,
        Date.now(),
        req.body.data
    );

    blockchain.addBlock(newBlock);
    res.json(newBlock);
});

// =====================================================================
// [INCOMPLETED]
app.post("/vital-sign/add", async (req, res) => {
    const sampleData = [
        { patientid: "123", sys: 120.5, dia: 80.2, pulse: 70, breath: 16 },
        { patientid: "456", sys: 130.8, dia: 85.0, pulse: 65, breath: 18 },
        // Add more sample data as needed
    ];

    // Insert sample data into the vital_sign table
    for (const data of sampleData) {
        try {
            // Log the data before inserting
            logger.log(JSON.stringify(data));

            // Insert data into the database
            const query =
                "INSERT INTO vital_sign (patientid, timestamp, sys, dia, pulse, breath) VALUES (?, NOW(), ?, ?, ?, ?)";
            const values = [
                data.patientid,
                data.sys,
                data.dia,
                data.pulse,
                data.breath,
            ];

            await logger.query(query, values);
        } catch (error) {
            logger.error(`Error inserting data: ${error.message}`);
        }
    }
});

// =====================================================================
// LISTENER
app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});
