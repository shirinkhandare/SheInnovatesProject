/*Button event listeners*/
const homebutton = document.getElementById('home-button');
homebutton.addEventListener('click', () => {
    window.location.href = 'index.html';
});//When user clicks home button, redirect to homepage

const profilebutton = document.getElementById('profile-button');
const userName= document.getElementById("username");
profilebutton.addEventListener('click', ()=>{
    sessionStorage.setItem("currentUser", userName);
    window.location.href='profile-page.html';
}); 
/*username find/save*/

