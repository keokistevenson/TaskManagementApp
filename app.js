// Retrieve DOM Element References
const txtTaskName = document.getElementById("txtTaskName"),
    ddlCategory = document.getElementById("ddlCategory"),
    ddlStatus = document.getElementById("ddlStatus"),
    calDeadline = document.getElementById("calDeadline"),
    btnAddTask = document.getElementById("btnAddTask");

// I need to revisit this later. I'm already complicating things.
const taskStatus = {
    In_Progress: "In Progress",
    Completed: "Completed",  // I think we are mixing terms. A task can be overdue and completed, or it can be in progres and overdue.
    Overdue: "Overdue"
};

// Preliminary list of tasks
const taskCategories = ["Work", "Personal", "Health", "Education", "Finance"];

// Holds all the tasks
const taskList = [];

class Task {
    constructor(name, category, deadline = null) {  // I hope I don't regret trying to use object oriented concepts. 
        let date;

        if (deadline === null) {
            date = new Date();
            date.setDate(date.getDate() + 1); // default = tomorrow
        } else {
            date = new Date(deadline);  // I will not address time.

            if (isNaN(deadline.getTime())) {
                throw new Error("Invalid deadline");
            }
        }

        date.setHours(0, 0, 0, 0);  // Ignores time for now. Considers date only.

        this.name = name;
        this.creationDate = new Date();
        this.category = category;
        this.deadline = date;
        this.status = taskStatus.In_Progress;
    }

    getStatus() {
        return this.status;  // Tried to encapsulate Status.
    }

    markComplete() {
        this.status = taskStatus.Completed;
    }

    isOverdue() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        this.status = taskStatus.Overdue;

        return today > this.deadline;
    }

    isDueToday() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return today.getTime() === this.deadline.getTime(); // as long as its the same day its due.
    }
}


// Functions
function loadStatusDropdown() {
    const ddlStatus = document.getElementById("ddlStatus"); // Best Practice: Could be null even with defer.

    if (!ddlStatus) {
        console.error("Dropdown for Status is not found!");
        return;
    }

    for (const status of Object.values(taskStatus)) {
        const option = document.createElement("option");
        option.value = option.textContent = status;
        ddlStatus.appendChild(option);
    }
}

function loadCategoryDropdown() {
    const ddlCategory = document.getElementById("ddlCategory"); // Best Practice: Could be null even with defer.

    if (!ddlCategory) {
        console.error("Dropdown for Category is not found!");
        return;
    }

    for (const category of Object.values(taskCategories)) {
        const option = document.createElement("option");
        option.value = option.textContent = category;
        ddlCategory.appendChild(option);
    }
}

function displayTasks() {
    const lstTaskList = document.getElementById("lstTaskList");
    lstTaskList.innerHTML = ""; // refresh list

    // Prepare to create list items.
    const li = document.createElement("li");

    // Check if any tasks exist
    if (taskList.length === 0) {
        const li = document.createElement("li");
        li.textContent = "No tasks yet";
        lstTaskList.appendChild(li);
        return;
    }

    // If task exist, display tasks in lstTaskList
    for (const task of taskList) {
        const li = document.createElement("li");

        li.innerHTML = `
            <div class="taskCard">
                <h3>${task.name}</h3>
                <p>Status: ${task.status}</p>
                <p>Category: ${task.category}</p>
                <footer>Due: ${task.deadline}</footer>
            </div>`;

        lstTaskList.appendChild(li);
    }


}

function addTask(taskName, category, deadline) {

    // Create task
    const task = new Task(taskName, category, deadline);

    // Add task to task list
    taskList.push(task);

    // Display task
    displayTasks();
}


// Events
document.addEventListener("DOMContentLoaded", () => {
    loadStatusDropdown();
    loadCategoryDropdown();
});

btnAddTask.addEventListener("click", function () {
    addTask(txtTaskName.value, ddlCategory.value, calDeadline.value);
    txtTaskName.value = "";  // Prepare for next task. Clear input for next task.
});






