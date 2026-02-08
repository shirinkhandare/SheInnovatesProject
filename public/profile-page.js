const username = sessionStorage.getItem("currentUser");
if (!username){
    window.location.href="login.html";
}