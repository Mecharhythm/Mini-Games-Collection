(() => {
  const DURATION = 10_000; // ミリ秒

  const scoreEl = document.getElementById("score");
  const timeEl = document.getElementById("time");
  const bestScoreEl = document.getElementById("best-score");
  const targetEl = document.getElementById("click-target");
  const startBtn = document.getElementById("start-btn");
  const resetBtn = document.getElementById("reset-btn");

  let score = 0;
  let bestScore = 0;
  let startTime = null;
  let timerId = null;
  let running = false;

  const storedBest = window.localStorage.getItem("click-game-best");
  if (storedBest !== null) {
    bestScore = Number(storedBest) || 0;
    bestScoreEl.textContent = bestScore;
  }

  function updateTime() {
    if (!running || startTime === null) return;

    const now = performance.now();
    const elapsed = now - startTime;
    const remain = Math.max(0, DURATION - elapsed);

    timeEl.textContent = (remain / 1000).toFixed(1);

    if (remain <= 0) {
      endGame();
    } else {
      timerId = requestAnimationFrame(updateTime);
    }
  }

  function startGame() {
    if (running) return;
    running = true;
    score = 0;
    scoreEl.textContent = score.toString();
    startTime = performance.now();
    startBtn.disabled = true;
    timeEl.textContent = (DURATION / 1000).toFixed(1);
    timerId = requestAnimationFrame(updateTime);
  }

  function endGame() {
    running = false;
    startBtn.disabled = false;
    if (timerId !== null) {
      cancelAnimationFrame(timerId);
      timerId = null;
    }

    if (score > bestScore) {
      bestScore = score;
      bestScoreEl.textContent = bestScore.toString();
      window.localStorage.setItem("click-game-best", String(bestScore));
      alert(`新記録！ スコア: ${score}`);
    } else {
      alert(`おつかれさま！ スコア: ${score}`);
    }
  }

  function resetGame() {
    running = false;
    score = 0;
    scoreEl.textContent = "0";
    startTime = null;
    timeEl.textContent = (DURATION / 1000).toFixed(1);
    startBtn.disabled = false;
    if (timerId !== null) {
      cancelAnimationFrame(timerId);
      timerId = null;
    }
  }

  targetEl.addEventListener("click", () => {
    if (!running) return;
    score += 1;
    scoreEl.textContent = score.toString();
  });

  startBtn.addEventListener("click", startGame);
  resetBtn.addEventListener("click", resetGame);

  resetGame();
})();
