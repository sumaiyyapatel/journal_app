$(document).ready(function () {
    // Finance Tracker Form Submission
    $("#financeForm").submit(function (e) {
      e.preventDefault();
      const income = $("#income").val();
      const expenses = $("#expenses").val();
  
      $.ajax({
        url: 'http://localhost:8000/api/finance/', // For Django or PHP API
        method: 'POST',
        data: {
          income: income,
          expenses: expenses
        },
        success: function (response) {
          alert('Data added successfully!');
        },
        error: function (error) {
          console.error('Error:', error);
        }
      });
    });
  
    // Example: Fetching attendance data for attendance chart
    $.ajax({
      url: 'http://localhost:8000/api/attendance/', // Adjust to match your backend
      method: 'GET',
      success: function (data) {
        // Update the attendance chart with the fetched data
        updateAttendanceChart(data);
      },
      error: function (error) {
        console.error('Error fetching attendance data:', error);
      }
    });
  });
  
