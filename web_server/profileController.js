const formattedResponse = require("./formattedJsonData");

class ProfileController {
    async get_name(client, requestData) {
        console.log("Getting name");
        await client.connect();
        const db = client.db("FYP-IHIES");
        const coll_auth = db.collection("Authentication");
        // const coll_otp = db.collection("OTP");
        // const coll_passcode = db.collection("Passcode");
        const cursor = coll_auth.find({ "user.id": requestData.id });

        // Get query result from mongodb
        const data = await cursor.toArray();

        // check if uid exists
        if (!data.length) {
            return formattedResponse.errorMsg(
                "Profile Info Retrieval Failed",
                "/username",
                "Profile does not exist."
            );
        }

        const result = { passcode_verification: true, name: data[0].user.name };

        return formattedResponse.successMsg(result);
    }
}

module.exports = { ProfileController };
