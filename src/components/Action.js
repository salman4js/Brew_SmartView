const changeScreen = () => {
    console.log("Changing screen, cause token has expired");
    window.location.href = "/login";
}

export default changeScreen;