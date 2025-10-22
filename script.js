// Timer Elements
const timerDisplay = document.querySelector('.timer-display');
const playPauseBtn = document.querySelector('.play-pause-btn');
const playIcon = document.querySelector('.play-icon');
const pauseIcon = document.querySelector('.pause-icon');
const timer = document.querySelector('.timer');
const timeInput = document.getElementById('time-input');
const resetBtn = document.querySelector('.reset-btn');
const volumeBtn = document.querySelector('.volume-btn');
const volumeOnIcon = document.querySelector('.volume-on-icon');
const volumeOffIcon = document.querySelector('.volume-off-icon');

// Task Elements
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const clearTasksBtn = document.getElementById('clear-tasks-btn');

// Stats Elements
const timersCompletedSpan = document.getElementById('timers-completed');
const tasksCompletedSpan = document.getElementById('tasks-completed');
const resetStatsBtn = document.getElementById('reset-stats-btn');

// Theme Elements
const themeToggle = document.getElementById('theme-toggle');

// Language Elements
const langToggle = document.getElementById('lang-toggle');

// Timer Variables
let totalTime = timeInput.value * 60;
let timeLeft = totalTime;
let timerInterval;

// Task and Stats Variables
let tasks = [];
let timersCompleted = 0;
let tasksCompleted = 0;
let isDarkMode = false;
let isMuted = false;

// Audio
const bipSound = new Audio('assets/bip.wav');
let currentLang = 'en';

// --- Persistence Functions ---

function saveData() {
    sortTasks();
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('timersCompleted', timersCompleted);
    localStorage.setItem('tasksCompleted', tasksCompleted);
    localStorage.setItem('isDarkMode', isDarkMode);
    localStorage.setItem('isMuted', isMuted);
    localStorage.setItem('currentLang', currentLang);
}

function loadData() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
    timersCompleted = parseInt(localStorage.getItem('timersCompleted')) || 0;
    tasksCompleted = parseInt(localStorage.getItem('tasksCompleted')) || 0;
    isDarkMode = localStorage.getItem('isDarkMode') === 'true';
    isMuted = localStorage.getItem('isMuted') === 'true';
    currentLang = localStorage.getItem('currentLang') || 'en';
}

// --- Theme Functions ---

function applyTheme() {
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        themeToggle.checked = true;
    } else {
        document.body.classList.remove('dark-mode');
        themeToggle.checked = false;
    }
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    applyTheme();
    saveData();
}

// --- Volume Functions ---

function applyVolume() {
    if (isMuted) {
        volumeOnIcon.style.display = 'none';
        volumeOffIcon.style.display = 'block';
    } else {
        volumeOnIcon.style.display = 'block';
        volumeOffIcon.style.display = 'none';
    }
}

function toggleVolume() {
    isMuted = !isMuted;
    if (!isMuted) {
        bipSound.play();
    }
    applyVolume();
    saveData();
}
// --- Language Functions ---

function getTranslation(key) {
    if (translations[key] && translations[key][currentLang]) {
        return translations[key][currentLang];
    }
    // Fallback to English if translation is missing
    return translations[key]['en'];
}

function setLanguage() {
    document.title = getTranslation('Todo Timer');
    langToggle.checked = currentLang === 'es';
    document.querySelectorAll('[data-translate-key]').forEach(element => {
        const key = element.getAttribute('data-translate-key');
        if (element.tagName === 'INPUT') {
            element.placeholder = getTranslation(key);
        } else {
            element.textContent = getTranslation(key);
        }
    });
    renderTasks();
}

function toggleLanguage() {
    currentLang = langToggle.checked ? 'es' : 'en';
    setLanguage();
    saveData();
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
            if (!isMuted) {
                bipSound.play();
              }
            alert(getTranslation('Time is up!'));
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

function sortTasks() {
    tasks.sort((a, b) => {
        if (a.completed && !b.completed) {
            return 1;
        }
        if (!a.completed && b.completed) {
            return -1;
        }
        if (a.completed && b.completed) {
            return a.text.localeCompare(b.text);
        }
        return 0; // Keep relative order of incomplete tasks
    });
}

function renderTasks() {
    sortTasks();
    taskList.innerHTML = '';
    if (tasks.length === 0) {
        taskList.innerHTML = `<p class="empty-state" data-translate-key="No tasks yet. Add one to get started!">${getTranslation('No tasks yet. Add one to get started!')}</p>`;
        return;
    }
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.dataset.index = index;
        li.innerHTML = `
            <span>${task.text}</span>
            <div class="task-buttons">
                <button class="complete-btn" title="${getTranslation('Mark as complete')}" data-translate-key="Mark as complete">
                    <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                </button>
                <button class="edit-btn" title="${getTranslation('Edit task')}" data-translate-key="Edit task">
                    <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                </button>
                <button class="delete-btn" title="${getTranslation('Delete task')}" data-translate-key="Delete task">
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
        tasks.unshift({ text, completed: false });
        taskInput.value = '';
        saveData();
        renderTasks();
    }
}

function clearTasks() {
    if (confirm(getTranslation('Are you sure you want to clear all tasks? This cannot be undone.'))) {
        tasks = [];
        tasksCompleted = 0;
        updateStats();
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
        // Move to top when task is marked as incomplete
        const [task] = tasks.splice(index, 1);
        tasks.unshift(task);
    }
    updateStats();
    saveData();
    renderTasks();
}

function editTask(index) {
    const newText = prompt(getTranslation('Edit task:'), tasks[index].text);
    if (newText !== null && newText.trim()) {
        tasks[index].text = newText.trim();
        saveData();
        renderTasks();
    }
}

function deleteTask(index) {
    if (confirm(getTranslation('Are you sure you want to delete this task?'))) {
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

function resetStats() {
    if (confirm(getTranslation('Are you sure you want to reset all statistics? This cannot be undone.'))) {
        timersCompleted = 0;
        tasksCompleted = 0;
        // Also reset completed status of all tasks
        tasks.forEach(task => task.completed = false);
        updateStats();
        saveData();
        renderTasks();
    }
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
themeToggle.addEventListener('change', toggleTheme);
volumeBtn.addEventListener('click', toggleVolume);
langToggle.addEventListener('change', toggleLanguage);

clearTasksBtn.addEventListener('click', clearTasks);
resetStatsBtn.addEventListener('click', resetStats);

taskList.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (!button) return;

    const li = e.target.closest('li');
    if (!li) return;

    const index = parseInt(li.dataset.index, 10);

    if (button.classList.contains('complete-btn')) {
        toggleComplete(index);
    } else if (button.classList.contains('edit-btn')) {
        editTask(index);
    } else if (button.classList.contains('delete-btn')) {
        deleteTask(index);
    }
});

// --- Initial Load ---
loadData();
applyTheme();
applyVolume();
setLanguage();
updateTimerDisplay();
updateTimerBackground();
updateStats();

document.getElementById('made-with').addEventListener('click', (e) => {
    e.target.classList.toggle('hidden');
});
