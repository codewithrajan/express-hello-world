//navbar
var MenuItems = document.getElementById("MenuItems");
MenuItems.style.maxHeight = "0px";
function menutoggle() {
    if (MenuItems.style.maxHeight == "0px") {
        MenuItems.style.maxHeight = "200px"
    }
    else {
        MenuItems.style.maxHeight = "0px"
    }
}
//preloder
// var loader = document.getElementById("preloader");
// window.addEventListener("load", function(){
//         loader.style.display = "none";
// })   

// //Slider JScript

//     let slideIndex = 0;
//     showSlides();

//     function showSlides() {
//       let i;
//       let slides = document.getElementsByClassName("mySlides");
//       let dots = document.getElementsByClassName("dot");
//       for (i = 0; i < slides.length; i++) {
//         slides[i].style.display = "none";  
//       }
//       slideIndex++;
//       if (slideIndex > slides.length) {slideIndex = 1}    
//       for (i = 0; i < dots.length; i++) {
//         dots[i].className = dots[i].className.replace(" active", "");
//       }
//       slides[slideIndex-1].style.display = "block";  
//       dots[slideIndex-1].className += " active";
//       setTimeout(showSlides, 3000); // Change image every 2 seconds
//     }


//fot to timeout





let timeout;

function resetSessionTimeout() {
    clearTimeout(timeout);
    // Set the session timeout duration in milliseconds
    timeout = setTimeout(logout, 120000); // Logout after one minute of inactivity
}

function logout() {
    // Perform logout action, e.g., redirect to the logout route
    window.location.href = '/logout';
}

// Attach event listeners to reset the timeout on user activity
document.addEventListener('mousemove', resetSessionTimeout);
document.addEventListener('keydown', resetSessionTimeout);
window.addEventListener('beforeunload', (event) => {
    // Clear the timeout to prevent logout when closing the tab
    clearTimeout(timeout);
  });

// Initial setup
resetSessionTimeout();

