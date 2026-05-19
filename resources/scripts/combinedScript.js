import { renderObject, eventListeners} from './modules/stateObjectModule.js';

import {state} from './modules/stateObjectModule.js';

import { calcUrgency, addTask, sortTasks, calcDaysLeft, sortSubs, subArrObj } from "./modules/classModule.js";
import { StudySubject, Task } from './modules/classModule.js';

import { subGenFunction } from './modules/renderModule.js';

console.log(state);
console.log(eventListeners);

const clockInterval = setInterval(renderObject.renderClock, 1000);

subArrObj.subArray = JSON.parse(localStorage.getItem('subArray'));
console.log(subArrObj.subArray)
subGenFunction(subArrObj.subArray, document.getElementById('subUl'), false);

const inSevenDays = new Date(Date.now() + 7 * 24 * 3600 * 1000);
document.getElementById('dateInput').value = inSevenDays.toISOString().split('T')[0];

eventListeners.forEach(({ target, event, handle}) => {
    document.querySelector(target).addEventListener(event, handle);
});


renderObject.renderStates(state);