const storage = require("../Controller/Storage/Storage")

const changeScreen = () => { // Navigate back to the respective login route when the page expires!
    const loggedInID = storage.getStorage("loggedInID");
    const redirectTo = storage.getStorage("redirectTo");
    const multipleLogins = storage.getStorage("multipleLogin");
    storage.clearStorage(); // Clearing out the local storage on every session expires!
    if(redirectTo !== "vouchers" && multipleLogins){
      window.location.href = `/${loggedInID}/chooselogin`;
    } else {
      window.location.href = `/login`;
    }
}

export default changeScreen;