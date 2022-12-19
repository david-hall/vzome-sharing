"use strict";
// global reference to the store
let store = null;
// HTML elements are kept in local variables to avoid the overhead of document.getElementById within every call to render();
//let valueElement = null;
let operandElements = [];
let divisorElements = [];
let exponentElements = [];
let answerElements = [];

let equationElements = [];
let operation = multiply;

const operationMap = new Map([
  ["add",               { label: "+",   html: '&plus;',   fn: add      } ],
  ["subtract",          { label: "-",   html: '&minus;',  fn: subtract } ],
  ["multiply",          { label: "*",   html: '&times;',  fn: multiply } ],
  ["divide",            { label: "/",   html: '&div;',    fn: divide   } ],
  ["modulus",           { label: "%",   html: '&#xFF05;', fn: modulus  } ],
  ["continuedFraction", { label: "///", html: '///',      fn: continuedFraction } ],
]);

// TODO: eventually revise all of these functions to handle ANs
function add      (a, b) { return a + b; }
function subtract (a, b) { return a - b; }
function multiply (a, b) { return a * b; }
function divide   (a, b) { return a / b; }
function modulus  (a, b) { return a % b; }
function continuedFraction (a, b) { return "TODO: continuedFraction"; }

// calc is the function that manages all actions upon the stored state
function calc(state, action) {
	const newState = {...state}; // clone current state
	switch (action.type) {
    case 'operator-change':
		newState.op = setOperator(action.payload);
		return evaluate(newState);
    
	case 'divisor-change': {
		const {id, value} = action.payload;
		newState.divisors[id] = parseInt(value); // validated int goes in the state so we can do math
	} return evaluate(newState);
    
	case 'exponent-change': {
		const {id, value} = action.payload;
		newState.exponents[id] = parseInt(value); // validated int goes in the state so we can do math
	} return evaluate(newState);
    
	case 'operand-change': {
		const {id, value} = action.payload;
		newState.operands[id] = parseInt(value); // validated int goes in the state so we can do math
	} return evaluate(newState);
	
	case "@@INIT": // store is initializing
		console.dir({$msg: "Initializing redux store", state, action});
		return state;
    
	default:
		console.dir({$error: "Unexpected action.type", state, action});
		return state;
	}
}

function setOperator(newOperator) {
	const mapEntry = operationMap.get(newOperator);
	operation = mapEntry ? mapEntry.fn : noop;
	document.getElementById('pickMathOp').value = newOperator
	return document.getElementById('pickMathOp').value; // rather than newOperator, so we know it's valid or nukk
}

function evaluate(state) {
	const {divisors, exponents, op, operands} = state;
	for(let i = 0; i < 2; i++) {
		if(divisors[i] < 0) {
			// ensure that divisor is never negative since that's how vZome normalizes ANs & BRs
			divisors[i] *= -1; // negate
			operands[i] *= -1; // negate
			// TODO: negate all operand terms when we use ANs
			// TODO: handle divide by zero when we use ANs
		}
	}
	const divA = divisors[0];
	const divB = divisors[1];
	const expA = exponents[0];
	const expB = exponents[1];
	const opA  = operands[0];
	const opB  = operands[1];
	const ansA = Math.pow(opA / divA, expA);
	const ansB = Math.pow(opB / divB, expB);
	const value = operation(ansA, ansB);
	return {...state, answers: [ansA, ansB], divisors: [divA, divB], exponents: [expA, expB], op, operands: [opA, opB], value };
}

// the render function will be notified whenever a store action is invoked (e.g. store.dispatch)
function render() {
	// use object deconstruction syntax
	const {answers, divisors, exponents, operands, value} = store.getState();
	const n = 2;
	for(let i = 0; i < n; i++) {
		operandElements[i].value = operands[i];
		divisorElements[i].value = divisors[i];
		//exponentElements[i].value = exponents[i];
		//answerElements[i].innerHTML = answers[i];
	}
	//answerElements[n].innerHTML = value;
	//valueElement.innerHTML = value;
}

function initializeStore() {
	// ensure that we only initialize once
	if(store == null) {
		const initialState = evaluate({ answers: [1, 1], divisors: [1, 1], exponents: [1, 1], op: "multiply", operands: [1, 1], value: 1 });
		store = Redux.createStore(calc, // the function that manages all actions on the store
			initialState, // optional param may be omitted
			window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() // may be 2nd or 3rd param to enable the chrome Redux extension
		);
		store.dispatch({ type: 'operator-change', payload: initialState.op } );

		operandElements = document.getElementsByClassName('tdf-num');
		divisorElements = document.getElementsByClassName('tdf-den');
		exponentElements = document.getElementsByClassName('tdf-exp');
		answerElements = document.getElementsByClassName('row-val'); // deprecated
		const pickMathOp = document.getElementById('pickMathOp');

		// call render once directly from this initialization code
		render();
		// then subscribe the render function to be notified for any store changes
		store.subscribe(render);
		
		// Now hook all of the events that can trigger a store change
		// TODO: set the selected value of pickMathOp here 
		// based on initialState to override the HTML selected attribute
		// before hooking the event
		pickMathOp .addEventListener('change', function (event) {
			const pickList = event.target;
			store.dispatch({ type: 'operator-change', payload: pickList.options[pickList.selectedIndex].value } );
		});
		
		for(let id = 0; id < operandElements.length; id++) {
			// TODO: be sure we don't get multiple event listeners on the same element when changing field or field.order and making new tdf-num cells
			operandElements[id].addEventListener('change', function (event) {
				store.dispatch( { type: 'operand-change', payload: { id, value: event.target.value } } );
			});
		}
		
		for(let id = 0; id < divisorElements.length; id++) {
			divisorElements[id].addEventListener('change', function (event) {
				store.dispatch( { type: 'divisor-change', payload: { id, value: event.target.value } } );
			});
		}		

		for(let id = 0; id < exponentElements.length; id++) {
			exponentElements[id].addEventListener('change', function (event) {
				store.dispatch( { type: 'exponent-change', payload: { id, value: event.target.value } } );
			});
		}		
	}
}

function initializeUI() {
	const pickList = document.getElementById("pickMathOp");
	// here's how to get the optgroups if we want them some day...
	// also https://stackoverflow.com/questions/36615578/how-to-get-optgroup-value-from-javascript
	//const optGroups = document.getElementsByTagName('optgroup');
	//const optGroup = optGroups && optGroups.length == 1 ? optGroups[0] : null;
	//console.dir(optGroup);
	// pickList.innerHTML = ""; // remove the optgroup too
	pickList.options.length = 0; //remove only the options, not the optgroup
	for(const [key, value] of operationMap.entries()) {
		const opt = new Option(value.label, key);
		// Option c'tor sets innerText, not innerHTML, so fix that here...
		opt.innerHTML = value.html;
		// this will put the options after the optgroup as sibling nodes, not inside the optgroup as children
		// visually it's the same, but the DOM tree is a bit different
		pickList.options[pickList.options.length] = opt;
	}
	
	const order = field.getOrder();
	
	equationElements = [];
	const equation_rows = document.querySelectorAll('tr.equation');
	for(const equation_row of equation_rows) {
		// pad numerator outputs
		let numeratorOutputs = equation_row.querySelectorAll('div.tdf-num');
		// TODO: might be cleaner to remove all but he first then re-add them instead of trying to re-use irrat cells
		if(numeratorOutputs.length > order) { // remove extra output tds
			for(let i = numeratorOutputs.length-1; i >= order; i--) {
				numeratorOutputs[i].remove();
			}
			numeratorOutputs = equation_row.querySelectorAll('div.tdf-num');
		} else if(numeratorOutputs.length < order) { // add more input tds as needed
			const td = numeratorOutputs[0].closest("td");
			for(let i = numeratorOutputs.length; i < order; i++) {
				const newbie = td.cloneNode(true);
				newbie.removeAttribute("id"); // shouldn't be an id, but just in case...
				td.after(newbie);
			}
			numeratorOutputs = equation_row.querySelectorAll('div.tdf-num');
		}

		// pad numerator inputs
		let numeratorInputs = equation_row.querySelectorAll('input[type=number].tdf-num');
		// TODO: might be cleaner to remove all but he first then re-add them instead of trying to re-use irrat cells
		if(numeratorInputs.length > order) { // remove extra input tds
			for(let i = numeratorInputs.length-1; i >= order; i--) {
				numeratorInputs[i].remove();
			}
			numeratorInputs = equation_row.querySelectorAll('input[type=number].tdf-num');
		} else if(numeratorInputs.length < order) { // add more input tds as needed
			const td = numeratorInputs[0].closest("td");
			for(let i = numeratorInputs.length; i < order; i++) {
				const newbie = td.cloneNode(true);
				newbie.removeAttribute("id"); // shouldn't be an id, but just in case...
				td.after(newbie);
			}
			numeratorInputs = equation_row.querySelectorAll('input[type=number].tdf-num');
		}

		equationElements.push( {
			input: {
				numerators:  equation_row.querySelectorAll('input[type=number].tdf-num'),
				denominator: equation_row.querySelector   ('input[type=number].tdf-den'),
				exponent:    equation_row.querySelector   ('input[type=number].tdf-exp')
			},
			output: {
				algebraic:   equation_row.querySelector   ('div.alg-num'),
				decimal:     equation_row.querySelector   ('div.dec-num'),
				numerators:  equation_row.querySelectorAll('div.tdf-num'),
				denominator: equation_row.querySelector   ('div.tdf-den')
			}
		} );
	}
	
	{
		// pad numerator outputs in the answer row
		const answer_row = document.querySelector('tr.answer');
		let numeratorOutputs = answer_row.querySelectorAll('div.tdf-num');
		// TODO: might be cleaner to remove all but he first then re-add them instead of trying to re-use irrat cells
		if(numeratorOutputs.length > order) { // remove extra output tds
			for(let i = numeratorOutputs.length-1; i >= order; i--) {
				numeratorOutputs[i].remove();
			}
			numeratorOutputs = answer_row.querySelectorAll('div.tdf-num');
		} else if(numeratorOutputs.length < order) { // add more input tds as needed
			const td = numeratorOutputs[0].closest("td");
			for(let i = numeratorOutputs.length; i < order; i++) {
				const newbie = td.cloneNode(true);
				newbie.removeAttribute("id"); // shouldn't be an id, but just in case...
				td.after(newbie);
			}
			numeratorOutputs = answer_row.querySelectorAll('div.tdf-num');
		}
	}

	// adjust the dynamic colspans
	const nCols = document.querySelector('tr.equation').querySelectorAll("td"               ).length; // there has to be a better way
	const nUsed = document.querySelector('tr.answer'  ).querySelectorAll("td:not([colspan])").length; // there has to be a better way
	document.querySelector('tr.hline' ).querySelector("td").setAttribute("colspan", nCols);
	document.querySelector('tr.answer').querySelector("td").setAttribute("colspan", nCols - nUsed);
	
	// now build the UI mgmt object
	const answer_row = document.querySelector('tr.answer');
	answerElements = {
		output: {
			algebraic:   answer_row.querySelector   ('div.alg-num'),
			decimal:     answer_row.querySelector   ('div.dec-num'),
			numerators:  answer_row.querySelectorAll('div.tdf-num'),
			denominator: answer_row.querySelector   ('div.tdf-den')
		}
	};
	const configurator = { todo: "TODO: hide/show exponent per line, copy to and from lines... and more" };
	console.dir({equationElements, answerElements, pickList, configurator});
}
const field = {
	getName: function () { return "heptagon"; },
	getOrder: function () { return 3; }
}
// don't initialize the store until the window is loaded
// because it depends on all the elements being loaded in the DOM
window.addEventListener("load", () => {
	initializeUI();
	initializeStore();
});
