import * as THREE from "three";

const cursor = document.querySelector(".cursor");
const raccoon = document.querySelector(".raccoon");
const exploreBtn = document.querySelector("#exploreBtn");
const speech = document.querySelector("#speech");
const sections = document.querySelectorAll("section");
const canvasEl = document.querySelector("#flower-canvas");

/* Staggered Panel Navigation Logic */
let navOpen = false;
const header = document.querySelector(".header");
const trigger = document.querySelector(".header__trigger");
const headerNav = document.querySelector(".header__nav");

if (trigger && headerNav) {
  trigger.addEventListener("click", () => {
    header.classList.toggle("open");
    trigger.classList.toggle("open");
    headerNav.classList.toggle("open");
    const amount = navOpen ? 0 : 100;
    
    gsap.timeline({})
      .to(headerNav, 0.4, {
        "--panel-bottom-1": amount,
        ease: "Power1.easeOut"
      })
      .to(headerNav, 0.4, {
        "--panel-bottom-2": amount,
        ease: "Power1.easeOut"
      }, 0.1)
      .to(headerNav, 0.4, {
        "--panel-bottom-3": amount,
        ease: "Power1.easeOut"
      }, 0.2)
      .to(headerNav, 0.4, {
        "--panel-bottom-4": amount,
        ease: "Power1.easeOut"
      }, 0.3);

    navOpen = !navOpen;
  });
}

const navLinks = document.querySelectorAll(".header__link");

// Close nav when a link is clicked
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    if (navOpen) {
      trigger.click();
    }
  });
});

let mouseX = 0;
let mouseY = 0;

/* WebGL Flower Setup */

let pointer = { x: 0.5, y: 0.5, clicked: false, moving: false };
let isStart = true;
let isRendering = true;
let renderer, shaderScene, mainScene, renderTargets, camera, clock;
let basicMaterial, shaderMaterial;

const backgroundColor = new THREE.Color(0xf0cdf4);

function initFlowerScene() {
  renderer = new THREE.WebGLRenderer({ canvas: canvasEl, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  shaderScene = new THREE.Scene();
  mainScene = new THREE.Scene();

  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  clock = new THREE.Clock();

  renderTargets = [
    new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight),
    new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight),
  ];

  const planeGeometry = new THREE.PlaneGeometry(2, 2);

  shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      u_ratio: {type: "f", value: window.innerWidth / window.innerHeight},
      u_point: {type: "v2", value: new THREE.Vector2(pointer.x, pointer.y)},
      u_time: {type: "f", value: 0.},
      u_stop_time: {type: "f", value: 0.},
      u_stop_randomizer: {type: "v3", value: new THREE.Vector3(0, 0, 0)},
      u_texture: {type: "t", value: null},
      u_background_color: {type: "v3", value: backgroundColor}
    },
    vertexShader: document.getElementById("vertexShader").textContent,
    fragmentShader: document.getElementById("fragmentShader").textContent,
    transparent: true
  });

  basicMaterial = new THREE.MeshBasicMaterial({ transparent: true });

  const backgroundColorMaterial = new THREE.MeshBasicMaterial({
    color: backgroundColor,
    transparent: true
  });

  const planeBasic = new THREE.Mesh(planeGeometry, basicMaterial);
  const planeShader = new THREE.Mesh(planeGeometry, shaderMaterial);
  const coloredPlane = new THREE.Mesh(planeGeometry, backgroundColorMaterial);

  shaderScene.add(planeShader);
  mainScene.add(coloredPlane);

  renderer.setRenderTarget(renderTargets[0]);
  renderer.render(mainScene, camera);
  mainScene.remove(coloredPlane);
  mainScene.add(planeBasic);
}

function updateSize() {
  if (shaderMaterial) {
    shaderMaterial.uniforms.u_ratio.value = window.innerWidth / window.innerHeight;
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Re-create render targets on resize
    renderTargets[0].setSize(window.innerWidth, window.innerHeight);
    renderTargets[1].setSize(window.innerWidth, window.innerHeight);
  }
}

initFlowerScene();
updateSize();
window.addEventListener("resize", updateSize);

/* Cursor & Mouse Events */

document.addEventListener("mousemove",(e)=>{

mouseX = e.clientX;
mouseY = e.clientY;

if (cursor) {
  cursor.style.transform=`translate(${mouseX}px,${mouseY}px)`;
}

pointer.x = mouseX / window.innerWidth;
pointer.y = mouseY / window.innerHeight;
pointer.clicked = true; // Continuous "painting" while moving

});

/* Raccoon follow */

function animate(){

if(raccoon){

const offsetX=(mouseX-window.innerWidth/2)*0.01;
const offsetY=(mouseY-window.innerHeight/2)*0.01;

raccoon.style.transform=`translate(${offsetX}px,${offsetY}px)`;

}

// Render Flower Effect
if (isRendering) {
  const delta = clock.getDelta();
  shaderMaterial.uniforms.u_texture.value = renderTargets[0].texture;
  shaderMaterial.uniforms.u_time.value = clock.getElapsedTime() + .9;

  if (pointer.clicked) {
    shaderMaterial.uniforms.u_point.value = new THREE.Vector2(pointer.x, 1 - pointer.y);
    shaderMaterial.uniforms.u_stop_randomizer.value = new THREE.Vector3(Math.random(), Math.random(), Math.random());
    if (isStart) {
      shaderMaterial.uniforms.u_stop_randomizer.value = new THREE.Vector3(.5, 1, 1);
      isStart = false;
    }
    shaderMaterial.uniforms.u_stop_time.value = 0.;
    pointer.clicked = false;
  }
  shaderMaterial.uniforms.u_stop_time.value += delta;

  renderer.setRenderTarget(renderTargets[1]);
  renderer.render(shaderScene, camera);

  basicMaterial.map = renderTargets[1].texture;
  renderer.setRenderTarget(null);
  renderer.render(mainScene, camera);

  let tmp = renderTargets[0];
  renderTargets[0] = renderTargets[1];
  renderTargets[1] = tmp;
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