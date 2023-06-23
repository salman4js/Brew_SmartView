const storage = require("../Controller/Storage/Storage")

const changeScreen = () => {
    console.log("Changing screen, cause token has expired");
    storage.clearStorage(); // Clearing out the local storage on every session expires!
    window.location.href = "/login";
}

export default changeScreen;