const bcrypt = require("bcrypt");
const FormattedResponse = require("./formattedJsonData");

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
            return FormattedResponse.errorMsg(
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

        return FormattedResponse.successMsg(result);
    } catch (error) {
        return FormattedResponse.errorMsg(
            "Authentication Error",
            "/login",
            error.message
        );
    } finally {
        // Ensure that the client will close when you finish/error
        await client.close();
    }
}

async function two_factor_authenticate(uid) {}

module.exports = { authenticate };
