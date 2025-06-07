const c = document.getElementById("myCanvas");
const canvasHeight = c.height;
const canvasWidth = c.width;
const ctx = c.getContext("2d");
let circle_x = 160;
let circle_y = 60;
let radius = 20;
// 移動速度
let xSpeed = 20;
let ySpeed = 20;
// 地板初始值
let ground_x = 100;
let ground_y = 500;
let ground_height = 5;
// 磚塊陣列
let brickArray = [];
let count = 0;

// 生成一個區間的隨機數
function getRandomArbrtrary(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}

// 磚塊
class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    brickArray.push(this);
    this.visible = true;
  }

  drawBrick() {
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  touchingBall(ballX, ballY) {
    return (
      ballX >= this.x - radius &&
      ballX <= this.x + this.width + radius &&
      ballY <= this.y + this.width + radius &&
      ballY >= this.y - radius
    );
  }
}

// 製作所有隨機的磚塊
for (let i = 0; i < 10; i++) {
  new Brick(getRandomArbrtrary(0, 950), getRandomArbrtrary(0, 550));
}

// 滑鼠控制地板移動
c.addEventListener("mousemove", (e) => {
  ground_x = e.clientX;
});

// 畫圓
function drawCircle() {
  // 確認球是否打到磚塊
  brickArray.forEach((brick, index) => {
    if (brick.visible && brick.touchingBall(circle_x, circle_y)) {
      count++;
      console.log(count);
      brick.visible = false;

      // 改變x y方向速度，並將brick從brickArray中移除
      // 撞到磚塊改變方向
      // 從下方撞擊
      if (circle_y >= brick.y + brick.height) {
        ySpeed *= -1;
      }
      // 從上方撞擊
      else if (circle_y <= brick.y) {
        ySpeed *= -1;
      }
      // 從左方撞擊
      else if (circle_x <= brick.x) {
        xSpeed *= -1;
      }
      // 從右方撞擊
      else if (circle_x >= brick.x + brick.width) {
        ySpeed *= -1;
      }

      // 時間複雜度太高
      //   brickArray.splice(index, 1);
      //   if (brickArray.length == 0) {
      //     alert("遊戲結束");
      //     clearInterval(game);
      //   }

      // 以可見不可見來計算，變成不可見之後計算數量，滿10個遊戲結束
      if (count == 10) {
        alert("遊戲結束");
        clearInterval(game);
      }
    }
  });
  // 確認球是否打到橘色地板
  if (
    circle_x <= ground_x + 200 + radius &&
    circle_x >= ground_x - radius &&
    circle_y >= ground_y - radius &&
    circle_y <= ground_y + radius
  ) {
    // 當從上方打到地板就向上移，並增加彈力
    if (ySpeed > 0) {
      circle_y -= 40;
    } else {
      circle_y += 40;
    }
    ySpeed *= -1;
  }
  // 確認球是否達到邊界
  // 右邊邊界
  if (circle_x >= canvasWidth - radius) {
    xSpeed *= -1;
  }
  // 左邊邊界
  if (circle_x <= radius) {
    xSpeed *= -1;
  }
  // 下邊邊界
  if (circle_y >= canvasHeight - radius) {
    ySpeed *= -1;
  }
  // 上邊邊界
  if (circle_y <= radius) {
    ySpeed *= -1;
  }

  // 更動圓的座標
  circle_x += xSpeed;
  circle_y += ySpeed;

  // console.log("畫圓....");
  // 每次更新畫出黑色背景
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight); // 畫出方形

  // 畫出所有磚塊
  brickArray.forEach((brick) => {
    if (brick.visible) {
      brick.drawBrick();
    }
  });

  // 畫出可控制的地板
  ctx.fillStyle = "orange";
  ctx.fillRect(ground_x, ground_y, 200, ground_height);

  //   畫出圓球
  ctx.beginPath();
  // x , y , 半徑  , 初始角度0 , 終點角度
  ctx.arc(circle_x, circle_y, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = "yellow";
  ctx.fill();
}

let game = setInterval(drawCircle, 25);
