$(document).ready(function () {
    let transactions = [];
    let budgets = [];
    let savingsGoal = 0;

    // Handle Finance Form Submission
    $("#financeForm").submit(function (e) {
        e.preventDefault();
        const description = $("#description").val();
        const amount = parseFloat($("#amount").val());
        const category = $("#category").val();
        const type = $("#type").val();

        if (description && amount && category && type) {
            transactions.push({ description, amount, category, type });
            alert('Transaction added successfully!');
            updateSpendingChart();
            clearFinanceForm();
        } else {
            alert('Please fill in all fields.');
        }
    });

    // Handle Budget Form Submission
    $("#budgetForm").submit(function (e) {
        e.preventDefault();
        const category = $("#budgetCategory").val();
        const amount = parseFloat($("#budgetAmount").val());

        if (category && amount) {
            budgets.push({ category, amount });
            alert('Budget added successfully!');
            updateSpendingChart();
            clearBudgetForm();
        } else {
            alert('Please fill in all fields.');
        }
    });

    // Handle Savings Goal Submission
    $("#savingsGoal").change(function () {
        savingsGoal = parseFloat($(this).val());
        alert('Savings goal set successfully!');
        updateSpendingChart();
    });

    // Clear Finance Form
    function clearFinanceForm() {
        $("#description").val('');
        $("#amount").val('');
        $("#category").val('Income');
        $("#type").val('Credit');
    }

    // Clear Budget Form
    function clearBudgetForm() {
        $("#budgetCategory").val('');
        $("#budgetAmount").val('');
    }

    // Update Spending Chart
    function updateSpendingChart() {
        // Logic to update the spending chart dynamically based on transactions and budgets
        const categories = transactions.map(tr => tr.category);
        const amounts = transactions.map(tr => tr.amount);

        const ctx = document.getElementById('spendingChart').getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: categories,
                datasets: [{
                    label: 'Spending Breakdown',
                    data: amounts,
                    backgroundColor: ['#ff6384', '#36a2eb', '#ffcd56', '#4bc0c0', '#9966ff'],
                }]
            }
        });
    }
});
