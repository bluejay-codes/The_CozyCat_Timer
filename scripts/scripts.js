const submitBtn = document.getElementById("submit-btn");
const taskInput = document.getElementById("task");
const taskData = [];

if (submitBtn && taskInput) {
    submitBtn.addEventListener("click", () => {
        if (taskInput.value.trim()) {
            taskData.push(taskInput.value.trim());
            taskInput.value = "";
            console.log(taskData);
        }
    });
}

let totalSeconds = (Number(localStorage.getItem("focusMinutes")) || 15) * 60;
let remainingSeconds = totalSeconds;
let timerInterval = null;

const timerDisplay = document.getElementById("timer");
const progressBar = document.getElementById("progress-bar");
const startBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("PauseBtn");
const resetBtn = document.getElementById("resetBtn");

function updateDisplay() {
    if (!timerDisplay) return;

    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    if (progressBar) {
        const percentageElapsed = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
        progressBar.style.width = `${percentageElapsed}%`;
    }
}

function startTimer() {
    if (timerInterval) return;

    timerInterval = setInterval(() => {
        if (remainingSeconds > 0) {
            remainingSeconds--;
            updateDisplay();
        } else {
            clearInterval(timerInterval);
            timerInterval = null;
            alert("Task Completed!");
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function resetTimer() {
    pauseTimer();
    remainingSeconds = totalSeconds;
    updateDisplay();
}

function setMode(minutes) {
    pauseTimer();
    totalSeconds = minutes * 60;
    remainingSeconds = totalSeconds;
    localStorage.setItem("focusMinutes", String(minutes));

    document.querySelectorAll(".timer button").forEach((button) => {
        button.classList.toggle("active", Number(button.dataset.minutes) === minutes);
    });

    updateDisplay();
}

document.querySelectorAll(".timer button").forEach((button) => {
    button.addEventListener("click", () => setMode(Number(button.dataset.minutes)));
});

if (startBtn) startBtn.addEventListener("click", startTimer);
if (pauseBtn) pauseBtn.addEventListener("click", pauseTimer);
if (resetBtn) resetBtn.addEventListener("click", resetTimer);

const selectedMinutes = Number(localStorage.getItem("focusMinutes")) || 15;
setMode(selectedMinutes);
