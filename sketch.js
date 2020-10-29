/* Variables */
let prevX = 0;
let currX = 0;
let prevY = 0;
let currY = 0;
let canvas;
let canvasContext;
let isDrawing = false;

/* Setup Canvas Board */
setupCanvas = () => {
  canvas = document.getElementById("canvas");
  canvasContext = canvas.getContext("2d");
  canvasContext.fillRect(0, 0, 400, canvas.clientWidth);
  canvasContext.fillStyle = "black";

  /*--------------------------------------------------MOUSE EVENT LISTENERS------------------------------------------- */

  canvas.addEventListener("mousemove", (event) => {
    if (isDrawing) {
      prevX = currX;
      /* Statring origin at canvas */
      currX = event.clientX - canvas.offsetLeft;
      prevY = currY;
      currY = event.clientY - canvas.offsetTop;

      /* Drawing on the Canvas */
      drawNumber();
    }
  });

  /* When button is pressed */
  canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    currX = event.clientX - canvas.offsetLeft;
    currY = event.clientY - canvas.offsetTop;
  });

  /* when mouse is released */
  canvas.addEventListener("mouseup", (e) => {
    isDrawing = false;
  });

  /* if mouse is out of bounds: */
  canvas.addEventListener("mouseleave", (event) => {
    isDrawing = false;
  });

  /*--------------------------------------------------TOUCH SCREEN LISTENERS------------------------------------------- */
  //TouchStart
  canvas.addEventListener("touchstart", () => {
    isDrawing = true;
    currX = event.touches[0].clientX - canvas.offsetLeft;
    currY = event.touches[0].clientY - canvas.offsetTop;
  });

  //TouchEnd
  canvas.addEventListener("touchend", () => {
    isDrawing = false;
  });

  //TouchCancelled
  canvas.addEventListener("touchcancel", () => {
    isDrawing = false;
  });

  //TouchMove
  canvas.addEventListener("touchmove", (event) => {
    if (isDrawing) {
      prevX = currX;
      /* Statring origin at canvas */
      currX = event.touches[0].clientX - canvas.offsetLeft;
      prevY = currY;
      currY = event.touches[0].clientY - canvas.offsetTop;

      /* Drawing on the Canvas */
      drawNumber();
    }
  });
};

/* reset Canvas board */
resetCanvas = () => {
  let prevX = 0;
  let currX = 0;
  let prevY = 0;
  let currY = 0;
  canvasContext.fillRect(0, 0, 400, canvas.clientWidth);
  canvasContext.fillStyle = "black";
  isDrawing = false;
};

drawNumber = () => {
  canvasContext.lineJoin = "round";
  canvasContext.beginPath();
  canvasContext.lineWidth = 5;
  canvasContext.strokeStyle = "white";
  canvasContext.moveTo(prevX, prevY);
  canvasContext.lineTo(currX, currY);
  canvasContext.closePath();
  canvasContext.stroke();
};
