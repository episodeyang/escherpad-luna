/** Created by ge on 3/26/16. */

/* so that this show up as a module */
export default {};
/** Created by ge on 12/6/15. */
import {Action, Hash, Reducer} from "./index";

// the Stat interface need to extend Hash so that the index keys are available.

let reducer = <Reducer>function (state:number = 0, action:Action, callback:(state:number)=>void):number {
    if (action.type === "INC") {
        return state + 1;
    } else if (action.type === "DEC") {
        return state - 1;
    } else if (action.type === "ASYNC_INC") {
        setTimeout(()=> {
            callback(state + 1);
        }, 10);
        return undefined;
    } else if (action.type === "ASYNC_DEC") {
        setTimeout(()=> {
            callback(state - 1);
        }, 10);
        return undefined;
    } else {
        return state;
    }
};

describe("interfaces", function () {
    it("Reducer can be a function", function () {
        var state:number = undefined;
        state = reducer(state, {type: "INC"});
        expect(state).toBe(1);
        state = reducer(state, {type: "DEC"});
        expect(state).toBe(0);
    });
    it("create store", function () {
        var state:number = 0;
        expect(state).toBe(0);
        state = reducer(state, {type: "INC"});
        expect(state).toBe(1);
        state = reducer(state, {type: "DEC"});
        expect(state).toBe(0);
    });
});

import {Store} from "./index";
describe("store", function () {
    it("sync reducers should work", function () {
        var state:number = 10;
        var store = new Store<number>(reducer, state);
        store.subscribe(
            (state)=> {
                console.log('spec state: ', state)
            },
            error=> console.log('error ', error),
            () => console.log('completed.')
        );
        store.dispatch({type: "INC"});
        expect(store.value).toEqual(11);
        store.dispatch({type: "DEC"});
        expect(store.value).toEqual(10);
        store.destroy();
    });
});
describe("dispatch function", function () {

    it("support action creator", function () {
        var state:number = 30;
        var store = new Store<number>(reducer, state);

        function increase():Action {
            return {
                type: "INC"
            };
        }

        store.subscribe(
            (state)=> {
                console.log('spec state: ', state)
            },
            error=> console.log('error ', error),
            () => console.log('completed.')
        );
        store.dispatch(increase());
        store.dispatch({type: "DEC"});
        store.destroy();
    });
    it("support passing in thunk", function () {
        var state:number = 40;
        var store = new Store<number>(reducer, state);

        function increase():Action {
            return {
                type: "INC"
            };
        }

        store.subscribe(
            (state)=> {
                console.log('spec state: ', state)
            },
            error=> console.log('error ', error),
            () => console.log('completed.')
        );
        store.dispatch(increase);
        store.dispatch({type: "DEC"});
        store.destroy();
    });
    it("support passing in thunk, and thunk have access to dispatch", function () {
        var state:number = 40;
        var store = new Store<number>(reducer, state);

        function increase():void {
            var _store:Store<number> = this;
            setTimeout(function ():void {
                var action:Action = {
                    type: "INC"
                };
                _store.dispatch(action)
            }, 200);
        }

        store.subscribe(
            (state)=> {
                console.log('spec state: ', state)
            },
            error=> console.log('error ', error),
            () => console.log('completed.')
        );
        store.dispatch(increase);
        store.dispatch({type: "DEC"});
        store.destroy();
    })

});
describe("store with hash type", function () {
    it("can accept actions without initial state (an properly handle the initialization)", function () {
        interface TState extends Hash<number> {
        }

        let reducer = <Reducer>function <Number>(state:number = 0, action:Action):number {
            if (action.type === "INC") {
                return state + 1;
            } else if (action.type === "DEC") {
                return state - 1;
            } else {
                return state;
            }
        };
        var rootReducer:Hash<Reducer> = {
            counter: reducer
        };

        var store = new Store<TState>(rootReducer);

        function increase():void {
            var _store:Store<TState> = this;
            setTimeout(function ():void {
                var action:Action = {
                    type: "INC"
                };
                _store.dispatch(action);
            }, 200);
        }

        store.subscribe(
            (state) => {
                console.log('spec state: ', state);
            },
            error => console.log('error ', error),
            () => console.log('completed.')
        );
        store.dispatch(increase);
        store.dispatch({type: "DEC"});
        store.destroy();
    });
    it("can take initial value", function () {
        interface TState extends Hash<number> {
        }
        var state:TState = {
            counter: 40
        };

        let reducer = <Reducer>function <Number>(state:number = 0, action:Action):number {
            if (action.type === "INC") {
                return state + 1;
            } else if (action.type === "DEC") {
                return state - 1;
            } else {
                return state;
            }
        };
        var rootReducer:Hash<Reducer> = {
            counter: reducer
        };

        var store = new Store<TState>(rootReducer, state);

        function increase():void {
            var _store:Store<TState> = this;
            setTimeout(function ():void {
                var action:Action = {
                    type: "INC"
                };
                _store.dispatch(action);
            }, 200);
        }

        store.subscribe(
            (state) => {
                console.log('spec state: ', state);
            },
            error => console.log('error ', error),
            () => console.log('completed.')
        );
        store.dispatch(increase);
        store.dispatch({type: "DEC"});
        store.destroy();
    });
    it("accept reducers of different types", function () {
        interface TState {
            counter: number;
            name: string;
        }
        var state:TState = {
            counter: 40,
            name: 'Captain Kirk'
        };

        let counterReducer = <Reducer>function <Number>(state:number, action:Action):number {
            if (action.type === "INC") {
                return state + 1;
            } else if (action.type === "DEC") {
                return state - 1;
            } else {
                return state;
            }
        };
        let stringReducer = <Reducer>function <String>(state:string, action:Action):string {
            if (action.type === "CAPITALIZE") {
                return state.toUpperCase();
            } else if (action.type === "LOWERING") {
                return state.toLowerCase();
            } else {
                return state;
            }
        };
        var rootReducer:Hash<Reducer> = {
            counter: counterReducer,
            name: stringReducer
        };

        var store = new Store<TState>(rootReducer, state);

        store.subscribe(
            (state)=> {
                console.log('spec state: ', state)
            },
            error=> console.log('error ', error),
            () => console.log('completed.')
        );
        store.dispatch({type: "CAPITALIZE"});
        store.dispatch({type: "LOWERING"});
        store.dispatch({type: "INC"});
        store.destroy();
    });
    it("should allow filtered partial states in a stream", function () {
        interface TState {
            counter: number;
            name: string;
        }
        var state:TState = {
            counter: 40,
            name: 'Captain Kirk'
        };

        let counterReducer = <Reducer>function <Number>(state:number, action:Action):number {
            if (action.type === "INC") {
                return state + 1;
            } else if (action.type === "DEC") {
                return state - 1;
            } else {
                return state;
            }
        };
        let stringReducer = <Reducer>function <String>(state:string, action:Action):string {
            if (action.type === "CAPITALIZE") {
                return state.toUpperCase();
            } else if (action.type === "LOWERING") {
                return state.toLowerCase();
            } else {
                return state;
            }
        };
        var rootReducer:Hash<Reducer> = {
            counter: counterReducer,
            name: stringReducer
        };

        var store = new Store<TState>(rootReducer, state);

        store.select('name').subscribe(
            (state) => {
                console.log('spec state: ', state);
            },
            error => console.log('error ', error),
            () => console.log('completed.')
        );

        // mock persistent storage example
        store
            .select('counter')
            .subscribe((count:number):void => console.log('counter saving event: ', count));

        store.dispatch({type: "CAPITALIZE"});
        store.dispatch({type: "LOWERING"});
        store.dispatch({type: "INC"});
        store.dispatch({type: "DEC"});

        store.destroy();
    });

});