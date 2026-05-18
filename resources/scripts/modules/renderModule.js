import { subArrObj, removeSub } from "./classModule.js";
import { Task, StudySubject, sortTasks, sortSubs } from "./classModule.js";
// DOM elements
//div & container & element selectors
const div1 = document.getElementById('div1'); //progress bar and timer div in session page
const div2 = document.getElementById('div2'); //state div in session page (displays study/break)
const div3 = document.getElementById('div3'); //date and time div in front page
const div4 = document.getElementById('div4'); //start session div in front page
const div5 = document.getElementById('div5'); //add subject div in front page
const subListDiv = document.getElementById('div6'); //sublist in front page (only subjects)
const div6extended = document.getElementById('div6extended'); //sublist extended with tasks etc
const div7 = document.getElementById('div7'); //in session main div (current subject, nav buttons)
const div8 = document.getElementById('div8'); //in session task div (task list, add task button)
const divs = [div1, div2, div3, div4, div5, subListDiv, div6extended, div7, div8];
const homeDivs = [div3, div4, div5, subListDiv];
const sessionDivs = [div1, div2, div7, div8];
const alertDiv = document.getElementById('alertDiv');

let subUl = document.getElementById('subUl');//add children to this ul for new subjects (let bc must be accessible/updatable in addSubject function)
let subUlDivExtended = document.getElementById('subUlDivExtended');
const subTaskList = document.getElementById('subTaskList');
const timerMins = document.getElementById('timerMins');
const timerSecs = document.getElementById('timerSecs');
const alertH2 = document.getElementById('alertH2');

const currentTask = document.getElementById('currentTask');

//button & input selectors
const addNewSubBtn = document.getElementById('addNewSub');
const startSessionBtn = document.getElementById('startSession');
const endSessionBtn = document.getElementById('endSession');
const nextSessionBtn = document.getElementById('nextSession');
const skipSessionBtn = document.getElementById('skipSession');
const alertOkBtn = document.getElementById('alertOkButton');
const leftSessionBtn = document.getElementById('leftSessionBtn');
const rightSessionBtn = document.getElementById('rightSessionBtn');

const totalHoursInput = document.getElementById('sessionHourInput');
const totalMinsInput = document.getElementById('sessionMinInput');
const sessionMinsInput = document.getElementById('sessionLengthInput');

const subNameInput = document.getElementById('subjectInput');
const subDateInput = document.getElementById('dateInput');
const subConfidenceInput = document.getElementById('confidenceInput');

const breaksYes = document.getElementById('breaksYes');
const inSessionTaskAdder = document.getElementById('inSessionTaskAdder'); //  ?

export const subGenFunction = (subArr, container, bool) => {
    container.innerHTML = "";
    for(let sub of subArr){
    //sub container
    const subDiv = document.createElement('div');
    subDiv.classList.add('subDiv');
    container.appendChild(subDiv);
    //sub head
    const subHeadDiv = document.createElement('div');
    subHeadDiv.classList.add('subHeadDiv');
    subDiv.appendChild(subHeadDiv);
    //h2
    const subH2 = document.createElement('h2');
    subH2.textContent = sub.name.toUpperCase() + sub.dueDate;
    subHeadDiv.appendChild(subH2);
    //delete
    const deleteSubBtn = document.createElement('button');
    deleteSubBtn.classList.add('deleteBtn');
    deleteSubBtn.insertAdjacentHTML('beforeend', '<svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="currentColor"><path d="M261-120q-24.75 0-42.37-17.63Q201-155.25 201-180v-570h-11q-12.75 0-21.37-8.68-8.63-8.67-8.63-21.5 0-12.82 8.63-21.32 8.62-8.5 21.37-8.5h158q0-13 8.63-21.5 8.62-8.5 21.37-8.5h204q12.75 0 21.38 8.62Q612-822.75 612-810h158q12.75 0 21.38 8.68 8.62 8.67 8.62 21.5 0 12.82-8.62 21.32-8.63 8.5-21.38 8.5h-11v570q0 24.75-17.62 42.37Q723.75-120 699-120H261Zm438-630H261v570h438v-570ZM418.5-274.63q8.5-8.62 8.5-21.37v-339q0-12.75-8.68-21.38-8.67-8.62-21.5-8.62-12.82 0-21.32 8.62-8.5 8.63-8.5 21.38v339q0 12.75 8.68 21.37 8.67 8.63 21.5 8.63 12.82 0 21.32-8.63Zm166 0q8.5-8.62 8.5-21.37v-339q0-12.75-8.68-21.38-8.67-8.62-21.5-8.62-12.82 0-21.32 8.62-8.5 8.63-8.5 21.38v339q0 12.75 8.68 21.37 8.67 8.63 21.5 8.63 12.82 0 21.32-8.63ZM261-750v570-570Z"/></svg>');
    deleteSubBtn.addEventListener('click', () => {
        subDiv.remove();
        subArrObj.subArray = subArrObj.subArray.filter(subA => subA.name !== sub.name);
        localStorage.setItem('subArray', JSON.stringify(subArrObj.subArray));
        console.log(subArrObj.subArray);

    });
    subHeadDiv.appendChild(deleteSubBtn);
    //if tasks need to be generated
    if(bool === true){
        taskGenFunction(subDiv, sub);
    }
    }
}

export const taskGenFunction = (container, sub) => {
    //add button
    const addTaskBtn = document.createElement('button');
    addTaskBtn.classList.add('addBtn');
    addTaskBtn.insertAdjacentHTML('beforeend', '<svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="currentColor"><path d="M450-450H200v-60h250v-250h60v250h250v60H510v250h-60v-250Z"/></svg>');
    addTaskBtn.addEventListener('click', () => {
        if(sub.openTaskInput === false){
            addTaskEventFunction(ul, sub);
        } else {
            customError('openTaskInput');
        }
    });
    container.appendChild(addTaskBtn);
    //ul container
    const divContainer = document.createElement('div');
    divContainer.classList.add('tgContainerDiv');
    container.appendChild(divContainer);
    //ul
    const ul = document.createElement('ul');
    ul.classList.add('tgContainerDivUl');
    divContainer.appendChild(ul);
    //gen tasks in ul
    sub.tasks.forEach(task => generateTaskLi(ul, task, sub));
}

const addTaskEventFunction = (container, sub) => {
    sub.openTaskInput = true;
    const taskInput = document.createElement('input');
    taskInput.type = 'text';
    container.appendChild(taskInput);
    taskInput.focus();
    taskInput.addEventListener('keydown',(event)=>{
        if(event.key === 'Enter'){
            if(taskInput.value.trim().length >= 3){
                const newTask = new Task(taskInput.value.toLowerCase().trim(), sub);
                taskInput.remove();
                sub.openTaskInput = false;
                localStorage.setItem('subArray', JSON.stringify(subArrObj.subArray));
                generateTaskLi(container, newTask, sub);
            } else {
                customError('taskMinLength')
            }
        }
    });
}

const editTaskEventFunction = (task) => {
    //edit features

}

export const generateTaskLi = (ul, task, sub) => {
    //li
    const li = document.createElement('li');
    li.classList.add('taskLi');
    ul.appendChild(li);
    //checkbox
    const input = document.createElement('input');
    input.type = 'checkbox';
    if(task.done === true){
        input.checked = true;
    }
    li.appendChild(input);
    //p
    const p = document.createElement('p');
    p.textContent = task.name.toUpperCase();
    p.addEventListener('click', () => {
        li.remove();
        //remove from task array
        sub.tasks = sub.tasks.filter(task => task.name !== p.textContent.toLowerCase().trim());
        localStorage.setItem('subArray', JSON.stringify(subArrObj.subArray));
        console.log(sub.tasks);
    });
    li.appendChild(p);
    //checkbox event listener
    input.addEventListener('change', (event)=>{
        if(event.target.checked){
            task.done = true;
            console.log(task);
            p.style.textDecoration = 'line-through';
        }else{
            task.done = false;
            console.log(task);
            p.style.textDecoration = 'none';
        }
        sortTasks(sub, 'done');
        localStorage.setItem('subArray', JSON.stringify(subArrObj.subArray));
    });
    //edit btn
    const editBtn = document.createElement('button');
    editBtn.classList.add('editBtn');
    editBtn.insertAdjacentHTML('beforeend', '<svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="currentColor"><path d="M180-180h44l472-471-44-44-472 471v44Zm-30 60q-13 0-21.5-8.5T120-150v-73q0-12 5-23.5t13-19.5l557-556q8-8 19-12.5t23-4.5q11 0 22 4.5t20 12.5l44 44q9 9 13 20t4 22q0 11-4.5 22.5T823-694L266-138q-8 8-19.5 13t-23.5 5h-73Zm629-617-41-41 41 41Zm-105 64-22-22 44 44-22-22Z"/></svg>');
    editBtn.addEventListener('click', () => {
        editTaskEventFunction(task);
    });
    li.appendChild(editBtn);
}


//function
const renderObject = {

    renderStates(state){
        if (state === 'home'){
            console.log('home');
            //only show state's div(s)
            divs.forEach(div=>div.classList.add('hidden'));
            homeDivs.forEach(div=>div.classList.remove('hidden'));
            subUl.innerHTML = '';
            subGenFunction(subArrObj.subArray, subUl, false);
        } else if (state === 'session'){
            console.log('session');
            //only show state's div(s)
            divs.forEach(div=>div.classList.add('hidden'));
            sessionDivs.forEach(div=>div.classList.remove('hidden'));
            currentTask.textContent = subArrObj.subArray[0].name.toUpperCase();
            subTaskList.innerHTML = '';
            taskGenFunction(subTaskList, subArrObj.subArray[0]);
        } else if (state === 'subList'){
            console.log('subList');
            //only show state's div(s)
            divs.forEach(div=>div.classList.add('hidden'));
            div6extended.classList.remove('hidden');
            //generate subs with tasks
            subUlDivExtended.innerHTML = '';
            subGenFunction(subArrObj.subArray, subUlDivExtended, true);
        }
    },
    renderClock(){
        const dateH1 = document.getElementById('dateH1');
        const timeH1 = document.getElementById('timeH1');

        const now = new Date();
        let time = now.toLocaleTimeString();
        if(time[1] === ':'){
            time = '0' + time;
        }
        if(time.length > 8){
            time = time.slice(0, 5) + time.slice(8, 11);
        } else{
            time = time.slice(0, 5);
        }
        const date = now.toLocaleDateString();
        dateH1.textContent = date;
        timeH1.textContent = time;
    },
    renderSessionSubject(){
        currentTask.textContent = subArrObj.subArray[0].name.toUpperCase();
        subUlDivExtended.innerHTML = '';
        subGenFunction(subArrObj.subArray, subUlDivExtended, true);
    },
    sessionNavButtons(sessionObj){
        if(sessionObj.interval._intervalState === 0){
            leftSessionBtn.textContent = translations[lang]['exit_session'];
            rightSessionBtn.textContent = translations[lang]['start_session'];
        } else if(sessionObj.interval.pauseInterval === true){
            leftSessionBtn.textContent = translations[lang]['exit_session'];
            rightSessionBtn.textContent = translations[lang]['resume_session'];
        } else if (sessionObj.interval.pauseInterval === false && sessionObj.interval._intervalState !== 0){
            leftSessionBtn.textContent = translations[lang]['end_session'];
            rightSessionBtn.textContent = translations[lang]['pause_session'];
        }
    },
    sessionInterval(){

    }
}

export const inputCollector = {
    breakInput(){
        if(breaksYes.checked){
            return true;
        } else {
            return false;
        }
    },
    sessionLength(){
        return sessionMinsInput.value * 60;
    },
    totalLength(){
        return (totalHoursInput.value * 3600 + totalMinsInput.value * 60);
    },
    subName(){
        return subNameInput.value.toLowerCase().trim();
    },
    subDate(){
        return subDateInput.value;
    },
    subConfidence(){
        return subConfidenceInput.value;
    },
    clearSubInputs(){
        subNameInput.value = "";
        const inSevenDays = new Date(Date.now() + 7 * 24 * 3600 * 1000);
        subDateInput.value = inSevenDays.toISOString().split('T')[0];
        subConfidenceInput.value = 3;
    }
}

export const customError = (error) => {
    if(error === 'newSubName'){
        console.log('eN');
    }else if(error === 'newSubDate'){
        console.log('eD');
    } else if (error === 'openTaskInput'){
        console.log('eOTI');
    } else if (error === 'taskMinLength'){
        console.log('eTML');
    }
    /*
    else if (error === ''){
        console.log('e');
    }
    */
    
    
}

export default renderObject; // export to stateObjectModule.js

//export default renderFunction;
