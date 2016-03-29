/** Created by ge on 12/4/15. */
import { BehaviorSubject, ReplaySubject, Observable } from 'rxjs';
import { Action, Thunk, Reducer, Hash, StateActionBundle } from "./interfaces";
export declare const INIT_STORE: string;
export declare const INIT_STORE_ACTION: {
    type: string;
};
export declare class Store<TState> extends BehaviorSubject<TState> {
    rootReducer: Reducer;
    update$: ReplaySubject<StateActionBundle<TState>>;
    action$: BehaviorSubject<Action>;
    constructor(rootReducer: Reducer | Hash<Reducer>, initialState?: TState);
    dispatch(action: Action | Thunk): void;
    getState: () => TState;
    select: <TRState>(key: string) => Observable<TRState>;
    destroy: () => void;
}
