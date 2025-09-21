const canvas = document.getElementById('demo');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let time = 0;

// Parameters
let dotColor = "black";
let waveAmp = 100;
let angleSpacing = 0.1;
let startRadius = 10;
let numDots = 500;
let backgroundColor = "black";
let backgroundOpacity = 0.05;
let useCrazyColors = true;



// Function to generate random color
function randomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}

function randomBackground() {
  backgroundColor = {
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256)
  };
}

// Create the button ONCE, outside draw()
const myButton = document.createElement("button");
myButton.innerHTML = "Randomize";
myButton.style.position = "absolute";
myButton.style.top = "10px";
myButton.style.left = "10px";
myButton.style.zIndex = 10;
document.body.appendChild(myButton);

// Add click listener
myButton.addEventListener("click", () => {
  numDots = Math.floor(Math.random() * 300) + 50;
  startRadius = Math.random() * 300 + 50;
  waveAmp = Math.random() * 150;
  angleSpacing = Math.random() * 0.5 + 0.05;
  dotColor = randomColor();
  backgroundColor = randomColor();
useCrazyColors = Math.random() > 0.8; 
randomBackground();
});

function draw() {
  time += 0.01;

 ctx.fillStyle = `rgba(${backgroundColor.r}, ${backgroundColor.g}, ${backgroundColor.b}, ${backgroundOpacity})`;
ctx.fillRect(0, 0, canvas.width, canvas.height);


  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  

  for (let i = 0; i < numDots; i++) {
    const angle = i * angleSpacing + time;
    const radius = startRadius + waveAmp * Math.cos(time * 2 + i / 4);
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
   

    // Rainbow effect
    if (useCrazyColors)
{    const baseHue = (i * 30 + time * 200) % 360;  // like original
    const randomShift = Math.random() * 50 - 25;  // -25 to +25 random variation
    const hue = (i * 20 + time * 100) % 360;
    const sat = 80;
    const light = 60 + Math.random() * 10;
    ctx.fillStyle = `hsl(${hue}, ${sat}%, ${light}%)`;
} else { 
    ctx.fillStyle = dotColor;
}
ctx.fillRect(x, y, 4, 4);


    // Dot itself
      ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);

    ctx.fill();
  }

  requestAnimationFrame(draw);
}

// Start animation
draw();

