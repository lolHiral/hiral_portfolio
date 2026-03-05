const cursor = document.querySelector(".cursor");
const raccoon = document.querySelector(".raccoon");
const exploreBtn = document.querySelector("#exploreBtn");
const speech = document.querySelector("#speech");
const sections = document.querySelectorAll("section");

let mouseX = 0;
let mouseY = 0;


/* Cursor movement */

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  if (cursor) {
    cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  }
});


/* Raccoon follow animation */

function animate() {

  if (raccoon) {

    const offsetX = (mouseX - window.innerWidth / 2) * 0.01;
    const offsetY = (mouseY - window.innerHeight / 2) * 0.01;

    raccoon.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  }

  requestAnimationFrame(animate);
}

animate();


/* Explore button scroll */

if (exploreBtn) {
  exploreBtn.addEventListener("click", () => {

    document.querySelector("#about").scrollIntoView({
      behavior: "smooth"
    });

  });
}


/* Section detection for raccoon speech */

window.addEventListener("scroll", () => {

  if (!speech) return;

  let currentSection = "";

  sections.forEach(section => {

    const rect = section.getBoundingClientRect();

    if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.4) {
      currentSection = section.id;
    }

  });

  switch(currentSection){

    case "about":
      speech.innerText = "This is where you learn about me!";
      break;

    case "projects":
      speech.innerText = "Check out my projects!";
      break;

    case "skills":
      speech.innerText = "These are my skills!";
      break;

    case "interests":
      speech.innerText = "Here are some of my hobbies!";
      break;

    case "contact":
      speech.innerText = "Let's get in touch!";
      break;

    default:
      speech.innerText = "Welcome to my portfolio :)";
  }

});