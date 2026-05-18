import renderObject from './renderModule.js';
import { inputCollector } from './renderModule.js';

let subArray = [];
let sessionArray = [];

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
        _subject: subArray[0],
        _breaks: true,
        _timeSpent: 0,
        _sessionAmount: 3,
        _sessionsDone: 0,
        _breaksDone: 0,
        _breakLength: 5*60,     //break length in secs
        _sessionLength: 25*60,  //session length in secs
        _totalLength: 90*60,     //total length in secs
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
            this._subject = subArray[0];
        },
        set breaks(bool){
            if(bool === true || bool === false){
                this._breaks = bool;
            } else {
                throw Error('state.session.breaks must be set equal to a boolean value');
            }
        },
        calcSessionAmount(){
            if(this._breaks){
                this._sessionAmount = Math.floor(this._totalLength / (this._sessionLength + this._breakLength));
            } else {
                this._sessionAmount = Math.floor(this._totalLength / this._sessionLength);
            }
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
            if(this._totalLength >= 15*60){
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
                            subArray[0].practicedAmount ++;
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
                        subArray[0].practicedAmount ++;
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
            state.state = 'session';
            console.log('navigate to session');
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
    /*
    ,{
        target: "",
        event: "",
        handle: () => {}
    }
    */
];

export {subArray, sessionArray, renderObject, eventListeners };