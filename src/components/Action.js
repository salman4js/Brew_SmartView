const storage = require("../Controller/Storage/Storage")

const changeScreen = (isTokenExpired) => { // Navigate back to the respective login route when the page expires!
    const loggedInID = storage.getStorage("loggedInID");
    const redirectTo = storage.getStorage("redirectTo");
    const multipleLogins = storage.getStorage("multipleLogin");
    storage.clearStorage(); // Clearing out the local storage on every session expires!
    if(redirectTo !== "vouchers" && multipleLogins !== 'false' && isTokenExpired === undefined){
      window.location.href = `/login`; // TODO: Change this to choose login route.
      // 1, Can make the REST to send only the token and set it again in the local storage instead of clearing out the session storage!
    } else {
      window.location.href = `/login`;
    }
}

export default changeScreen;