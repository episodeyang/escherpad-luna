/** Created by ge on 12/17/15. */
import { Reducer, Hash } from "./interfaces";
export declare function createStore<TState>(reducer: Reducer | Hash<Reducer>, initialState: TState): any;
