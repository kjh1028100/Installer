class Shape {
  constructor(sx, sy, ex, ey) {
    this.sx = sx;
    this.sy = sy;
    this.ex = ex;
    this.ey = ey;
  }
}

class Square extends Shape {
  constructor() {
    super(sx, sy, ex, ey);
    this.name = `square ${square.length + 1}`;
  }
}

class Circle extends Shape {
  constructor() {
    super(sx, sy, ex, ey);
    this.name = `circle ${circle.length + 1}`;
  }
}
let sx, sy, ex, ey;
let square = [];
let circle = [];
let paints = [];
let moving = -1;
let sq, cr;
let squarePating = false;
let circlePating = false;
let squareKey = "square";
let circleKey = "circle";

const interiorContaier = document.querySelector(".container");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const squareBtn = document.querySelector(".js-square");
const circleBtn = document.querySelector(".js-circle");
const range = document.querySelector(".js-range");
const restoreBtn = document.querySelector(".js-restore");
const saveBtn = document.querySelector(".save_btn");
const saveForm = document.querySelector(".save__container");
const main = document.querySelector("main");

let imageUrl;
let id;

const removeContainer = () => {
  saveForm.classList.remove("active");
  main.classList.remove("active");
};

const redirectHome = () => {
  const home = document.querySelector(".home");
  home.click();
};

const handleSubmit = async () => {
  const input = document.querySelector(".save__container input");
  const value = input.value;
  const imgObj = {
    imageUrl,
    value,
  };
  const response = await fetch(`/api/interior/${id}/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(imgObj),
  });
  if (response.status === 201) {
    removeContainer();
    redirectHome();
  }
  if (response.status === 404) {
    // errorMessage();
    return;
  }
};

const paintContainer = () => {
  saveForm.classList.add("active");
  main.classList.add("active");
};

const handleSaveBtnClick = () => {
  id = interiorContaier.dataset.userId;
  imageUrl = canvas.toDataURL("image/png");
  paintContainer();
  const titleBtn = document.querySelector(".save__container button");
  titleBtn.addEventListener("click", handleSubmit);
};

const handleRestoreBtnClick = () => {
  const check = paints.pop();
  const base = check.name.substring(0, 6);
  if (base === "square") {
    square.pop();
    savePaint();
  }
  if (base === "circle") {
    circle.pop();
    savePaint();
  }
  drawPating();
};

const savePaint = () => {
  localStorage.setItem(squareKey, JSON.stringify(square));
  localStorage.setItem(circleKey, JSON.stringify(circle));
};

const handleSquareBtnClick = () => {
  if (sq === true) {
    sq = false;
    squareBtn.innerText = "사각형";
  } else {
    sq = true;
    cr = false;
    squareBtn.innerText = "사각형 사용중";
  }
};

const getSquareTarget = (x, y) => {
  for (let i = 0; i < square.length; i++) {
    let s = square[i];
    if (x > s.sx && x < s.ex && y > s.sy && y < s.ey) {
      return i;
    }
  }
  return -1;
};

const drawPating = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < square.length; i++) {
    let rect = square[i];
    ctx.strokeRect(rect.sx, rect.sy, rect.ex - rect.sx, rect.ey - rect.sy);
  }
};

const handleMousedown = (e) => {
  const { offsetX, offsetY } = e;
  sx = offsetX;
  sy = offsetY;
  if (sq) {
    moving = getSquareTarget(sx, sy);
    if (moving === -1) {
      squarePating = true;
    }
  }
};

const handleMouseMove = (e) => {
  const { offsetX, offsetY } = e;
  ex = offsetX;
  ey = offsetY;
  if (squarePating) {
    drawPating();
    ctx.strokeRect(sx, sy, ex - sx, ey - sy);
  } else {
    if (moving != -1) {
      const rect = square[moving];
      const gapX = ex - sx;
      const gapY = ey - sy;
      rect.sx += gapX;
      rect.sy += gapY;
      rect.ex += gapX;
      rect.ey += gapY;
      sx = ex;
      sy = ey;
      savePaint();
      drawPating();
    }
  }
  //   if (circlePating) {
  //     drawPating();
  //     ctx.beginPath();
  //   }
};

const handleMouseUp = () => {
  if (squarePating) {
    let x1 = Math.min(sx, ex);
    let y1 = Math.min(sy, ey);
    let x2 = Math.max(sx, ex);
    let y2 = Math.max(sy, ey);
    const newRect = new Square(x1, y1, x2, y2);
    square.push(newRect);
    paints.push(newRect);
    savePaint();
  }
  squarePating = false;
  moving = -1;
};

const loadPaint = () => {
  const squareData = localStorage.getItem(squareKey);
  if (squareData !== null) {
    const squareObj = JSON.parse(squareData);
    square = squareObj;
    paints = squareObj;
    drawPating();
  }
};

function init() {
  const CANVAS_SIZE = 1000;
  ctx.fillStyle = "orange";
  if (canvas) {
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;
    canvas.addEventListener("mousedown", handleMousedown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
  }
  if (squareBtn) {
    squareBtn.addEventListener("click", handleSquareBtnClick);
  }
  if (restoreBtn) {
    restoreBtn.addEventListener("click", handleRestoreBtnClick);
  }
  if (saveBtn) {
    saveBtn.addEventListener("click", handleSaveBtnClick);
  }
  loadPaint();
}

init();
