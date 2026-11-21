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

});