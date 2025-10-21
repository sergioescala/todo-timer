const timerDisplay = document.querySelector('.timer-display');
const playPauseBtn = document.querySelector('.play-pause-btn');
const playIcon = document.querySelector('.play-icon');
const pauseIcon = document.querySelector('.pause-icon');
const timer = document.querySelector('.timer');
const timeInput = document.getElementById('time-input');
const resetBtn = document.querySelector('.reset-btn');

let totalTime = timeInput.value * 60;
let timeLeft = totalTime;
let timerInterval;

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function updateTimerBackground() {
    const percentage = ((totalTime - timeLeft) / totalTime) * 100;
    timer.style.background = `conic-gradient(#e52e3f ${percentage}%, #e0e0e0 ${percentage}%)`;
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        updateTimerBackground();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert('Time is up!');
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function resetTimer() {
    stopTimer();
    timerInterval = null;
    totalTime = timeInput.value * 60;
    timeLeft = totalTime;
    updateTimerDisplay();
    updateTimerBackground();
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
}

playPauseBtn.addEventListener('click', () => {
    if (timerInterval) {
        stopTimer();
        timerInterval = null;
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    } else {
        startTimer();
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    }
});

timeInput.addEventListener('change', () => {
    resetTimer();
});

resetBtn.addEventListener('click', resetTimer);

updateTimerDisplay();
updateTimerBackground();
