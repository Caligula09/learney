import { subArray, sessionArray, renderObject, eventListeners} from './modules/stateObjectModule.js';

import {state} from './modules/stateObjectModule.js';

import { calcUrgency, addTask, sortTasks, calculateDaysLeft, sortSubs } from "./modules/classModule.js";
import { StudySubject, Task } from './modules/classModule.js';

console.log(state);
console.log(eventListeners)

eventListeners.forEach(({ target, event, handle}) => {
    document.querySelector(target).addEventListener(event, handle);
});

renderObject.renderStates('home');