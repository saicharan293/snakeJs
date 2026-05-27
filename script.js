
const board = document.querySelector(".board");
const startBtn = document.querySelector(".btn-start");
const modal = document.querySelector(".modal");
const gameOverModal = document.querySelector('.game-over');
const startGameModal = document.querySelector('.start-game');
const restartbtn = document.querySelector(".btn-restart");
let timerElem = document.querySelector(".time");

let highScore = document.querySelector('.high-score')
let score = document.querySelector('.score')

const blockHt = 50;
const blockWt = 50;
let initScore = 0;
let initHighScore = 0;
let time = `00-00`;``

const cols = Math.floor(board.clientWidth / blockWt);
const rows = Math.floor(board.clientHeight / blockHt);

let intervalId = null;
let timerId = null;
const blocks = [];
let snake =[
    {x:1, y:3}
];

let food = {x: Math.floor(Math.random()*rows), y: Math.floor(Math.random()*cols)};

let direction = 'right'

// linear iteration
// for(let i = 0; i< rows * cols;i++){
//     const block = document.createElement("div");
//     block.classList.add("block");
//     board.append(block)
// }


// 2D ITERATION: To create row, col matrix
for(let row = 0 ; row < rows ; row++){
    for(let col = 0; col < cols; col++){
        const block = document.createElement("div");
        block.classList.add("block");
        // block.innerText=`${row}-${col}`;
        blocks[`${row}-${col}`]=block
        board.append(block);
    }
}

function render(){
    let head = null;

    blocks[`${food.x}-${food.y}`].classList.add("food");

    if(direction === 'left'){
        head = {x: snake[0].x, y: snake[0].y-1};
    } else if(direction === 'right'){
        head = {x: snake[0].x, y: snake[0].y+1};
    } else if(direction === 'down'){
        head = {x: snake[0].x+1, y: snake[0].y};
    } else if(direction === "up"){
        head = {x: snake[0].x-1, y: snake[0].y};
    }

    if(head.x < 0 || head.x >= rows || head.y <0 || head.y >= cols){
        // alert("Game over");
        clearInterval(intervalId);
        modal.style.display = 'flex';
        startGameModal.style.display = 'none';
        gameOverModal.style.display = 'flex';
        return;
    }

    if(food.x === head.x && food.y === head.y){
        blocks[`${food.x}-${food.y}`].classList.remove("food");
        food = {x: Math.floor(Math.random()*rows), y: Math.floor(Math.random()*cols)};
        blocks[`${food.x}-${food.y}`].classList.add("food");
        snake.unshift(head);
        initScore+=10;
        score.innerText = initScore;
        if(initScore>initHighScore) sessionStorage.setItem("highScore",initScore)
    }

    snake.forEach(seg=>{
        blocks[`${seg.x}-${seg.y}`].classList.remove('fill')
    })

    snake.unshift(head);
    snake.pop();
    snake.forEach(seg => {
        blocks[`${seg.x}-${seg.y}`].classList.add("fill");

    })
}

startBtn.addEventListener('click',() => {
    modal.style.display="none";

    intervalId = setInterval(() => {
        render()
    }, 500);

    timerId = setInterval(()=>{
        let [minute, seconds] = time.split("-").map(Number);
        if(seconds < 59){
            seconds+=1;
        } else {
            seconds = `00`;
            minute += 1;
        }
        time = `${String(minute).padStart(2, 0)}-${String(seconds).padStart(2,0)}`;
        timerElem.innerText = time;
        
    }, 1000)

})

function Restart(){

    initScore = 0;
    score.innerText = 0;

    time = `00-00`;
    timerElem.innerText=time;

    clearInterval(intervalId);
    clearInterval(timerId);

    direction = 'right';

    initHighScore = sessionStorage.getItem("highScore") ?? 0;
    highScore.innerText = initHighScore;

    blocks[`${food.x}-${food.y}`].classList.remove('food');

    snake.forEach(seg =>{
        blocks[`${seg.x}-${seg.y}`].classList.remove("fill");
    });

    modal.style.display = 'none';

    snake = [{x: 1, y: 3}]

    food = {
        x: Math.floor(Math.random()*rows), 
        y: Math.floor(Math.random()*cols)
    };

    intervalId = setInterval(() => {
        render()
    }, 500);

    timerId = setInterval(() => {
        let [minute, seconds] = time.split("-").map(Number);
        if(seconds < 59){
            seconds++;
        } else {
            seconds = 0;
            minute++;
        }
        time = `${String(minute).padStart(2,'0')}-${String(seconds).padStart(2,'0')}`;
        timerElem.innerText = time;
    }, 1000);
}

restartbtn.addEventListener('click', Restart);

addEventListener("keydown", (e) => {
    if(e.key === 'ArrowUp' && direction != 'down'){
        direction = 'up';
    } else if(e.key === 'ArrowRight' && direction != 'left'){
        direction = 'right';
    } else if(e.key === 'ArrowDown' && direction != 'up'){
        direction = 'down';
    } else if(e.key === 'ArrowLeft' && direction != 'left'){
        direction = 'left';
    }
})
