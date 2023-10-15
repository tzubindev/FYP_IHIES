const data = require("./dataCollection");

module.exports = {
    errorMsg(errorMsg, path) {
        return {
            timestamp: data.currentTime(),
            type: "Error",
            message: errorMsg,
            path: path,
        };
    },
};
