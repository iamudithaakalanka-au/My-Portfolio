// Navbar toggle
const navbarToggle = document.querySelector('.navbar-toggle');
const navbarMenu = document.querySelector('.navbar-menu');

navbarToggle.addEventListener('click', () => {
    navbarToggle.classList.toggle('active');
    navbarMenu.classList.toggle('active');
});


// Smooth scroll nevigation to the About-Me section
document.querySelector('.btn').addEventListener('click', function(smoothscroll) {
    smoothscroll.preventDefault();

    const section = document.querySelector('#about-me');

    section.scrollIntoView({
        behavior: 'smooth'
    });
});