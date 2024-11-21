// Add Subject Input Row
document.getElementById("addSubject").addEventListener("click", function () {
    const subjectRow = document.createElement("div");
    subjectRow.classList.add("input-row");
    subjectRow.innerHTML = `
        <label>Subject:</label>
        <input type="text" class="subjectName" placeholder="e.g., Science" required>
        <label>Priority (1-5):</label>
        <select class="subjectPriority">
            <option value="1">1 (High)</option>
            <option value="2">2</option>
            <option value="3" selected>3</option>
            <option value="4">4</option>
            <option value="5">5 (Low)</option>
        </select>
    `;
    document.getElementById("subjectInputs").appendChild(subjectRow);
});


// Add Subtopic Input Row
document.getElementById("subjectInputs").addEventListener("click", function (event) {
    if (event.target.classList.contains("addSubtopic")) {
        const subtopicRow = document.createElement("div");
        subtopicRow.classList.add("input-row");
        subtopicRow.innerHTML = `
            <input type="text" class="subtopicName" placeholder="e.g., Algebra" required>
            <button type="button" class="removeSubtopic">Remove</button>
        `;
        event.target.nextElementSibling.appendChild(subtopicRow);
    } else if (event.target.classList.contains("removeSubtopic")) {
        event.target.parentElement.remove();
    }
});

// Add Subject Input Row (Retains Original Functionality)
document.getElementById("addSubject").addEventListener("click", function () {
    const subjectRow = document.createElement("div");
    subjectRow.classList.add("input-row", "subject-row");
    subjectRow.innerHTML = `
        <label>Subject:</label>
        <input type="text" class="subjectName" placeholder="e.g., Science" required>
        <label>Priority (1-5):</label>
        <select class="subjectPriority">
            <option value="1">1 (High)</option>
            <option value="2">2</option>
            <option value="3" selected>3</option>
            <option value="4">4</option>
            <option value="5">5 (Low)</option>
        </select>
        <button type="button" class="addSubtopic">Add Subtopics</button>
        <div class="subtopicContainer" style="margin-left: 20px;">
            <h4>Subtopics</h4>
            <div class="input-row">
                <input type="text" class="subtopicName" placeholder="e.g., Basics of Light" required>
                <button type="button" class="removeSubtopic">Remove</button>
            </div>
        </div>
    `;
    document.getElementById("subjectInputs").appendChild(subjectRow);
});

// Generate Timetable (Modified to Include Subtopics)
document.getElementById("generateButton").addEventListener("click", function () {
    const studyDuration = parseInt(document.getElementById("studyDuration").value, 10);
    if (isNaN(studyDuration) || studyDuration <= 0) {
        alert("Please enter a valid study duration in hours.");
        return;
    }
    const totalMinutes = studyDuration * 60;

    const subjects = Array.from(document.querySelectorAll(".subject-row")).map(subjectRow => {
        const subjectName = subjectRow.querySelector(".subjectName").value.trim();
        const priority = parseInt(subjectRow.querySelector(".subjectPriority").value, 10);
        const subtopics = Array.from(subjectRow.querySelectorAll(".subtopicName")).map(input => input.value.trim());
        return { subjectName, priority, subtopics };
    });

    // Ensure there is at least one subject
    if (!subjects.length) {
        alert("Please add at least one subject.");
        return;
    }

    // Create tasks based on subjects and their subtopics
    const tasks = [];
    subjects.forEach(({ subjectName, priority, subtopics }) => {
        if (subtopics.length) {
            subtopics.forEach(subtopic => tasks.push({ name: `Study ${subjectName} - ${subtopic}`, priority }));
        } else {
            tasks.push({ name: `Study ${subjectName}`, priority });
        }
    });

    const totalPriority = tasks.reduce((sum, task) => sum + (6 - task.priority), 0);
    const timetable = tasks.map(task => ({
        task: task.name,
        duration: Math.floor((totalMinutes * (6 - task.priority)) / totalPriority),
    }));

    // Render timetable
    const timetableBody = document.getElementById("timetableBody");
    timetableBody.innerHTML = "";
    timetable.forEach(entry => {
        const row = document.createElement("tr");
        const taskCell = document.createElement("td");
        const durationCell = document.createElement("td");

        taskCell.textContent = entry.task;
        durationCell.textContent = `${entry.duration} mins`;

        row.appendChild(taskCell);
        row.appendChild(durationCell);
        timetableBody.appendChild(row);
    });

    document.getElementById("timetableForm").style.display = "none";
    document.getElementById("timetableContainer").style.display = "block";
});




// Add Assignment Input Row
document.getElementById("addAssignment").addEventListener("click", function () {
    const assignmentRow = document.createElement("div");
    assignmentRow.classList.add("input-row");
    assignmentRow.innerHTML = `
        <label>Assignment:</label>
        <input type="text" class="assignmentName" placeholder="e.g., Research Paper" required>
        <label>Priority (1-5):</label>
        <select class="assignmentPriority">
            <option value="1">1 (High)</option>
            <option value="2">2</option>
            <option value="3" selected>3</option>
            <option value="4">4</option>
            <option value="5">5 (Low)</option>
        </select>
        <label>Deadline:</label>
        <input type="date" class="assignmentDeadline" required>
    `;
    document.getElementById("assignmentInputs").appendChild(assignmentRow);
});

// Generate Timetable
document.getElementById("generateButton").addEventListener("click", function () {
    const studyDuration = parseInt(document.getElementById("studyDuration").value, 10);
    if (isNaN(studyDuration) || studyDuration <= 0) {
        alert("Please enter a valid study duration in hours.");
        return;
    }
    const totalMinutes = studyDuration * 60;

    const subjects = Array.from(document.getElementsByClassName("subjectName")).map(input => input.value.trim());
    const subjectPriorities = Array.from(document.getElementsByClassName("subjectPriority")).map(input => parseInt(input.value, 10));

    const assignments = Array.from(document.getElementsByClassName("assignmentName")).map(input => input.value.trim());
    const assignmentPriorities = Array.from(document.getElementsByClassName("assignmentPriority")).map(input => parseInt(input.value, 10));
    const assignmentDeadlines = Array.from(document.getElementsByClassName("assignmentDeadline")).map(input => input.value);

    const chores = document.getElementById("chores").value.trim();

    if (!subjects.length && !assignments.length && !chores) {
        alert("Please add at least one subject, assignment, or chore.");
        return;
    }

    const tasks = [];
    subjects.forEach((name, index) => tasks.push({ name: `Study ${name}`, priority: subjectPriorities[index], deadline: "" }));
    assignments.forEach((name, index) => tasks.push({ name: `Complete ${name}`, priority: assignmentPriorities[index], deadline: assignmentDeadlines[index] }));
    if (chores) {
        tasks.push({ name: `Chores: ${chores}`, priority: 3, deadline: "" });
    }

    const totalPriority = tasks.reduce((sum, task) => sum + (6 - task.priority), 0);
    const timetable = tasks.map(task => ({
        task: task.name,
        duration: Math.floor((totalMinutes * (6 - task.priority)) / totalPriority),
        deadline: task.deadline,
    }));

    const timetableBody = document.getElementById("timetableBody");
    timetableBody.innerHTML = "";
    timetable.forEach(entry => {
        const row = document.createElement("tr");
        const taskCell = document.createElement("td");
        const durationCell = document.createElement("td");
        const deadlineCell = document.createElement("td");

        taskCell.textContent = entry.task;
        durationCell.textContent = `${entry.duration} mins`;
        deadlineCell.textContent = entry.deadline || "N/A";

        row.appendChild(taskCell);
        row.appendChild(durationCell);
        row.appendChild(deadlineCell);
        timetableBody.appendChild(row);
    });

    document.getElementById("timetableForm").style.display = "none";
    document.getElementById("timetableContainer").style.display = "block";
});

// Show Deadline Notifications
document.getElementById("showDeadlinesButton").addEventListener("click", function () {
    const assignmentDeadlines = Array.from(document.getElementsByClassName("assignmentDeadline")).map(input => input.value);
    if (assignmentDeadlines.length === 0) {
        alert("No assignments have deadlines.");
        return;
    }
    assignmentDeadlines.forEach(deadline => {
        const date = new Date(deadline);
        const today = new Date();
        if (date >= today) {
            alert(`Reminder: Deadline is approaching! Deadline: ${date.toDateString()}`);
        }
    });
});

// Download Timetable as CSV
document.getElementById("downloadButton").addEventListener("click", function () {
    const rows = [["Task", "Duration (Minutes)", "Deadline"]];
    const timetable = Array.from(document.querySelectorAll("#timetableBody tr"));
    timetable.forEach(row => {
        const cols = Array.from(row.children).map(cell => cell.textContent);
        rows.push(cols);
    });

    const csvContent = rows.map(e => e.join(",")).join("\n");
    const downloadLink = document.createElement("a");
    downloadLink.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent);
    downloadLink.target = "_blank";
    downloadLink.download = "timetable.csv";
    downloadLink.click();
});

// Back to Form
document.getElementById("backButton").addEventListener("click", function () {
    document.getElementById("timetableForm").style.display = "block";
    document.getElementById("timetableContainer").style.display = "none";
});

//download
document.getElementById("downloadButton").addEventListener("click", function () {
    const rows = [["Task", "Duration (Minutes)", "Deadline"]];
    const timetable = Array.from(document.querySelectorAll("#timetableBody tr"));
    timetable.forEach(row => {
        const cols = Array.from(row.children).map(cell => cell.textContent);
        rows.push(cols);
    });

    const csvContent = rows.map(e => e.join(",")).join("\n");
    const downloadLink = document.createElement("a");
    downloadLink.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent);
    downloadLink.target = "_blank";
    downloadLink.download = "timetable.csv";
    downloadLink.click();
});


//subtopics
// Add Subtopic Input Row
document.getElementById("subjectInputs").addEventListener("click", function (event) {
    if (event.target.classList.contains("addSubtopic")) {
        const subtopicRow = document.createElement("div");
        subtopicRow.classList.add("input-row");
        subtopicRow.innerHTML = `
            <input type="text" class="subtopicName" placeholder="e.g., Algebra" required>
            <button type="button" class="removeSubtopic">Remove</button>
        `;
        event.target.nextElementSibling.appendChild(subtopicRow);
    } else if (event.target.classList.contains("removeSubtopic")) {
        event.target.parentElement.remove();
    }
});

// Add Subject Input Row (Retains Original Functionality)
document.getElementById("addSubject").addEventListener("click", function () {
    const subjectRow = document.createElement("div");
    subjectRow.classList.add("input-row", "subject-row");
    subjectRow.innerHTML = `
        <label>Subject:</label>
        <input type="text" class="subjectName" placeholder="e.g., Science" required>
        <label>Priority (1-5):</label>
        <select class="subjectPriority">
            <option value="1">1 (High)</option>
            <option value="2">2</option>
            <option value="3" selected>3</option>
            <option value="4">4</option>
            <option value="5">5 (Low)</option>
        </select>
        <button type="button" class="addSubtopic">Add Subtopics</button>
        <div class="subtopicContainer" style="margin-left: 20px;">
            <h4>Subtopics</h4>
            <div class="input-row">
                <input type="text" class="subtopicName" placeholder="e.g., Basics of Light" required>
                <button type="button" class="removeSubtopic">Remove</button>
            </div>
        </div>
    `;
    document.getElementById("subjectInputs").appendChild(subjectRow);
});

// Generate Timetable (Modified to Include Subtopics)
document.getElementById("generateButton").addEventListener("click", function () {
    const studyDuration = parseInt(document.getElementById("studyDuration").value, 10);
    if (isNaN(studyDuration) || studyDuration <= 0) {
        alert("Please enter a valid study duration in hours.");
        return;
    }
    const totalMinutes = studyDuration * 60;

    const subjects = Array.from(document.querySelectorAll(".subject-row")).map(subjectRow => {
        const subjectName = subjectRow.querySelector(".subjectName").value.trim();
        const priority = parseInt(subjectRow.querySelector(".subjectPriority").value, 10);
        const subtopics = Array.from(subjectRow.querySelectorAll(".subtopicName")).map(input => input.value.trim());
        return { subjectName, priority, subtopics };
    });

    // Ensure there is at least one subject
    if (!subjects.length) {
        alert("Please add at least one subject.");
        return;
    }

    // Create tasks based on subjects and their subtopics
    const tasks = [];
    subjects.forEach(({ subjectName, priority, subtopics }) => {
        if (subtopics.length) {
            subtopics.forEach(subtopic => tasks.push({ name: `Study ${subjectName} - ${subtopic}`, priority }));
        } else {
            tasks.push({ name: `Study ${subjectName}`, priority });
        }
    });

    const totalPriority = tasks.reduce((sum, task) => sum + (6 - task.priority), 0);
    const timetable = tasks.map(task => ({
        task: task.name,
        duration: Math.floor((totalMinutes * (6 - task.priority)) / totalPriority),
    }));

    // Render timetable
    const timetableBody = document.getElementById("timetableBody");
    timetableBody.innerHTML = "";
    timetable.forEach(entry => {
        const row = document.createElement("tr");
        const taskCell = document.createElement("td");
        const durationCell = document.createElement("td");

        taskCell.textContent = entry.task;
        durationCell.textContent = `${entry.duration} mins`;

        row.appendChild(taskCell);
        row.appendChild(durationCell);
        timetableBody.appendChild(row);
    });

    document.getElementById("timetableForm").style.display = "none";
    document.getElementById("timetableContainer").style.display = "block";
});

// document.getElementById('scheduleForm').addEventListener('submit', function(event) {
//     event.preventDefault();  // Prevent form from submitting normally

//     const totalTime = parseFloat(document.getElementById('totalTime').value);
//     const extraChores = parseFloat(document.getElementById('extraChores').value);
//     const tasks = [];

//     // Collect tasks data
//     document.querySelectorAll('.task').forEach(task => {
//         const subject = task.querySelector('.subject').value;
//         const subtopic = task.querySelector('.subtopic').value;
//         const deadline = task.querySelector('.deadline').value;
//         const priority = parseInt(task.querySelector('.priority').value);

//         if (subject && subtopic && deadline && priority) {
//             tasks.push({ subject, subtopic, deadline, priority });
//         }
//     });

//     // Generate study schedule
//     generateSchedule(totalTime, extraChores, tasks);
// });

// function generateSchedule(totalTime, extraChores, tasks) {
//     const scheduleOutput = document.getElementById('scheduleOutput');
//     const downloadButton = document.getElementById('downloadCSV');
    
//     // Remove existing content
//     scheduleOutput.innerHTML = '';
    
//     // Process total available time after subtracting chores
//     const availableTime = totalTime - extraChores;

//     // Sort tasks by priority (1 = high, 5 = low)
//     tasks.sort((a, b) => a.priority - b.priority);

//     // Calculate time per task
//     const timePerTask = availableTime / tasks.length;
    
//     // Create schedule
//     let scheduleHTML = '<h3>Your Study Schedule</h3><table><thead><tr><th>Subject</th><th>Subtopic</th><th>Deadline</th><th>Time Allocated (hours)</th></tr></thead><tbody>';
//     tasks.forEach(task => {
//         scheduleHTML += `
//             <tr>
//                 <td>${task.subject}</td>
//                 <td>${task.subtopic}</td>
//                 <td>${task.deadline}</td>
//                 <td>${timePerTask.toFixed(2)}</td>
//             </tr>
//         `;
//     });
//     scheduleHTML += '</tbody></table>';
    
//     // Show the generated schedule
//     scheduleOutput.innerHTML = scheduleHTML;
//     scheduleOutput.style.display = 'block';

//     // Enable CSV download
//     downloadButton.style.display = 'block';
//     downloadButton.onclick = function() {
//         downloadCSV(tasks, timePerTask);
//     };
// }

// function addTask() {
//     const taskContainer = document.getElementById('tasks');
//     const newTask = document.createElement('div');
//     newTask.classList.add('task');
//     newTask.innerHTML = `
//         <input type="text" class="subject" placeholder="Subject" required>
//         <input type="text" class="subtopic" placeholder="Subtopic" required>
//         <input type="date" class="deadline" placeholder="Deadline" required>
//         <input type="number" class="priority" placeholder="Priority (1-5)" required>
//     `;
//     taskContainer.appendChild(newTask);
// }

// function downloadCSV(tasks, timePerTask) {
//     const rows = [
//         ['Subject', 'Subtopic', 'Deadline', 'Time Allocated (hours)']
//     ];

//     tasks.forEach(task => {
//         rows.push([task.subject, task.subtopic, task.deadline, timePerTask.toFixed(2)]);
//     });

//     let csvContent = "data:text/csv;charset=utf-8,";

//     rows.forEach(row => {
//         csvContent += row.join(",") + "\n";
//     });

//     // Create a link and simulate a click to download CSV
//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", "study_schedule.csv");
//     link.click();
// }
