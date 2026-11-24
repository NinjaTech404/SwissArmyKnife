function addUser(username="", password = ""){

    if(username.length > 4 && password.length >= 8){
        return {
            username: username,
            password: password,
        };
    }

    return null;
}


function getUserInfo(name = "", db = []){
    if(db.length > 0 && name.length > 4){
        for(let i = 0; i < db.length; i++){
            const {username, password} = db[i];
            if(username == name){
                return {username, password};
            }
        }
    }
    return null;
}


window.addEventListener("load", ()=>{

    if(!localStorage.getItem("users")){
        localStorage.setItem("users", JSON.stringify([]));
    }

    let users_db = JSON.parse(localStorage.getItem("users"));



});