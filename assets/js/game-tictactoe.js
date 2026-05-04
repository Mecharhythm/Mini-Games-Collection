(() => {
  const boardEl = document.getElementById("ttt-board");
  const cells = Array.from(
    boardEl.querySelectorAll(".ttt-cell")
  );
  const statusEl = document.getElementById("ttt-status");
  const restartBtn = document.getElementById("ttt-restart");

  // "O" or "X"
  let current = "O";
  let board = Array(9).fill(null);
  let finished = false;

  const wins = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  function updateStatus() {
    if (finished) return;
    statusEl.textContent =
      current === "O" ? "プレイヤー1（○）の番です" : "プレイヤー2（×）の番です";
  }

  function checkWinner() {
    for (const [a, b, c] of wins) {
      if (
        board[a] &&
        board[a] === board[b] &&
        board[a] === board[c]
      ) {
        return board[a];
      }
    }
    if (board.every((v) => v !== null)) {
      return "draw";
    }
    return null;
  }

  function handleCellClick(e) {
    if (finished) return;
    const cell = e.currentTarget;
    const idx = Number(cell.dataset.index);
    if (board[idx] !== null) return;

    board[idx] = current;
    cell.textContent = current;

    const result = checkWinner();
    if (result === "O") {
      statusEl.textContent = "プレイヤー1（○）の勝ち！";
      finished = true;
      cells.forEach((c) => c.classList.add("disabled"));
      return;
    }
    if (result === "X") {
      statusEl.textContent = "プレイヤー2（×）の勝ち！";
      finished = true;
      cells.forEach((c) => c.classList.add("disabled"));
      return;
    }
    if (result === "draw") {
      statusEl.textContent = "引き分けです";
      finished = true;
      cells.forEach((c) => c.classList.add("disabled"));
      return;
    }

    current = current === "O" ? "X" : "O";
    updateStatus();
  }

  function resetGame() {
    board = Array(9).fill(null);
    current = "O";
    finished = false;
    cells.forEach((c) => {
      c.textContent = "";
      c.classList.remove("disabled");
    });
    updateStatus();
  }

  cells.forEach((cell) =>
    cell.addEventListener("click", handleCellClick)
  );
  restartBtn.addEventListener("click", resetGame);

  resetGame();
})();
