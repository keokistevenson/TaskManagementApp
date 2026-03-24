Link to the website: https://keokistevenson.github.io/TaskManagementApp/

## Include a brief README.md explaining how the app works and any additional features you have implemented.

The only thing required is the task name. Everything else will be loaded with defaults.  If user makes a mistake, all fields can be updated on the task itself provided the name is correct. Otherwise, they can delete.

Filter category based on status and category.

## Challenges faced during the project.

I might have over engineered trying to think in OOP concepts only to realize there is special syntax to implement encapsulation.

I probably spent way too much time trying to figure out the best way to mark something overdue.  Deciding at what point things are overdue.

This was a crazy bug fix:
function parseDateInput(value) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
}

I couldn't remember how to use filter. Its a shame how quickly you lose information. The video i found was too simple.


##  How you approached solving those challenges.
Lots of times I had to question what the best practice was.  I learned somethings from that. Start putting code down. Start from what i know and it starts to come together.


## What you would improve if given more time.
I would improve the looks. This README.