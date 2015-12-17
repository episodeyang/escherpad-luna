# Luna, a reactive redux library supporting built-in async action creator and Thunks

[![Join the chat at https://gitter.im/escherpad/luna](https://img.shields.io/badge/GITTER-join%20chat-green.svg?style=flat-square)](https://gitter.im/escherpad/luna?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Luna is a light functional model container inspired by redux written using the reactive extension (v5.0). Luna try to improve upon redux by providing out of the box Thunk support so that you can pass in `actionCreator`s and asynchronous action creators directly into the `store.dispatch` function.


## What's different about Luna (from redux)?

- Luna is written using the reactive-extension, so that both the action and the states are streams.
- Luna `dispatcher` support `actionCreator` and asynchronous actions out of the box
    - Luna's Thunks take no input arguments. The Store object is accessed as `this` keyword in the thunk. I'm experimenting with this as a cleaner syntax.
- Luna is written for an Angular2 project, and will provide dependency injection (DI).

## How to use Luna

first run 

```shell
npm install 
```

and then to run a test you can use `karma run`. I use webstorm's karma integration to run the tests.

```typescript
/** Created by ge on 12/6/15. */
import {Action, Hash, Reducer} from "luna";

// the Stat interface need to extend Hash so that the index keys are available.
interface TestState extends Hash {
    counter:number;
}

// Reducer example
const reducer = <Reducer>function (state:TestState, action:Action<TestState>, callback:(state:TestState)=>void):TestState {
    if (action.type === "INC") {
        state.counter += 1;
        return state
    } else if (action.type === "DEC") {
        state.counter -= 1;
        return state
    } else if (action.type === "ASYNC_INC") {
        console.log('adding right now ---------------');
        setTimeout(()=> {
            console.log('adding right now =================');
            state.counter += 1;
            callback(state);
        }, 10);
        return undefined;
    } else if (action.type === "ASYNC_DEC") {
        setTimeout(()=> {
            state.counter -= 1;
            callback(state);
        }, 10);
        return undefined;
    } else {
        return state;
    }
};

// define the initial state of store
var state:TestState = {
    counter: 20
};

// now create store
var store = new Store<TestState>(reducer, state);

// stream states to view
store.state$.subscribe(
    (state)=> {
        console.log('spec state: ', state)
    },
    error=> console.log('error ', error),
    () => {
        console.log('completed.');
        done();
    }
);

// dispatch actions using the dispatcher$ BehaviorSubject
var action = {
    type: "ASYNC_INC"
}
store.dispatcher$.next(action);

```

## Luna's different signature for asynchronous actions

Here is the syntax with redux-thunk:

```typescript
// But what do you do when you need to start an asynchronous action,
// such as an API call, or a router transition?

// Meet thunks.
// A thunk is a function that returns a function.
// This is a thunk.

function makeASandwichWithSecretSauce(forPerson) {

  // Invert control!
  // Return a function that accepts `dispatch` so we can dispatch later.
  // Thunk middleware knows how to turn thunk async actions into actions.

  return function (dispatch) {
    return fetchSecretSauce().then(
      sauce => dispatch(makeASandwich(forPerson, sauce)),
      error => dispatch(apologize('The Sandwich Shop', forPerson, error))
    );
  };
}

// Thunk middleware lets me dispatch thunk async actions
// as if they were actions!

store.dispatch(
  makeASandwichWithSecretSauce('Me')
);
```

The signature for the returned thunk has `dispatch` and `getValue`. I find this signature kind of arbitrary. Here with Luna, you can do:

```typescript
// But what do you do when you need to start an asynchronous action,
// such as an API call, or a router transition?

// Meet thunks.
// A thunk is a function that returns a function.
// This is a thunk.

function makeASandwichWithSecretSauce(forPerson) {

  // Invert control!
  // Return a function that accepts `dispatch` so we can dispatch later.
  // Thunk middleware knows how to turn thunk async actions into actions.

  return function () {
    var _store = this;
    return fetchSecretSauce().then(
      sauce => _store.dispatch(makeASandwich(forPerson, sauce)),
      error => _store.dispatch(apologize('The Sandwich Shop', forPerson, error))
    );
  };
}

// Thunk middleware lets me dispatch thunk async actions
// as if they were actions!

store.dispatch(
  makeASandwichWithSecretSauce('Me')
);
```

## Plans next

Personally I think documentation is the most important part of a library, and for making everyone's life easier. Bad documentation wastes people's time.

If you would like to help, besides code you can create even larger impact by writing up examples. Redux (and luna) is a simple idea. Let's make it easier for people to understand the concept and start doing things that they set-out to do asap.

### Todo List

- [ ] use immutable in the test instead. Current form is too sloppy!
- [ ] more testing cases with complicated stores
- better store life-cycle support

## Acknowledgement

This library is influenced by @jas-chen's work on redux-core, and received help from @fxck and @robwormald.

Luna is part of my effort on re-writting [escherpad](http://www.escherpad.com), a beautiful real-time collaborative notebook supporting real-time LaTeX, collaborative Jupyter notebook, and a WYSIWYG rich-text editor.

## About Ge

I'm a graduate student studying quantum information and quantum computer at University of Chicago. When I'm not tolling away in a cleanroom or working on experiments, I write `(java|type)script` to relax. You can find my publications here: [google scholar](https://scholar.google.com/citations?user=vaQcF6kAAAAJ&hl=en)

## LICENSING

MIT.