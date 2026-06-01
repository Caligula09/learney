import { renderObject, eventListeners, classEventListeners} from './modules/stateObjectModule.js';

import {state} from './modules/stateObjectModule.js';

import { calcUrgency, addTask, sortTasks, calcDaysLeft, sortSubs, arrObj } from "./modules/classModule.js";
import { StudySubject, Task } from './modules/classModule.js';

import { subGenFunction, editObject } from './modules/renderModule.js';

console.log(state);
console.log(eventListeners);

const clockInterval = setInterval(renderObject.renderClock, 1000);

arrObj.subArray = JSON.parse(localStorage.getItem('subArray')) ?? [ ];
arrObj.sessionArray = JSON.parse(localStorage.getItem('sessionArray')) ?? [ ];
console.log(arrObj.subArray);
if(arrObj.subArray[0]){
    subGenFunction(arrObj.subArray, document.getElementById('subUl'), false);
}
const inSevenDays = new Date(Date.now() + 7 * 24 * 3600 * 1000);
document.getElementById('dateInput').value = inSevenDays.toISOString().split('T')[0];

eventListeners.forEach(({ target, event, handle}) => {
    document.querySelector(target).addEventListener(event, handle);
});

classEventListeners.forEach(({ target, event, handle}) => {
    document.querySelectorAll(target).forEach(element => element.addEventListener(event, handle));
});

renderObject.renderStates(state);