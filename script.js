// Timer Elements
const timerDisplay = document.querySelector('.timer-display');
const playPauseBtn = document.querySelector('.play-pause-btn');
const playIcon = document.querySelector('.play-icon');
const pauseIcon = document.querySelector('.pause-icon');
const timer = document.querySelector('.timer');
const timeInput = document.getElementById('time-input');
const resetBtn = document.querySelector('.reset-btn');

// Task Elements
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

// Stats Elements
const timersCompletedSpan = document.getElementById('timers-completed');
const tasksCompletedSpan = document.getElementById('tasks-completed');

// Timer Variables
let totalTime = timeInput.value * 60;
let timeLeft = totalTime;
let timerInterval;

// Task and Stats Variables
let tasks = [];
let timersCompleted = 0;
let tasksCompleted = 0;

// --- Persistence Functions ---

function saveData() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('timersCompleted', timersCompleted);
    localStorage.setItem('tasksCompleted', tasksCompleted);
}

function loadData() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
    timersCompleted = parseInt(localStorage.getItem('timersCompleted')) || 0;
    tasksCompleted = parseInt(localStorage.getItem('tasksCompleted')) || 0;
}

// --- Timer Functions ---

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
            timersCompleted++;
            updateStats();
            saveData();
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

// --- Task Functions ---

function renderTasks() {
    taskList.innerHTML = '';
    if (tasks.length === 0) {
        taskList.innerHTML = '<p class="empty-state">No tasks yet. Add one to get started!</p>';
        return;
    }
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${task.text}</span>
            <div class="task-buttons">
                <button onclick="toggleComplete(${index})" title="Mark as complete">
                    <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                </button>
                <button onclick="editTask(${index})" title="Edit task">
                    <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                </button>
                <button onclick="deleteTask(${index})" title="Delete task">
                    <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                </button>
            </div>
        `;
        if (task.completed) {
            li.classList.add('completed');
        }
        taskList.appendChild(li);
    });
}

function addTask() {
    const text = taskInput.value.trim();
    if (text) {
        tasks.push({ text, completed: false });
        taskInput.value = '';
        saveData();
        renderTasks();
    }
}

function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    if (tasks[index].completed) {
        tasksCompleted++;
    } else {
        tasksCompleted--;
    }
    updateStats();
    saveData();
    renderTasks();
}

function editTask(index) {
    const newText = prompt('Edit task:', tasks[index].text);
    if (newText !== null && newText.trim()) {
        tasks[index].text = newText.trim();
        saveData();
        renderTasks();
    }
}

function deleteTask(index) {
    if (confirm('Are you sure you want to delete this task?')) {
        if (tasks[index].completed) {
            tasksCompleted--;
        }
        tasks.splice(index, 1);
        updateStats();
        saveData();
        renderTasks();
    }
}

// --- Stats Functions ---

function updateStats() {
    timersCompletedSpan.textContent = timersCompleted;
    tasksCompletedSpan.textContent = tasksCompleted;
}


// --- Event Listeners ---

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

timeInput.addEventListener('change', resetTimer);
resetBtn.addEventListener('click', resetTimer);
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// --- Initial Load ---
loadData();
updateTimerDisplay();
updateTimerBackground();
renderTasks();
updateStats();
