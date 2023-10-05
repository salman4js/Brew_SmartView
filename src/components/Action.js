const storage = require("../Controller/Storage/Storage")

const changeScreen = (isTokenExpired) => { // Navigate back to the respective login route when the page expires!
    const loggedInID = storage.getStorage("loggedInID");
    const redirectTo = storage.getStorage("redirectTo");
    const multipleLogins = storage.getStorage("multipleLogin");
    console.log(storage.getStorage('multipleLogin'));
    storage.clearStorage(); // Clearing out the local storage on every session expires!
    if(redirectTo !== "vouchers" && multipleLogins !== 'true' && isTokenExpired === undefined){
      window.location.href = `/${loggedInID}/chooselogin`;
    } else {
      window.location.href = `/login`;
    }
}

export default changeScreen;