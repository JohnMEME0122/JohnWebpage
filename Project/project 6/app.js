const c = document.getElementById("myCanvas");
const canvasHeight = c.height;
const canvasWidth = c.width;
const ctx = c.getContext("2d");
let circle_x = 160;
let circle_y = 60;
let radius = 20;
let xSpeed = 20;
let ySpeed = 20;
let ground_x = 100;
let ground_y = 500;
let ground_height = 5;
let brickArray = [];
let count = 0;

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    brickArray.push(this);
    this.visited = true;
  }

  drawBrick() {
    ctx.fillStyle = "lightblue";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  touchBrick(ballX, ballY) {
    return (
      ballX >= this.x - radius &&
      ballX <= this.x + this.width + radius &&
      ballY >= this.y - radius &&
      ballY <= this.y + this.height + radius
    );
  }
}

//產生磚塊
for (let i = 0; i < 10; i++) {
  new Brick(getRandomArbitrary(0, 950), getRandomArbitrary(0, 550));
}

c.addEventListener("mousemove", function (e) {
  ground_x = e.clientX - c.offsetLeft - 100;
});

function drawCircle() {
  //球碰到磚塊
  brickArray.forEach((brick) => {
    if (brick.visited && brick.touchBrick(circle_x, circle_y)) {
      count++;
      brick.visited = false;
      if (circle_y >= brick.y + brick.height || circle_y <= brick.y)
        ySpeed *= -1;
      else if (circle_x >= brick.x + brick.width || circle_x <= brick.x)
        xSpeed *= -1;

      // brickArray.splice(index, 1); //O(n)

      if (count === 10) {
        alert("遊戲結束");
        clearInterval(game);
      }
    }
  });
  //碰到地板時反彈
  if (
    circle_x >= ground_x - radius &&
    circle_x <= ground_x + 200 + radius &&
    circle_y >= ground_y - radius &&
    circle_y <= ground_y + radius
  ) {
    if (ySpeed > 0) circle_y -= 50;
    else circle_y += 50;

    ySpeed *= -1;
  }

  //碰到牆壁時反彈
  if (circle_x + radius > canvasWidth || circle_x - radius <= 0) {
    xSpeed *= -1;
  } else if (circle_y + radius > canvasHeight || circle_y - radius <= 0) {
    ySpeed *= -1;
  }

  //移動圓的位置
  circle_x += xSpeed;
  circle_y += ySpeed;

  //畫黑色背景
  ctx.fillStyle = "black";
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  //畫磚塊
  brickArray.forEach((brick) => {
    if (brick.visited) brick.drawBrick();
  });

  //畫地板
  ctx.fillStyle = "orange";
  ctx.fillRect(ground_x, ground_y, 200, ground_height);

  //畫圓
  ctx.beginPath();
  ctx.arc(circle_x, circle_y, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = "yellow";
  ctx.fill();
}

let game = setInterval(drawCircle, 25);
