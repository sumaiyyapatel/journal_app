$(document).ready(function () {
    let hobbies = [];
    let goals = [];

    // Handle Hobby Form Submission
    $("#hobbyForm").submit(function (e) {
        e.preventDefault();
        const hobbyName = $("#hobbyName").val();
        const timeSpent = parseFloat($("#hobbyTime").val());

        if (hobbyName && timeSpent) {
            hobbies.push({ hobbyName, timeSpent });
            alert('Hobby added successfully!');
            updateHobbyProgressChart();
            populateGoalHobbyDropdown();
            clearHobbyForm();
        } else {
            alert('Please fill in all fields.');
        }
    });

    // Handle Goal Form Submission
    $("#goalForm").submit(function (e) {
        e.preventDefault();
        const goalHobby = $("#goalHobby").val();
        const targetHours = parseFloat($("#goalTargetHours").val());

        if (goalHobby && targetHours) {
            goals.push({ goalHobby, targetHours });
            alert('Goal set successfully!');
            displayGoals();
            clearGoalForm();
        } else {
            alert('Please fill in all fields.');
        }
    });

    // Populate Goal Hobby Dropdown
    function populateGoalHobbyDropdown() {
        $("#goalHobby").empty();
        hobbies.forEach(hobby => {
            $("#goalHobby").append(`<option value="${hobby.hobbyName}">${hobby.hobbyName}</option>`);
        });
    }

    // Display Goals with Quit Button
    function displayGoals() {
        $("#goalList").empty();
        goals.forEach((goal, index) => {
            $("#goalList").append(`
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <strong>${goal.goalHobby}</strong> - Target: ${goal.targetHours} hrs/week
                    <button class="btn btn-danger btn-sm quit-goal-btn" data-index="${index}">Quit</button>
                </li>
            `);
        });

        // Handle Quit Button Click
        $(".quit-goal-btn").click(function () {
            const index = $(this).data('index');
            goals.splice(index, 1); // Remove goal from list
            displayGoals(); // Refresh the list
        });
    }

    // Clear Hobby Form
    function clearHobbyForm() {
        $("#hobbyName").val('');
        $("#hobbyTime").val('');
    }

    // Clear Goal Form
    function clearGoalForm() {
        $("#goalHobby").val('');
        $("#goalTargetHours").val('');
    }

    // Update Hobby Progress Chart
    function updateHobbyProgressChart() {
        const hobbyNames = hobbies.map(hobby => hobby.hobbyName);
        const timeSpentData = hobbies.map(hobby => hobby.timeSpent);

        const ctx = document.getElementById('hobbyProgressChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: hobbyNames,
                datasets: [
                    {
                        label: 'Time Spent (hours)',
                        data: timeSpentData,
                        backgroundColor: '#007bff',
                    }
                ]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }
});
