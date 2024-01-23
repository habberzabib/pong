let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Canvas dimensions
let canvasWidth = 800;
let canvasHeight = 400;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

// Game state
let gameRunning = false;
let gameOver = false;
let restarting = false;

// Paddle variables
let paddle = {
  width: 20,
  height: 110,
  leftPaddleY: canvasHeight / 2 - 250 / 2,
  rightPaddleY: canvasHeight / 2 - 250 / 2,
  paddleSpeed: 5,
};

// Ball variables
let ball = {
  size: 30,
  x: canvasWidth / 2,
  y: canvasHeight / 2,
  speedX: 2,
  speedY: 2,
};

// track key presses
let upPressed = false;
let downPressed = false;
let wPressed = false;
let sPressed = false;

// Event listener for the canvas click
canvas.addEventListener("click", handleCanvasClick);

// Function to handle canvas click
function handleCanvasClick() {
  if (!gameRunning && !restarting) {
    startGame();
  } else if (gameOver) {
    restartGame();
  }
}

// Function to start the game
function startGame() {
  // Reset ball position and speed
  ball.x = canvasWidth / 2;
  ball.y = canvasHeight / 2;
  ball.speedX;
  ball.speedY;

  // Set game state variables
  gameRunning = true;
  gameOver = false;
  restarting = false;

  // Remove the click event listener after the game starts
  canvas.removeEventListener("click", handleCanvasClick);

  // Add event listeners for key presses only when the game is running
  document.addEventListener("keydown", handleKeyPress);
  document.addEventListener("keyup", handleKeyRelease);

  // Start the initial draw
  draw();
}

// Function to handle key presses
function handleKeyPress(event) {
  // Set corresponding flag to true when a key is pressed
  if (event.key === "ArrowUp") {
    upPressed = true;
  } else if (event.key === "ArrowDown") {
    downPressed = true;
  } else if (event.key === "w") {
    wPressed = true;
  } else if (event.key === "s") {
    sPressed = true;
  }
}

// Function to handle key releases
function handleKeyRelease(event) {
  // Set corresponding flag to false when a key is released
  if (event.key === "ArrowUp") {
    upPressed = false;
  } else if (event.key === "ArrowDown") {
    downPressed = false;
  } else if (event.key === "w") {
    wPressed = false;
  } else if (event.key === "s") {
    sPressed = false;
  }
}

// Function to draw the game
function draw() {
  // Clear the canvas
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (!gameRunning) {
    // Draw start screen
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("CLICK TO START", canvas.width / 2 - 100, canvas.height / 2);
  } else if (gameOver) {
    // Draw game over screen
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2 - 20);
    ctx.font = "20px Arial";
    ctx.fillText(
      "Restarting in 2 seconds...",
      canvas.width / 2 - 120,
      canvas.height / 2 + 20
    );

    restarting = true;
    setTimeout(restartGame, 2000); // Restart after 2 seconds
  } else {
    // Move the ball before drawing
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Ball collisions with walls
    if (ball.y - ball.size / 2 < 0 || ball.y + ball.size / 2 > canvas.height) {
      ball.speedY = -ball.speedY;
    }

    // Ball collisions with paddles
    if (
      (ball.x - ball.size / 2 < paddle.width &&
        ball.y > paddle.leftPaddleY &&
        ball.y < paddle.leftPaddleY + paddle.height) ||
      (ball.x + ball.size / 2 > canvas.width - paddle.width &&
        ball.y > paddle.rightPaddleY &&
        ball.y < paddle.rightPaddleY + paddle.height)
    ) {
      ball.speedX = -ball.speedX;
    }

    // Update paddle positions based on key flags
    if (upPressed) {
      paddle.rightPaddleY -= paddle.paddleSpeed;
    }
    if (downPressed) {
      paddle.rightPaddleY += paddle.paddleSpeed;
    }
    if (wPressed) {
      paddle.leftPaddleY -= paddle.paddleSpeed;
    }
    if (sPressed) {
      paddle.leftPaddleY += paddle.paddleSpeed;
    }

    // Ensure paddles stay within the canvas
    if (paddle.leftPaddleY < 0) {
      paddle.leftPaddleY = 0;
    }
    if (paddle.leftPaddleY > canvas.height - paddle.height) {
      paddle.leftPaddleY = canvas.height - paddle.height;
    }

    if (paddle.rightPaddleY < 0) {
      paddle.rightPaddleY = 0;
    }
    if (paddle.rightPaddleY > canvas.height - paddle.height) {
      paddle.rightPaddleY = canvas.height - paddle.height;
    }

    // Draw paddles
    ctx.fillStyle = "white";
    ctx.fillRect(0, paddle.leftPaddleY, paddle.width, paddle.height);
    ctx.fillRect(
      canvas.width - paddle.width,
      paddle.rightPaddleY,
      paddle.width,
      paddle.height
    );

    // Draw ball
    ctx.fillStyle = "white"; // Set ball color
    ctx.fillRect(
      ball.x - ball.size / 2,
      ball.y - ball.size / 2,
      ball.size,
      ball.size
    );

    // Check for a goal
    if (ball.x - ball.size / 2 < 0 || ball.x + ball.size / 2 > canvas.width) {
      // Game over
      gameOver = true;
      setTimeout(restartGame, 2000); // Restart after 2 seconds
    }
  }

  requestAnimationFrame(draw);
}

// Function to restart the game
function restartGame() {
  gameRunning = false;
  gameOver = false;
  restarting = false; // Reset the restarting flag

  // Reset paddle positions
  paddle.leftPaddleY = canvasHeight / 2 - 250 / 2;
  paddle.rightPaddleY = canvasHeight / 2 - 250 / 2;

  // Reset ball position and speed
  ball.x = canvasWidth / 2;
  ball.y = canvasHeight / 2;
  ball.speedX = 2;
  ball.speedY = 2;

  // Add the click event listener back for restarting the game
  canvas.addEventListener("click", handleCanvasClick);
}

// Initial draw
draw();
