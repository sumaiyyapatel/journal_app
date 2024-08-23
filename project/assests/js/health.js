$(document).ready(function () {
    let exercises = [];
    let sleepRecords = [];
    let meals = [];
    let goals = [];

    // Handle Exercise Form Submission
    $("#exerciseForm").submit(function (e) {
        e.preventDefault();
        const type = $("#exerciseType").val();
        const duration = parseFloat($("#exerciseDuration").val());
        const calories = parseFloat($("#caloriesBurned").val());

        if (type && duration && calories) {
            exercises.push({ type, duration, calories });
            alert('Exercise added successfully!');
            updateProgressChart();
            clearExerciseForm();
        } else {
            alert('Please fill in all fields.');
        }
    });

    // Handle Sleep Form Submission
    $("#sleepForm").submit(function (e) {
        e.preventDefault();
        const duration = parseFloat($("#sleepDuration").val());
        const quality = $("#sleepQuality").val();

        if (duration && quality) {
            sleepRecords.push({ duration, quality });
            alert('Sleep record added successfully!');
            updateProgressChart();
            clearSleepForm();
        } else {
            alert('Please fill in all fields.');
        }
    });

    // Handle Meal Form Submission
    $("#mealForm").submit(function (e) {
        e.preventDefault();
        const description = $("#mealDescription").val();
        const calories = parseFloat($("#mealCalories").val());
        const protein = parseFloat($("#mealProtein").val());
        const carbs = parseFloat($("#mealCarbs").val());

        if (description && calories && protein && carbs) {
            meals.push({ description, calories, protein, carbs });
            alert('Meal added successfully!');
            updateProgressChart();
            clearMealForm();
        } else {
            alert('Please fill in all fields.');
        }
    });

    // Handle Goal Form Submission
    $("#goalForm").submit(function (e) {
        e.preventDefault();
        const type = $("#goalType").val();
        const target = parseFloat($("#goalTarget").val());

        if (type && target) {
            goals.push({ type, target });
            alert('Goal set successfully!');
            updateProgressChart();
            clearGoalForm();
        } else {
            alert('Please fill in all fields.');
        }
    });

    // Clear Exercise Form
    function clearExerciseForm() {
        $("#exerciseType").val('');
        $("#exerciseDuration").val('');
        $("#caloriesBurned").val('');
    }

    // Clear Sleep Form
    function clearSleepForm() {
        $("#sleepDuration").val('');
        $("#sleepQuality").val('Excellent');
    }

    // Clear Meal Form
    function clearMealForm() {
        $("#mealDescription").val('');
        $("#mealCalories").val('');
        $("#mealProtein").val('');
        $("#mealCarbs").val('');
    }

    // Clear Goal Form
    function clearGoalForm() {
        $("#goalType").val('Exercise');
        $("#goalTarget").val('');
    }

    // Update Progress Chart
    function updateProgressChart() {
        const exerciseTotal = exercises.reduce((sum, ex) => sum + ex.duration, 0);
        const sleepTotal = sleepRecords.reduce((sum, sleep) => sum + sleep.duration, 0);
        const caloriesTotal = meals.reduce((sum, meal) => sum + meal.calories, 0);

        const ctx = document.getElementById('progressChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Exercise (mins)', 'Sleep (hours)', 'Nutrition (calories)'],
                datasets: [{
                    label: 'Total Progress',
                    data: [exerciseTotal, sleepTotal, caloriesTotal],
                    backgroundColor: ['#007bff', '#28a745', '#ffc107'],
                }]
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
