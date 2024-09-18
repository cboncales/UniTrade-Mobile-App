function setRouter() {
    switch (window.location.pathname) {
        case "/":
        case "/login.html":
        case "/signup.html":
            if (localStorage.getItem("access_token")) {
                window.location.pathname = "/home.html";
            }
            break;
        default:
            if (!localStorage.getItem("access_token")) {
                window.location.pathname = "/login.html";
            }
            break;
    }
}

export { setRouter };