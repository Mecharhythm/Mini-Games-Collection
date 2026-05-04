(() => {
  const DURATION = 30_000;

  const words = [
    "apple",
    "orange",
    "banana",
    "grape",
    "lemon",
    "melon",
    "strawberry",
    "peach",
    "cherry",
    "mango",
    "keyboard",
    "javascript",
    "github",
    "vercel",
    "browser",
    "coding",
    "typing",
    "game",
    "score",
    "random",
  ];

  const scoreEl = document.getElementById("typing-score");
  const timeEl = document.getElementById("typing-time");
  const bestEl = document.getElementById("typing-best");
  const wordEl = document.getElementById("typing-word");
  const inputEl = document.getElementById("typing-input");
  const msgEl = document.getElementById("typing-message");
  const startBtn = document.getElementById("typing-start");
  const resetBtn = document.getElementById("typing-reset");

  let score = 0;
  let best = 0;
  let currentWord = "";
  let running = false;
  let startTime = null;
  let timerId = null;

  const storedBest = window.localStorage.getItem("typing-game-best");
  if (storedBest !== null) {
    best = Number(storedBest) || 0;
    bestEl.textContent = best;
  }

  function choice(list) {
    const idx = Math.floor(Math.random() * list.length);
    return list[idx];
  }

  function setNewWord() {
    currentWord = choice(words);
    wordEl.textContent = currentWord;
    inputEl.value = "";
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
    scoreEl.textContent = "0";
    msgEl.textContent = "";
    startBtn.disabled = true;
    inputEl.disabled = false;
    inputEl.focus();
    setNewWord();
    startTime = performance.now();
    timeEl.textContent = (DURATION / 1000).toFixed(1);
    timerId = requestAnimationFrame(updateTime);
  }

  function endGame() {
    running = false;
    startBtn.disabled = false;
    inputEl.disabled = true;
    if (timerId !== null) {
      cancelAnimationFrame(timerId);
      timerId = null;
    }

    if (score > best) {
      best = score;
      bestEl.textContent = String(best);
      window.localStorage.setItem("typing-game-best", String(best));
      alert(`新記録！ スコア: ${score} 語`);
    } else {
      alert(`おつかれさま！ スコア: ${score} 語`);
    }
  }

  function resetGame() {
    running = false;
    score = 0;
    scoreEl.textContent = "0";
    startTime = null;
    timeEl.textContent = (DURATION / 1000).toFixed(1);
    wordEl.textContent = "press START";
    msgEl.textContent = "";
    startBtn.disabled = false;
    inputEl.value = "";
    inputEl.disabled = true;
    if (timerId !== null) {
      cancelAnimationFrame(timerId);
      timerId = null;
    }
  }

  inputEl.addEventListener("keydown", (e) => {
    if (!running) return;
    if (e.key === "Enter") {
      const value = inputEl.value.trim();
      if (value === currentWord) {
        score += 1;
        scoreEl.textContent = String(score);
        msgEl.textContent = "OK!";
        setNewWord();
      } else {
        msgEl.textContent = "もう一度！";
      }
    }
  });

  startBtn.addEventListener("click", startGame);
  resetBtn.addEventListener("click", resetGame);

  resetGame();
})();
