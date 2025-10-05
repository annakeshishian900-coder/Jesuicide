const canvas = document.getElementById('canvas');
ctx = canvas.getContext('2d');
function drawShape(p, f, s) {
  ctx.fillStyle = f;
  ctx.strokeStyle = s;
  ctx.beginPath();
  ctx.moveTo(p[0][0], p[0][1]);
  for (let i = 1; i < p.length; i++) ctx.lineTo(p[i][0], p[i][1]);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}
const shapes = [
  {points: [[215,0],[285,0],[500,430],[140,430],[177,360],[405,360]], fill: '#d9f075ff', stroke: 'lightblue'},
  {points: [[500,430],[475,500],[25,500],[215,140],[255,210],[140,430]], fill: '#32a683ff', stroke: 'lightblue'},
  {points: [[215,0],[405,360],[335,360],[215,140],[25,500],[0,430]], fill: '#da59afff', stroke: 'lightblue'}];



function draw3DBall(x, y, radius) {
  // Create radial gradient (light source is at top-left)
  let gradient = ctx.createRadialGradient(
    x - radius / 4, y - radius /4, radius / 6, // light highlight center
    x, y, radius // ball center and outer radius
  );

  gradient.addColorStop(0, 'white');           // bright highlight
  gradient.addColorStop(0.7, '#878582');           // main ball color
  gradient.addColorStop(1, '#2e2d2d');         // shadow on edges

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.strokeStyle = 'lightblue';
  ctx.lineWidth = 0.1;
  ctx.stroke();
}

const path = [
[322,147],
[725,360],
[450,500],
[450,190],
[810,390],
[420,590],
[420,330],
[730,470],
[340,650],
[340,240],
[600,380],
[290,540],
[322,147],
];

const layerSchedule = [
  { start: 0.0, end: 0.18, under: [2,1], over: [0] },
  { start: 0.18, end: 0.334, under: [], over: [0,1,2] },
  { start: 0.334, end: 0.52, under: [0,2], over: [1] },
  { start: 0.52, end: 0.667, under: [], over: [1,2,0] },
  { start: 0.667, end: 0.845, under: [1], over: [2,0] },
  { start: 0.845, end: 1.0, under: [], over: [2,0,1] },
];


let t = 0;
const speed = 0.001;

function interpolate(p1, p2, t) {
  return [
    p1[0] + (p2[0] - p1[0]) * t,
    p1[1] + (p2[1] - p1[1]) * t
  ];
}

function draw() {
ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = 'lightblue';
ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('t: ' + t.toFixed(3), 20, 30);

  function getActiveLayer(t) {
  return layerSchedule.find(layer => t >= layer.start && t < layer.end);
}

  const layer = getActiveLayer(t);
  ctx.save();
  ctx.translate(800, 150);
  ctx.rotate(Math.PI / 2);
  layer.under.forEach(i => drawShape(shapes[i].points, shapes[i].fill, shapes[i].stroke));
  ctx.restore();

  const segmentCount = path.length - 1;
  const segmentProgress = t * segmentCount; // maps 0–1 to 0–(segmentCount)
  const currentSegment = Math.floor(segmentProgress);
  const localT = segmentProgress % 1;

  const p1 = path[currentSegment];
  const p2 = path[(currentSegment + 1) % path.length];

  const [x, y] = interpolate(p1, p2, localT);
  draw3DBall(x, y, 25);

  ctx.save();
  ctx.translate(800, 150);
  ctx.rotate(Math.PI / 2);
  layer.over.forEach(i => drawShape(shapes[i].points, shapes[i].fill, shapes[i].stroke));
  ctx.restore();

  ctx.restore();
    // Update overall progress
  t += speed;
  if (t > 1) t = 0; // loop back to start

  requestAnimationFrame(draw);


}

draw();

