const canvas = document.getElementById('demo');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


let time = 0;
function draw() {
  time += 0.01;
  ctx.fillStyle = "rgba(4, 38, 46, 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  for (let i = 0; i < 200; i++) {
    const angle = i * 0.2 + time;
    const radius = 200 + 100 * Math.cos(time * 2 + i / 4);
    const x = cx + radius * Math.tan(angle);
    const y = cy + radius * Math.cos(angle);

    ctx.fillStyle = `hsl(${(i * 20 + time * 100) % 360}, 100%, 50%)`;
    ctx.fillRect(x, y, 4, 4);
     ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(150, 27, 221, 0.4)";
    ctx.fill();
  }

  requestAnimationFrame(draw);
}

draw();
