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

    let users_db = JSON.parse(localStorage.getItem("users")); // The Local Storage

    // Sign Up

    const signup_button = document.querySelector("#signup-button") || document.createElement("div");
    const signup_email  = document.querySelector("#signup-email")  || document.createElement("div");
    const signup_pass   = document.querySelector("#signup-pass")   || document.createElement("div");
    const error_message = document.querySelector(".error-message");

    signup_button.addEventListener("click", ()=>{

        let email_value = signup_email.value.trim();
        let pass_value = signup_pass.value;

        
        if(email_value.length == 0 && pass_value.length == 0){
            error_message.style.display = "block";
            error_message.innerHTML = "Email & Password are required!";
        }
        else if(email_value.length == 0){
            error_message.style.display = "block";
            error_message.innerHTML = "Email is required!";
        }
        else if(pass_value.length == 0){
            error_message.style.display = "block";
            error_message.innerHTML = "Password is required!";
        }

        else if(!signup_email.validity.valid){
            error_message.style.display = "block";
            error_message.innerHTML = "Invalid Email!";
        }

        else if(pass_value.length < 8){
            error_message.style.display = "block";
            error_message.innerHTML = "Password must be atleast 8 characters or more!";
        }

        else { 

            let new_user = addUser(email_value, pass_value);
            if(getUserInfo(email_value, users_db)){
                error_message.style.display = "block"; 
                error_message.innerHTML = "This email is already in use!!";
            }
            else if(new_user){
                users_db.push(new_user);
                localStorage.setItem("users", JSON.stringify(users_db));
                error_message.style.display = "none"; 
                location.assign("index/dashboard.html");
            }
            else {
                error_message.style.display = "block"; 
                error_message.innerHTML = "Something Went Wrong!!";
            }

        }
    });

    //Login
    const login_button = document.querySelector("#login-button");
    const login_email  = document.querySelector("#login-email");
    const login_pass   = document.querySelector("#login-pass");


     login_button.addEventListener("click", ()=>{


        let email_value = login_email.value.trim();
        let pass_value  = login_pass.value;

        
        if(email_value.length == 0 && pass_value.length == 0){
            error_message.style.display = "block";
            error_message.innerHTML = "Email & Password are required!";
        }
        else if(email_value.length == 0){
            error_message.style.display = "block";
            error_message.innerHTML = "Email is required!";
        }
        else if(pass_value.length == 0){
            error_message.style.display = "block";
            error_message.innerHTML = "Password is required!";
        }

        else if(!login_email.validity.valid){
            error_message.style.display = "block";
            error_message.innerHTML = "Invalid Email!";
        }

        else if(pass_value.length < 8){
            error_message.style.display = "block";
            error_message.innerHTML = "Password must be atleast 8 characters or more!";
        }

        else {
            let user_info = getUserInfo(email_value, users_db);
            if(user_info){

                if(user_info.password === pass_value){
                    localStorage.setItem("users", JSON.stringify(users_db));
                    error_message.style.display = "none"; 
                    location.assign("index/dashboard.html");
                }
                else {
                    error_message.style.display = "block"; 
                    error_message.innerHTML = "Incorrect Email or Password!!";
                }


            }

            else{
                error_message.style.display = "block"; 
                error_message.innerHTML = "There is no account asscociated with this email!!";
            }

        }
    });

});