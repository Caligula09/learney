console.log('newScript.js is running');
console.log('newScript.js is loading modules');

import { StudySubject, Task } from './modules/classModule.js';

console.log('newScript.js is loading functions');
//functions 
const updateTimeDate = () => {
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
}

//alert
const triggerAlert = (alert_data_i18n_key) => {
    alertDiv.classList.remove('hidden');
    alertH2.textContent = translations[lang][alert_data_i18n_key];
}

const hideAlertDiv = () => {
    alertDiv.classList.add('hidden');
}

//add a subject
const addTaskEventFunction = (container, sub) => {
    console.log('add task event function triggered');
    const taskInput = document.createElement('input');
    taskInput.type = 'text';
    taskInput.placeholder = translations[lang]['task_input_placeholder'];
    taskInput.focus();
    const currentSub = sub;
    //add task
    taskInput.addEventListener('keydown', (event) => {
        if(event.key === 'Enter' && taskInput.value.trim() !== '' && taskInput.value.length >= 3 && taskInput.value.length <= 50){
            const newTask = document.createElement('li');
            const newTaskText = document.createElement('p');
            newTaskText.textContent = taskInput.value.toUpperCase();
            //add task to sub object
            const newTaskObject = new Task(taskInput.value.toLowerCase().trim(), currentSub);
            currentSub.tasks.push(newTaskObject);
            console.log(currentSub.tasks);
            const editBtn = document.createElement('button');
            editBtn.classList.add('editBtn');
            editBtn.insertAdjacentHTML('beforeend', '<svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="currentColor"><path d="M180-180h44l472-471-44-44-472 471v44Zm-30 60q-13 0-21.5-8.5T120-150v-73q0-12 5-23.5t13-19.5l557-556q8-8 19-12.5t23-4.5q11 0 22 4.5t20 12.5l44 44q9 9 13 20t4 22q0 11-4.5 22.5T823-694L266-138q-8 8-19.5 13t-23.5 5h-73Zm629-617-41-41 41 41Zm-105 64-22-22 44 44-22-22Z"/></svg>');
            editBtn.addEventListener('click', () => {
                editTaskEventFunction(newTaskObject);
            });
            const checkBox = document.createElement('input');
            checkBox.type = 'checkbox';
            checkBox.addEventListener('change', (event) => {
                if(event.target.checked){
                    newTaskText.style.textDecoration = 'line-through';
                    //task.done 
                    newTaskObject.done = true;
                    console.log(currentSub.tasks);
                } else {
                    newTaskText.style.textDecoration = 'none';
                    //undo task.done
                    newTaskObject.done = false;
                    console.log(currentSub.tasks);
                }
                sortTasks(sub);
                saveSubArray();
            });
            newTask.appendChild(checkBox);
            newTask.appendChild(newTaskText);
            newTask.appendChild(editBtn);
        
            newTaskText.addEventListener('click', (event) => {
                newTask.remove();
                //remove from task array
                currentSub.tasks = currentSub.tasks.filter(task => task !== newTaskObject);
                console.log(currentSub.tasks);
                saveSubArray();
            });
            container.appendChild(newTask);
            event.target.remove();
            if(container.children.length > sub.tasks.length){
                container.firstElementChild.remove();
            }
        }
        saveSubArray();
    }); 
    container.appendChild(taskInput);
    taskInput.focus();
    saveSubArray();
}

const editTaskEventFunction = (task) => {
    const outerDiv = document.createElement('div');
    outerDiv.classList.add('temporaryDivBg');
    const editDiv = document.createElement('div');
    editDiv.classList.add('abcDiv');
    editDiv.classList.add('innerAlertDiv');
    const closeBtn = document.createElement('button');
    closeBtn.classList.add('closeBtn');
    closeBtn.insertAdjacentHTML('beforeend', '<svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="currentColor"><path d="M480-438 270-228q-9 9-21 9t-21-9q-9-9-9-21t9-21l210-210-210-210q-9-9-9-21t9-21q9-9 21-9t21 9l210 210 210-210q9-9 21-9t21 9q9 9 9 21t-9 21L522-480l210 210q9 9 9 21t-9 21q-9 9-21 9t-21-9L480-438Z"/></svg>')
    closeBtn.addEventListener('click', () => {
        outerDiv.remove();
    });

    editDiv.appendChild(closeBtn);
    outerDiv.appendChild(editDiv);
    document.body.appendChild(outerDiv);
}

const taskGenFunction = (container, subIndexStart, subAmount) => {
    console.log('TaskGenFunction is running')
    container.innerHTML = '';
    for(let j = subIndexStart; j < subAmount; j++){
        const divContainer = document.createElement('div');
        divContainer.classList.add('tgContainerDiv');
        const h3 = document.createElement('h3');
        h3.classList.add('tgContainerDivH3');
        h3.textContent = subArray[j].name.toUpperCase() + ' ' + subArray[j].dueDate;
        const addTask = '<svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="currentColor"><path d="M450-450H200v-60h250v-250h60v250h250v60H510v250h-60v-250Z"/></svg>';
        const addTaskDiv = document.createElement('div');
        addTaskDiv.classList.add('tgContainerDivAddTaskDiv');
        addTaskDiv.classList.add('addTaskSvgDiv');
        const ul = document.createElement('ul');
        ul.classList.add('tgContainerDivUl');
        addTaskDiv.insertAdjacentHTML('beforeend', addTask);
        addTaskDiv.addEventListener('click', () => {addTaskEventFunction(ul, subArray[j])});
        divContainer.appendChild(h3);
        divContainer.appendChild(addTaskDiv);
        
        for(let i = 0; i < subArray[j].tasks.length; i++){
            const li = document.createElement('li');
            const input = document.createElement('input');
            const editBtn = document.createElement('button');
            editBtn.classList.add('editBtn');
            editBtn.insertAdjacentHTML('beforeend', '<svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="currentColor"><path d="M180-180h44l472-471-44-44-472 471v44Zm-30 60q-13 0-21.5-8.5T120-150v-73q0-12 5-23.5t13-19.5l557-556q8-8 19-12.5t23-4.5q11 0 22 4.5t20 12.5l44 44q9 9 13 20t4 22q0 11-4.5 22.5T823-694L266-138q-8 8-19.5 13t-23.5 5h-73Zm629-617-41-41 41 41Zm-105 64-22-22 44 44-22-22Z"/></svg>');
            editBtn.addEventListener('click', () => {
                editTaskEventFunction(subArray[j].tasks[i]);
                saveSubArray();
            });
            input.type = 'checkbox';
            const p = document.createElement('p');
            if(subArray[j].tasks[i].done){
                input.checked = true;
                p.style.textDecoration = 'line-through';
            }
            input.addEventListener('change', (event)=>{
                if(event.target.checked){
                    subArray[j].tasks[i].done = true;
                    console.log(subArray[j].tasks[i]);
                    p.style.textDecoration = 'line-through';
                }else{
                    subArray[j].tasks[i].done = false;
                    console.log(subArray[j].tasks[i]);
                    p.style.textDecoration = 'none';
                }
                sortTasks(subArray[j]);
                saveSubArray();
            });
            p.textContent = subArray[j].tasks[i].name.toUpperCase();
            p.addEventListener('click', () => {
                li.remove();
                //remove from task array
                subArray[j].tasks = subArray[j].tasks.filter(task => task.name !== p.textContent.toLowerCase().trim());
                console.log(subArray[j].tasks);
                saveSubArray();
            });

            li.appendChild(input);
            li.appendChild(p);
            li.appendChild(editBtn);
            ul.appendChild(li);
        }
        if (subArray[j].tasks.length===0){
            const infoLi = document.createElement('li');
            infoLi.textContent = translations[lang]['no_tasks_found'];
            infoLi.class = 'emptyInfoLi';
            infoLi.addEventListener('click', (event) => {
                event.target.remove();
            });
            ul.appendChild(infoLi);
        }
        divContainer.appendChild(ul);
        container.appendChild(divContainer);
    }
}

const subBuilder = (sub) => {    
            const li = document.createElement('li');
            li.id = sub.name;
            const span = document.createElement('span');
            span.textContent = "🗑️";
            span.id = `${sub.name.toLowerCase().trim()}Remove`;
            li.textContent = sub.name.toUpperCase() + ' ' + sub.dueDate;
            li.appendChild(span);
            span.addEventListener('click', (event) => {   //add remove subject function
                for (i=0; i < subArray.length; i++){
                    if(subArray[i].name === li.id){
                        subArray.splice(i, 1);
                    }
                }
                event.target.remove();
                li.remove();
                console.log(subArray);
                saveSubArray();
            });
            subUl = document.getElementById('subUl');   //update subUl for new li
            subUl.appendChild(li);
        }

const addSubject = () => {
    //get inputs
    const subInput = document.getElementById('subjectInput');
    const dateInput = document.getElementById('dateInput');
    const confInput = document.getElementById('confidenceInput');
    let doubles = [];     //check if subject is already in list
    if (subArray[0]){
        doubles = subArray.filter(sub => {
            return sub.name === subInput.value.toLowerCase().trim();
        });
    }
    console.log('Add subject triggered')
    if(doubles.length === 0 || subArray.length === 0){    //only add if not in list yet
        //calculate days until due date
            let today = new Date();
            let due = new Date(dateInput.value);
            let msPerDay = 1000 * 60 * 60 * 24;
            let daysAvailable = Math.ceil((due - today)/msPerDay);

        if (subInput.value && dateInput.value && daysAvailable >= 0){ //check whether input is not empty and valid

            const newSub = new StudySubject(subInput.value.toLowerCase().trim(), dateInput.value, Number(confInput.value));
            //add li subject
            subBuilder(newSub);
            //clear inputs
            subInput.value = '';
            dateInput.value = '';
            confInput.value = '3';
        } else if (daysAvailable < 0){
            triggerAlert("no_oldDate_alert");
        } else if (dateInput.value){ // if no sub
            triggerAlert("no_empty_alert");
        } else if (subInput.value){ //if no date
            triggerAlert("no_date_alert");
        } else { //if none
            triggerAlert("no_empty_alert");
        }
    } else {
        triggerAlert("no_double_alert");
    }
    console.log(subArray);
    saveSubArray();
}

function calcUrgency(sub){
    sub.urgency = sub.daysLeft * sub.confidence * sub.practicedAmount;
}

function calcDays(sub){
    sub.daysLeft = Math.ceil((this.dueDate - new Date())/(1000*60*60*24))
}

//collapse sub list
const subListExpander = () => {
    divs.forEach(div => {
        div.classList.add('hidden');
    });
    div6extended.classList.remove('hidden');
    const subUlDivExtended = document.getElementById('subUlDivExtended');
    taskGenFunction(subUlDivExtended, 0, subArray.length);
    document.querySelector('#extendedSubsH2').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

const subListCollapser = () => {
    divs.forEach(div => {
        div.classList.remove('hidden');
    });
    div1.classList.add('hidden');
    div2.classList.add('hidden');
    div6extended.classList.add('hidden');
    div7.classList.add('hidden');
    div8.classList.add('hidden');
    //hide all tasks etc
    const subUlDiv = document.getElementById('subUlDiv');
    subUlDiv.innerHTML = '';
    const ul = document.createElement('ul');
    ul.id = 'subUl';
    for(let sub of subArray){
        const li = document.createElement('li');
        li.id = sub.name;
        const span = document.createElement('span');
        span.textContent = "🗑️";
        li.textContent = sub.name.toUpperCase() + ' ' + sub.dueDate;
        li.appendChild(span);
        span.addEventListener('click', (event) => {   //add remove subject function
            for (i=0; i < subArray.length; i++){
                if(subArray[i].name === li.id){
                    subArray.splice(i, 1);
                    saveSubArray();
                }
            }
            event.target.remove();
            li.remove();
            console.log(subArray);
        });
        ul.appendChild(li);
    }
    subUlDiv.appendChild(ul);
}

const startSession = () => {
    const sessionHour = document.getElementById("sessionHourInput");
    const sessionMin = document.getElementById("sessionMinInput");
    const sessionLengthInput = document.getElementById("sessionLengthInput");

    if (subArray[0] && Number(sessionMin.value) + Number(sessionHour.value) !== 0){
        if((Number(sessionMin.value) + Number(sessionHour.value)*60) >= Number(sessionLengthInput.value)){
            sessionObject.reset(); //make sure the sessionobject is in starting mode

            let sessionTime = Number(sessionMin.value) + Number(sessionHour.value) * 60;
            sessionObject.sessionLength = sessionLengthInput.value;
            
            if(breaksYes.checked){
                if(sessionTime > Number(sessionLengthInput.value)){
                    console.log('breaks is checked')
                    sessionObject.amountLeft = Math.floor(sessionTime / (sessionLengthInput.value + 5));
                    console.log("Session Time: " + sessionTime);
                    sessionObject.breaks = true;
                } else if(sessionTime === Number(sessionLengthInput.value)){
                    console.log('breaks is checked but time ===')
                    sessionObject.amountLeft = 1;
                    console.log("Session Time: " + sessionTime);
                    sessionObject.breaks = false;
                }
            } else {
                console.log('breaks not checked');
                sessionObject.amountLeft = Math.floor(sessionTime / sessionLengthInput.value);
                console.log("Session Time: " + sessionTime); 
                sessionObject.breaks = false;
            }

            console.log("SubArray");
            console.log(subArray);
            sortSubs();

            divs.forEach(div => {
                div.classList.add('hidden');
            });
            div1.classList.remove('hidden');
            div2.classList.remove('hidden');
            div7.classList.remove('hidden');
            div8.classList.remove('hidden');
            
            document.getElementById('stateH1').textContent = translations[lang]['study'];
            timerMins.textContent = sessionObject.sessionLength;
        } else {
            triggerAlert("too_short_alert");
        }
    } else {
        triggerAlert("no_empty_alert");
    }
    saveSubArray();
}

const endSession = () => {
    divs.forEach(div => {
        div.classList.remove('hidden');
    });
    div1.classList.add('hidden');
    div2.classList.add('hidden');
    div7.classList.add('hidden');
    div8.classList.add('hidden');
    div6extended.classList.add('hidden');
    //reset page to prep for next
    nextSessionBtn.classList.remove('hidden');
    endSessionBtn.classList.remove('hidden');
    timerMins.textContent = '00'
    timerSecs.textContent = "00"
    document.getElementById('stateH1').textContent = translations[lang]['study'];
    progressor.style.width = '0%';
    sessionObject.started = false;
    saveSubArray();
}
/*
const sortTasks = (sub) => {
    sub.tasks.sort((a,b)=>{
        return a.done - b.done;
    });
}
*/
const sortSubs = () => {
    subArray.forEach(sub =>calcUrgency(sub));
    const compareUrgency = (a,b) => {
        return a.urgency - b.urgency ;
    }
    subArray.sort(compareUrgency);
    console.log("New Sorted SubArray:");
    console.log(subArray);
    document.getElementById("currentTask").textContent = subArray[0].name.toUpperCase();
    sessionObject.subject = subArray[0].name;
    //generate sub tasks
    taskGenFunction(subTaskList, 0, 1);
    saveSubArray();
}

const nextSessionOnClick = () => {
    if (sessionObject.counting === false){
        sessionObject.next();
        let secsToStudy;
        //check for current state and assign minutes
        if(sessionObject.state === 'study'){
            secsToStudy = sessionObject.sessionLength * 60;
        } else if(sessionObject.state === 'break'){
            secsToStudy = sessionObject.breakLength * 60;
        }
        nextSessionBtn.classList.add('hidden');
        endSessionBtn.classList.add('hidden');
        skipSessionBtn.classList.remove('hidden');

        if(sessionObject.state === 'study'){
            document.getElementById('stateH1').textContent = translations[lang]['study'];
        } else if (sessionObject.state === 'break'){
            document.getElementById('stateH1').textContent = translations[lang]['break'];
        }

        let progressor = document.getElementById('progressor');
        let progressBits = secsToStudy;

        studyInterval = setInterval(()=>{
            secsToStudy--;
            //update progress bar
            progressor.style.width = `${100 - secsToStudy*99/progressBits}%`;
            //update timer
            timerSecs.textContent = String(secsToStudy % 60).padStart(2, '0');
            timerMins.textContent = Math.floor(secsToStudy/60);
            //check clearing condition
            if(secsToStudy === 0){
                clearInterval(studyInterval);
                sessionObject.counting = false;
                nextSessionBtn.classList.remove('hidden');
                if(sessionObject.amountLeft === 0) {
                    nextSessionBtn.classList.add('hidden');
                };
                endSessionBtn.classList.remove('hidden');
                skipSessionBtn.classList.add('hidden');
            }
        }, 1000);
    }
    saveSubArray();
}

const skipSessionEvent = ()=>{
    clearInterval(studyInterval);
    sessionObject.counting = false;
    nextSessionBtn.classList.remove('hidden');
    if(sessionObject.amountLeft === 0) {
        nextSessionBtn.classList.add('hidden');
    };
    endSessionBtn.classList.remove('hidden');
    skipSessionBtn.classList.add('hidden');

    if(sessionObject.state === "study"){
        timerMins.textContent = '00';
        timerSecs.textContent = "00";
        progressor.style.width = '0%';
        document.getElementById('stateH1').textContent = translations[lang]['break'];
    } else if (sessionObject.state === "break"){
        timerMins.textContent = '00';
        timerSecs.textContent = "00";
        progressor.style.width = '0%';
        document.getElementById('stateH1').textContent = translations[lang]['study'];
    }
    console.log(sessionObject);
    saveSubArray();
};

const saveSubArray = () => {
    localStorage.setItem('subArray', JSON.stringify(subArray));
    console.log('Saved subArray to localStorage:');
    console.log(subArray);
}

console.log('newScript.js: functions loaded');

//sessionObject
console.log('newScript.js is loading sessionObject');
let sessionObject = {
    state: "study",                             //break or study
    subject: "",
    next(){      
        progressor.style.width = '0%'; 
        if(this.breaks === true){                              //switch to next after countdown is 0
            if(this.state === "study" && this.started === true){             //switch from study to break
                subArray[0].practicedAmount++;      //add session to subject
                sortSubs();                         //regenerate subject list and next subject
                this.state = "break";
                timerMins.textContent = `${this.breakLength}`;
                this.counting = true;
            } else if(this.state === "break" && this.started === true){      //switch from break
                this.state = "study";
                this.amountLeft--;
                this.amountDone++;
                this.counting = true;
                timerMins.textContent = `${this.sessionLength}`;
            } else {
                this.counting = true;
                this.started = true;
                sortSubs();
                this.amountLeft--;
                this.amountDone++;
            }
        } else if (this.breaks === false) {
            if (this.started === true){
                subArray[0].practicedAmount++; 
                timerMins.textContent = this.sessionLength;
                sortSubs(); 
                this.counting = true;
                this.state = 'study';
                this.amountLeft--;
                this.amountDone++;
            } else {
                this.counting = true;
                this.started = true;
                sortSubs();
                this.state = 'study';
                this.amountLeft--;
                this.amountDone++;
            }
        }
        console.log(sessionObject);
    },
    counting: false,  //true if time is running, false if not
    started: false,
    amountLeft: 0,         //amount of learn-break cycles
    amountDone: 0,    //amount of finished cycles
    sessionLength: 25,
    breakLength: 5,
    breaks: true,
    reset(){
        this.state = "study";
        this.subject = "";
        this.counting = false;
        this.started = false;
        this.amountLeft = 0;
        this.amountDone = 0;
    }
};
console.log('newScript.js: sessionObject loaded');

//application logic
console.log('newScript.js is starting application logic');
const lang = localStorage.getItem("lang") || "de"; //load language from local storage or default to german
setInterval(updateTimeDate ,1000); //clock and date update every second

let studyInterval;

subArray = JSON.parse(localStorage.getItem('subArray'));



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
const alertDiv = document.getElementById('alertDiv');

let subUl = document.getElementById('subUl');//add children to this ul for new subjects (let bc must be accessible/updatable in addSubject function)
const subTaskList = document.getElementById('subTaskList');
const timerMins = document.getElementById('timerMins');
const timerSecs = document.getElementById('timerSecs');
const alertH2 = document.getElementById('alertH2');

//button & input selectors
const expandSubList = document.getElementById('expandSubList');//expand button in sublist
const collapseSubList = document.getElementById('collapseSubList');//collapse button in extended sublist
const addNewSubBtn = document.getElementById('addNewSub');
const startSessionBtn = document.getElementById('startSession');
const endSessionBtn = document.getElementById('endSession');
const nextSessionBtn = document.getElementById('nextSession');
const skipSessionBtn = document.getElementById('skipSession');
const alertOkBtn = document.getElementById('alertOkButton');

const breaksYes = document.getElementById('breaksYes');
const inSessionTaskAdder = document.getElementById('inSessionTaskAdder'); //  ?
//button event listeners
expandSubList.addEventListener('click', subListExpander);
collapseSubList.addEventListener('click', subListCollapser);
addNewSubBtn.addEventListener('click', addSubject);
startSessionBtn.addEventListener('click', startSession);
endSessionBtn.addEventListener('click', endSession);
nextSessionBtn.addEventListener('click', nextSessionOnClick);
skipSessionBtn.addEventListener('click', skipSessionEvent);
alertOkBtn.addEventListener('click', hideAlertDiv);

if(subArray[0]){
    subArray.forEach(sub => subBuilder(sub));
}
console.log('newScript.js: application logic loaded');
console.log('newScript.js is fully loaded');