const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click' , () => {
document.body.classList.toggle('darkMode');


// save in local storage
if(document.body.classList.contains('darkMode')){
    localStorage.setItem('theme', 'dark');
}else{
    localStorage.setItem('theme', 'light');
}
});

//load saved theme on page load
if(localStorage.getItem('theme') === 'dark'){
    document.body.classList.add('darkMode');
    
}
