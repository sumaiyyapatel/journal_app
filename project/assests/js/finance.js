$(document).ready(function () {
    let transactions = [];
    let budgets = [];
    let savingsGoal = 0;
    let spendingChart; // Store the chart instance for updates

    // Handle Finance Form Submission
    $("#financeForm").submit(function (e) {
        e.preventDefault();
        const description = $("#description").val();
        const amount = parseFloat($("#amount").val());
        const type = $("#type").val();

        if (description && !isNaN(amount) && type) {
            transactions.push({ description, amount, type });
            alert('Transaction added successfully!');
            updateSpendingChart();
            clearFinanceForm();
        } else {
            alert('Please fill in all fields correctly.');
        }
    });

    // Handle Budget Form Submission
    $("#budgetForm").submit(function (e) {
        e.preventDefault();
        const category = $("#budgetCategory").val();
        const amount = parseFloat($("#budgetAmount").val());

        if (category && !isNaN(amount)) {
            budgets.push({ category, amount });
            alert('Budget added successfully!');
            updateSpendingChart();
            clearBudgetForm();
        } else {
            alert('Please fill in all fields correctly.');
        }
    });

    // Handle Savings Goal Submission
    $("#saveGoalBtn").click(function () {
        const goal = parseFloat($("#savingsGoal").val());
        if (!isNaN(goal)) {
            savingsGoal = goal;
            alert('Savings goal set successfully!');
            updateSpendingChart();
        } else {
            alert('Please enter a valid goal amount.');
        }
    });

    // Clear Finance Form
    function clearFinanceForm() {
        $("#description").val('');
        $("#amount").val('');
        $("#type").val('Credit');
    }

    // Clear Budget Form
    function clearBudgetForm() {
        $("#budgetCategory").val('');
        $("#budgetAmount").val('');
    }

    // Update Spending Chart
    function updateSpendingChart() {
        const categoryData = aggregateTransactionsByType();
        const categories = Object.keys(categoryData);
        const amounts = Object.values(categoryData);

        const ctx = document.getElementById('spendingChart').getContext('2d');

        if (spendingChart) {
            spendingChart.destroy(); // Destroy the old chart instance before creating a new one
        }

        spendingChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: categories,
                datasets: [{
                    label: 'Spending Breakdown',
                    data: amounts,
                    backgroundColor: generateColorPalette(categories.length),
                }]
            }
        });
    }

    // Aggregate transactions by type
    function aggregateTransactionsByType() {
        return transactions.reduce((acc, transaction) => {
            const typeLabel = transaction.type === "Credit" ? "Income" : "Expense";
            if (!acc[typeLabel]) {
                acc[typeLabel] = 0;
            }
            acc[typeLabel] += transaction.amount;
            return acc;
        }, {});
    }

    // Generate a color palette for the chart
    function generateColorPalette(size) {
        const colors = ['#ff6384', '#36a2eb', '#ffcd56', '#4bc0c0', '#9966ff'];
        return Array.from({ length: size }, (_, i) => colors[i % colors.length]);
    }
});
