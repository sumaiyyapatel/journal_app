$(document).ready(function () {
    let classes = [];
    let attendanceRecords = [];
    let alertThreshold = 75;

    // Handle Schedule Form Submission
    $("#scheduleForm").submit(function (e) {
        e.preventDefault();
        const subject = $("#subject").val();
        const day = $("#day").val();
        const hours = parseFloat($("#hours").val());

        if (subject && day && hours) {
            classes.push({ subject, day, hours });
            alert('Class added successfully!');
            updateSubjectDropdown();
            renderWeeklyCalendar();
            clearScheduleForm();
        } else {
            alert('Please fill in all fields.');
        }
    });

    // Handle Attendance Form Submission
    $("#attendanceForm").submit(function (e) {
        e.preventDefault();
        const subject = $("#attendanceSubject").val();
        const status = $("#status").val();

        if (subject && status) {
            attendanceRecords.push({ subject, status });
            alert('Attendance marked successfully!');
            updateAttendanceChart();
            checkAttendanceAlert();
            clearAttendanceForm();
        } else {
            alert('Please select a subject and status.');
        }
    });

    // Handle Alert Threshold Setting
    $("#alertThreshold").change(function () {
        alertThreshold = parseFloat($(this).val());
        alert('Alert threshold set successfully!');
        checkAttendanceAlert();
    });

    // Update Subject Dropdown
    function updateSubjectDropdown() {
        const dropdown = $("#attendanceSubject");
        dropdown.empty();
        classes.forEach((cls) => {
            dropdown.append(`<option value="${cls.subject}">${cls.subject}</option>`);
        });
    }

    // Render Weekly Calendar
    function renderWeeklyCalendar() {
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
        const calendarBody = $("#calendarBody");
        calendarBody.empty();

        for (let hour = 8; hour <= 18; hour++) { // Assuming classes run from 8 AM to 6 PM
            let row = `<tr><td>${hour}:00</td>`;
            days.forEach((day) => {
                const classInSlot = classes.find((cls) => cls.day === day && cls.hours === hour);
                row += `<td>${classInSlot ? classInSlot.subject : ''}</td>`;
            });
            row += '</tr>';
            calendarBody.append(row);
        }
    }

    // Clear Schedule Form
    function clearScheduleForm() {
        $("#subject").val('');
        $("#day").val('Monday');
        $("#hours").val('');
    }

    // Clear Attendance Form
    function clearAttendanceForm() {
        $("#attendanceSubject").val('');
        $("#status").val('Present');
    }

    // Update Attendance Chart
    function updateAttendanceChart() {
        const attendanceData = {};

        classes.forEach((cls) => {
            const totalClasses = attendanceRecords.filter((rec) => rec.subject === cls.subject).length;
            const presentClasses = attendanceRecords.filter((rec) => rec.subject === cls.subject && rec.status === 'Present').length;
            const attendancePercentage = (presentClasses / totalClasses) * 100 || 0;
            attendanceData[cls.subject] = attendancePercentage.toFixed(2);
        });

        const ctx = document.getElementById('attendanceChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(attendanceData),
                datasets: [{
                    label: 'Attendance Percentage',
                    data: Object.values(attendanceData),
                    backgroundColor: '#007bff',
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            max: 100
                        }
                    }]
                }
            }
        });
    }

    // Check Attendance Alert
    function checkAttendanceAlert() {
        classes.forEach((cls) => {
            const totalClasses = attendanceRecords.filter((rec) => rec.subject === cls.subject).length;
            const presentClasses = attendanceRecords.filter((rec) => rec.subject === cls.subject && rec.status === 'Present').length;
            const attendancePercentage = (presentClasses / totalClasses) * 100 || 0;

            if (attendancePercentage < alertThreshold) {
                alert(`Warning: Your attendance for ${cls.subject} is below ${alertThreshold}%`);
            }
        });
    }
});
$(document).ready(function () {
    let classes = [];
    let attendanceRecords = [];
    let alertThreshold = 75;

    // Initialize Calendar
    renderWeeklyCalendar();

    // Render Weekly Calendar
    function renderWeeklyCalendar() {
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
        const calendarBody = $("#calendarBody");
        calendarBody.empty();

        for (let hour = 8; hour <= 18; hour++) { // Assuming classes run from 8 AM to 6 PM
            let row = `<tr><td>${hour}:00</td>`;
            days.forEach((day) => {
                row += `<td class="calendar-slot" data-day="${day}" data-time="${hour}"></td>`;
            });
            row += '</tr>';
            calendarBody.append(row);
        }

        // Make calendar slots clickable
        $(".calendar-slot").click(function () {
            const day = $(this).data('day');
            const time = $(this).data('time');
            $("#selectedDay").val(day);
            $("#selectedTime").val(time);
            $("#addLectureModal").modal('show');
        });
    }

    // Handle Add Lecture Form Submission
    $("#addLectureForm").submit(function (e) {
        e.preventDefault();
        const subject = $("#lectureSubject").val();
        const hours = parseFloat($("#lectureHours").val());
        const day = $("#selectedDay").val();
        const time = $("#selectedTime").val();

        if (subject && hours && day && time) {
            classes.push({ subject, day, hours, time });
            $("#addLectureModal").modal('hide');
            renderClassesOnCalendar();
        } else {
            alert('Please fill in all fields.');
        }
    });

    // Render Classes on Calendar
    function renderClassesOnCalendar() {
        $(".calendar-slot").empty(); // Clear all slots

        classes.forEach((cls) => {
            const slot = $(`.calendar-slot[data-day="${cls.day}"][data-time="${cls.time}"]`);
            slot.html(`<span class="badge badge-primary">${cls.subject} (${cls.hours} hrs)</span>`);
        });
    }

    // Handle Attendance and Alerts (Existing functionality remains unchanged)
    // ...

    // Render Weekly Calendar initially
    renderWeeklyCalendar();
});
