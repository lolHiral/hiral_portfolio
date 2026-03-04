const cursor = document.querySelector(".cursor");
const raccoon = document.querySelector(".raccoon");

let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  if (cursor) {
    cursor.style.left = e.pageX + "px";
    cursor.style.top = e.pageY + "px";
  }
});

function animate() {
  if (raccoon) {
    const offsetX = (mouseX - window.innerWidth / 2) * 0.01;
    const offsetY = (mouseY - window.innerHeight / 2) * 0.01;

    raccoon.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  }

  requestAnimationFrame(animate);
}

animate();