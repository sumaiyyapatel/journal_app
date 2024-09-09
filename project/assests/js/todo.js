let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

const taskList = document.getElementById('taskList');
const newTaskInput = document.getElementById('newTask');
const addTaskBtn = document.getElementById('addTaskBtn');

// Render tasks based on filter (all, completed, pending)
function renderTasks(filter = 'all') {
    taskList.innerHTML = '';
    tasks
        .filter(task => filter === 'all' || (filter === 'completed' && task.completed) || (filter === 'pending' && !task.completed))
        .forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = 'list-group-item d-flex justify-content-between align-items-center task-item';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.className = 'form-check-input me-2';
            checkbox.addEventListener('change', () => toggleCompleted(task.id));
            taskItem.appendChild(checkbox);

            const taskText = document.createElement('span');
            taskText.textContent = task.text;
            taskText.className = 'task-text' + (task.completed ? ' completed' : '');
            taskItem.appendChild(taskText);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-danger btn-sm ms-2';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => deleteTask(task.id));
            taskItem.appendChild(deleteBtn);

            taskList.appendChild(taskItem);
        });
    saveTasks();
}

// Add a new task to the list
function addTask() {
    const newTaskText = newTaskInput.value.trim();
    if (newTaskText !== '') {
        tasks.push({ id: Date.now(), text: newTaskText, completed: false });
        newTaskInput.value = '';
        renderTasks();
    } else {
        alert('Please enter a task.');
    }
}

// Toggle the completed status of a task
function toggleCompleted(taskId) {
    tasks = tasks.map(task => task.id === taskId ? { ...task, completed: !task.completed } : task);
    renderTasks();
}

// Delete a task from the list
function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    renderTasks();
}

// Clear all tasks from the list
function clearAllTasks() {
    if (confirm('Are you sure you want to clear all tasks?')) {
        tasks = [];
        renderTasks();
    }
}

// Filter tasks based on status (all, completed, pending)
function filterTasks(filter) {
    renderTasks(filter);
}

// Save tasks to local storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Add event listeners
addTaskBtn.addEventListener('click', addTask);
newTaskInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') addTask();
});

// Initial render of tasks
renderTasks();
