// Select elements
const gameBoard = document.getElementById("gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.getElementById("scoreText");
const reset = document.getElementById("reset");

// Game Constants
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "green";
const snakeColor = "lightgreen";
const snakeBorder = "black";
const foodColor = "red";
const unitSize = 25;

// Game Variables
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;

// Initial Snake Body
let snake = [
    { x: unitSize * 4, y: 0 },
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 }
];

// Event Listeners
window.addEventListener("keydown", startGame);
reset.addEventListener("click", resetGame);

// Draw initial board with snake and food
initializeGameBoard();

function initializeGameBoard() {
    clearBoard();
    drawFood();
    drawSnake();
}

// Start game on key press
function startGame(event) {
    if (!running) {
        running = true;
        window.removeEventListener("keydown", startGame); // Remove this so it only starts once
        window.addEventListener("keydown", changeDirection); // Now listen for movement keys
        gameStart();
    }
    changeDirection(event); // Allow immediate movement on first key press
}

function gameStart() {
    score = 0;
    scoreText.textContent = score;
    createFood();
    nextTick();
}

function nextTick() {
    if (running) {
        setTimeout(() => {
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, 75);
    } else {
        displayGameOver();
    }
}

function clearBoard() {
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
}

function createFood() {
    function randomFood(min, max) {
        return Math.floor((Math.random() * (max - min) + min) / unitSize) * unitSize;
    }
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameHeight - unitSize);
}

function drawFood() {
    ctx.fillStyle = foodColor;
    ctx.beginPath();
    ctx.arc(foodX + unitSize / 2, foodY + unitSize / 2, unitSize / 2, 0, Math.PI * 2);
    ctx.fill();
}

function moveSnake() {
    const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };
    snake.unshift(head);

    if (snake[0].x === foodX && snake[0].y === foodY) {
        score += 1;
        scoreText.textContent = score;
        createFood();
    } else {
        snake.pop();
    }
}

function drawSnake() {
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;
    ctx.lineJoin = "round"; // Makes the corners slightly rounded

    snake.forEach(snakePart => {
        ctx.beginPath();
        ctx.moveTo(snakePart.x + 5, snakePart.y);
        ctx.lineTo(snakePart.x + unitSize - 5, snakePart.y);
        ctx.arcTo(
            snakePart.x + unitSize, snakePart.y,
            snakePart.x + unitSize, snakePart.y + 5, 5
        );
        ctx.lineTo(snakePart.x + unitSize, snakePart.y + unitSize - 5);
        ctx.arcTo(
            snakePart.x + unitSize, snakePart.y + unitSize,
            snakePart.x + unitSize - 5, snakePart.y + unitSize, 5
        );
        ctx.lineTo(snakePart.x + 5, snakePart.y + unitSize);
        ctx.arcTo(
            snakePart.x, snakePart.y + unitSize,
            snakePart.x, snakePart.y + unitSize - 5, 5
        );
        ctx.lineTo(snakePart.x, snakePart.y + 5);
        ctx.arcTo(
            snakePart.x, snakePart.y,
            snakePart.x + 5, snakePart.y, 5
        );
        ctx.fill();
        ctx.stroke();
    });
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    console.log("Key Pressed:", keyPressed);

    const left = 37;
    const up = 38;
    const right = 39;
    const down = 40;

    const goingUp = (yVelocity === -unitSize);
    const goingDown = (yVelocity === unitSize);
    const goingRight = (xVelocity === unitSize);
    const goingLeft = (xVelocity === -unitSize);

    switch (true) {
        case (keyPressed === left && !goingRight):
            xVelocity = -unitSize;
            yVelocity = 0;
            break;
        case (keyPressed === up && !goingDown):
            xVelocity = 0;
            yVelocity = -unitSize;
            break;
        case (keyPressed === right && !goingLeft):
            xVelocity = unitSize;
            yVelocity = 0;
            break;
        case (keyPressed === down && !goingUp):
            xVelocity = 0;
            yVelocity = unitSize;
            break;
    }
}

function checkGameOver() {
    switch (true) {
        case (snake[0].x < 0):
        case (snake[0].x >= gameWidth):
        case (snake[0].y < 0):
        case (snake[0].y >= gameHeight):
            running = false;
            break;
    }

    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            running = false;
        }
    }
}

function displayGameOver() {
    ctx.font = "50px Verdana, Geneva, Tahoma, sans-serif";
    ctx.fillStyle = "darkgreen";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", gameWidth / 2, gameHeight / 2);
    running = false;
}

function resetGame() {
    running = false;
    xVelocity = unitSize;
    yVelocity = 0;
    snake = [
        { x: unitSize * 4, y: 0 },
        { x: unitSize * 3, y: 0 },
        { x: unitSize * 2, y: 0 },
        { x: unitSize, y: 0 },
        { x: 0, y: 0 }
    ];
    window.addEventListener("keydown", startGame); // Re-add the event listener to start the game
    scoreText.textContent = "0";
    initializeGameBoard();
}
