export const arrObj = { subArray: [], sessionArray: [] };
//sub array
export function removeSub(sub){
    arrObj.subArray = arrObj.subArray.filter(subA => subA.name !== sub.name);
    console.log(arrObj.subArray);
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

        arrObj.subArray.push(this);
        console.log(arrObj.subArray);
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

function sortTasks(sub, criteria) {
    const validCriteria = ['done', 'dueDate', 'priority', 'description'];
    if (validCriteria.includes(criteria)) {
        sub.tasks.sort((a, b) => {
            if (a[criteria] < b[criteria]) return -1;
            if (a[criteria] > b[criteria]) return 1;
            return 0;
        });
    }
}

export function sortSubsByCriteria(array, criteria){
    const validCriteria = ['dueDate', 'urgency'];
    if (validCriteria.includes(criteria)) {
        array.sort((a, b) => {
            if (a[criteria] < b[criteria]) return -1;
            if (a[criteria] > b[criteria]) return 1;
            return 0;
        });
    }
}

const sortSubs = () => {
    arrObj.subArray.forEach(sub => {
        calcUrgency(sub);
    });
    const compareUrgency = (a,b) => {
        return a.urgency - b.urgency ;
    }
    arrObj.subArray.sort(compareUrgency);
    console.log("New Sorted SubArray: " , arrObj.subArray);
}

function calcDaysLeft(sub){
    const today = new Date();
    const timeDiff = new Date(sub.dueDate) - today;
    sub.daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
}

//

export { StudySubject, Task };
export { calcUrgency, addTask, sortTasks, calcDaysLeft, sortSubs };