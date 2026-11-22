window.addEventListener("load",()=>{

    // Sider Bar
    const side_bar = document.querySelector(".side-bar");
    const side_bar_header = document.querySelector(".side-bar-header");
    const side_bar_body = document.querySelector(".side-bar-body");
    const side_bar_footer = document.querySelector(".side-bar-footer");
    const content_body = document.querySelector(".content-body");


    const side_bar_toggle_button = document.querySelectorAll(".side-bar-toggle-button");
    const side_bar_header_span = document.querySelector(".side-bar-header > span");
    const side_bar_option_buttons_span = document.querySelectorAll(".side-bar-option-button > span");
    const side_bar_footer_buttons_span = document.querySelectorAll(".side-bar-footer-button > span");
    const side_bar_footer_buttons_right_icons = document.querySelectorAll(".side-bar-footer-button > i:last-child");


    let toggle_side_bar = true;

    for(let i = 0; i < side_bar_toggle_button.length; i++){

    side_bar_toggle_button[i].addEventListener("click",() => {
        toggle_side_bar = !toggle_side_bar; 

        side_bar.style.minWidth = toggle_side_bar? "300px" : "92px";
        if(toggle_side_bar){
            setTimeout(() => {
                side_bar_header_span.style.display = toggle_side_bar? "block" : "none";
                side_bar_header.style.justifyContent = toggle_side_bar? "left" : "center";
        
                for(let i = 0; i < side_bar_option_buttons_span.length; i++){
                    side_bar_option_buttons_span[i].style.display = toggle_side_bar? "block" : "none";
                }
                for(let i = 0; side_bar_footer_buttons_span; i ++){
                    side_bar_footer_buttons_span[i].style.display = toggle_side_bar? "block" : "none";
                    side_bar_footer_buttons_right_icons[i].style.display = toggle_side_bar? "block" : "none";
                }
            }, 200);
        }
        else{
            side_bar_header_span.style.display = toggle_side_bar? "block" : "none";
            side_bar_header.style.justifyContent = toggle_side_bar? "left" : "center";
        
            for(let i = 0; i < side_bar_option_buttons_span.length; i++){
                side_bar_option_buttons_span[i].style.display = toggle_side_bar? "block" : "none";
            }
            for(let i = 0; side_bar_footer_buttons_span; i ++){
                side_bar_footer_buttons_span[i].style.display = toggle_side_bar? "block" : "none";
                side_bar_footer_buttons_right_icons[i].style.display = toggle_side_bar? "block" : "none";
            }
        }
        
    });

    }

    // Additional Component
    // dialogue

    const dialogue = document.querySelector(".dialogue");
    const dialogue_conatiner = document.querySelector(".dialogue-container");
    const dialogue_cancel_button = document.querySelector(".dialogue-footer > button:first-child");
    const logout_button = document.querySelector(".logout-button");


    logout_button.addEventListener("click", ()=>{
        dialogue.style.display = "grid";
        dialogue.style.opacity = "1";
        setTimeout(() => {
            dialogue_conatiner.style.opacity = "1";
            dialogue_conatiner.style.transform = "translateY(0)";
        }, 200);
    });

    dialogue_cancel_button.addEventListener("click", ()=>{
        dialogue_conatiner.style.opacity = "0";
        dialogue_conatiner.style.transform = "translateY(1000px)";
        setTimeout(() => {
            dialogue.style.display = "none";
            dialogue.style.opacity = "0";
        }, 200);
    });



    // Loader
    const loader                   = document.querySelectorAll(".loader");
    const loader_closing_div_upper = document.querySelectorAll(".loader-closing-animation-upper");
    const loader_closing_div_lower = document.querySelectorAll(".loader-closing-animation-lower");
    const loader_container_header  = document.querySelectorAll(".loader-container-header");
    const loader_container_body    = document.querySelectorAll(".loader-container-body");
    const loader_container_footer  = document.querySelectorAll(".loader-container-footer");


    console.log(loader_closing_div_upper);
    setTimeout(() => {
        for(let i = 0; i < loader.length; i++){

            loader_container_header[i].style.transform = "translateY(-1000px)";
            loader_container_body[i].style.opacity = "0";
            loader_container_footer[i].style.transform = "translateY(1000px)";

            setTimeout(()=>{
                loader_closing_div_upper[i].style.transform = "translateY(-1000px)";
                loader_closing_div_lower[i].style.transform = "translateY(1000px)";
                setTimeout(()=>{
                    loader[i].style.display = "none";
                }, 500);
            },500);
        }
    }, 3000);



    // Header List Menu
    const content_header_list_button = document.querySelectorAll(".content-header-list-button");
    const header_list_menu = document.querySelectorAll(".header-list-menu");

    let toggleMenuList = true;
    for(let i = 0; i < content_header_list_button.length; i++){
        content_header_list_button[i].addEventListener("click",()=>{
            if(toggleMenuList){
                header_list_menu[i].classList.add("header-list-menu-visible");
                toggleMenuList = !toggleMenuList;
            }
            else{
                header_list_menu[i].classList.remove("header-list-menu-visible");
                toggleMenuList = !toggleMenuList;
            }
        });
    }

});