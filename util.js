var PIXEL_RATIO = (function () {
  var ctx = document.createElement("canvas").getContext("2d"),
    dpr = window.devicePixelRatio || 1,
    bsr = ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio || 1;

  return dpr / bsr;
})();

function createHiDPICanvas(w, h, ratio) {
  if (!ratio) { ratio = PIXEL_RATIO; }
  var can = document.createElement("canvas");
  can.width = w * ratio;
  can.height = h * ratio;
  can.style.width = w + "px";
  can.style.height = h + "px";
  can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
  return can;
}

function rand(n) {
  return Math.floor(Math.random() *n +1);
}

function assignConfig(cfg, ctx) {
  Object.keys(cfg).forEach(function(key) {
    ctx[key] = cfg[key];
  });
}

function drawRect(cfg) {
  cfg.canvas.font = cfg.font;
  cfg.canvas.beginPath();
  cfg.canvas.rect((cfg.x || 0), (cfg.y || 0), cfg.width, cfg.height);
  cfg.canvas.fillStyle = cfg.color ;
  cfg.canvas.fill();
  cfg.canvas.closePath();
}

function drawLine(cfg) {
  var can = cfg.canvas;
  can.beginPath();
  can.moveTo(cfg.start.x, cfg.start.y);
  can.lineWidth = cfg.lineWidth || 0.1;
  can.lineTo(cfg.end.x, cfg.end.y);
  can.stroke();
}
