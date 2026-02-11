const LEVELS = {
  1: { size: 3, time: 180, message: "Great job" }, // -----> 3 minute
  2: { size: 4, time: 300, message: "Excellent" }, // -----> 5 minute
  3: { size: 5, time: 420, message: "Good Boy" }, // -----> 7 minute
}

let currentLevel = 1
let board = []
let moves = 0
let timer
let timeRemaining
let isPaused = false

// Call from Html
const boardEl = document.getElementById("board")
const movesDisplay = document.getElementById("moves")
const timerDisplay = document.getElementById("timer")
const levelTitle = document.getElementById("levelTitle")
const shuffle = document.getElementById("shuffle")
const pauseButton = document.getElementById("pauseButton")

if (shuffle) shuffle.addEventListener("click", initLevel)

  
if (pauseButton) {
  pauseButton.addEventListener("click", () => {
    isPaused = !isPaused
    pauseButton.innerText = isPaused ? "Resume Game" : "Pause Game"
    if (isPaused) clearInterval(timer)
    else startTimer()
  })
}

function initLevel() {
  const data = LEVELS[currentLevel]

  if (levelTitle)
    levelTitle.innerText = `Level ${currentLevel} : ${data.size}x${data.size}`

  timeRemaining = data.time
  moves = 0
  if (movesDisplay) movesDisplay.innerText = moves

  isPaused = false
  if (pauseButton) pauseButton.innerText = "Pause Game"

  createBoard(data.size)
  startTimer()
  render()
}

function createBoard(size) {
  board = []
  let total = size * size

  // Create orderenumber
  for (let i = 1; i < total; i++) {
    board.push(i)
  }
  board.push(null) //-------> empty squar

  // --------  Shuffle board---

  for (let i = board.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))

    let temp = board[i]
    board[i] = board[j]
    board[j] = temp
  }
}

function render() {
  if (!boardEl) return
  boardEl.innerHTML = ""

  const size = LEVELS[currentLevel].size
  boardEl.style.gridTemplateColumns = `repeat(${size}, 70px)`

  board.forEach((val, i) => {
    const squar = document.createElement("div")
    squar.className = "squar"

    if (val === null) squar.classList.add("empty")
    else squar.innerText = val

    squar.onclick = () => moveSquare(i)
    boardEl.appendChild(squar)
  })
}

function moveSquare(i) {
  if (isPaused) return

  const size = LEVELS[currentLevel].size
  const empty = board.indexOf(null)

  const r = Math.floor(i / size)
  const c = i % size
  const er = Math.floor(empty / size)
  const ec = empty % size

  if (Math.abs(r - er) + Math.abs(c - ec) === 1) {
    ;[board[i], board[empty]] = [board[empty], board[i]]
    moves++
    if (movesDisplay) movesDisplay.innerText = moves
    render()
    checkWin()
  }
}

function checkWin() {
  for (let i = 0; i < board.length - 1; i++) {
    if (board[i] !== i + 1) return
  }

  clearInterval(timer)
  alert(LEVELS[currentLevel].message)

  if (currentLevel < 3) {
    currentLevel++
    initLevel()
  }
}

function startTimer() {
  clearInterval(timer)

  timer = setInterval(() => {
    timeRemaining--

    let mins = Math.floor(timeRemaining / 60)
    let secs = timeRemaining % 60
    if (secs < 10) secs = "0" + secs

    if (timerDisplay) timerDisplay.innerText = `${mins}:${secs}`

    if (timeRemaining <= 0) {
      clearInterval(timer)
      alert("Time Finished")
      initLevel()
    }
  }, 1000)
}

initLevel()
