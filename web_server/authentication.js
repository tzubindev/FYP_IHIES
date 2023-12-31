const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2/promise");
const formattedResponse = require("./formattedJsonData");
const emailHandler = require("./emailHandler");

const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

const secretKey = process.env.TOKEN_SECRET_KEY;

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

        const confirmedUser = isAuthenticated
            ? { id: requestData.id, role: role }
            : null;

        // Add role into result
        const result = isAuthenticated
            ? {
                  authentication: isAuthenticated,
                  user: confirmedUser,
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

async function two_factor_authenticate(pool, requestData) {
    let connection;
    try {
        // Get a MySQL connection from the pool
        connection = await pool.getConnection();

        // SEND
        if (
            (requestData.type === "forgetPassword" ||
                requestData.type === "login") &&
            requestData.mode === "send"
        ) {
            // Query the user data from the MySQL database
            const table =
                requestData.role === "patient"
                    ? "patient_profile"
                    : "mp_profile";
            const [userDataRows] = await connection.execute(
                `SELECT email FROM ${table} WHERE id = ?`,
                [requestData.id]
            );

            // Check if user id exists
            if (!userDataRows.length) {
                return formattedResponse.errorMsg(
                    "Authentication Failed",
                    "/login",
                    "User Id does not exist."
                );
            }

            // only one uid will be matched
            const email = userDataRows[0].email;

            // Generate random otp
            const otp = OTP_generator();

            // Send e-mail for otp (your email sending logic goes here)
            await emailHandler.sendOTP(email, `${otp.id}-${otp.code}`);

            // Store otp to database
            // The otp will be valid for 5 mins
            const expirationDate = new Date(Date.now() + 5 * 60 * 1000);
            expirationDate.setHours(expirationDate.getHours() + 8); // Adding 8 hours for UTC+8

            const formattedExpirationDate = expirationDate
                .toISOString()
                .slice(0, 19)
                .replace("T", " ");
            const otpData = {
                expired: formattedExpirationDate,
                id: otp.id,
                code: otp.code,
            };

            const [result] = await connection.execute(
                "INSERT INTO otp (id, code, expired) VALUES (?, ?, ?)",
                [otpData.id, otpData.code, otpData.expired]
            );

            let response;

            // Res to Req
            if (result.affectedRows === 1) {
                response = { id: otp.id };
            } else {
                response = "Failed to insert OTP data";
            }

            return formattedResponse.successMsg(response);
        }

        // RECEIVE
        if (requestData.mode === "receive") {
            // Verify otp and take action correspondingly
            if (
                requestData.type === "login" ||
                requestData.type === "forgetPassword"
            ) {
                const [otpDataRows] = await connection.execute(
                    "SELECT * FROM otp WHERE id = ?",
                    [requestData.otp.id]
                );

                // Verification
                let result;
                if (otpDataRows.length === 1) {
                    const target = otpDataRows[0];

                    if (
                        target.expired > new Date() &&
                        target.id === requestData.otp.id &&
                        target.code == requestData.otp.code
                    ) {
                        result =
                            "VER_SUCCESS" +
                            "|" +
                            generate_token(requestData.user);
                    } else {
                        result = "VER_FAILED";
                    }
                } else {
                    result = "VER_FAILED";
                }

                // If it is forgetPassword req, additional actions needed
                if (requestData.type === "forgetPassword") {
                    // Additional actions for forgetPassword
                    const randomPassword = random_password_generator();

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
        // Release the MySQL connection back to the pool
        if (connection) connection.release();
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
const verify_token = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: "Token is missing" });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded; // Attach user information to the request
        delete req.user.pw;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = {
    authenticate,
    two_factor_authenticate,
    generate_token,
    verify_token,
};
