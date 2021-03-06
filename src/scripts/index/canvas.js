(() => {
  const drawMethod = document.getElementById('drawMethod');
  const erase = document.getElementById('erase');
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');

  const mousedown = {};
  let drawingSurfaceImageData = '';

  let draging = false;

  function windowToCanvas(x, y) {
    const bbox = canvas.getBoundingClientRect();
    return {
      x: x - bbox.left,
      y: y - bbox.top,
    };
  }

  function drawGrid(color, stepx, stepy) {
    context.strokeStyle = color;
    context.lineWdith = 0.5;

    for (let i = stepx + 0.5; i < context.canvas.width; i += stepx) {
      context.beginPath();
      context.moveTo(i, 0);
      context.lineTo(i, context.canvas.height);
      context.stroke();
    }

    for (let i = stepy + 0.5; i < context.canvas.height; i += stepy) {
      context.beginPath();
      context.moveTo(0, i);
      context.lineTo(context.canvas.width, i);
      context.stroke();
    }
  }

  function drawLine(location) {
    context.beginPath();
    context.moveTo(mousedown.x, mousedown.y);
    context.lineTo(location.x, location.y);
    context.stroke();
  }

  function drawCircle(location) {
    const x = Math.abs(mousedown.x - location.x);
    const y = Math.abs(mousedown.y - location.y);
    const radiuse = Math.sqrt((x ** 2) + (y ** 2));

    context.beginPath();
    context.arc(mousedown.x, mousedown.y, radiuse, 0, Math.PI * 2, false);
    context.stroke();
  }

  function saveDrawingsurface() {
    drawingSurfaceImageData = context.getImageData(0, 0, canvas.width, canvas.height);
  }

  function restoreDrawingSurface() {
    context.putImageData(drawingSurfaceImageData, 0, 0);
  }

  canvas.addEventListener('mousedown', (e) => {
    const location = windowToCanvas(e.clientX, e.clientY);

    mousedown.x = location.x;
    mousedown.y = location.y;

    saveDrawingsurface();

    draging = true;
  }, false);

  canvas.addEventListener('mousemove', (e) => {
    const location = windowToCanvas(e.clientX, e.clientY);

    if (draging) {
      context.clearRect(0, 0, canvas.width, canvas.height);

      restoreDrawingSurface();

      switch (drawMethod.value) {
        case 'line':
          drawLine(location);
          break;

        case 'circle':
          drawCircle(location);
          break;

        default:
      }
    }
  }, false);

  canvas.addEventListener('mouseup', () => {
    draging = false;
    saveDrawingsurface();
  }, false);

  erase.addEventListener('click', () => {
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid('lightgray', 10, 10);
  }, false);

  drawGrid('lightgray', 10, 10);
})();

