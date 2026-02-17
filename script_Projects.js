// Navbar toggle
const navbarToggle = document.querySelector('.navbar-toggle');
const navbarMenu = document.querySelector('.navbar-menu');

navbarToggle.addEventListener('click', () => {
    navbarToggle.classList.toggle('active');
    navbarMenu.classList.toggle('active');
});


var lastScrollTop = 0;
    navbar = document.getElementById("navbar");
window.addEventListener("scroll", function() {
    var scrollTop = window.pageXOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop){
        navbar.style.top = "-90px";
    } else {
        navbar.style.top = "0";
    }
    lastScrollTop = scrollTop;
})