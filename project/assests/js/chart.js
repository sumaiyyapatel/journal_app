// Finance Overview Chart
const ctxFinance = document.getElementById("financeChart").getContext("2d");
const financeChart = new Chart(ctxFinance, {
  type: "pie",
  data: {
    labels: ["Savings", "Expenses", "Budget"],
    datasets: [
      {
        label: "Finance Overview",
        data: [200, 300, 500],
        backgroundColor: ["#28a745", "#dc3545", "#ffc107"],
      },
    ],
  },
});

// Attendance Overview Chart
const ctxAttendance = document.getElementById("attendanceChart").getContext("2d");
const attendanceChart = new Chart(ctxAttendance, {
  type: "bar",
  data: {
    labels: ["Class 1", "Class 2", "Class 3"],
    datasets: [
      {
        label: "Attendance Percentage",
        data: [85, 90, 75],
        backgroundColor: ["#007bff", "#28a745", "#17a2b8"],
      },
    ],
  },
});

// Spending Breakdown Chart (Finance Page)
const ctxSpending = document.getElementById("spendingChart").getContext("2d");
const spendingChart = new Chart(ctxSpending, {
  type: "doughnut",
  data: {
    labels: ["Food", "Entertainment", "Transport", "Others"],
    datasets: [
      {
        label: "Spending",
        data: [150, 100, 50, 70],
        backgroundColor: ["#ff6384", "#36a2eb", "#ffcd56", "#4bc0c0"],
      },
    ],
  },
});
