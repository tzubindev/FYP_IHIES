const bcrypt = require("bcrypt");
const formattedResponse = require("./formattedJsonData");
const emailHandler = require("./emailHandler");
const fs_p = require("fs/promises");
const fs = require("fs");

async function authenticate(client, requestData) {
    try {
        // Connection to mongodb and send query
        await client.connect();
        const db = client.db("FYP-IHIES");
        const coll = db.collection("Authentication");
        const cursor = coll.find({ "user.id": requestData.id });

        // Get query result from mongodb
        const data = await cursor.toArray();

        // check if uid exists
        if (!data.length) {
            return formattedResponse.errorMsg(
                "Authentication Failed",
                "/login",
                "User Id does not exist."
            );
        }

        // only one uid will be matched
        const pw = data[0].user.pw;
        const role = data[0].user.role;
        const salt = data[0].user.salt;

        function comparePasswordsAsync(userEnteredPassword, hashedPassword) {
            return new Promise((resolve, reject) => {
                bcrypt.hash(userEnteredPassword, salt, function (err, hash) {
                    if (err) reject(err);
                    else resolve(hash === hashedPassword);
                });
            });
        }

        const isAuthenticated = await comparePasswordsAsync(requestData.pw, pw);

        // Add role into result
        const result = isAuthenticated
            ? { authentication: isAuthenticated, role: role }
            : { authentication: isAuthenticated };

        return formattedResponse.successMsg(result);
    } catch (error) {
        return formattedResponse.errorMsg(
            "Authentication Error",
            "/login",
            error.message
        );
    } finally {
        // Ensure that the client will close when you finish/error
        await client.close();
    }
}

// type: [
//      forgetPassword,
//      login,
// ]
// mode: [
//      receive,
//      send
// ]

async function two_factor_authenticate(client, requestData) {
    try {
        // Connection to mongodb and send query
        await client.connect();
        const db = client.db("FYP-IHIES");
        const coll_auth = db.collection("Authentication");
        const coll_otp = db.collection("OTP");

        // SEND
        if (
            (requestData.type === "forgetPassword" ||
                requestData.type === "login") &&
            requestData.mode === "send"
        ) {
            const cursor = coll_auth.find({ "user.id": requestData.id });

            // Get query result from mongodb
            const data = await cursor.toArray();

            // check if uid exists
            if (!data.length) {
                return formattedResponse.errorMsg(
                    "Authentication Failed",
                    "/login",
                    "User Id does not exist."
                );
            }

            // only one uid will be matched
            const email = data[0].user.email;

            // Generate random otp
            const otp = OTP_generator();

            // Send e-mail for otp
            await emailHandler.sendOTP(email, `${otp.id}-${otp.code}`);

            // Store otp to database
            // The otp will be valid for 5 mins
            const otpData = {
                expired: Date.now() + 1 * 60 * 1000,
                id: otp.id,
                code: otp.code,
            };

            const filter = { [requestData.id]: { $exists: true } };
            const updateData = {
                $set: { [requestData.id]: otpData },
            };

            const result = await coll_otp.updateOne(filter, updateData, {
                upsert: true,
            });

            let response;

            // Res to Req
            if (result.modifiedCount === 1 || result.upsertedCount === 1) {
                response = { id: otp.id };
            } else {
                response = "Failed to update or create OTP data";
            }
            return formattedResponse.successMsg(response);
        }

        // RECEIVE
        // id: otp_uid,
        // type: otp_type,
        // mode: "receive",
        // otp:  {
        //     id,
        //     code,
        // }
        if (requestData.mode === "receive") {
            // Verify otp and take action correspondingly
            if (requestData.type === "login") {
                // Query the OTP data from the MongoDB collection
                const keyToFind = requestData.id;
                const filter = { [keyToFind]: { $exists: true } };
                const otpDataCursor = await coll_otp.find(filter);

                // Convert the cursor results to an array
                const otpDataArray = await otpDataCursor.toArray();
                console.log(otpDataArray);

                // Verification
                let result;
                if (otpDataArray.length === 1) {
                    const target = otpDataArray[0][requestData.id];

                    if (
                        target.expired > Date.now() &&
                        target.id === requestData.otp.id &&
                        target.code == requestData.otp.code
                    ) {
                        result = "VER_SUCCESS";
                    } else {
                        result = "VER_FAILED";
                    }
                } else {
                    result = "VER_FAILED";
                }

                return formattedResponse.successMsg(result);
            }
            if (requestData.type === "forgetPassword") {
                return formattedResponse.successMsg({
                    msgType: "forgetPassword",
                });
            }
        }
    } catch (error) {
        return formattedResponse.errorMsg(
            "Two-Factor Authentication Error",
            "/login",
            error.message
        );
    } finally {
        // Ensure that the client will close when you finish/error
        await client.close();
    }
}

function OTP_generator() {
    // Define a list of alphabet characters to randomize for ID
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let generatedID = "";

    // Generate a random 3-character ID
    for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * alphabet.length);
        generatedID += alphabet[randomIndex];
    }

    // Generate a random 7-digit code
    const generatedCode = Math.floor(1000000 + Math.random() * 9000000);

    return { id: generatedID, code: generatedCode };
}

module.exports = { authenticate, two_factor_authenticate };
