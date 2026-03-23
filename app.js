// Retrieve DOM Element References
const txtTaskName = document.getElementById("txtTaskName"),
    ddlCategory = document.getElementById("ddlCategory"),
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
        let overdue = false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (today > this.deadline) {
            this.status = taskStatus.Overdue;
            overdue = true;
        }
        return overdue;
    }

    isDueToday() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return today.getTime() === this.deadline.getTime(); // as long as its the same day its due.
    }
}


// Functions
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

function formatDateForInput(date) {
    return date.toISOString().split("T")[0];
}

function displayTasks() {
    const lstTaskList = document.getElementById("lstTaskList");
    lstTaskList.innerHTML = ""; // refresh list

    // Check if any tasks exist
    if (taskList.length === 0) {
        const li = document.createElement("li");
        li.textContent = "No tasks yet";
        lstTaskList.appendChild(li);
        return;
    }

    // If task exist, display tasks in lstTaskList
    for (const task of taskList) {
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
            const newDate = new Date(e.target.value);

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
            const index = taskList.indexOf(task);
            taskList.splice(index, 1);
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


// Events
document.addEventListener("DOMContentLoaded", () => {
    loadCategoryDropdown();
    displayTasks();
});

btnAddTask.addEventListener("click", function () {
    addTask(txtTaskName.value, ddlCategory.value, calDeadline.value);
    txtTaskName.value = "";  // Prepare for next task. Clear input for next task.
});






