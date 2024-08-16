// script.js
let activeTrackers = [];
let darkMode = false;

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    addTemplate(data);
}

function showDashboard() {
    const contentArea = document.getElementById('content-area');
    const pageTitle = document.getElementById('page-title');
    pageTitle.textContent = 'Student Planner Dashboard';
    
    const dashboardContent = `
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">Quick Overview</div>
                <div class="card-body">
                    <p>Active Trackers: ${activeTrackers.length}</p>
                    <p>Today's Tasks: ${getTodaysTasks()}</p>
                    <p>Upcoming Meetings: ${getUpcomingMeetings()}</p>
                </div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">Recent Activity</div>
                <div class="card-body">
                    <ul>
                        ${getRecentActivity()}
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    contentArea.innerHTML = dashboardContent;
}

function addTemplate(type) {
    const contentArea = document.getElementById('content-area');
    const pageTitle = document.getElementById('page-title');


    switch(type) {
        case 'finance':
            template = createFinanceTracker();
            pageTitle.textContent = 'Finance Tracker';
            break;
        case 'attendance':
            template = createAttendanceTracker();
            pageTitle.textContent = 'Attendance Tracker';
            break;
        case 'mentalHealth':
            template = createMentalHealthTracker();
            pageTitle.textContent = 'Mental Health Tracker';
            break;
        case 'todo':
            template = createTodoList();
            pageTitle.textContent = 'To-Do List';
            break;
        case 'meetings':
            template = createMeetingsTracker();
            pageTitle.textContent = 'Meetings Tracker';
            break;
        case 'nutrition':
            template = createNutritionTracker();
            pageTitle.textContent = 'Nutrition Tracker';
            break;
        case 'hobbies':
            template = createHobbiesTracker();
            pageTitle.textContent = 'Hobbies Tracker';
            break;
    }

    const trackerContainer = document.createElement('div');
    trackerContainer.className = 'col-md-6';
    trackerContainer.innerHTML = template;
    contentArea.appendChild(trackerContainer);
    initializeCharts();
    
    if (!activeTrackers.includes(type)) {
        activeTrackers.push(type);
    }
    
    saveToLocalStorage();
}

function createFinanceTracker() {
    return `
        <div class="card mb-4 shadow-sm">
            <div class="card-header">
                <h4 class="my-0 fw-normal"><i class="fas fa-dollar-sign"></i> Finance Tracker</h4>
            </div>
            <div class="card-body">
                <canvas id="financeChart"></canvas>
                <form class="mt-3" onsubmit="addFinanceEntry(event)">
                    <div class="mb-3">
                        <label for="amount" class="form-label">Amount</label>
                        <input type="number" class="form-control" id="amount" required>
                    </div>
                    <div class="mb-3">
                        <label for="category" class="form-label">Category</label>
                        <select class="form-select" id="category" required>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary">Add Transaction</button>
                </form>
            </div>
        </div>
    `;
}

function createAttendanceTracker() {
    return `
        <div class="card mb-4 shadow-sm">
            <div class="card-header">
                <h4 class="my-0 fw-normal"><i class="fas fa-calendar-check"></i> Attendance Tracker</h4>
            </div>
            <div class="card-body">
                <canvas id="attendanceChart"></canvas>
                <form class="mt-3" onsubmit="addAttendanceEntry(event)">
                    <div class="mb-3">
                        <label for="date" class="form-label">Date</label>
                        <input type="date" class="form-control" id="date" required>
                    </div>
                    <div class="mb-3">
                        <label for="status" class="form-label">Status</label>
                        <select class="form-select" id="status" required>
                            <option value="present">Present</option>
                            <option value="absent">Absent</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary">Add Attendance</button>
                </form>
            </div>
        </div>
    `;
}

function createMentalHealthTracker() {
    return `
        <div class="card mb-4 shadow-sm">
            <div class="card-header">
                <h4 class="my-0 fw-normal"><i class="fas fa-heartbeat"></i> Mental Health Tracker</h4>
            </div>
            <div class="card-body">
                <canvas id="moodChart"></canvas>
                <form class="mt-3" onsubmit="addMoodEntry(event)">
                    <div class="mb-3">
                        <label for="mood" class="form-label">Mood</label>
                        <select class="form-select" id="mood" required>
                            <option value="5">Excellent</option>
                            <option value="4">Good</option>
                            <option value="3">Okay</option>
                            <option value="2">Not great</option>
                            <option value="1">Poor</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="notes" class="form-label">Notes</label>
                        <textarea class="form-control" id="notes" rows="3"></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Add Entry</button>
                </form>
            </div>
        </div>
    `;
}

function createTodoList() {
    return `
        <div class="card mb-4 shadow-sm">
            <div class="card-header">
                <h4 class="my-0 fw-normal"><i class="fas fa-list"></i> To-Do List</h4>
            </div>
            <div class="card-body">
                <ul id="todo-list" class="list-group mb-3">
                    <!-- Todo items will be added here -->
                </ul>
                <form onsubmit="addTodoItem(event)">
                    <div class="input-group mb-3">
                        <input type="text" class="form-control" id="new-todo" placeholder="Add a new task" required>
                        <button class="btn btn-primary" type="submit">Add</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

function createMeetingsTracker() {
    return `
        <div class="card mb-4 shadow-sm">
            <div class="card-header">
                <h4 class="my-0 fw-normal"><i class="fas fa-handshake"></i> Meetings Tracker</h4>
            </div>
            <div class="card-body">
                <div id="meetings-list" class="mb-3">
                    <!-- Meetings will be added here -->
                </div>
                <form onsubmit="addMeeting(event)">
                    <div class="mb-3">
                        <label for="meeting-title" class="form-label">Title</label>
                        <input type="text" class="form-control" id="meeting-title" required>
                    </div>
                    <div class="mb-3">
                        <label for="meeting-date" class="form-label">Date & Time</label>
                        <input type="datetime-local" class="form-control" id="meeting-date" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Add Meeting</button>
                </form>
            </div>
        </div>
    `;
}

function createNutritionTracker() {
    return `
        <div class="card mb-4 shadow-sm">
            <div class="card-header">
                <h4 class="my-0 fw-normal"><i class="fas fa-apple-alt"></i> Nutrition Tracker</h4>
            </div>
            <div class="card-body">
                <canvas id="nutritionChart"></canvas>
                <form class="mt-3" onsubmit="addNutritionEntry(event)">
                    <div class="mb-3">
                        <label for="food-item" class="form-label">Food Item</label>
                        <input type="text" class="form-control" id="food-item" required>
                    </div>
                    <div class="mb-3">
                        <label for="calories" class="form-label">Calories</label>
                        <input type="number" class="form-control" id="calories" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Add Entry</button>
                </form>
            </div>
        </div>
    `;
}

function createHobbiesTracker() {
    return `
        <div class="card mb-4 shadow-sm">
            <div class="card-header">
                <h4 class="my-0 fw-normal"><i class="fas fa-palette"></i> Hobbies Tracker</h4>
            </div>
            <div class="card-body">
                <div id="hobbies-list" class="mb-3">
                    <!-- Hobbies will be added here -->
                </div>
                <form onsubmit="addHobby(event)">
                    <div class="mb-3">
                        <label for="hobby-name" class="form-label">Hobby Name</label>
                        <input type="text" class="form-control" id="hobby-name" required>
                    </div>
                    <div class="mb-3">
                        <label for="time-spent" class="form-label">Time Spent (minutes)</label>
                        <input type="number" class="form-control" id="time-spent" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Add Hobby</button>
                </form>
            </div>
        </div>
    `;
}

function initializeCharts() {
    if (document.getElementById('financeChart')) {
        new Chart(document.getElementById('financeChart'), {
            type: 'bar',
            data: {
                labels: ['Income', 'Expenses'],
                datasets: [{
                    label: 'Amount',
                    data: [0, 0],
                    backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)']
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    if (document.getElementById('attendanceChart')) {
        function initializeCharts() {
            // ... (keep existing code for other charts)
        
            if (document.getElementById('attendanceChart')) {
                try {
                    new Chart(document.getElementById('attendanceChart'), {
                        type: 'pie',
                        data: {
                            labels: ['Present', 'Absent'],
                            datasets: [{
                                data: [0, 0],
                                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)']
                            }]
                        }
                    });
                    console.log('Attendance chart initialized successfully');
                } catch (error) {
                    console.error('Error initializing attendance chart:', error);
                }
            } else {
                console.warn('Attendance chart container not found');
            }
        
            if (document.getElementById('moodChart')) {
                try {
                    new Chart(document.getElementById('moodChart'), {
                        type: 'line',
                        data: {
                            labels: [],
                            datasets: [{
                                label: 'Mood',
                                data: [],
                                borderColor: 'rgba(75, 192, 192, 1)',
                                tension: 0.1
                            }]
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    max: 5
                                }
                            }
                        }
                    });
                    console.log('Mood chart initialized successfully');
                } catch (error) {
                    console.error('Error initializing mood chart:', error);
                }
            } else {
                console.warn('Mood chart container not found');
            }
        }
    if (document.getElementById('nutritionChart')) {
        new Chart(document.getElementById('nutritionChart'), {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: []
                }]
            }
        });
    }
}

function addFinanceEntry(event) {
    event.preventDefault();
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    
    const chart = Chart.getChart('financeChart');
    if (category === 'income') {
        chart.data.datasets[0].data[0] += amount;
    } else {
        chart.data.datasets[0].data[1] += amount;
    }
    chart.update();

    event.target.reset();
    saveToLocalStorage();
}

function addAttendanceEntry(event) {
    event.preventDefault();
    const status = document.getElementById('status').value;
    
    const chart = Chart.getChart('attendanceChart');
    if (!chart) {
        console.error('Attendance chart not found. Make sure the chart is initialized.');
        return;
    }
    
    console.log('Current attendance chart data:', chart.data);

    if (status === 'present') {
        chart.data.datasets[0].data[0]++;
    } else {
        chart.data.datasets[0].data[1]++;
    }
    
    console.log('Updated attendance chart data:', chart.data);
    
    try {
        chart.update();
        console.log('Attendance chart updated successfully');
    } catch (error) {
        console.error('Error updating attendance chart:', error);
    }

    event.target.reset();
    saveToLocalStorage();
}

function addMoodEntry(event) {
    event.preventDefault();
    const mood = parseInt(document.getElementById('mood').value);
    const notes = document.getElementById('notes').value;
    
    const chart = Chart.getChart('moodChart');
    if (!chart) {
        console.error('Mood chart not found. Make sure the chart is initialized.');
        return;
    }
    
    console.log('Current mood chart data:', chart.data);

    const date = new Date().toLocaleDateString();
    chart.data.labels.push(date);
    chart.data.datasets[0].data.push(mood);
    
    console.log('Updated mood chart data:', chart.data);
    
    try {
        chart.update();
        console.log('Mood chart updated successfully');
    } catch (error) {
        console.error('Error updating mood chart:', error);
    }

    console.log('Mood entry added:', { date, mood, notes });

    event.target.reset();
    saveToLocalStorage();
}

function addTodoItem(event) {
    event.preventDefault();
    const todoList = document.getElementById('todo-list');
    const newTodo = document.getElementById('new-todo').value;
    
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `
        ${newTodo}
        <button class="btn btn-sm btn-danger" onclick="removeTodoItem(this)">Remove</button>
    `;
    todoList.appendChild(li);

    event.target.reset();
    saveToLocalStorage();
}

function removeTodoItem(button) {
    button.parentElement.remove();
    saveToLocalStorage();
}

function addMeeting(event) {
    event.preventDefault();
    const meetingsList = document.getElementById('meetings-list');
    const title = document.getElementById('meeting-title').value;
    const date = document.getElementById('meeting-date').value;
    
    const meetingDiv = document.createElement('div');
    meetingDiv.className = 'card mb-2';
    meetingDiv.innerHTML = `
        <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <p class="card-text">${new Date(date).toLocaleString()}</p>
        </div>
    `;
    meetingsList.appendChild(meetingDiv);

    event.target.reset();
    saveToLocalStorage();
}

function addNutritionEntry(event) {
    event.preventDefault();
    const foodItem = document.getElementById('food-item').value;
    const calories = parseInt(document.getElementById('calories').value);
    
    const chart = Chart.getChart('nutritionChart');
    chart.data.labels.push(foodItem);
    chart.data.datasets[0].data.push(calories);
    chart.data.datasets[0].backgroundColor.push(getRandomColor());
    chart.update();

    event.target.reset();
    saveToLocalStorage();
}

function addHobby(event) {
    event.preventDefault();
    const hobbiesList = document.getElementById('hobbies-list');
    const hobbyName = document.getElementById('hobby-name').value;
    const timeSpent = document.getElementById('time-spent').value;
    
    const hobbyDiv = document.createElement('div');
    hobbyDiv.className = 'card mb-2';
    hobbyDiv.innerHTML = `
        <div class="card-body">
            <h5 class="card-title">${hobbyName}</h5>
            <p class="card-text">Time spent: ${timeSpent} minutes</p>
        </div>
    `;
    hobbiesList.appendChild(hobbyDiv);

    event.target.reset();
    saveToLocalStorage();
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getTodaysTasks() {
    // This is a placeholder function. In a real application, you would fetch this data from a backend.
    return 5;
}

function getUpcomingMeetings() {
    // This is a placeholder function. In a real application, you would fetch this data from a backend.
    return 2;
}

function getRecentActivity() {
    // This is a placeholder function. In a real application, you would fetch this data from a backend.
    return `
        <li>Added a finance entry</li>
        <li>Completed 2 tasks</li>
        <li>Tracked mood for today</li>
    `;
}

function showSettings() {
    const contentArea = document.getElementById('content-area');
    const pageTitle = document.getElementById('page-title');
    pageTitle.textContent = 'Settings';
    
    const settingsContent = `
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">User Preferences</div>
                <div class="card-body">
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" id="darkModeSwitch" ${darkMode ? 'checked' : ''}>
                        <label class="form-check-label" for="darkModeSwitch">Dark Mode</label>
                    </div>
                    <button class="btn btn-primary mt-3" onclick="exportData()">Export Data</button>
                </div>
            </div>
        </div>
    `;
    
    contentArea.innerHTML = settingsContent;
    
    document.getElementById('darkModeSwitch').addEventListener('change', toggleDarkMode);
}

function toggleDarkMode() {
    darkMode = !darkMode;
    document.body.classList.toggle('dark-mode', darkMode);
    saveToLocalStorage();
}

function exportData() {
    const data = JSON.stringify({
        activeTrackers: activeTrackers,
        // Add other data you want to export
    });
    
    const blob = new Blob([data], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_planner_data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function saveToLocalStorage() {
    try {
        const contentAreaHTML = document.getElementById('content-area').innerHTML;
        localStorage.setItem('trackers', contentAreaHTML);
        localStorage.setItem('activeTrackers', JSON.stringify(activeTrackers));
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    } catch (error) {
        console.error('Error saving to local storage:', error);
    }
}

function loadFromLocalStorage() {
    try {
        const savedContent = localStorage.getItem('trackers');
        const savedActiveTrackers = localStorage.getItem('activeTrackers');
        const savedDarkMode = localStorage.getItem('darkMode');
        
        if (savedContent) {
            document.getElementById('content-area').innerHTML = savedContent;
            initializeCharts();
        }
        if (savedActiveTrackers) {
            activeTrackers = JSON.parse(savedActiveTrackers);
        }
        if (savedDarkMode) {
            darkMode = JSON.parse(savedDarkMode);
            document.body.classList.toggle('dark-mode', darkMode);
        }
    } catch (error) {
        console.error('Error loading from local storage:', error);
    }
}

window.onload = function() {
    showDashboard();
    loadFromLocalStorage();
};}