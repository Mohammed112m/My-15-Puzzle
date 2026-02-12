const LEVELS = {
1: { size: 3, time: 180, message: 'Great job' }, // -----> 3 minute
2: { size: 4, time: 300, message: 'Excellent' }, // -----> 5 minute
3: { size: 5, time: 420, message: 'Good Boy' } // -----> 7 minute
}

let currentLevel = 1
let board = []
let moves = 0
let timer
let timeRemaining
let isPaused = false

// Call from Html
const boardEl = document.getElementById('board')
const movesDisplay = document.getElementById('moves')
const timerDisplay = document.getElementById('timer')
const levelTitle = document.getElementById('levelTitle')
const shuffle = document.getElementById('shuffle')
const pauseButton = document.getElementById('pauseButton')

if (shuffle) shuffle.addEventListener('click', initLevel)

if (pauseButton) {
pauseButton.addEventListener('click', () => {
isPaused = !isPaused
if (isPaused) {
pauseButton.innerText = 'Resume Game'
} else {
pauseButton.innerText = 'Pause Game'
}

if (isPaused) clearInterval(timer) // ---> stop timer
else startTimer()
})
}

function initLevel() {
const data = LEVELS[currentLevel] // ----> setting levels3x3 ,4x4,5x5

if (levelTitle)
levelTitle.innerText = 'Level ' + currentLevel + ' : ' + data.size + 'x' + data.size

timeRemaining = data.time
moves = 0
if (movesDisplay) movesDisplay.innerText = moves

isPaused = false // ----> cancel paused and continuo game
if (pauseButton) pauseButton.innerText = 'Pause Game'

createBoard(data.size)
startTimer()
render()
}

function createBoard(size) {
board = []
let total = size * size

// Create orderenumber
for (let i = 1; i < total; i++) {
board.push(i)}
board.push(null) //-------> empty squar

for (let i = board.length - 1; i > 0; i--) {
let j = Math.floor(Math.random() * (i + 1)) // --->math random gives mix numbers , AND math flor change to integer number
let temp = board[i]
board[i] = board[j]   //--------> swap the squar
board[j] = temp}
}

function render() {    // ---> clear any old squar
if (!boardEl) return
boardEl.innerHTML = ''

const size = LEVELS[currentLevel].size
boardEl.style.gridTemplateColumns = 'repeat(' + size + ', 70px)'

board.forEach((val, i) => {
const squar = document.createElement('div')
squar.className = 'squar'

if (val === null) squar.classList.add('empty')
else squar.innerText = val

squar.onclick = () => moveSquare(i)
boardEl.appendChild(squar)
})
}

function moveSquare(i) {
if (isPaused) return
let size = LEVELS[currentLevel].size
let emptyIndex = board.indexOf(null)
let row = 0
let col = 0
for (let j = 0; j < size * size; j++) {
if (j === i) {
row = Math.floor(j / size)
col = j - row * size
break}
}
let emptyRow = 0
let emptyCol = 0
for (let j = 0; j < size * size; j++) {
if (j === emptyIndex) {
emptyRow = Math.floor(j / size)
emptyCol = j - emptyRow * size
break}
}

if (Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1) {
let temp = board[i]
board[i] = board[emptyIndex]
board[emptyIndex] = temp
if (movesDisplay) movesDisplay.innerText = moves
render()
checkWin()}
}

function checkWin() {
for (let i = 0; i < board.length - 1; i++) {
if (board[i] !== i + 1) return
}
clearInterval(timer)
alert(LEVELS[currentLevel].message)
if (currentLevel < 3) {
currentLevel++
initLevel()}
}

function startTimer() {
clearInterval(timer)

timer = setInterval(() => {
timeRemaining--

let mins = Math.floor(timeRemaining / 60)
let secs = timeRemaining % 60
if (secs < 10) secs = '0' + secs
if (timerDisplay) {
  timerDisplay.innerText = mins + ':' + secs;
}

if (timeRemaining <= 0) {
clearInterval(timer)
alert('Time Finished')
initLevel()}
}, 1000)}
initLevel()
