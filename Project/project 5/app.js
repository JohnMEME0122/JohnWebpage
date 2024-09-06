const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const unit = 20;
const row = canvas.height / unit; //320/20 = 16
const column = canvas.width / unit; //320/20 = 24

let snake = []; //都是一個物件

function createSnake() {
  for (let i = 0; i < 4; i++) {
    snake[i] = {
      x: 80 - i * unit,
      y: 0,
    };
  }
}

class Fruit {
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }

  drawFruit() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  pickALocation() {
    let overlapping = false;
    let new_x;
    let new_y;

    function checkOverlap(new_x, new_y) {
      for (let i = 0; i < snake.length; i++) {
        if (new_x == snake[i].x && new_y == snake[i].y) {
          overlapping = true;
          return;
        } else {
          overlapping = false;
        }
      }
    }

    do {
      new_x = Math.floor(Math.random() * column) * unit;
      new_y = Math.floor(Math.random() * row) * unit;
      checkOverlap(new_x, new_y);
    } while (overlapping);

    if (!overlapping) {
      this.x = new_x;
      this.y = new_y;
    }
  }
}

//初始化
createSnake();
let myFruit = new Fruit();
window.addEventListener("keydown", changDirection);

let d = "Right";
function changDirection(e) {
  if ((e.key == "ArrowLeft" || e.key == "a") && d != "Right") d = "Left";
  else if ((e.key == "ArrowUp" || e.key == "w") && d != "Down") d = "Up";
  else if ((e.key == "ArrowRight" || e.key == "d") && d != "Left") d = "Right";
  else if ((e.key == "ArrowDown" || e.key == "s") && d != "Up") d = "Down";

  //每次按下按鍵，在畫下一幀之前，不接受Keydown事件
  window.removeEventListener("keydown", changDirection);
}

let highScore;
loadHighScore();

let scroe = 0;
document.getElementById("myScore").innerHTML = "遊戲分數: " + scroe;
document.getElementById("myScore2").innerHTML = "最高分數: " + highScore;

function draw() {
  //每次畫之前，確認蛇有沒有撞到自己
  for (let i = 1; i < snake.length; i++) {
    if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
      clearInterval(myGame);
      alert("遊戲結束");
      return;
    }
  }

  //背景設定為黑色並清除畫布
  ctx.fillStyle = "black";
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //畫食物
  myFruit.drawFruit();

  //畫蛇
  for (let i = 0; i < snake.length; i++) {
    if (i == 0) ctx.fillStyle = "lightgreen";
    else ctx.fillStyle = "lightblue";

    ctx.strokeStyle = "white";

    if (snake[i].x > canvas.width) snake[i].x = 0;
    if (snake[i].x < 0) snake[i].x = canvas.width - unit;
    if (snake[i].y > canvas.height) snake[i].y = 0;
    if (snake[i].y < 0) snake[i].y = canvas.height - unit;

    //x, y, width, height
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }

  //以目前d的方向來決定蛇的下一幀要放的位置
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (d == "Left") snakeX -= unit;
  if (d == "Up") snakeY -= unit;
  if (d == "Right") snakeX += unit;
  if (d == "Down") snakeY += unit;

  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  //如果蛇吃到食物
  if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
    myFruit.pickALocation();
    scroe++;
    setHighScore();
    document.getElementById("myScore").innerHTML = "遊戲分數: " + scroe;
    document.getElementById("myScore2").innerHTML = "最高分數: " + highScore;
  } else snake.pop();

  snake.unshift(newHead);

  window.addEventListener("keydown", changDirection);
}

let myGame = setInterval(draw, 100);

function loadHighScore() {
  if (localStorage.getItem("highScore") == null) highScore = 0;
  else highScore = Number(localStorage.getItem("highScore"));
}

function setHighScore() {
  if (scroe > highScore) {
    highScore = scroe;
    localStorage.setItem("highScore", highScore);
  }
}
