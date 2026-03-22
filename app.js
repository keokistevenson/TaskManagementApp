
class Task {
    constructor(name, deadline = null) {  // I hope I don't regret trying to use object oriented concepts. 
        let date;

        if (deadline === null) {
            date = new Date();
            date.setDate(date.getDate() + 1); // default = tomorrow
            date.setHours(0, 0, 0, 0);  // Set to tomorrow's time to midnight.
        } else {

            if (isNaN(deadline.getTime())) {
                throw new Error("Invalid deadline");
            }
            date = new Date(deadline);  // I will not address time.
        }

        if (isNaN(date.getTime())) {
            throw new Error("Invalid deadline");
        }

        this.name = name;
        this.deadline = date;
    }
}


const taskStatus = {
    progress: "In Progress",
    completed: "Completed",
    overdue: "Overdue"
};



// Preliminary list of tasks
const taskCategories = ["Work", "Personal", "Health", "Education", "Shopping"];

// Holds all the tasks
const taskList = []
