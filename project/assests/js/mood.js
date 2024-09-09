$(document).ready(function () {
    let moodRecords = [];
    let moodSuggestions = [];

    // Handle Mood Form Submission
    $("#moodForm").submit(function (e) {
        e.preventDefault();
        const mood = $("#mood").val();
        const factors = $("#moodFactors").val();
        const date = new Date().toISOString().split('T')[0]; // Get today's date

        moodRecords.push({ date, mood, factors });
        alert('Mood recorded successfully!');
        updateMoodTrendsChart();
        generateMoodSuggestions();
        clearMoodForm();
    });

    // Handle Time Range Selection for Mood Trends
    $("#moodTimeRange").change(function () {
        const range = $(this).val();
        if (range === 'custom') {
            $("#customStartDate, #customEndDate").show();
        } else {
            $("#customStartDate, #customEndDate").hide();
            updateMoodTrendsChart();
        }
    });

    $("#customStartDate, #customEndDate").change(function () {
        updateMoodTrendsChart();
    });

    // Clear Mood Form
    function clearMoodForm() {
        $("#mood").val('Happy');
        $("#moodFactors").val('');
    }

    // Update Mood Trends Chart
    function updateMoodTrendsChart() {
        const timeRange = $("#moodTimeRange").val();
        const startDate = timeRange === 'custom' ? $("#customStartDate").val() : getStartDate(timeRange);
        const endDate = timeRange === 'custom' ? $("#customEndDate").val() : new Date().toISOString().split('T')[0];

        const filteredMoods = moodRecords.filter(record => {
            const recordDate = new Date(record.date);
            return recordDate >= new Date(startDate) && recordDate <= new Date(endDate);
        });

        const moodData = groupMoodDataByDate(filteredMoods);

        const ctx = document.getElementById('moodTrendsChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: Object.keys(moodData),
                datasets: [{
                    label: 'Mood Over Time',
                    data: Object.values(moodData),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: true
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            max: 5, // Rating from 1 to 5 (Happy to Angry)
                            stepSize: 1,
                            callback: function(value) {
                                const moodLabels = ['Happy', 'Neutral', 'Sad', 'Stressed', 'Angry'];
                                return moodLabels[value - 1];
                            }
                        }
                    }]
                }
            }
        });
    }

    // Group Mood Data by Date
    function groupMoodDataByDate(moods) {
        const moodLevels = { Happy: 1, Neutral: 2, Sad: 3, Stressed: 4, Angry: 5 };
        const moodData = {};

        moods.forEach(record => {
            const date = record.date;
            const moodLevel = moodLevels[record.mood];
            moodData[date] = moodLevel;
        });

        return moodData;
    }

    // Generate Mood Improvement Suggestions
    function generateMoodSuggestions() {
        moodSuggestions = []; // Clear previous suggestions

        const factors = moodRecords.reduce((acc, record) => acc.concat(record.factors.split(',')), []);
        const commonFactors = findCommonFactors(factors);

        // Generate suggestions based on common negative factors
        if (commonFactors.includes('Stress')) {
            moodSuggestions.push('Try practicing mindfulness or meditation to reduce stress.');
        }
        if (commonFactors.includes('Poor Sleep')) {
            moodSuggestions.push('Ensure you get 7-8 hours of quality sleep each night.');
        }
        if (commonFactors.includes('Lack of Exercise')) {
            moodSuggestions.push('Consider incorporating regular physical activity into your routine.');
        }

        // Render suggestions
        $("#moodSuggestions").empty();
        moodSuggestions.forEach(suggestion => {
            $("#moodSuggestions").append(`<li class="list-group-item">${suggestion}</li>`);
        });
    }

    // Find Common Factors Influencing Mood
    function findCommonFactors(factors) {
        const factorCounts = {};
        factors.forEach(factor => {
            factor = factor.trim();
            if (factor) {
                factorCounts[factor] = (factorCounts[factor] || 0) + 1;
            }
        });

        // Consider factors that occur frequently
        return Object.keys(factorCounts).filter(factor => factorCounts[factor] > 1);
    }

    // Utility to Get Start Date Based on Time Range
    function getStartDate(range) {
        const today = new Date();
        if (range === '7') {
            today.setDate(today.getDate() - 7);
        } else if (range === '30') {
            today.setMonth(today.getMonth() - 1);
        }
        return today.toISOString().split('T')[0];
    }
});
