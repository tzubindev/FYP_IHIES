const data = require("./dataCollection");

module.exports = {
    errorMsg(errorMsg, path, description = null) {
        return {
            timestamp: data.currentTime(),
            type: "Error",
            message: errorMsg,
            description: description,
            path: path,
        };
    },
    successMsg(msg) {
        return {
            timestamp: data.currentTime(),
            type: "Success",
            message: msg,
        };
    },
};
