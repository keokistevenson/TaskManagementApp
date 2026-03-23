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
class Task {
    constructor(name, deadline = null) {  // I hope I don't regret trying to use object oriented concepts. 
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



// Preliminary list of tasks
const taskCategories = ["Work", "Personal", "Health", "Education", "Shopping"];

// Holds all the tasks
const taskList = [];






