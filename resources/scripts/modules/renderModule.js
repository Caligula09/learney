import { arrObj, removeSub } from "./classModule.js";
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
const appsDiv = document.getElementById('appsDiv');
const calendarDiv = document.getElementById('calendarDiv');
const studyHistoryDiv = document.getElementById('studyHistoryDiv');
const notesDiv = document.getElementById('notesDiv');
const divs = [div1, div2, div3,appsDiv, calendarDiv, studyHistoryDiv, notesDiv, div4, div5, subListDiv, div6extended, div7, div8];
const homeDivs = [div3,appsDiv, div4, div5, subListDiv];
const sessionDivs = [div1, div2, div7, div8];
const alertDiv = document.getElementById('outerAlert');
const editDiv = document.getElementById('outerEdit');
const editInputDiv = document.getElementById('editInputs')
const progressor = document.getElementById('progressor');
let subUl = document.getElementById('subUl');//add children to this ul for new subjects (let bc must be accessible/updatable in addSubject function)
let subUlDivExtended = document.getElementById('subUlDivExtended');
const subTaskList = document.getElementById('subTaskList');
const timerMins = document.getElementById('timerMins');
const timerSecs = document.getElementById('timerSecs');
const alertH2 = document.getElementById('alertH2');
const studyHistoryUl = document.getElementById('studyHistoryUl');
const currentTask = document.getElementById('currentTask');
const stateH1 = document.getElementById('stateH1');
//button & input selectors
const leftSessionBtn = document.getElementById('leftSessionBtn');
const rightSessionBtn = document.getElementById('rightSessionBtn');

const totalHoursInput = document.getElementById('sessionHourInput');
const totalMinsInput = document.getElementById('sessionMinInput');
const sessionMinsInput = document.getElementById('sessionLengthInput');

const subNameInput = document.getElementById('subjectInput');
const subDateInput = document.getElementById('dateInput');
const subConfidenceInput = document.getElementById('confidenceInput');

const breaksYes = document.getElementById('breaksYes');

export const subGenFunction = (subArr, container, bool) => {
    container.innerHTML = "";
    if(subArr[0]){
        for(let sub of subArr){
            //sub container
            const subDiv = document.createElement('div');
            subDiv.classList.add('subDiv');
            container.appendChild(subDiv);
            //h2
            const subH2 = document.createElement('h2');
            subH2.classList.add('subH2')
            subH2.textContent = sub.name.toUpperCase() + ' ' +sub.dueDate;
            subDiv.appendChild(subH2);
            //sub head
            const subHeadDiv = document.createElement('div');
            subHeadDiv.classList.add('subHeadDiv');
            subDiv.appendChild(subHeadDiv);
            //delete
            const deleteSubBtn = document.createElement('button');
            deleteSubBtn.classList.add('deleteSubBtn');
            deleteSubBtn.insertAdjacentHTML('beforeend', '<svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="currentColor"><path d="M261-120q-24.75 0-42.37-17.63Q201-155.25 201-180v-570h-11q-12.75 0-21.37-8.68-8.63-8.67-8.63-21.5 0-12.82 8.63-21.32 8.62-8.5 21.37-8.5h158q0-13 8.63-21.5 8.62-8.5 21.37-8.5h204q12.75 0 21.38 8.62Q612-822.75 612-810h158q12.75 0 21.38 8.68 8.62 8.67 8.62 21.5 0 12.82-8.62 21.32-8.63 8.5-21.38 8.5h-11v570q0 24.75-17.62 42.37Q723.75-120 699-120H261Zm438-630H261v570h438v-570ZM418.5-274.63q8.5-8.62 8.5-21.37v-339q0-12.75-8.68-21.38-8.67-8.62-21.5-8.62-12.82 0-21.32 8.62-8.5 8.63-8.5 21.38v339q0 12.75 8.68 21.37 8.67 8.63 21.5 8.63 12.82 0 21.32-8.63Zm166 0q8.5-8.62 8.5-21.37v-339q0-12.75-8.68-21.38-8.67-8.62-21.5-8.62-12.82 0-21.32 8.62-8.5 8.63-8.5 21.38v339q0 12.75 8.68 21.37 8.67 8.63 21.5 8.63 12.82 0 21.32-8.63ZM261-750v570-570Z"/></svg>');
            deleteSubBtn.addEventListener('click', () => {
                subDiv.remove();
                arrObj.subArray = arrObj.subArray.filter(subA => subA.name !== sub.name);
                localStorage.setItem('subArray', JSON.stringify(arrObj.subArray));
                console.log(arrObj.subArray);

            });
            subHeadDiv.appendChild(deleteSubBtn);
            //edit
            const editSubBtn = document.createElement('button');
            editSubBtn.classList.add('editSubBtn');
            editSubBtn.insertAdjacentHTML('beforeend', '<svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="currentColor"><path d="M180-180h44l472-471-44-44-472 471v44Zm-30 60q-13 0-21.5-8.5T120-150v-73q0-12 5-23.5t13-19.5l557-556q8-8 19-12.5t23-4.5q11 0 22 4.5t20 12.5l44 44q9 9 13 20t4 22q0 11-4.5 22.5T823-694L266-138q-8 8-19.5 13t-23.5 5h-73Zm629-617-41-41 41 41Zm-105 64-22-22 44 44-22-22Z"/></svg>');
            editSubBtn.addEventListener('click', () => {
                editFunction(sub, sub, 'subject');
            });
            subHeadDiv.appendChild(editSubBtn);
            //if tasks need to be generated
            if(bool === true){
                taskGenFunction(subDiv, sub, subHeadDiv);
            }
        }
    }
}

export const taskGenFunction = (container, sub, btnDiv) => {
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
    btnDiv.appendChild(addTaskBtn);
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
                localStorage.setItem('subArray', JSON.stringify(arrObj.subArray));
                generateTaskLi(container, newTask, sub);
            } else {
                customError('taskMinLength')
            }
        }
    });
}

const generateStudyHistory = () => {
    studyHistoryUl.innerHTML = '';
    const sessionArray = JSON.parse(localStorage.getItem('sessionArray')) ?? [ ];
    sessionArray.forEach(session => {
        const li = document.createElement('li');
        const dateP = document.createElement('p');
        const timeP = document.createElement('p');
        const studiedUl = document.createElement('ul');

        dateP.textContent = session.date;
        timeP.textContent = `${translations[lang].time_studied}${Math.floor(session.totalTime / 3600).toString().padStart(2, '0')}:${Math.floor((session.totalTime % 3600) / 60).toString().padStart(2, '0')}`;

        for(let sub of session.subjects){
            const subLi = document.createElement('li');
            const subNameP = document.createElement('p');
            subNameP.textContent = sub.name;
            subLi.appendChild(subNameP);
            studiedUl.appendChild(subLi);
        }

        studyHistoryUl.appendChild(li);
        li.appendChild(dateP);
        li.appendChild(timeP);
        li.appendChild(studiedUl);
    });
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
        localStorage.setItem('subArray', JSON.stringify(arrObj.subArray));
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
        localStorage.setItem('subArray', JSON.stringify(arrObj.subArray));
    });
    //edit btn
    const editBtn = document.createElement('button');
    editBtn.classList.add('editBtn');
    editBtn.insertAdjacentHTML('beforeend', '<svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="currentColor"><path d="M180-180h44l472-471-44-44-472 471v44Zm-30 60q-13 0-21.5-8.5T120-150v-73q0-12 5-23.5t13-19.5l557-556q8-8 19-12.5t23-4.5q11 0 22 4.5t20 12.5l44 44q9 9 13 20t4 22q0 11-4.5 22.5T823-694L266-138q-8 8-19.5 13t-23.5 5h-73Zm629-617-41-41 41 41Zm-105 64-22-22 44 44-22-22Z"/></svg>');
    editBtn.addEventListener('click', () => {
        editFunction(sub, task, 'task');
    });
    li.appendChild(editBtn);
}

const lang = localStorage.getItem('lang') || 'de';
//function
const renderObject = {

    renderStates(stateObj){
        if (stateObj._state === 'home'){
            console.log('home');
            //only show state's div(s)
            divs.forEach(div=>div.classList.add('hidden'));
            homeDivs.forEach(div=>div.classList.remove('hidden'));
            subUl.innerHTML = '';
            subGenFunction(arrObj.subArray, subUl, false);
        } else if (stateObj._state === 'session'){
            console.log('session');
            //only show state's div(s)
            divs.forEach(div=>div.classList.add('hidden'));
            sessionDivs.forEach(div=>div.classList.remove('hidden'));
            this.renderSessionSubject(stateObj);
            this.sessionNavButtons(stateObj);
            this.sessionInterval(stateObj);
        } else if (stateObj._state === 'subList'){
            console.log('subList');
            //only show state's div(s)
            divs.forEach(div=>div.classList.add('hidden'));
            div6extended.classList.remove('hidden');
            //generate subs with tasks
            subUlDivExtended.innerHTML = '';
            subGenFunction(arrObj.subArray, subUlDivExtended, true);
        } else if (stateObj._state === 'calendar'){
            console.log('calendar');
            //only show state's div(s)
            divs.forEach(div=>div.classList.add('hidden'));
            calendarDiv.classList.remove('hidden');
        }else if (stateObj._state === 'studyHistory'){
            console.log('studyHistory');
            //only show state's div(s)
            divs.forEach(div=>div.classList.add('hidden'));
            studyHistoryDiv.classList.remove('hidden');
            generateStudyHistory();
        }else if (stateObj._state === 'notes'){
            console.log('notes');
            //only show state's div(s)
            divs.forEach(div=>div.classList.add('hidden'));
            notesDiv.classList.remove('hidden');
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
    renderSessionSubject(stateObj){
        currentTask.textContent = arrObj.subArray[0].name.toUpperCase();
        subTaskList.innerHTML = '';
        taskGenFunction(subTaskList, arrObj.subArray[0], subTaskList);
        stateH1.textContent = stateObj.session.nextObjective.toUpperCase();
        if(stateObj.session.nextObjective === 'study'){
            stateH1.textContent = translations[lang]['study'];
        } else {
            stateH1.textContent = translations[lang]['break'];
        }
    },
    _navController: null,
    sessionNavButtons(stateObj){
        if(this._navController){
            this._navController.abort();
        }
        this._navController = new AbortController();
        const { signal } = this._navController;

        if(stateObj.session._sessionsDone === stateObj.session._sessionAmount){
            leftSessionBtn.classList.add('hidden');
            rightSessionBtn.textContent = translations[lang]['finish_session'];
            rightSessionBtn.addEventListener('click',()=>{
                //stateObj.session.interval.skipInterval = false;
                stateObj.session.step();
                leftSessionBtn.classList.remove('hidden');
            }, { signal });
        }else if(stateObj.session.interval._intervalState === 0){
            leftSessionBtn.textContent = translations[lang]['exit_session'];
            leftSessionBtn.addEventListener('click',()=>{
                stateObj.state = 'home';
            }, { signal });
            rightSessionBtn.textContent = translations[lang]['start_session'];
            rightSessionBtn.addEventListener('click',()=>{
                stateObj.session.interval.skipInterval = false;
                stateObj.session.step();
            }, { signal });
        } else if(stateObj.session.interval.pauseInterval === true){
            leftSessionBtn.textContent = translations[lang]['exit_session'];
            leftSessionBtn.addEventListener('click',()=>{
                stateObj.state = 'home';
            }, { signal });
            rightSessionBtn.textContent = translations[lang]['resume_session'];
            rightSessionBtn.addEventListener('click',()=>{
                stateObj.session.interval.pauseInterval = false;
                stateObj.session.step();
            }, { signal });
        } else if (stateObj.session.interval.active === true){
            leftSessionBtn.textContent = translations[lang]['end_session'];
            leftSessionBtn.addEventListener('click',()=>{
                stateObj.session.interval.skipInterval = true;
            }, { signal });
            rightSessionBtn.textContent = translations[lang]['pause_session'];
            rightSessionBtn.addEventListener('click',()=>{
                stateObj.session.interval.pauseInterval = true;
            }, { signal });
        }
    },

    sessionInterval(state){
        let overall;
        if(state.session._breaks){
            if(state.session._breaksDone === state.session._sessionsDone){
                overall = state.session._sessionLength;
            } else{
                overall = state.session._breakLength;
            }
        } else{
            overall = state.session._sessionLength;
        }
        progressor.style.width = `${(100 / overall)*(overall - state.session.interval._intervalState)}%`
        console.log(progressor.style.width)
        const timerMinsTextContent = `${Math.floor(state.session.interval._intervalState / 60)}`
        if(timerMinsTextContent[1]){
            timerMins.textContent = timerMinsTextContent
        } else{
            timerMins.textContent = '0' + timerMinsTextContent;
        }
        const timerSecsTextContent = `${state.session.interval._intervalState % 60}`
        if(timerSecsTextContent[1]){
            timerSecs.textContent = timerSecsTextContent
        } else{
            timerSecs.textContent = '0' + timerSecsTextContent;
        }
    }
}

export const inputCollector = {
    breakInput(){
        if(breaksYes.checked){
            return true;
            console.log('true')
        } else {
            return false;
            console.log('false')
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
    let h2Message;
    if(error === 'newSubName'){
        h2Message = translations[lang]['sub_name_error'];
    }else if(error === 'newSubDate'){
        h2Message = translations[lang]['no_date_alert'];
    } else if (error === 'openTaskInput'){
        h2Message = translations[lang]['open_task_input_alert'];
    } else if (error === 'taskMinLength'){
        h2Message = translations[lang]['min_length_alert'];
    } else if (error === 'sessionLength'){
        h2Message = translations[lang]['session_length_error'];
    } else if (error === 'construction'){
        h2Message = translations[lang]['construction'];
    }
    alertDiv.classList.remove('hidden');
    alertH2.textContent = h2Message;
    /*
    else if (error === ''){
        console.log('e');
    }
    */
    
    
}

export let editObject = {subject: null, object: null, type: null};

const editFunction = (subject, object, type) => {
    editObject.subject = subject;
    editObject.object = object;
    editObject.type = type;
    editDiv.classList.remove('hidden');
    if(type === 'subject'){

    } else if (type === 'task'){
        const nameLabel = document.createElement('label');
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.value = object.name.toUpperCase();
        nameInput.id = 'editNameInput';
        nameLabel.textContent = translations[lang]['name'];
        nameLabel.for = 'editNameInput';
        editInputDiv.appendChild(nameLabel);
        editInputDiv.appendChild(nameInput);
    }
    const dateLabel = document.createElement('label');
    const dateInput =  document.createElement('input');
    dateInput.type = 'date';
    dateInput.value = object.dueDate;
    dateInput.id = 'editDateInput';
    dateLabel.textContent = translations[lang]['date'];
    dateLabel.for = 'editDateInput';
    editInputDiv.appendChild(dateLabel);
    editInputDiv.appendChild(dateInput);
    if(type === 'subject'){

    } else if (type === 'task'){
        //description input
        const descriptionInput = document.createElement('input');
        const descriptionInputLabel = document.createElement('label');
        descriptionInput.type = 'textarea';
        descriptionInput.id = 'editDescriptionInput'
        descriptionInput.placeholder = translations[lang]['description'];
        descriptionInputLabel.for = 'editDescriptionInput';
        descriptionInputLabel.textContent = translations[lang]['description_label'];
        if(object.description[0]){
            descriptionInput.value = object.description;
        }
        editInputDiv.appendChild(descriptionInputLabel);
        editInputDiv.appendChild(descriptionInput);
    }
}

export default renderObject; // export to stateObjectModule.js

//export default renderFunction;
