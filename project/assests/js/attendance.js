$(document).ready(function () {
    let classes = [];
    let attendanceRecords = {};
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    renderWeeklyCalendar();

    function renderWeeklyCalendar() {
        const calendarBody = $("#calendarBody");
        calendarBody.empty();

        for (let hour = 8; hour <= 18; hour++) {
            let row = `<tr><td>${hour}:00</td>`;
            days.forEach((day) => {
                row += `<td class="calendar-slot droppable" data-day="${day}" data-time="${hour}"></td>`;
            });
            row += '</tr>';
            calendarBody.append(row);
        }

        renderClassesOnCalendar();
        bindCalendarCellClicks(); // Bind click event for each calendar cell
    }

    function bindCalendarCellClicks() {
        $(".calendar-slot").click(function () {
            const day = $(this).data('day');
            const time = $(this).data('time');

            // Pre-fill the modal with the selected day and time
            $("#selectedDay").val(day);
            $("#selectedTime").val(time);
            $("#editingIndex").val(""); // Clear any existing editing index

            $("#addLectureModal").modal('show');
        });
    }

    $("#addLectureForm").submit(function (e) {
        e.preventDefault();
        const subject = $("#lectureSubject").val();
        const hours = parseFloat($("#lectureHours").val());
        const day = $("#selectedDay").val();
        const time = parseInt($("#selectedTime").val());
        const index = $("#editingIndex").val();

        if (subject && hours && day && time) {
            if (index) {
                // Edit existing lecture
                classes[index] = { subject, day, hours, time };
            } else {
                // Add new lecture
                classes.push({ subject, day, hours, time });
            }
            $("#addLectureModal").modal('hide');
            renderClassesOnCalendar();
        } else {
            alert('Please fill in all fields.');
        }
    });

    $("#deleteLectureBtn").click(function () {
        const index = $("#editingIndex").val();
        if (index) {
            classes.splice(index, 1);
            $("#addLectureModal").modal('hide');
            renderClassesOnCalendar();
        }
    });

    function renderClassesOnCalendar() {
        $(".calendar-slot").empty().css('visibility', 'visible').removeAttr('rowspan');

        classes.forEach((cls, index) => {
            const slot = $(`.calendar-slot[data-day="${cls.day}"][data-time="${cls.time}"]`);
            const rowSpan = cls.hours;

            const lectureBlock = $(`
                <div class="lecture-block badge badge-primary" data-index="${index}" style="cursor: pointer; height: ${rowSpan * 42}px;">
                    ${cls.subject} (${cls.hours} hrs)
                </div>
            `);

            slot.append(lectureBlock).attr('rowspan', rowSpan).css('vertical-align', 'top');

            // Hide merged cells below the main slot
            for (let i = 1; i < rowSpan; i++) {
                $(`.calendar-slot[data-day="${cls.day}"][data-time="${cls.time + i}"]`).css('visibility', 'hidden');
            }

            // Handle lecture block click for editing or marking attendance
            lectureBlock.click(function (event) {
                event.stopPropagation(); // Prevent the cell click event

                const classIndex = $(this).data('index');
                $("#lectureSubject").val(classes[classIndex].subject);
                $("#lectureHours").val(classes[classIndex].hours);
                $("#selectedDay").val(classes[classIndex].day);
                $("#selectedTime").val(classes[classIndex].time);
                $("#editingIndex").val(classIndex);

                $("#addLectureModal").modal('show');
            });
        });
    }

    function recordAttendance(day, time, classIndex) {
        const cls = classes[classIndex];
        const attendanceKey = `${cls.subject}_${day}_${time}`;
        let attendanceStatus = attendanceRecords[attendanceKey] || 'Absent';

        attendanceStatus = attendanceStatus === 'Present' ? 'Absent' : 'Present';
        attendanceRecords[attendanceKey] = attendanceStatus;

        updateAttendanceVisualization(classIndex, day, time, attendanceStatus);
        updateAttendanceChart();
    }

    function updateAttendanceVisualization(classIndex, day, time, attendanceStatus) {
        const slot = $(`.calendar-slot[data-day="${day}"][data-time="${time}"]`);
        const lectureBlock = slot.find(`[data-index="${classIndex}"]`);

        if (attendanceStatus === 'Present') {
            lectureBlock.removeClass('badge-primary').addClass('badge-success');
        } else {
            lectureBlock.removeClass('badge-success').addClass('badge-primary');
        }
    }

    function updateAttendanceChart() {
        const attendanceData = {};

        classes.forEach((cls) => {
            const totalClasses = days.reduce((count, day) => count + (attendanceRecords[`${cls.subject}_${day}_${cls.time}`] ? 1 : 0), 0);
            const presentClasses = days.reduce((count, day) => count + (attendanceRecords[`${cls.subject}_${day}_${cls.time}`] === 'Present' ? 1 : 0), 0);
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

    // Dummy data for testing
    classes = [
        { subject: "Math", day: "Monday", hours: 2, time: 9 },
        { subject: "Physics", day: "Wednesday", hours: 3, time: 11 },
        { subject: "Chemistry", day: "Friday", hours: 1, time: 14 }
    ];

    renderClassesOnCalendar();
});
