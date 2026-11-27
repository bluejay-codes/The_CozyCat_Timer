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
    if (timerDisplay) {
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    if (progressBar) {
        const percentageElapsed = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
        progressBar.style.width = `${Math.max(0, Math.min(100, percentageElapsed))}%`;
    }
}

function startTimer() {
    if (timerInterval) return;
    if (remainingSeconds <= 0) remainingSeconds = totalSeconds;

    localStorage.setItem("timerRunning", "true");
    localStorage.setItem("timerEndTime", String(Date.now() + remainingSeconds * 1000));
    updateDisplay();

    timerInterval = setInterval(() => {
        const endTime = Number(localStorage.getItem("timerEndTime"));
        remainingSeconds = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
        updateDisplay();

        if (remainingSeconds <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            localStorage.setItem("timerRunning", "false");
            alert("Task Completed!");
        }
    }, 250);
}

function pauseTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    localStorage.setItem("timerRunning", "false");
    localStorage.removeItem("timerEndTime");
}

function resetTimer() {
    pauseTimer();
    remainingSeconds = totalSeconds;
    updateDisplay();
}

document.querySelectorAll(".timer button").forEach((button) => {
    button.addEventListener("click", () => {
        const minutes = Number(button.dataset.minutes);
        totalSeconds = minutes * 60;
        remainingSeconds = totalSeconds;
        localStorage.setItem("focusMinutes", String(minutes));
        localStorage.setItem("timerRunning", "true");
        localStorage.setItem("timerEndTime", String(Date.now() + totalSeconds * 1000));
        window.location.href = "index.html";
    });
});

if (startBtn) startBtn.addEventListener("click", startTimer);
if (pauseBtn) pauseBtn.addEventListener("click", pauseTimer);
if (resetBtn) resetBtn.addEventListener("click", resetTimer);

const onTimerPage = Boolean(document.querySelector(".timer"));
if (!onTimerPage) {
    const running = localStorage.getItem("timerRunning") === "true";
    const endTime = Number(localStorage.getItem("timerEndTime"));

    if (running && endTime) {
        remainingSeconds = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
        updateDisplay();
        if (remainingSeconds > 0) startTimer();
    } else {
        remainingSeconds = totalSeconds;
        updateDisplay();
    }
} else {
    document.querySelectorAll(".timer button").forEach((button) => {
        button.classList.toggle("active", Number(button.dataset.minutes) === Number(localStorage.getItem("focusMinutes")));
    });
    updateDisplay();
}
