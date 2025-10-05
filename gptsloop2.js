const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// ---------- PENROSE TRIANGLE SHAPES ----------
function drawShape(p, f, s, useGradient = false) {
  if (useGradient) {
    const minX = Math.min(...p.map(pt => pt[0]));
    const minY = Math.min(...p.map(pt => pt[1]));
    const maxX = Math.max(...p.map(pt => pt[0]));
    const maxY = Math.max(...p.map(pt => pt[1]));
    const gradient = ctx.createLinearGradient(maxX, maxY, minX, minY);
    gradient.addColorStop(0, 'rgba(49, 4, 19, 1)');
    gradient.addColorStop(1, f);
    ctx.fillStyle = gradient;
  } else ctx.fillStyle = f;

  ctx.strokeStyle = s;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(p[0][0], p[0][1]);
  for (let i = 1; i < p.length; i++) ctx.lineTo(p[i][0], p[i][1]);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

const shapes = [
  {points: [[215,0],[285,0],[500,430],[140,430],[177,360],[405,360]], fill: '#ff004cff', stroke: '#140f58ff'},
  {points: [[500,430],[475,500],[25,500],[215,140],[253,210],[140,430]], fill: '#5a0723ff', stroke: '#140f58ff'},
  {points: [[215,0],[405,360],[335,360],[215,140],[25,500],[0,430]], fill: '#b91f5fff', stroke: '#140f58ff'}
];

// ---------- BALL ----------
function draw3DBall(x, y, radius) {
  const gradient = ctx.createRadialGradient(
    x - radius / 14, y - radius / 14, radius / 20,
    x, y, radius
  );
  gradient.addColorStop(0, 'white');
  gradient.addColorStop(0.7, '#7dddf5ff');
  gradient.addColorStop(1, '#0b2150ff');
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.strokeStyle = '#0b2150ff';
  ctx.lineWidth = 0.01;
  ctx.stroke();
}

// ---------- PATH + LAYERS ----------
const path = [
  [322,147],[725,360],[450,500],[450,190],[810,390],
  [420,590],[420,330],[730,470],[340,650],[340,240],
  [600,380],[290,540],[322,147]
];

const layerSchedule = [
  { start: 0.0, end: 0.18, under: [2,1], over: [0] },
  { start: 0.18, end: 0.334, under: [], over: [0,1,2] },
  { start: 0.334, end: 0.52, under: [0,2], over: [1] },
  { start: 0.52, end: 0.667, under: [], over: [1,2,0] },
  { start: 0.667, end: 0.845, under: [1], over: [2,0] },
  { start: 0.845, end: 1.0, under: [], over: [2,0,1] }
];

function getActiveLayer(t) {
  return layerSchedule.find(layer => t >= layer.start && t < layer.end);
}

function interpolate(p1, p2, t) {
  return [p1[0] + (p2[0] - p1[0]) * t, p1[1] + (p2[1] - p1[1]) * t];
}

// ---------- BACKGROUND ----------
const stars = Array.from({ length: 500 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 1.5,
  speed: Math.random() * 0.35 + 0.1   
}));

const smudges = Array.from({ length: 40 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 120 + 80,
  hue: 200 + Math.random() * 100,
  alpha: 0.03 + Math.random() * 0.08
}));

function drawStarfield() {
  for (const s of stars) {
    s.x -= s.speed; // drift left

    if (s.x < -s.r) { //stop from going off-screen
      s.x = canvas.width + s.r;
      s.y = Math.random() * canvas.height;
    }

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${0.35 + Math.random() * 0.6})`; // twinkle
    ctx.fill();
  }
}

function drawGalaxyBackground() {
  const g = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, 0,
    canvas.width / 2, canvas.height / 2, canvas.width
  );
  g.addColorStop(0, '#120428');
  g.addColorStop(1, 'black');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const s of smudges) {
    const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r);
    grad.addColorStop(0, `hsla(${s.hue}, 100%, 70%, ${s.alpha})`);
    grad.addColorStop(1, `hsla(${s.hue}, 100%, 10%, 0)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }

  drawStarfield();
}

// ---------- MAIN DRAW ----------
let t = 0;
const speed = 0.0016;
let prevPos = [path[0][0], path[0][1]];
let rotation = 0;

function drawPenrose() {
  const layer = getActiveLayer(t);

  // under layers
  ctx.save();
  ctx.translate(800, 150);
  ctx.rotate(Math.PI / 2);
  layer.under.forEach(i => drawShape(shapes[i].points, shapes[i].fill, shapes[i].stroke, true));
  ctx.restore();

  // ball
  const segmentCount = path.length - 1;
  const segmentProgress = t * segmentCount;
  const currentSegment = Math.floor(segmentProgress);
  const localT = segmentProgress % 1;
  const p1 = path[currentSegment];
  const p2 = path[(currentSegment + 1) % path.length];
  const [x, y] = interpolate(p1, p2, localT);
  const dx = x - prevPos[0];
  const dy = y - prevPos[1];
  const distance = Math.sqrt(dx * dx + dy * dy);
  rotation += distance / 25;
  prevPos = [x, y];

  ctx.save();
  ctx.translate(x, y);
  draw3DBall(0, 0, 27);
  ctx.rotate(rotation);
  ctx.beginPath();
  ctx.moveTo(-10, 0);
  ctx.lineTo(10, 0);
  ctx.strokeStyle = '#b0cff8ff';
  ctx.lineWidth = 0.3;
  ctx.stroke();
  ctx.restore();

  // over layers
  ctx.save();
  ctx.translate(800, 150);
  ctx.rotate(Math.PI / 2);
  layer.over.forEach(i => drawShape(shapes[i].points, shapes[i].fill, shapes[i].stroke, true));
  ctx.restore();

  t += speed;
  if (t > 1) t = 0;
}



// ---------- LOOP ----------
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGalaxyBackground();
  drawPenrose()
  requestAnimationFrame(draw);
}


draw();
