import "https://unpkg.com/redux@latest/dist/redux.min.js";
import { getField } from "https://www.vzome.com/modules/vzome-legacy.js";

export class ReduxCalculatorModel extends EventTarget {
	#store;

	constructor(fieldName = "polygon5", store = null) {
		super();
		if(store != null) {
			this.#store = store;
			console.log("Using existing store", store);
		} else {
			const initialState = ReduxCalculatorModel.evaluate({
				format: "tdf",
				...ReduxCalculatorModel.#newFieldOperands(fieldName),
				exponents: [1, 1],
				op: "multiply",
				operations: this.operations
			});
			this.#store = Redux.createStore(ReduxCalculatorModel.calculatorReducer, // the reducer function that manages all actions on the store
				initialState, // optional param may be omitted
				window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() // may be 2nd or 3rd param to enable the chrome Redux extension
			);
			console.log("Using new store", this.#store);
		}
		// Subscribe this.render to be called for any store changes
		// CAREFUL, if we subscribe non-static member methods directly, "this" will be undefined when the method gets invoked later.
		// The following line will execute with no problem, but render() will fail when invoked later.
		// DON'T DO THIS: // this.#store.subscribe(this.render);
		
		// The solution is to use a closure.
		// Adapted from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
		// An immediately invoked function will subscribe the store to call "render"
		// with "this" in it's current context being preserved in the "calculator" parameter when render() is called later.
		(function (calculator) {
			calculator.#store.subscribe(
				() => {
					calculator.render();
				}
			);
		})(this); 
		// then call render once to fire a changeEvent to the UI
		this.render();
	}
	
	// The render function will be notified after any store action has been invoked and handled (e.g. store.dispatch)
	// The UI module will hook this event to completely replace its html content based on the current state
	render() {
		// the detail prop is not used, but it's shown here to remind me that it's available
		this.dispatchEvent( new CustomEvent("change", { srcElement: this, detail: ""}) );
	}

	static #newFieldOperands(fieldName) {
		const field = getField(fieldName);
		const order = field.getOrder();
		const irrationalLabels = [];
		for(let i = 0; i < order; i++) {
			irrationalLabels.push( field.getIrrational(i, 0) );
		}
		const operand = ReduxCalculatorModel.expandAN(field.zero());
		const namedNumbers = ReduxCalculatorModel.#getNamedNumbers(field);
		return {
			fieldName,
			order,
			irrationalLabels,
			namedNumbers,
			operands: [ operand, operand ]
		};
	}
	
	static #getNamedNumbers(field) {
		// copied this logic from MathTableExporter.java
		const namedNumbers = new Map();
		if(field != null) {
			const names = [
				"zero",
				"one",
				// increasing order except that phi and other greek letters go before any sqrtN
				"phi",      // 5,2 
				"rho",      // 7,2
				"sigma",    // 7,3
				// alpha, beta and gamma are ambiguous when nSides is a mutiple of both 9 and 13
				// but since 9*13=117, and we seldom use 117N-gons, I'll live with it. 
				"alpha",    // 13,2 and 9,2
				"beta",     // 13,3 and 9,3
				"gamma",    // 13,4 and 9,4
				"delta",    // 13,5
				"epsilon",  // 13,6
				"theta",    // 11,2
				"kappa",    // 11,3
				"lambda",   // 11,4
				"mu",       // 11,5
				//"separator",
				// square roots
				"\u221A2",
				"\u221A3",
				"\u221A5",
				"\u221A6",
				"\u221A7",
				"\u221A8",
				"\u221A10",
			];
			for(const name of names) {
				const number = field.getNumberByName(name);
				if(number != null) {
					namedNumbers[name] = ReduxCalculatorModel.expandAN(number);
				}
			}
		}
		return namedNumbers;
	}

	static isAlgebraicNumber(num) {
		return num 
			&& num === Object(num)
			&& Array.isArray(num.__proto__.constructor.__interfaces)
			&& num.__proto__.constructor.__interfaces.includes("com.vzome.core.algebra.AlgebraicNumber");
	}

	static expandAN(num) {
		const result = ReduxCalculatorModel.isAlgebraicNumber(num) ? 
		{
			// parameterless toString() overload throws "Error: invalid overload"
			// but only for some nums (e.g. [5,1,1], but not [5,0,1]) using polygon5 field
			alg: num.toString(0),
			dec: num.evaluate(),
			tdf: num.toTrailingDivisor(),
		}
		: num.isInfinite && num.label ?
		{ ...num,
			alg: num.label, // or use num.html
			dec: num.label, // or use num.html
			tdf: num.label,	// or use num.html
		}
		: 
		{
			num,
			alg: num,
			dec: num,
			tdf: num,
			numType: typeof num,
			loggged: console.dir(num),
		};
		return result;
	}
	
	static #createAlgebraicNumberFromTD(fieldName, tdf) {
		return getField(fieldName).createAlgebraicNumberFromTD(tdf);
	}

	// Using Proxies to provide array-like syntax in the event handlers:
	// host.operands[id, term] = event.target.value;
	// See https://stackoverflow.com/questions/2449182/getter-setter-on-javascript-array
	// and https://delicious-insights.com/en/posts/js-index-proxies/
	// and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/set
	// and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/get
	operands = new Proxy(this, {
		get (target, id, reciever) {
			return new Proxy(target, {
				get (target, term, reciever) {
					return target.#store.getState().operands[id].tdf[term];
				},
				set ( target, term, value, reciever ) {
					target.#store.dispatch( { type: 'operand-change', payload: { id, term, value } } );
					return Reflect.set(...arguments);
				},
			});
		},
		set ( target, id, value, reciever ) {
			if(Array.isArray(value)) {
				const { order } = target.#store.getState();
				if(value.length == order + 1) {
					for(let term = 0; term < value.length; term++) {
						target.operands[id][term] = value[term];
					}
					return Reflect.set(...arguments);		
				}
			}
			console.dir({...arguments});
			const msg = "Whoa!, You probably shouldn't be setting the value of operands[" + id + "].\n"
			+ "operands is a 2D integer array.\n"
			+ "Did you mean to set operands[" + id + "][???]";
			console.log(msg);
			throw new Error(msg);
		},
	});

	divisors = new Proxy(this, {
		get (target, id, reciever) {
			const { order } = this.#store.getState();
			return target.#store.getState().operands[id].tdf[order];
		},
		set ( target, id, value, reciever ) {
			target.#store.dispatch( { type: 'divisor-change', payload: { id, value } } );
			return Reflect.set(...arguments);
		},
	});
	
	exponents = new Proxy(this, {
		get (target, id, reciever) {
			return target.store.getState().exponents[id];
		},
		set ( target, id, value, reciever ) {
			target.store.dispatch( { type: 'exponent-change', payload: { id, value } } );
			return Reflect.set(...arguments);
		},
	});

	doAction(subAction, props) {
		this.#store.dispatch( { type: 'calculator-action', payload: {subAction, props} } );
	}

	get operator() {
		return this.#store.getState().op;
	}
	set operator(newValue) {
		this.#store.dispatch( { type: 'operator-change', payload: newValue } );
	}

	get fieldName() {
		this.#store.getState().fieldName;
	}
	set fieldName(newValue) {
		this.#store.dispatch( { type: 'field-name-change', payload: newValue } );
	}

	get format() {
		return this.#store.getState().format;
	}
	set format(newValue) {
		this.#store.dispatch( { type: 'format-change', payload: newValue } );
	}

	get formats() {
		return ["alg", "dec", "tdf"];
	}

	get operations() {
		return [...ReduxCalculatorModel.operationMap.keys()];
	}

	// Deprecated
	get store() {
		this.#deprecate("applicable #model property setters");
		return this.#store;
	}
	
	// Deprecated
	get state() {
		this.#deprecate("applicable #model property getters");
		return this.#store.getState();
	}
	
	// Deprecated
	#deprecate(alt) {
		//console.log("Deprecated: Use " + alt);
		//debugger;
	}
	
	static evaluate(state) {
		const {fieldName, operands, exponents, op} = state;
		const algebraicOperands = [];
		const results = [];
		const field = getField(fieldName);
		for(let i = 0; i < 2; i++) {
			// TODO: Check if the tdf divisor is 0. If so, then get zero and append isInfinity instead of throwing a divide by zero exception
			const inputOperand = field.numberFactory.createAlgebraicNumberFromTD(field, operands[i].tdf);
			 // Put the AN back into the state to ensure that the denominator is positive and all numerators are valid and normalized
			 // This makes for some potentially unexpected behavior when denominator is not positive, but it keeps the inputs valid and auto-normalized
			operands[i] = ReduxCalculatorModel.expandAN(inputOperand);
			const reducedOperand = ReduxCalculatorModel.power(inputOperand, exponents[i]);
			algebraicOperands.push(reducedOperand);
			results.push(ReduxCalculatorModel.expandAN(reducedOperand));
		}
		const algOp0 = algebraicOperands[0];
		const algOp1 = algebraicOperands[1];
		const operate = ReduxCalculatorModel.operationMap.get(op);
		const rawAnswer = (algOp0.isInfinite || algOp1.isInfinite)
			? {... field.zero(), isInfinite: true}
			: operate(algOp0, algOp1);
		const answers = Array.isArray(rawAnswer) ? rawAnswer : [rawAnswer];
		for(let i = 0; i < answers.length; i++) {
			answers[i] =  ReduxCalculatorModel.expandAN(answers[i]);
		}
		return { ...state, results, answers };
	}

	static power(operand, exponent) {
		let result = exponent == 0 ? operand.getField().one() : operand;
		if(!result.isOne() && !result.isZero() ) {
			// only one (or neither) of the loops below will be applicable
			// when exponent >= 2
			for(let exp = 2; exp <= exponent; exp++) {
				result = result.times(operand);
			}
			// when exponent <= -2
			for(let exp = -2; exp >= exponent; exp--) {
				result = result.dividedBy(operand);
			}
		}
		return result;
	}

	static add(a, b) { return a.plus(b); }
	
	static subtract(a, b) { return a.minus(b); }
	
	static multiply(a, b) { return a.times(b); }
	
	static divide(a, b) { 
		return b.isInfinite || b.isZero() 
		? {... b, isInfinite: true}
		: a.dividedBy(b); 
	}
	
	static modulus(a, b) {
		// I'm not going to do any special processing based on the sign of the operands.
		// Apparently, there are several valid options so I'll do what's easiset.
		// See https://www.omnicalculator.com/math/modulo-of-negative-numbers#how-does-modulo-work-with-negative-numbers
		if(b.isInfinite || b.isZero()) {
			return {... b, isInfinite: true};
		}
		const quotient = a.dividedBy(b);
		const field = a.getField();
		const tdf = field.zero().toTrailingDivisor();
		tdf[0] = parseInt(quotient.evaluate());
		const modulo = field.createAlgebraicNumberFromTD(tdf);
		const remainder = a.minus(modulo.times(b));
		return [modulo, remainder];
	}

	static continuedFraction (a, b) { return ReduxCalculatorModel.divideRecursive (a, b, 5); }
	static divideRecursive (a, b, depth, delim = ",<br>\n ", accum="[ ", suffix = ",<br>\n... ]") {
		// TODO: make this iterative instead of recursive
		// TODO: Stop the series if it ever starts to repeat, then append an elipses...
		// TODO: See the continued-fractions branch in the vZome project for a better algorithm
		// TODO: Ensure that a & b are both positive before getting recursive
		// TODO: Divide 1 by a, not a by b. I think b is irrelevant.
		// TODO: This math is quite likely wrong, but is mostly works well enough with the UI for now...
		// except for maybe division by zero...
		console.log({...arguments});
		//debugger;
		if(!b.isZero() && depth >= 0) {
			const field = a.getField();
			// can't divide by zero
			const q = ReduxCalculatorModel.divide(a,b);
			const n = parseInt(q.evaluate());
			accum += n;
			const tdf = field.zero().toTrailingDivisor();
			tdf[0] = parseInt(n);
			const num = field.createAlgebraicNumberFromTD(tdf);
			const r = ReduxCalculatorModel.subtract(num, q);
			if(depth >= 0 && !r.isZero()) {
				console.log(`${depth}:\t${accum}`); // template literal
				return ReduxCalculatorModel.divideRecursive (r, b.reciprocal(), depth-1, delim, accum + delim, suffix);
			}
		}
		return accum + suffix;
	}

	// calculatorReducer is the reducer function that manages all actions upon the stored state
	static calculatorReducer(state, action) {
		const newState = {...state}; // clone current state
		const {fieldName, format, order, exponents, op} = {...state};
		const {id, term, value} = {...action.payload};
		switch (action.type) {
		case 'double-polygon-field': {
			// TODO: Make an action to "double-polygon-field". It will only work on polygon fields.
			// It maintains the current values of the operands.
			// Potentially we could also make a variant to reduce the field by 1/2 if it's an even-gon and the operands align correctly
			console.log("TODO:", action);
			return state;
		}
			
		case 'field-name-change': {
			const fieldName = action.payload;
			if(fieldName == newState.fieldName) {
				// this avoids resetting all of the operands and exponents when the fieldName isn't actually changing
				return state; // unchanged
			}
			const field = getField(fieldName);
			if(field.unknown) {
				console.dir(field);
				return state; // unchanged
			}
			const newFieldState = {format,
				...ReduxCalculatorModel.#newFieldOperands(fieldName),
				exponents,
				op,
			}
			return ReduxCalculatorModel.evaluate(newFieldState);
		}
		
		case 'calculator-action': {
			const {subAction, props} = action.payload;
			switch(subAction) {
			case 'clear':
				const zero = ReduxCalculatorModel.expandAN(getField(fieldName).zero());
				newState.operands  = [zero, zero];
				newState.exponents = [1, 1];
				return ReduxCalculatorModel.evaluate(newState);
			case 'swap':
				newState.operands  = [state.operands [1], state.operands [0]];
				newState.exponents = [state.exponents[1], state.exponents[0]];
				return ReduxCalculatorModel.evaluate(newState);
			case "set-named-value": {
				const {id, name} = props;
				if(id == 0 || id == 1) {
					const number = newState.namedNumbers[name];
					if(number != null) {
						newState.operands[id] = number;
						return ReduxCalculatorModel.evaluate(newState);
					}
				}
			}
			case "unary-action": {
				const {id, name} = props;
				const {operands} = newState;
				if(operands[id].tdf[order] == 0) {
					return state; // unchanged;
				}
				if(id == 0 || id == 1) {
					let anum = ReduxCalculatorModel.#createAlgebraicNumberFromTD(fieldName, operands[id].tdf);
					let success = false;
					// TODO: put all of these in another string-to-unary-function map and refactor this switch ...
					switch(name) {
						case "negate":
							// TODO: Add this.negate(id) method which does this
							anum = anum.negate();
							success = true;
							break;
						case "reciprocal":
							// TODO: Add this.reciprocal(id) method which does this
							if(anum.isZero() || anum.isOne()) {
								console.log("Ignoring reciprocal of " + anum.toString(0));
								return state; // unchanged;
							}
							anum = anum.reciprocal();
							success = true;
							break;
						case "unit-exponent":
							// TODO: Add this.unitExponent(id) method which does this
							if(exponents[id] == 1) {
								return state; // unchanged
							}
							anum = ReduxCalculatorModel.power(anum, exponents[id]);
							newState.exponents[id] = 1;
							success = true;
							break;
						case "absolute-value":
							// TODO: Add this.abs(id) method which does this
							if(anum.signum() >= 0) {
								return state; // unchanged
							}
							anum = anum.negate();
							success = true;
							break;
						case "ceiling":
							// TODO: Add this.ceiling(id) method which does this
							anum = getField(fieldName).createRational(Math.ceil(anum.evaluate()));
							success = true;
							break;
						case "floor":
							// TODO: Add this.floor(id) method which does this
							anum = getField(fieldName).createRational(Math.floor(anum.evaluate()));
							success = true;
							break;
					}
					if(success) {
						newState.operands[id] = ReduxCalculatorModel.expandAN(anum);
						return ReduxCalculatorModel.evaluate(newState);
					}
				}
			} 
			}
		}  break; // fall thru and log the unexpected args

		case 'operator-change': {
			const operator = action.payload;
			if(ReduxCalculatorModel.operationMap.get(operator) != null) {
				newState.op = operator;
				return ReduxCalculatorModel.evaluate(newState);
			}
		}  break; // fall thru and log the unexpected args

		case 'divisor-change': {
			const parsedValue = parseInt(value);
			if(parsedValue != 0 && ! Number.isNaN(parsedValue)) {
				newState.operands[id].tdf[order] = parsedValue;
			}	
			return ReduxCalculatorModel.evaluate(newState);
			// could include an error message in the state
		} return state; 

		case 'exponent-change': {
			newState.exponents[id] = parseInt(value);
		} return ReduxCalculatorModel.evaluate(newState);

		case 'operand-change': {
			newState.operands[id].tdf[term] = parseInt(value);
		} return ReduxCalculatorModel.evaluate(newState);

		case 'format-change': {
			// TODO: validate against the formats array
			newState.format = action.payload;
		} return newState;

		case "@@INIT": // redux store is initializing
			//console.log(action, state);
			return newState;
		}
		console.dir({$error: "Unexpected action.type", action, state});
		return state;
	}
	
	static operationMap = new Map([
		["add",              	ReduxCalculatorModel.add			   	],
		["subtract",         	ReduxCalculatorModel.subtract 		 	],
		["multiply",         	ReduxCalculatorModel.multiply 		 	],
		["divide",           	ReduxCalculatorModel.divide   		 	],
		["modulus",          	ReduxCalculatorModel.modulus  		 	],
		["continuedFraction",	ReduxCalculatorModel.continuedFraction	],
	]);
/*
	static newid () {
		const _ = function() { return (((1 + Math.random()) * 0x10000)|0).toString(16).substring(1).toUpperCase(); };
		return (_()+_()+"-"+_()+"-"+_()+"-"+_()+"-"+_()+_()+_());
	}
*/
}
