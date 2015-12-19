import { Hash, Reducer } from "../interfaces";
export declare function combineReducers<TState>(reducers: Hash<Reducer>): Reducer;
export declare function passOrCombineReducers<TState>(reducers: Reducer | Hash<Reducer>): Reducer;
