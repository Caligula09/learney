export const subArrObj = { subArray: [] };
export let sessionArray = [];
//sub array
export function removeSub(sub){
    subArrObj.subArray = subArrObj.subArray.filter(subA => subA.name !== sub.name);
    console.log(subArrObj.subArray);
}

//classes
class StudySubject {
    constructor(name, dueDate, confidenceLevel) {
        this.name = name;
        this.dueDate = dueDate;
        this.now = new Date();
        this.creationDate = new Date(Date.now()).toISOString().split('T')[0];
        this.confidence = confidenceLevel;
        this.daysLeft = 0;
        this.practicedAmount = 1;
        this.urgency = 0;
        this.tasks = [];
        this.openTaskInput = false;

        calcDaysLeft(this);
        calcUrgency(this);

        subArrObj.subArray.push(this);
        console.log(subArrObj.subArray);
    }
/*
    addSession(timeSpent) {
        const session = {
            date: new Date(),
            timeSpent: timeSpent
        };
        sessionArray.push(session);
        this.practicedAmount += 1;
        this.calculateUrgency();
    }
*/
}

class Task {
    constructor(name, subject) {
        this.name = name;
        this.creationDate = new Date();
        this.dueDate = subject.dueDate;
        this.done = false;
        this.priority = 0;
        this.description = "";

        subject.tasks.push(this);
        console.log(subject);
    }
    set Priority(priority) {
        this.priority = priority;
    }

    set Description(description) {
        this.description = description;
    }

    set DueDate(dueDate) {
        this.dueDate = dueDate;
    }

    markAsDone() {
        this.done = true;
    }
}
//creator functions
function calcUrgency(sub){
    sub.urgency = sub.daysLeft * sub.confidence * sub.practicedAmount;
}

function addTask(name, sub){
    new Task(name, sub);
}

function sortTasks(sub,criteria){
    if (criteria === 'done'){
    sub.tasks.sort((a,b)=>{
        return a.criteria - b.criteria;
    });
    }
}

function calcDaysLeft(sub){
    const today = new Date();
    const timeDiff = new Date(sub.dueDate) - today;
    sub.daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
}

//

const sortSubs = () => {
    subArrObj.subArray.forEach(sub => {
        calcUrgency(sub);
    });
    const compareUrgency = (a,b) => {
        return a.urgency - b.urgency ;
    }
    subArrObj.subArray.sort(compareUrgency);
    console.log("New Sorted SubArray: " + subArrObj.subArray);
}

export { StudySubject, Task };
export { calcUrgency, addTask, sortTasks, calcDaysLeft, sortSubs };