// Retrieve DOM Element References
const txtTaskName = document.getElementById("txtTaskName"),
    ddlCategory = document.getElementById("ddlCategory"),
    calDeadline = document.getElementById("calDeadline"),
    btnAddTask = document.getElementById("btnAddTask");

const ddlFilterCategory = document.getElementById("ddlFilterCategory"),
    ddlFilterStatus = document.getElementById("ddlFilterStatus");

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
        if (!name || name.trim() === "") {
            throw new Error("Task name is required.");
        }

        let date;

        if (deadline === null || deadline === "") {
            date = new Date();
            date.setDate(date.getDate());
        } else {
            date = parseDateInput(deadline);  // I will not address time. Fixes bug.

            if (isNaN(date.getTime())) {
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

        return today > this.deadline;
    }

    isDueToday() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return today.getTime() === this.deadline.getTime(); // as long as its the same day its due.
    }
}


// Functions
function loadFilterStatusDropdown() {
    const ddlFilterStatus = document.getElementById("ddlFilterStatus"); // Best Practice: Could be null even with defer.

    if (!ddlFilterStatus) {
        console.error("Dropdown for Status is not found!");
        return;
    }

    ddlFilterStatus.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Filter Status";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    ddlFilterStatus.appendChild(defaultOption);

    for (const status of Object.values(taskStatus)) {
        const option = document.createElement("option");
        option.value = option.textContent = status;
        ddlFilterStatus.appendChild(option);
    }
}

function loadCategoryDropdown() {
    const ddlCategory = document.getElementById("ddlCategory"); // Best Practice: Could be null even with defer.

    if (!ddlCategory) {
        console.error("Dropdown for Category is not found!");
        return;
    }

    ddlCategory.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select Category";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    ddlCategory.appendChild(defaultOption);

    for (const category of Object.values(taskCategories)) {
        const option = document.createElement("option");
        option.value = option.textContent = category;
        ddlCategory.appendChild(option);
    }
}


function loadFilterCategoryDropdown() {
    const ddlFilterCategory = document.getElementById("ddlFilterCategory"); // Best Practice: Could be null even with defer.

    if (!ddlFilterCategory) {
        console.error("Dropdown for Category is not found!");
        return;
    }

    ddlFilterCategory.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Filter Category";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    ddlFilterCategory.appendChild(defaultOption);

    for (const category of Object.values(taskCategories)) {
        const option = document.createElement("option");
        option.value = option.textContent = category;
        ddlFilterCategory.appendChild(option);
    }
}

function formatDateForInput(date) {
    return date.toISOString().split("T")[0];
}

function displayTasks(tasksToDisplay = taskList) {
    const lstTaskList = document.getElementById("lstTaskList");
    lstTaskList.innerHTML = ""; // refresh list

    // Check if any tasks exist
    if (tasksToDisplay.length === 0) {
        const li = document.createElement("li");
        li.textContent = "No tasks yet";
        lstTaskList.appendChild(li);
        return;
    }

    // If task exist, display tasks in lstTaskList
    for (const task of tasksToDisplay) {
        const li = document.createElement("li");  // Creates new list item each time.

        // Create Card
        const card = document.createElement("div");
        card.className = "card";

        const taskName = document.createElement("h3");
        taskName.textContent = task.name;

        const p = document.createElement("p");

        const wrapper = document.createElement("span");
        wrapper.className = "wrapper";

        // Create Card Category DropDown to Change the Category
        const ddlChangeCategory = document.createElement("select");
        ddlChangeCategory.className = "ddlChangeCategory";

        for (const category of taskCategories) {
            const option = document.createElement("option");
            option.value = option.textContent = category;

            if (category === task.category) {
                option.selected = true;
            }

            ddlChangeCategory.appendChild(option);
        }

        // Create a ddlChangeCategory event for each task
        ddlChangeCategory.addEventListener("change", (e) => {
            task.category = e.target.value;
            displayTasks();
        });

        wrapper.appendChild(ddlChangeCategory);
        const dueText = document.createTextNode(" • Due: ");

        const calChangeDeadline = document.createElement("input");
        calChangeDeadline.type = "date";
        calChangeDeadline.className = "calChangeDeadline";
        calChangeDeadline.value = formatDateForInput(task.deadline);

        calChangeDeadline.addEventListener("change", (e) => {
            const newDate = parseDateInput(e.target.value);

            if (!isNaN(newDate.getTime())) {
                newDate.setHours(0, 0, 0, 0);
                task.deadline = newDate;
                displayTasks();
            }
        });

        p.appendChild(wrapper);
        p.appendChild(dueText);
        p.appendChild(calChangeDeadline);

        const footer = document.createElement("footer");

        const ddlChangeStatus = document.createElement("select");
        ddlChangeStatus.className = "ddlChangeStatus";

        for (const status of [taskStatus.In_Progress, taskStatus.Completed]) {
            const option = document.createElement("option");
            option.value = option.textContent = status;

            if (status === task.status) {
                option.selected = true;
            }

            ddlChangeStatus.appendChild(option);
        }

        if (task.isOverdue()) {
            const overdueLabel = document.createElement("span");
            overdueLabel.className = "overdue";
            overdueLabel.textContent = " Overdue";

            p.appendChild(overdueLabel);
        }

        // Create a ddlChangeStatus event for each task
        ddlChangeStatus.addEventListener("change", (e) => {
            task.status = e.target.value;
            displayTasks();
        });

        const btnDelete = document.createElement("button");
        btnDelete.className = "btnDelete";
        btnDelete.textContent = "Delete";

        // Create a btnDelete event for each task
        btnDelete.addEventListener("click", () => {
            const index = tasksToDisplay.indexOf(task);
            tasksToDisplay.splice(index, 1);
            displayTasks();
        });

        footer.appendChild(ddlChangeStatus);
        footer.appendChild(btnDelete);

        card.appendChild(taskName);
        card.appendChild(p);
        card.appendChild(footer);

        li.appendChild(card);
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

function resetForm() {
    txtTaskName.value = "";
    ddlCategory.selectedIndex = 0;
    calDeadline.value = "";
}

// I don't understand this. I haven't  had time to study what is going on. Fixes bug.
function parseDateInput(value) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
}


// Events
document.addEventListener("DOMContentLoaded", () => {
    loadCategoryDropdown();

    loadFilterStatusDropdown();
    loadFilterCategoryDropdown();

    displayTasks();
});

btnAddTask.addEventListener("click", function () {
    const taskName = txtTaskName.value.trim();

    if (taskName === "") {
        alert("Please enter a task name.");
        txtTaskName.focus();
        return;
    }

    addTask(txtTaskName.value, ddlCategory.value, calDeadline.value);
    resetForm();
});
