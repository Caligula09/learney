import { StudySubject, subArrObj, sessionArray } from './classModule.js';
import renderObject from './renderModule.js';
import { inputCollector, subGenFunction, taskGenFunction, customError } from './renderModule.js';

const intervalFunction = () => {
    this.interval.active = true;
    this.interval.sessionInterval = setInterval(()=>{
        this.interval._intervalState--; // count
        console.log(this.interval._intervalState);    //log timer to console for test purposes
        if(this.interval._intervalState === 0 || this.interval.pauseInterval === true || this.interval.skipInterval === true){ //check for condition to finish
            clearInterval(this.interval.sessionInterval);
            this.interval.active = false;
        }
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
        renderObject.renderStates(this._state);
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
        interval: {
            sessionInterval: null,  // key for interval
            _intervalState: null,    //countdown key
            pauseInterval: false,   //pause
            skipInterval: false,     //skip
            active: false,
            setIntervalState(){
                this.intervalState = state.session._sessionLength;
            },


        },
        finished: false,
        subjectsStudied: [],

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
            if (this.sessionsDone === 0){
                this.start();
            } else if (this.sessionsDone < this.sessionAmount) {
                this.next();
            } else if (this.sessionsDone === this.sessionAmount){
                this.finish();
            }
        },

        // only call step function  

        start(){ //start session 
            this.interval.setIntervalState(); //assign countdown
            intervalFunction();
        },
        next(){
            if(this.interval.active === false){ //check that interval is not currently running
                if(this.interval._intervalState === 0){//go to next 
                    if(this._breaks){ //breaks - check if session or break
                        if(this._sessionsDone === this._breaksDone){//when coming out of a session
                            this.incSessionsDone();
                            subArrObj.subArray[0].practicedAmount ++;
                            this.subjectsStudied.push(this._subject);
                            sortSubs();
                            this.setSubject();
                            this.interval.setIntervalState(this._breakLength);
                            intervalFunction();
                        } else{ // when coming out of a break
                            this.incBreaksDone();
                            this.interval.setIntervalState(this._sessionLength);
                            intervalFunction();
                        }
                    }else{ //no breaks - instant continue
                        this.incSessionsDone();
                        subArrObj.subArray[0].practicedAmount ++;
                        sortSubs();
                        this.subject();
                        this.interval.setIntervalState(this._sessionLength);
                        intervalFunction();
                    }
                } else{ //continue countdown
                    this.interval.setIntervalState(this.sessionLength);
                    intervalFunction();
                }
            }
        },
        finish(){   // finish session
            saveSession();
            state.state('home');
        }
    }
}

const eventListeners = [
    {
        target: "#startSession",
        event: "click",
        handle: () => {
            state.session.breaks = inputCollector.breakInput();
            state.session.sessionLength = inputCollector.sessionLength();
            state.session.totalLength = inputCollector.totalLength();
            state.session.calcSessionAmount();
            state.state = 'session';
            console.log('navigate to session');
            console.log(state.session);
        }
    },
    {
        target: "#endSession",
        event: "click",
        handle: () => {
            state.state = 'home';
            console.log('navigate to home');
        }
    }
    ,{
        target: "#addNewSub",
        event: "click",
        handle: () => {
            if(subArrObj.subArray.every(sub => sub.name !== inputCollector.subName())){
                if(new Date(inputCollector.subDate()) > new Date(Date.now())){
                    let newSub = new StudySubject(inputCollector.subName(), inputCollector.subDate(), inputCollector.subConfidence());
                    localStorage.setItem("subArray",JSON.stringify(subArrObj.subArray))
                    subGenFunction([newSub], document.getElementById('subUl'), false);
                    inputCollector.clearSubInputs();
                } else{
                    customError('newSubDate');
                }
            } else {
                customError('newSubName');
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