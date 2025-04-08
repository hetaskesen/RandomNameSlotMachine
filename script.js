let names = ["Alice", "Bob", "Charlie", "David", "Eve"]; // Replace with the names from your CSV
let spinning = false;
let reel = document.getElementById("reel");
let interval;
let stopRequested = false;

function startSpin() {
  if (spinning) return;
  spinning = true;
  stopRequested = false;
  reel.innerHTML = '';  // Clear previous names
  spinStep();
}

function spinStep() {
  if (!spinning) return;

  const name = names[Math.floor(Math.random() * names.length)];
  const el = document.createElement("div");
  el.innerText = name;
  reel.appendChild(el);

  let shift = reel.children.length * 60;
  reel.style.transition = "none";  // Remove transition for smooth scroll
  reel.style.transform = "translateY(-" + shift + "px)";

  if (reel.children.length > 20) {
    reel.removeChild(reel.firstChild); // Clean up old names
  }

  if (!stopRequested) {
    interval = setTimeout(spinStep, 100);
  } else {
    // Stop after a brief delay and display final name
    setTimeout(() => {
      spinning = false;
      const final = names[Math.floor(Math.random() * names.length)];
      reel.innerHTML = '<div style="color: black;">🎉 ' + final + ' 🎉</div>';
    }, 300);
  }
}

function stopSpin() {
  if (!spinning) return;
  stopRequested = true;
  reel.style.transition = "transform 0.2s ease-in-out";  // Smooth transition to stop
}
