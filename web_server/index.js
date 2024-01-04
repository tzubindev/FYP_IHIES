// =====================================================================
// [IMPORTS]
const express = require("express");
const mongodb = require("mongodb");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const { Blockchain, Block } = require("./blockchain");
const multer = require("multer");

const Formatter = require("./formattedJsonData");
const Authentication = require("./authentication");
const Logger = require("./logger");
const MySQLPool = require("./database");
const RequestType = require("./requestType");
const { ProfileController } = require("./profileController");
const { RecordController } = require("./recordController");
const { ScheduleController } = require("./scheduleController");
const generalController = require("./generalController");
const AI = require("./AI");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const logger = new Logger(MySQLPool);
const blockchain = new Blockchain();
const upload = multer({});
const profileController = new ProfileController();
const recordController = new RecordController();
const scheduleController = new ScheduleController();

// =====================================================================
// [APP INITIATION]

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// =====================================================================
// [MIDDLEWARE] allow access from a specific address and port *** for dev
app.use(function (request, response, next) {
    // Website wish to allow to connect
    response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");

    // Request methods wish to allow
    response.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );

    // Request headers wish to allow, including Authorization
    response.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type,Authorization"
    );

    // Set to true if need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    response.setHeader("Access-Control-Allow-Credentials", true);

    // Pass to next layer of middleware
    next();
});

// =====================================================================
// [CONNECTION] mongodb
const MongoClient = mongodb.MongoClient;
const ServerApiVersion = mongodb.ServerApiVersion;
const client = new MongoClient(process.env.MONGODB_URI, {
    // serverApi: {
    //     version: ServerApiVersion.v1,
    //     strict: true,
    //     deprecationErrors: true,
    // },
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
        const result = await profileController.get_all(MySQLPool, request.user);

        const resultGetProfilePic =
            await profileController.read_profile_picture(client, request.user);

        result.message.profile.picture = resultGetProfilePic;

        response.send(result);

        delete result.message.profile.picture.buffer;
        const logStr = Formatter.logJsonToString({
            type: RequestType.PROFILE_INIT,
            from: {
                ID: request.user.id,
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
    } catch (e) {
        response.send(
            Formatter.errorMsg("Get Info Error", "/profile", e.message)
        );
    }
});

// =====================================================================
// [PROFILE UPDATES]
app.put("/last-login", async (request, response) => {
    try {
        const requestData = request.body.data;
        const result = await profileController.update_last_login(
            MySQLPool,
            requestData.user
        );
        const logStr = Formatter.logJsonToString({
            type: RequestType.LLI,
            from: {
                ID: requestData.user.id,
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
    } catch (e) {
        response.send(
            Formatter.errorMsg("Update Info Error", "/last-login", e.message)
        );
    }
});

// Not completed
app.put(
    "/lang/:language",
    Authentication.verify_token,
    async (request, response) => {
        try {
            const result = await profileController.update_language(
                request.params.language,
                MySQLPool,
                request.user
            );
            const logStr = Formatter.logJsonToString({
                type: RequestType.LLI,
                from: {
                    ID: request.user.id,
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
        } catch (e) {
            response.send(
                Formatter.errorMsg("Update Info Error", "/lang", e.message)
            );
        }
    }
);

app.put(
    "/profile/upload",
    Authentication.verify_token,
    upload.single("file"),
    async (request, response) => {
        try {
            const user = request.user;
            const editedData = request.body.edited
                ? JSON.parse(request.body.edited)
                : null;
            const file = request.file ? request.file : null;

            // both results will be boolean
            let resultFile = null,
                resultProfile = null;

            // if any profile picture
            if (file) {
                // Assuming ProfileController.update_profile_picture returns a promise
                resultFile = await profileController.update_profile_picture(
                    client,
                    user,
                    file
                );
            }

            // if any edited data
            if (editedData) {
                resultProfile = await profileController.update_profile(
                    MySQLPool,
                    user,
                    editedData
                );
            }

            const logStr = Formatter.logJsonToString({
                type: RequestType.PU,
                from: {
                    ID: request.user.id,
                    IP: request.ip,
                    Method: request.method,
                    "Query Params": JSON.stringify(request.query),
                    Cookies: JSON.stringify(request.cookies),
                    URL: request.url,
                    Path: request.path,
                    "Host Name": request.hostname,
                    Protocol: request.protocol,
                    Result: {
                        ProfilePicture: resultFile,
                        Profile: {
                            IsUpdate: resultProfile,
                            Data: editedData,
                        },
                    },
                },
            });
            logger.log(logStr);

            response.send(Formatter.successMsg("Profile Updated"));
        } catch (e) {
            response.send(
                Formatter.errorMsg(
                    "Update Info Error",
                    "/profile/upload",
                    e.message
                )
            );
        } finally {
            client.close();
        }
    }
);

// =====================================================================
// [MEDICAL RECORD]
// Upload
app.post(
    "/medical-record/upload",
    Authentication.verify_token,
    upload.array("records"),
    async (request, response) => {
        try {
            // Assuming the records are sent as an array in the request body
            const records = request.files;

            // Get the user information from the authenticated token
            const requestUser = request.user;

            // Call the RecordController to handle the upload
            const result = await recordController.upload(
                client,
                requestUser,
                records
            );

            response.send(await Formatter.successMsg(result));
            const logStr = Formatter.logJsonToString({
                type: RequestType.MRU,
                from: {
                    ID: request.user.id,
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
        } catch (error) {
            console.error("Error uploading medical records:", error);
            response.status(500).json({ error: "Internal Server Error" });
        }
    }
);

app.get(
    "/medical-record/:id",
    Authentication.verify_token,
    async (request, response) => {
        try {
            // Assuming the records are sent as an array in the request body
            const { id } = request.params;

            // Call the RecordController to handle the upload
            const result = await recordController.get_all_filename_by_id(
                client,
                id
            );

            response.send(await Formatter.successMsg(result));
            const logStr = Formatter.logJsonToString({
                type: RequestType.MRR,
                from: {
                    ID: request.user.id,
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
        } catch (error) {
            console.error("Error retrieving medical records:", error);
            response.status(500).json({ error: "Internal Server Error" });
        }
    }
);

app.get(
    "/medical-record/id/:recordobjid",
    Authentication.verify_token,
    async (request, response) => {
        try {
            // Assuming the records are sent as an array in the request body
            const id = request.params.recordobjid;

            // Call the RecordController to handle the upload
            const result = await recordController.get_record_by_id(client, id);

            response.send(await Formatter.successMsg(result));
            const logStr = Formatter.logJsonToString({
                type: RequestType.RDR,
                from: {
                    ID: request.user.id,
                    IP: request.ip,
                    Method: request.method,
                    "Query Params": JSON.stringify(request.query),
                    Cookies: JSON.stringify(request.cookies),
                    URL: request.url,
                    Path: request.path,
                    "Host Name": request.hostname,
                    Protocol: request.protocol,
                    Result: result ? "Retrieve Successfully" : "Failed",
                },
            });
            logger.log(logStr);
        } catch (error) {
            console.error("Error retrieving medical records:", error);
            response.status(500).json({ error: "Internal Server Error" });
        }
    }
);

// =====================================================================
// [AI RECO]
app.get("/ai-reco", Authentication.verify_token, async (request, response) => {
    try {
        const result = await AI.recommend(Object.values(request.query));

        const logStr = Formatter.logJsonToString({
            type: RequestType.AR,
            from: {
                ID: request.user.id,
                IP: request.ip,
                Method: request.method,
                "Query Params": JSON.stringify(request.query),
                Cookies: JSON.stringify(request.cookies),
                URL: request.url,
                Path: request.path,
                "Host Name": request.hostname,
                Protocol: request.protocol,
                Result: "Hospitalisation:" + result,
            },
        });
        logger.log(logStr);
        response.send(await Formatter.successMsg(result));
    } catch (error) {
        console.error("Error AI RECO:", error);
        response.status(500).json({ error: "Internal Server Error" });
    }
});

app.get(
    "/institutions/:postal",
    Authentication.verify_token,
    async (request, response) => {
        try {
            const result = await AI.getAllInstitutions(
                MySQLPool,
                request.params.postal
            );

            const logStr = Formatter.logJsonToString({
                type: RequestType.IR,
                from: {
                    ID: request.user.id,
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
            response.send(await Formatter.successMsg(result));
        } catch (error) {
            console.error("Error AI RECO:", error);
            response.status(500).json({ error: "Internal Server Error" });
        }
    }
);

app.get(
    "/institutions",
    Authentication.verify_token,
    async (request, response) => {
        try {
            const result = await AI.getAllInstitutions(MySQLPool);

            const logStr = Formatter.logJsonToString({
                type: RequestType.IR,
                from: {
                    ID: request.user.id,
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
            response.send(await Formatter.successMsg(result));
        } catch (error) {
            console.error("Error AI RECO:", error);
            response.status(500).json({ error: "Internal Server Error" });
        }
    }
);

// =====================================================================
// [SCHEDULE]
app.get("/schedule", Authentication.verify_token, async (request, response) => {
    try {
        const user = request.user;

        const result = await scheduleController.get_schedule_by_user_id(
            MySQLPool,
            user
        );

        const logStr = Formatter.logJsonToString({
            type: RequestType.SCHID,
            from: {
                ID: request.user.id,
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
        response.send(await Formatter.successMsg(result));
    } catch (error) {
        console.error("Error Schedule Retrieval:", error);
        response.status(500).json({ error: "Internal Server Error" });
    }
});

app.get(
    "/schedule-management/:type",
    Authentication.verify_token,
    async (request, response) => {
        try {
            const user = request.user;
            const type = request.params.type;
            let result;

            if (type === "incoming")
                result =
                    await scheduleController.get_schedule_management_by_user_id(
                        MySQLPool,
                        user
                    );
            else if (type === "pending")
                result = await scheduleController.get_pending_schedule(
                    MySQLPool,
                    user
                );

            const logStr = Formatter.logJsonToString({
                type: RequestType.SCHMNGR,
                from: {
                    ID: request.user.id,
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
            response.send(await Formatter.successMsg(result));
        } catch (error) {
            console.error("Error Schedule Retrieval:", error);
            response.status(500).json({ error: "Internal Server Error" });
        }
    }
);

app.post(
    "/updateschedule/:action/:schedule_id",
    Authentication.verify_token,
    async (request, response) => {
        try {
            const { action, schedule_id } = request.params;
            const result = await scheduleController.change_status(
                MySQLPool,
                schedule_id,
                action
            );

            const logStr = Formatter.logJsonToString({
                type: RequestType.SCHU,
                from: {
                    ID: request.user.id,
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
            response.send(await Formatter.successMsg(result));
        } catch (error) {
            console.error("Error Schedule Action:", error);
            response.status(500).json({ error: "Internal Server Error" });
        }
    }
);

// =====================================================================
// [BLOCKCHAIN RECORD, INCOMPLETE]
app.get("/blocks", (request, response) => {
    response.json(blockchain.chain);
});

// Add a new block
app.post("/addBlock", (request, response) => {
    const newBlock = new Block(
        blockchain.chain.length,
        Date.now(),
        request.body.data
    );

    blockchain.addBlock(newBlock);
    response.json(newBlock);
});

// =====================================================================
// [VITAL SIGN]
app.post(
    "/vital-sign/add",
    Authentication.verify_token,
    async (request, response) => {
        try {
            console.log(request.body);
            const data = request.body;
            const result = await generalController.addVitalSign(
                MySQLPool,
                data
            );
            const logStr = Formatter.logJsonToString({
                type: RequestType.VSA,
                from: {
                    ID: request.user.id,
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

            response.send(await Formatter.successMsg(result.affectedRows));
        } catch (error) {
            logger.error(`Error inserting data: ${error.message}`);
        }
    }
);

// =====================================================================
// [SYMPTOMS]
app.get("/symptoms", Authentication.verify_token, async (request, response) => {
    try {
        const result = await AI.getAllSymptoms(MySQLPool);

        const logStr = Formatter.logJsonToString({
            type: RequestType.SYM,
            from: {
                ID: request.user.id,
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
        response.send(await Formatter.successMsg(result));
    } catch (error) {
        console.error("Error AI RECO:", error);
        response.status(500).json({ error: "Internal Server Error" });
    }
});

// =====================================================================
// [DEPARTMENTS]
app.get(
    "/departments",
    Authentication.verify_token,
    async (request, response) => {
        try {
            if (request.user.role === "patient") return;
            const result = await generalController.getAllDepartments(MySQLPool);

            const logStr = Formatter.logJsonToString({
                type: RequestType.DEPR,
                from: {
                    ID: request.user.id,
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
            response.send(await Formatter.successMsg(result));
        } catch (error) {
            console.error("Error AI RECO:", error);
            response.status(500).json({ error: "Internal Server Error" });
        }
    }
);

// =====================================================================
// LISTENER
app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});
