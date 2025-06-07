const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
// getContext() method會回傳一個canvas的drawing context
// drawing context可以在canvas內畫圖
// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D

// 設定蛇的一格身體
const unit = 20;

const row = canvas.height / unit; // 320 / 20 = 16
const column = canvas.width / unit; // 320 / 20 = 16

let snake = []; // array中的每個元素都是一個物件
function createSnake() {
  // 物件的工作是儲存身體的x、y座標
  snake[0] = {
    x: 80,
    y: 0,
  };

  snake[1] = {
    x: 60,
    y: 0,
  };

  snake[2] = {
    x: 40,
    y: 0,
  };

  snake[3] = {
    x: 20,
    y: 0,
  };
}

// 設定果實 class
class Fruit {
  constructor() {
    // 使用row、column選取位置
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }
  drawFruit() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  // 設定新果實位置，不可和蛇身體重疊
  pickLocation() {
    let overlapping = false;
    let new_x;
    let new_y;

    function checkOverlap(new_x, new_y) {
      for (let i = 0; i < snake.length; i++) {
        if (new_x == snake[i].x && new_y == snake[i].y) {
          console.log("overlapping...");
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
      console.log("果實可能的新座標" + new_x + "，" + new_y);
      checkOverlap(new_x, new_y);
    } while (overlapping);

    this.x = new_x;
    this.y = new_y;
  }
}

// 初始設定
createSnake();
let myFruit = new Fruit();

// 設定移動方向
window.addEventListener("keydown", changeDirection);
let d = "Right";
function changeDirection(e) {
  //   console.log(e);
  if (e.key == "ArrowRight" && d != "Left") {
    d = "Right";
  } else if (e.key == "ArrowDown" && d != "Up") {
    d = "Down";
  } else if (e.key == "ArrowLeft" && d != "Right") {
    d = "Left";
  } else if (e.key == "ArrowUp" && d != "Down") {
    d = "Up";
  }

  // draw d = "Left", d = "Up" , d = "Right" -> 180度反咬自己
  // 每次按上下左右鍵之後，在下一幀被畫出來之前，不接受任何keydown事件
  // 防止連續鍵導致蛇在邏輯上自殺
  window.removeEventListener("keydown", changeDirection);
}

// 分數設定
let score = 0;
document.getElementById("myScore").innerHTML = "遊戲分數：" + score;

// 最高分
let highestScore;
loadHighestScore();
document.getElementById("myScore2").innerHTML =
  "歷史紀錄最高分數：" + highestScore;

function draw() {
  // 每次畫圖前，確認蛇有沒有咬到自己
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      clearInterval(myGame);
      alert("遊戲結束");
      return;
    }
  }
  // 每次執行背景重設為黑色
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 畫出果實
  myFruit.drawFruit();

  // 把蛇畫出來
  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      ctx.fillStyle = "lightgreen";
    } else {
      ctx.fillStyle = "lightblue";
    }
    // 畫出外框
    ctx.strokeStyle = "white";

    // 蛇的穿牆功能，沒設定會跑到天涯海角
    if (snake[i].x >= canvas.width) {
      snake[i].x = 0;
    }
    if (snake[i].x < 0) {
      snake[i].x = canvas.width - unit;
    }
    if (snake[i].y >= canvas.height) {
      snake[i].y = 0;
    }
    if (snake[i].y < 0) {
      snake[i].y = canvas.height - unit;
    }

    // 畫出實心 x , y , width , height
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }

  // 以目前的d變數方向決定蛇的下一幀放在哪個座標
  let snakeX = snake[0].x; // snake[0].x 是number
  let snakeY = snake[0].y;
  if (d == "Left") {
    snakeX -= unit;
  } else if (d == "Up") {
    snakeY -= unit;
  } else if (d == "Right") {
    snakeX += unit;
  } else if (d == "Down") {
    snakeY += unit;
  }

  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  // 確認蛇是否吃到果實
  if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
    // console.log("吃到果實了");
    // 重新選定新的果實位置
    myFruit.pickLocation();
    // 畫出新果實
    myFruit.drawFruit();
    // 更新分數
    score++;
    setHighestScore(score);
    document.getElementById("myScore").innerHTML = "遊戲分數：" + score;
    document.getElementById("myScore2").innerHTML =
      "歷史紀錄最高分數：" + highestScore;
  } else {
    snake.pop();
  }
  snake.unshift(newHead);
  window.addEventListener("keydown", changeDirection);
}

// 讓蛇自動動作
let myGame = setInterval(draw, 100);

// 最高分
function loadHighestScore() {
  if (localStorage.getItem("highestScore") == null) {
    highestScore = 0;
  } else {
    highestScore = Number(localStorage.getItem("highestScore"));
  }
}

function setHighestScore(score) {
  if (score > highestScore) {
    localStorage.setItem("highestScore", score);
    highestScore = score;
  }
}
