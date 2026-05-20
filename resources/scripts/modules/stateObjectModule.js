import { StudySubject, subArrObj, sessionArray, sortSubs, sortTasks } from './classModule.js';
import renderObject from './renderModule.js';
import { inputCollector, subGenFunction, taskGenFunction, customError, editObject } from './renderModule.js';

const intervalFunction = (stateObj, objective) => {
    stateObj.session.interval.active = true;
    stateObj.session.interval.sessionInterval = setInterval(()=>{
        stateObj.session.interval._intervalState--; // count
        stateObj.session.incTimeSpent();
        console.log(stateObj.session.interval._intervalState);    //log timer to console for test purposes
        if(stateObj.session.interval._intervalState === 0 || stateObj.session.interval.pauseInterval === true || stateObj.session.interval.skipInterval === true){ //check for condition to finish
            clearInterval(stateObj.session.interval.sessionInterval);
            stateObj.session.interval.active = false;
            if(stateObj.session.interval.skipInterval === true){
                stateObj.session.interval._intervalState = 0;
            }
            if(stateObj.session.interval._intervalState === 0 || stateObj.session.interval.skipInterval === true){
                if(objective === 'break'){
                    stateObj.session.incBreaksDone();
                }else{
                    stateObj.session.incSessionsDone();
                }
            }
            renderObject.sessionNavButtons(stateObj);
            console.log('stopped at: ' + stateObj.session.interval._intervalState )
        }
        renderObject.sessionInterval(state);
    }, 1000);
}

const saveSession = () => {
    sessionArray.push(
        {date: new Date(Date.now()).toISOString().split('T')[0], totalTime: state.session._timeSpent,}
    );
}

export const state = {
    stateList: ['home', 'session', 'subList'],
    _state: 'home',
    set state(strOrNum){
        if(typeof strOrNum === 'number'){
            if(strOrNum >= 0 && strOrNum < this.stateList.length){
                this._state = this.stateList[strOrNum];
            } else{
                throw Error('state setter only takes numbers that fit an index of the state list');
            }
        }else if(typeof strOrNum === 'string'){
            if(this.stateList.includes(strOrNum)){
                this._state = strOrNum;
            } else{
                throw Error('must enter valid state from state list to set state');
            }
        }
        renderObject.renderStates(this);
    },
    session: {
        _subject: subArrObj.subArray[0],
        _breaks: null,
        _timeSpent: 0,
        _sessionAmount: 0,
        _sessionsDone: 0,
        _breaksDone: 0,
        _breakLength: 5*60,     //break length in secs
        _sessionLength: 0,  //session length in secs
        _totalLength: 0,     //total length in secs
        nextObjective: 'study',
        interval: {
            sessionInterval: null,  // key for interval
            _intervalState: 0,    //countdown key
            pauseInterval: false,   //pause
            skipInterval: false,     //skip
            active: false,
            setIntervalState(num){
                this._intervalState = num;
            },
            resetInt(){
                this.sessionInterval = null;
                this._intervalState = 0;
                this.pauseInterval = false;
                this.skipInterval = false;
                this.active = false;
            }
        },
        finished: false,
        subjectsStudied: [],
        reset(){
            this._subject= subArrObj.subArray[0];
            this._breaks= null;
            this._timeSpent= 0;
            this._sessionAmount= 0;
            this._sessionsDone= 0;
            this._breaksDone= 0;
            this._breakLength= 5*60;    //break length in secs
            this._sessionLength= 0;  //session length in secs
            this._totalLength= 0;    //total length in secs
            this.nextObjective= 'study';
            this.interval.resetInt();
            this.finished=false;
            this.subjectsStudied = [];
        },
        setSubject(){
            this._subject = subArrObj.subArray[0];
        },
        set breaks(bool){
            if(bool === true || bool === false){
                this._breaks = bool;
            } else {
                throw Error('state.session.breaks must be set equal to a boolean value');
            }
        },
        calcSessionAmount(){
            this._sessionAmount = Math.floor(this._totalLength / this._sessionLength);
            console.log('sessionAmount: ' + this._sessionAmount);
        },
        set breakLength(num){
            if(num > 60){
                this._breakLength = num;
            }else {
                console.warn('breakLength must be a number greater than 60 (seconds)')
            }
        },
        set sessionLength(num){
            if(num >= 15*60){
                this._sessionLength = num;
            } else {
                console.warn('sessionLength must be a number greater than 900 (seconds)')
            }
        },
        set totalLength(num){
            if(num >= 900){
                this._totalLength = num;
            } else {
                console.warn('totalLength must be a number greater than 900 (seconds)')
            }
        },
        set finished(bool){
            if(bool === true || bool === false){
                this._finished = bool;
            } else {
                throw Error('state.session.breaks must be set equal to a boolean value');
            }
        },
        incTimeSpent(){
            this._timeSpent++;
        },
        incSessionsDone(){
            this._sessionsDone++;
        },
        incBreaksDone(){
            this._breaksDone++;
        },

        step(){
            if (this._timeSpent === 0){
                this.start();
            }else if (this._sessionsDone < this._sessionAmount) {
                this.next();
            }else if (this._sessionsDone === this._sessionAmount){
                this.finish();
            }
            localStorage.setItem("subArray",JSON.stringify(subArrObj.subArray));
            renderObject.sessionNavButtons(state);
        },

        // only call step function  

        start(){ //start session 
            this.interval.setIntervalState(this._sessionLength); //assign countdown
            intervalFunction(state, 'study');
        },
        next(){
            console.log('next');
            if(this.interval.active === false){ //check that interval is not currently running
                console.log('active: false');
                if(this.interval._intervalState === 0){//go to next 
                    console.log('_intervalState === 0');
                    if(this._breaks){ //breaks - check if session or break
                        if(this._sessionsDone === this._breaksDone){//when coming out of a session
                            if(this._sessionsDone === this._sessionAmount){
                                this.finish();
                            } else {
                                subArrObj.subArray[0].practicedAmount ++;
                                this.subjectsStudied.push(this._subject);
                                sortSubs();
                                this.setSubject();
                                this.interval.setIntervalState(this._breakLength);
                                this.nextObjective = 'break';
                                intervalFunction(state, 'break');
                            }
                        } else{ // when coming out of a break
                            this.interval.setIntervalState(this._sessionLength);
                            this.nextObjective = 'study';
                            intervalFunction(state, 'study');
                        }
                    }else{ //no breaks - instant continue
                        subArrObj.subArray[0].practicedAmount ++;
                        sortSubs();
                        this.subject();
                        this.interval.setIntervalState(this._sessionLength);
                        intervalFunction(state, 'study');
                    }
                } else{ //continue countdown
                    console.log('continue')
                    let objective;
                    if(this._sessionsDone === this._breaksDone){
                        objective = 'study';
                    } else {
                        objective = 'break';
                    }
                    intervalFunction(state, objective);
                }
            }
            renderObject.renderSessionSubject(state);
        },
        finish(){   // finish session
            saveSession();
            state.state = 'home';
        }
    }
}

const eventListeners = [
    {
        target: "#startSession",
        event: "click",
        handle: () => {
            if(inputCollector.sessionLength() <= inputCollector.totalLength()){
                state.session.reset();
                state.session.breaks = inputCollector.breakInput();
                state.session.sessionLength = inputCollector.sessionLength();
                state.session.totalLength = inputCollector.totalLength();
                state.session.calcSessionAmount();
                state.state = 'session';
                console.log('navigate to session');
                console.log(state.session);
            } else{
                renderObject.customError('sessionLength')
            }
        }
    }
    ,{
        target: "#addNewSub",
        event: "click",
        handle: () => {
            if(subArrObj.subArray.every(sub => sub.name !== inputCollector.subName()) && inputCollector.subName()){
                if(new Date(inputCollector.subDate()) > new Date(Date.now())){
                    let newSub = new StudySubject(inputCollector.subName(), inputCollector.subDate(), inputCollector.subConfidence());
                    localStorage.setItem("subArray",JSON.stringify(subArrObj.subArray))
                    subGenFunction(subArrObj.subArray, document.getElementById('subUl'), false);
                    inputCollector.clearSubInputs();
                } else{
                    customError('newSubDate');
                }
            } else {
                customError('newSubName');
            }
        }
    }
    ,{
        target: "#subListExpandBtn",
        event: "click",
        handle: () => {
            state.state = 'subList';
            console.log('navigate to expanded sublist');
        }
    }
    ,{
        target: "#subListCollapseBtn",
        event: "click",
        handle: () => {
            state.state = 'home';
            console.log('navigate to expanded sublist');
        }
    }
    ,{
        target: "#alertOkButton",
        event: "click",
        handle: () => {
            document.getElementById('outerAlert').classList.add('hidden');
        }
    }
    ,{
        target: "#editApplyBtn",
        event: "click",
        handle: () => {
                if(new Date(document.getElementById('editDateInput').value) > new Date(Date.now())){
                    if(editObject.type === 'subject'){
                        const index = subArrObj.subArray.indexOf(editObject.subject);
                        subArrObj.subArray[index].dueDate = document.getElementById('editDateInput').value;
                    }else{
                        const index = subArrObj.subArray.indexOf(editObject.subject);
                        const taskIndex = subArrObj.subArray[index].tasks.indexOf(editObject.object);
                        subArrObj.subArray[index].tasks[taskIndex].name = document.getElementById('editNameInput').value.toLowerCase().trim();
                        subArrObj.subArray[index].tasks[taskIndex].dueDate = document.getElementById('editDateInput').value;
                    }
                    document.getElementById('editInputs').innerHTML = '';
                    document.getElementById('outerEdit').classList.add('hidden');
                    localStorage.setItem("subArray",JSON.stringify(subArrObj.subArray));
                    if(state._state === 'home'){
                        subGenFunction(subArrObj.subArray, subUl, false);
                    } else{
                        subGenFunction(subArrObj.subArray, subUlDivExtended, true);
                    }
                } else{
                    customError('newSubDate');
                }
        }
    }
    /*
    ,{
        target: "",
        event: "",
        handle: () => {}
    }
    */
];

export { renderObject, eventListeners };