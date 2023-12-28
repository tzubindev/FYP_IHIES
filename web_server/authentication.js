const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2/promise");
const formattedResponse = require("./formattedJsonData");
const emailHandler = require("./emailHandler");

async function authenticate(pool, requestData) {
    try {
        // Query the MySQL database
        const [rows] = await pool.query(
            "SELECT pw, role, salt FROM auth WHERE id = ?",
            [requestData.id]
        );

        // Check if user id exists
        if (!rows.length) {
            return formattedResponse.errorMsg(
                "Authentication Failed",
                "/login",
                "User Id does not exist."
            );
        }

        const pw = rows[0].pw;
        const role = rows[0].role;
        const salt = rows[0].salt;

        // Verify the password
        const isAuthenticated = await compare_passwords_async(
            requestData.pw,
            pw,
            salt
        );

        // Add role into result
        const result = isAuthenticated
            ? {
                  authentication: isAuthenticated,
                  user: { id: requestData.id, role: role },
              }
            : { authentication: isAuthenticated };

        return formattedResponse.successMsg(result);
    } catch (error) {
        return formattedResponse.errorMsg(
            "Authentication Error",
            "/login",
            error.message
        );
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
        const coll_passcode = db.collection("Passcode");

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
            if (
                requestData.type === "login" ||
                requestData.type === "forgetPassword"
            ) {
                // Query the OTP data from the MongoDB collection
                const keyToFind = requestData.id;
                const filter = { [keyToFind]: { $exists: true } };
                const otpDataCursor = await coll_otp.find(filter);

                // Convert the cursor results to an array
                const otpDataArray = await otpDataCursor.toArray();

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
                        const passcode = random_password_generator();
                        const filter = { [requestData.id]: { $exists: true } };
                        const updateData = {
                            $set: {
                                [requestData.id]: passcode,
                            },
                        };

                        const updateResult = await coll_passcode.updateOne(
                            filter,
                            updateData,
                            {
                                upsert: true,
                            }
                        );

                        if (
                            updateResult.modifiedCount === 1 ||
                            updateResult.upsertedCount === 1
                        ) {
                            result += "|" + passcode;
                        }
                    } else {
                        result = "VER_FAILED";
                    }
                } else {
                    result = "VER_FAILED";
                }

                // If it is forgetPassword req, additional actions needed
                if (requestData.type === "forgetPassword") {
                    // 1. verify otp DONE

                    // 3. store rand pw into the specific user's data
                    // 4. send email encompassing the rand pw to the user
                    // 5. return VER_SUCCESS / VER_FAILED

                    // 2. generate rand pw
                    const randomPassword = random_password_generator();

                    console.log(random_password_generator());
                    return formattedResponse.successMsg({
                        msgType: "forgetPassword",
                    });
                }

                return formattedResponse.successMsg(result);
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

async function check_passcode(client, requestData) {
    try {
        // Connection to mongodb and send query
        await client.connect();
        const db = client.db("FYP-IHIES");
        const coll_passcode = db.collection("Passcode");
        const keyToFind = requestData.id;
        const filter = { [keyToFind]: { $exists: true } };
        const passcodeDataCursor = await coll_passcode.find(filter);

        // Get query result from mongodb
        const data = await passcodeDataCursor.toArray();

        // check if uid exists
        if (!data.length) {
            return formattedResponse.errorMsg(
                "Verification Failed",
                "/username",
                "Unmatched passcode."
            );
        }
        const result = {
            passcode_verification:
                data[0][requestData.id] === requestData.passcode,
        };

        return formattedResponse.successMsg(result);
    } catch (error) {
        return formattedResponse.errorMsg(
            "Verification Error",
            "/username",
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

function random_password_generator() {
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const digitChars = "0123456789";
    const specialChars = "!@#$%^&*()_-+=<>?/";

    // Ensure at least one character from each category
    const randomUppercase =
        uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
    const randomLowercase =
        lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
    const randomDigit =
        digitChars[Math.floor(Math.random() * digitChars.length)];
    const randomSpecialChar =
        specialChars[Math.floor(Math.random() * specialChars.length)];

    // Combine characters from all categories and shuffle
    const combinedChars =
        uppercaseChars + lowercaseChars + digitChars + specialChars;
    let password =
        randomUppercase + randomLowercase + randomDigit + randomSpecialChar;

    while (password.length < 12) {
        const randomChar =
            combinedChars[Math.floor(Math.random() * combinedChars.length)];
        password += randomChar;
    }

    // Shuffle the password
    password = password.split("");
    for (let i = password.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [password[i], password[j]] = [password[j], password[i]];
    }

    return password.join("");
}

async function compare_passwords_async(
    userEnteredPassword,
    hashedPassword,
    salt
) {
    try {
        const userEnteredHash = await hash(userEnteredPassword, salt);
        return userEnteredHash === hashedPassword;
    } catch (err) {
        throw err;
    }
}

async function hash(target, salt) {
    try {
        const hash = await new Promise((resolve, reject) => {
            bcrypt.hash(target, salt, (err, hash) => {
                if (err) reject(err);
                else resolve(hash);
            });
        });
        return hash;
    } catch (err) {
        throw err; // Handle the error as needed
    }
}

// Function to generate a new token
const generate_token = (user) => {
    return jwt.sign(user, secretKey, { expiresIn: "8h" });
};

// Function to verify a token
const verify_token = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                reject(err);
            } else {
                resolve(user);
            }
        });
    });
};

module.exports = {
    authenticate,
    two_factor_authenticate,
    check_passcode,
    generate_token,
    verify_token,
};
