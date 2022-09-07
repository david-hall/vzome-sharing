"use strict";
// global reference to the store
let store = null;
// cached in local variable to avoid the overhead of document.getElementById within render();
let valueEl = null;

// counter is the function that manages all actions upon the stored state
function counter(state, action) {
  //in this simple case, the state consists of a single integer
  if (typeof state === 'undefined') {
    return 0;
  }
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    case 'SQUARE':
      return state * state;
    default:
	  console.dir({$error: "Unexpected action.type", state, action});
      return state;
  }
}

// the render function will be notified whenever a store action is invoked (e.g. dispatch)
function render() {
  valueEl.innerHTML = store.getState().toString();
}

function initializeStore() {
	// ensure that we only iinitialize once
	if(store == null) {
		// counter is the function that manages all actions upon the store
		store = Redux.createStore(counter);
		valueEl = document.getElementById('value');

		// call render once directly from this initialization code
		render();
		// then subscribe the render function to be notified for any store changes
		store.subscribe(render);
		
		// now hook all of the events that can trigger a store change
		document.getElementById('increment')
		.addEventListener('click', function () {
			store.dispatch({ type: 'INCREMENT' })
		});
		
		document.getElementById('decrement')
		.addEventListener('click', function () {
			store.dispatch({ type: 'DECREMENT' })
		});
		
		document.getElementById('incrementIfOdd')
		.addEventListener('click', function () {
			if (store.getState() % 2 !== 0) {
				store.dispatch({ type: 'INCREMENT' })
			}
		});
		
		document.getElementById('incrementAsync')
		.addEventListener('click', function () {
			setTimeout(function () {
				store.dispatch({ type: 'INCREMENT' })
			}, 1000)
		});

		document.getElementById('square')
		.addEventListener('click', function () {
			store.dispatch({ type: 'SQUARE' })
		});		
	}
}

// don't initialize the store until the window is loaded
// because it depends on all the elements being loaded in the DOM
window.addEventListener("load", () => {
	initializeStore();
});
