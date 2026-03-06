const cursor = document.querySelector(".cursor");
const raccoon = document.querySelector(".raccoon");
const exploreBtn = document.querySelector("#exploreBtn");
const speech = document.querySelector("#speech");
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-links a");

let mouseX = 0;
let mouseY = 0;

/* Cursor */

document.addEventListener("mousemove",(e)=>{

mouseX = e.clientX;
mouseY = e.clientY;

cursor.style.transform=`translate(${mouseX}px,${mouseY}px)`;

});

/* Raccoon follow */

function animate(){

if(raccoon){

const offsetX=(mouseX-window.innerWidth/2)*0.01;
const offsetY=(mouseY-window.innerHeight/2)*0.01;

raccoon.style.transform=`translate(${offsetX}px,${offsetY}px)`;

}

requestAnimationFrame(animate);
}

animate();

/* Explore button */

if(exploreBtn){

exploreBtn.addEventListener("click",()=>{

document.querySelector("#about").scrollIntoView({
behavior:"smooth"
});

});

}

/* Scroll reveal */

const observer = new IntersectionObserver((entries)=>{
entries.forEach(entry=>{
if(entry.isIntersecting){
entry.target.classList.add("show");
}
});
});

sections.forEach(section=>{
section.classList.add("hidden");
observer.observe(section);
});

/* Scroll detection */

window.addEventListener("scroll",()=>{

let currentSection="";

sections.forEach(section=>{

const rect=section.getBoundingClientRect();

if(rect.top<=window.innerHeight*0.4 && rect.bottom>=window.innerHeight*0.4){
currentSection=section.id;
}

});

/* Raccoon speech */

switch(currentSection){

case "about":
speech.innerText="This is where you learn about me!";
break;

case "education":
speech.innerText="Here’s my academic journey!";
break;

case "projects":
speech.innerText="Check out my projects!";
break;

case "skills":
speech.innerText="These are my skills!";
break;

case "interests":
speech.innerText="Here are some of my hobbies!";
break;

case "contact":
speech.innerText="Let's get in touch!";
break;

default:
speech.innerText="Welcome to my portfolio :)";

}

/* Navbar active */

navLinks.forEach(link=>{

link.classList.remove("active");

if(link.getAttribute("href").includes(currentSection)){
link.classList.add("active");
}

});

});