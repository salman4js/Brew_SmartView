const storage = require("../Controller/Storage/Storage")

const changeScreen = () => {
    const loggedInID = storage.getStorage("loggedInID");
    console.log("Changing screen, cause token has expired");
    storage.clearStorage(); // Clearing out the local storage on every session expires!
    window.location.href = `${loggedInID}/chooselogin`;
}

export default changeScreen;