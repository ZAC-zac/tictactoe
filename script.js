const canvas = document.getElementById('ticTacToeCanvas');
const ctx = canvas.getContext('2d');
const cellSize = 200; // Збільшено на 2 рази
let board = [['', '', ''], ['', '', ''], ['', '', '']];
let currentPlayer = 'X';
let gameOver = false;
let playerXName = '';
let playerOName = '';
let score = { 'X': 0, 'O': 0 };

function startGame() {
  playerXName = document.getElementById('playerX').value || 'Player X';
  playerOName = document.getElementById('playerO').value || 'Player O';
  
  document.getElementById('button-container').style.display = 'none';
  gameStarted = true; // Позначаємо, що гра розпочалась

  if (!document.getElementById('game-container')) {
    const gameContainer = document.createElement('div');
    gameContainer.id = 'game-container';
    document.body.appendChild(gameContainer);
  }

  drawBoard();
  canvas.addEventListener('click', handleClick);
}

function drawBoard() {
  // Якщо гра не розпочалась, не виконуємо решту функції
  if (!gameStarted) {
    return;
  }
  const currentPlayerElement = document.getElementById('currentPlayer');
  if (currentPlayerElement) {
    const playerName = currentPlayer === 'X' ? playerXName : playerOName;
    currentPlayerElement.textContent = `${playerName}'s turn`;
  }
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#000';
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 1; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(i * cellSize, 0);
    ctx.lineTo(i * cellSize, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i * cellSize);
    ctx.lineTo(canvas.width, i * cellSize);
    ctx.stroke();
  }

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const cellValue = board[row][col];
      if (cellValue !== '') {
        drawSymbol(cellValue, col * cellSize, row * cellSize);
      }
    }
  }
}

function drawSymbol(symbol, x, y) {
  ctx.lineWidth = 10;
  ctx.strokeStyle = '#000';
  
  if (symbol === 'X') {
    ctx.beginPath();
    ctx.moveTo(x + 15, y + 15);
    ctx.lineTo(x + cellSize - 15, y + cellSize - 15);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + cellSize - 15, y + 15);
    ctx.lineTo(x + 15, y + cellSize - 15);
    ctx.stroke();
  } else if (symbol === 'O') {
    ctx.beginPath();
    ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize / 2 - 15, 0, 2 * Math.PI);
    ctx.stroke();
  }
}

function handleClick(event) {
  if (gameOver) return;

  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const col = Math.floor(x / cellSize);
  const row = Math.floor(y / cellSize);

  if (board[row][col] === '') {
    board[row][col] = currentPlayer;
    drawBoard();
    checkWinner();
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    const currentPlayerElement = document.getElementById('currentPlayer');
    if (currentPlayerElement) {
      const playerName = currentPlayer === 'X' ? playerXName : playerOName;
      currentPlayerElement.textContent = `${playerName}'s turn`;
    }

  }
}

function checkWinner() {
  for (let i = 0; i < 3; i++) {
    if (
      (board[i][0] === currentPlayer && board[i][1] === currentPlayer && board[i][2] === currentPlayer) ||
      (board[0][i] === currentPlayer && board[1][i] === currentPlayer && board[2][i] === currentPlayer)
    ) {
      announceWinner();
      return;
    }
  }

  if (
    (board[0][0] === currentPlayer && board[1][1] === currentPlayer && board[2][2] === currentPlayer) ||
    (board[0][2] === currentPlayer && board[1][1] === currentPlayer && board[2][0] === currentPlayer)
  ) {
    announceWinner();
    return;
  }

  if (board.flat().every(cell => cell !== '')) {
    showModal('It\'s a tie!');
  }
}

function announceWinner() {
  const winnerName = currentPlayer === 'X' ? playerXName : playerOName;
  const loserName = currentPlayer === 'X' ? playerOName : playerXName;

  score[currentPlayer]++;
  showModal(
    `${winnerName}(${currentPlayer}) wins!`, 
    'Score:',
    `${playerXName}: ${score['X']}`,
    `${playerOName}: ${score['O']}`
  );
}

function showModal(winnerMessage, scoreMessage1, scoreMessage2, scoreMessage3) {
  document.getElementById('winner-message').textContent = winnerMessage;
  document.getElementById('score-message1').textContent = scoreMessage1;
  document.getElementById('score-message2').textContent = scoreMessage2;
  document.getElementById('score-message3').textContent = scoreMessage3;
  document.getElementById('game-over-modal').style.display = 'block';
}

function ClearCells() {
  board = [['', '', ''], ['', '', ''], ['', '', '']];
  currentPlayer = 'X';
  gameOver = false;
  document.getElementById('game-over-modal').style.display = 'none';
}

function resetGame() {
  ClearCells();
  drawBoard();
}

function exitGame() {
  ClearCells();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  currentPlayer = 'X';
  score = { 'X': 0, 'O': 0 };
  document.getElementById('button-container').style.display = 'block';
  gameStarted = false; // Позначаємо, що гра не розпочалась
  
}

function generateScoreText() {
  return `Score: ${playerXName}(${score['X']}) ${score['X']} - ${score['O']}(${score['O']}) ${playerOName}`;
}

// Додано функцію для виклику showModal при нічії
function showModalTie() {
  showModal('It\'s a tie!', generateScoreText());
}
