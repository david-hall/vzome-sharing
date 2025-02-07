import { VZomeCalculatorCSS } from "./vzome-calculator.css.js";
import { VZomeCalculatorController } from "./vzome-calculator-controller.js";

export class VZomeCalculator extends HTMLElement {
	#root;
	#container;
	#model;

	constructor() {
		super();
		this.#root = this.attachShadow({ mode: "open" });
		this.#root.appendChild( document.createElement("style") ).textContent = VZomeCalculatorCSS;
		this.#container = document.createElement("div");
		this.#container.className = "calculator";
		this.#root.appendChild( this.#container );
	}

	connectedCallback() {
		this.initializeStore();
	}

	initializeStore() {
		// These variables will be read from the observedAttributes because #model is still undefined
		const {fieldName, format, operator} = this;
		// TODO: Check if we have a parent object with a store we can use, like the top level React <App>
		const sharedStore = null; // passing null will let the model generate its own private store
		const controller = new VZomeCalculatorController();
    this.#model = controller;

    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    //  SV NOTE:
    //   I had to comment out the two if statements, since they access the getters on
    //   the controller before they are ready.  I'm a little unsure of your changing
    //   source of truth for the attributes/fields here, so I guess it is a puzzle for
    //   us to play with and discuss.
    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

    // now that #model is defined, our member getters will read from the store, not the attributes
		// sync our initial attribute values with the store's default values before we hook the change notification
		// if(this.format != format) {
		// 	this.format = format;
		// }
		// if(this.operator != operator) {
		// 	this.operator = operator;
		// }

    // Can't render here yet, we have to wait until there is state,
    //   and this will make sure that the state (with field) gets initialized IN DUE COURSE,
    //   in a later microtask.
    Promise.resolve()
      .then( () => {
        controller .fieldName = fieldName; // setter proxy will trigger async cascade, including the first change event to trigger render()
      });

		// CAREFUL, if we subscribe to non-static member methods directly, "this" will be undefined when the method gets invoked later.
		// The following line will execute with no problem, but render() will fail when invoked later.
		// DON'T DO THIS: // this.#store.subscribe(this.render);
		
		// The solution is to use a closure.
		// Adapted from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
		// An immediately invoked function will subscribe the store to call "render"
		// with "this" in it's current context being preserved in the "calculator" parameter when render() is called later.

    //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    // SV NOTE:  *MAYBE* you can replace the IIFE below (and the comments above) with this line:
    // controller .addEventListener( "change", () => render() );
    //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

		(function (calculator) {
			calculator.#model.addEventListener("change",
				(event) => {
					calculator.render();
				}
			);
		})(this); 
	}
	
	// The render function will be notified after any store action has been invoked and handled (e.g. store.dispatch)
	// It will completely replace the prior html content based on the current model state
	render() {
    const {answers, exponents, format, op, operands, order, results} = this.#model.state;
		const table = document.createElement("table");
		table.className = "calculator";
		//this.#container.appendChild(table);
		const thead = table.createTHead();
		const tbody = table.createTBody();
		let firstInputCell;
		let firstResultCell;
		let nPadColspan;
		let nAllColspan;
		// BEGIN INPUT ROWS
		for (let row = 0; row < operands.length; row++) {
			let tr = tbody.insertRow();
			tr.className = "equation";
			tr.setAttribute("data-row", row); // TODO: may be unnecessary if the change event uses a closure
			//
			let td = tr.insertCell();
			if(row > 0) {
				td.className = "operator";
				td.appendChild(this.getOperationPickList(op));
			}
			// BEGIN ROW INPUTS
			td = tr.insertCell();
			td.className = "exp-paren";
			td.innerHTML = "(";
			//
			//ADD OPERAND INPUTS
			// record the column
			firstInputCell = tr.childElementCount + 1;
			this.appendAlgebraicNumber(tr, format, operands[row], true);
			//
			td = tr.insertCell();
			td.className = "exp-paren";
			td.innerHTML = ")";
			//
			td = tr.insertCell();
			td.className = "exponent";
			td.innerHTML = "<input class='exponent' type='text' inputmode='numeric' pattern=' *-?[0-9][0-9]? *' required value='" + exponents[row] + "'>";
			td.querySelector("input").addEventListener('change',
			function (event) {
				event.target.setCustomValidity("");
				if(event.target.checkValidity()) {
					const host = this.closest("div.calculator").parentNode.host;
					const id = this.closest("tr").getAttribute("data-row");
					host.setExponent( id, event.target.value );
				} else {
					const msg = "Value must be an integer between -99 and 99.";
					event.target.setCustomValidity(msg);
					console.log(msg, "'" + event.target.value + "'");
					event.target.reportValidity();
				}
			});
			//
			td = tr.insertCell();
			td.className = "equals";
			td.appendChild(this.getRowPickList());
			// record the colspan for the padding cell in the answer row
			nPadColspan = tr.childElementCount;

			// add the results column(s)
			// record the column
			firstResultCell = tr.childElementCount + 1;
			this.appendAlgebraicNumber(tr, format, results[row], false);

			// record the total number of cells for use by the header row
			// TODO: consider cloning the first tr in tbody or other ways to get this number 
			// TODO: consider cloning the first tr of tbody and just modifying it since it has the correct number of cells
			nAllColspan = tr.childElementCount;
		}

		this.generateHeaderRow(thead, firstInputCell, firstResultCell, nAllColspan);

		// BEGIN ANSWER ROW(S)
		const tfoot = table.createTFoot();
		// TODO: consider cloning the first tr of tbody and just modifying it since it has the correct number of cells
		for (let row = 0; row < answers.length; row++) {
			const tr = tfoot.insertRow();
			tr.className = "answer";
			// TODO: may be unnecessary if the change event uses a closure
			tr.setAttribute("data-row", row);
			const td = tr.insertCell();
			td.className = "filler";
			td.setAttribute("colspan", nPadColspan); 
			td.innerHTML = ""; 
			// TODO: we could render something from the store here, like maybe "remainder" for modulus operator or any error messages or infinity
			// TODO: we could copy any inner elements of this module into a div here or in a subsequent tr
			//td.innerHTML = this.innerHTML; // TODO: could also show the fieldName here

			// ADD ANSWER ROW(s)
			this.appendAlgebraicNumber(tr, format, answers[row], false);
			// if(answers[row].isInfinite) {
			// 	// TODO: should we break out early with continued fractons
			// 	//break;
			// }
		}

		// replace any existing content with the new table
		this.#container.innerHTML = "";
		this.#container.appendChild(table);
		//console.log(this.#container.innerHTML);
	}

	generateHeaderRow(thead, firstInputCell, firstResultCell, nAllColspan) {
		const { fieldName, irrationalLabels, order, format} = {... this.#store.getState()};
		const tr = thead.insertRow();
		let th = document.createElement("th");
		th.innerHTML = this.getActionPickList(fieldName, order);
		th.querySelector("select").addEventListener('change',
			function (event) {
				const value = event.target.value;
				switch(value) {
					case "":
						return;
					case "clear-operands":
					case "swap-operands":
						event.target.closest("div.calculator").parentNode.host.doAction(value);
						break;
					case "info":
						alert("\n" + fieldName + "\n\norder " + order);
						break;
					default:
					const msg = "Unhandled action: " + value;
						console.log(msg);
						alert(msg);
						break;
				}
				event.target.value = "";
			}
		);
		tr.appendChild(th);
		//
		th = document.createElement("th");
		th.setAttribute("colspan", firstInputCell-1);
		tr.appendChild(th);
		//
		for(const label of irrationalLabels) {
			th = document.createElement("th");
			th.className = "tdf-num";
			th.innerText = label;
			tr.appendChild(th);
		}
		//
		th = document.createElement("th");
		th.setAttribute("colspan", firstResultCell - (firstInputCell + order));
		tr.appendChild(th);
		
		if(format == "tdf") {
			for(const label of irrationalLabels) {
				th = document.createElement("th");
				th.className = "tdf-num";
				th.innerText = label;
				tr.appendChild(th);
			}
			th = document.createElement("th");
			th.setAttribute("colspan", nAllColspan - tr.childElementCount);
			tr.appendChild(th);
		}
	}

	appendAlgebraicNumber(tr, format, num, asInput) {
		if(asInput) {
			format = "tdf";
		}
		const isInfinite = num.isInfinite == true ;
		switch(format) {
		case "alg":
			this.appendTdDiv(tr, format, num.alg, isInfinite);
			break;
		case "dec":
			this.appendTdDiv(tr, format, num.dec, isInfinite);
			break;
		case "tdf":
			this.appendTdfCells(tr, num.tdf, asInput, isInfinite);
			break;
		default:
			console.log("Unexpected format:", format);
			break;
		}
	}

	appendTdDiv(tr, className, text, isInfinite) {
		const td = tr.insertCell();
		td.className = className;
		td.innerHTML = "<div class='" + className + "'>" + text + "</div>";
		return td;
	}
	
	appendTdfCells(tr, tdf, asInput, isInfinite) {
		if(isInfinite || !Array.isArray(tdf)) {
			// may be overkill...
			// See https://stackoverflow.com/questions/4059147/check-if-a-variable-is-a-string-in-javascript
			const html = (typeof tdf === 'string' || tdf instanceof String) ? tdf : "&infin;";
			const td = this.appendTdDiv(tr, "infinite", html);
			const {order} = this.#store.getState();
			td.setAttribute("colspan", order + 3); // + 3 is for the two parens and the divisor
			return;
		}
		const order = tdf.length - 1;
		let td = tr.insertCell();
		td.className = "tdf-paren";
		td.innerHTML = "(";
		//
		let className = "tdf-num";
		for(let num = 0; num < order; num++) {
			if(asInput) {
				td = tr.insertCell();
				td.className = className;
				// TODO: may be unnecessary if the change event uses a closure
				td.setAttribute("data-col", num);
				td.innerHTML = "<input class='" + className + "' type='text' inputmode='numeric' pattern=' *-?[0-9]+ *' required value='" + tdf[num] + "'>";
				// See https://stackoverflow.com/questions/10320343/dont-make-functions-within-a-loop
				// we're safe here because for all event listeners, event.target is the "this" in the executing context;
				td.querySelector("input").addEventListener('change', 
				function (event) {
					event.target.setCustomValidity("");
					if(event.target.checkValidity()) {
						event.target.closest("div.calculator").parentNode.host.setOperand(
							event.target.closest("tr").getAttribute("data-row"), 
							event.target.closest("td").getAttribute("data-col"),
							event.target.value);
					} else {
						const msg = "Value must be an integer.";
						event.target.setCustomValidity(msg);
						console.log(msg, "'" + event.target.value + "'");
						event.target.reportValidity();
					}
				});
			} else {
				const term = tdf[num];
				// insert "+" before non-negative terms except the first
				const signum = (num > 0 && term >= 0) ? "&plus;" : "";
				this.appendTdDiv(tr, className, signum + term);
			}
		}
		//
		td = tr.insertCell();
		td.className = "tdf-paren";
		td.innerHTML = ")/";
		//
		className = "tdf-den";
		if(asInput) {
			td = tr.insertCell();
			td.className = className;
			td.innerHTML = "<input class='" + className + "' type='text' inputmode='numeric' pattern=' *-?0*[1-9][0-9]* *' required value='" + tdf[order] + "' min='1'>";
			// See https://stackoverflow.com/questions/10320343/dont-make-functions-within-a-loop
			// we're safe here because for all event listeners, event.target is the "this" in the executing context;
			td.querySelector("input").addEventListener('change', 
			function (event) {
				event.target.setCustomValidity("");
				if(event.target.checkValidity()) {
					event.target.closest("div.calculator").parentNode.host.setDivisor(
						event.target.closest("tr").getAttribute("data-row"), 
						event.target.value);
				} else {
					const msg = "Value must be a non-zero integer.";
					event.target.setCustomValidity(msg);
					console.log(msg, "'" + event.target.value + "'");
					event.target.reportValidity();
				}
			});
		} else {
			this.appendTdDiv(tr, className, tdf[order]);
		}
	}

	// TODO: Use Proxy to provide simpler array-like syntax in the event handlers such as 
	// host.operand[id, term] = event.target.value;
	// See https://stackoverflow.com/questions/2449182/getter-setter-on-javascript-array
	setOperand( id, term, value ) {
		this.#model.operands[id][term] = value;
	}

	setDivisor( id, value ) {
		this.#model.divisors[id] = value;
	}

	setExponent( id, value ) {
		this.#model.exponents[id] = value;
	}

	setOperator( value ) {
		this.#model.operator = value;
	}
	
	doAction( action, props ) {
		this.#model.doAction( action, props );
	}

	getOperationPickList(selection) {
		const selectList = document.createElement("select");
		selectList.className = "operator";
		const validOperations = this.#model.operations;
		VZomeCalculator.operationMap.forEach((label, value) => {
			if(validOperations.includes(value)) {
				const option = document.createElement("option");
				option.value = value;
				option.selected = (value == selection);
				option.label = VZomeCalculator.htmlDecode(label);
				option.title = value.replace("-", " ");
				selectList.appendChild(option);
			} else {
				console.log(value + " '" + label + "' operation is not supported.");
			}
		});
		// See https://stackoverflow.com/questions/10320343/dont-make-functions-within-a-loop
		// we're safe here because for all event listeners, event.target is the "this" in the executing context;
		selectList.addEventListener('change', function (event) {
			event.target.closest("div.calculator").parentNode.host.operator = event.target.value;
		});
		return selectList;
	}

	getActionPickList() {
		return `
<select class='menu'>
	<option selected label='&#x22EE;' value=''></option> <!-- vertical ellipsis -->
	<option label='C' title='clear operands' value='clear-operands'></option>
	<option label='&#x21F5;' title='swap operands' value='swap-operands'></option>
	<option label='?' title='info' value='info'></option>
</select>
`
	}

	static #unaryOperators = new Map([
		// The equal sign is a noop. It is located between unaryOperators and namedNumbers to visually seperate them
		[ "=",				"="		],
		[ "negate", 		"- #"	],
		[ "reciprocal",		"1 / #"	],
		[ "unit-exponent",	VZomeCalculator.htmlDecode( "&#x0023 &#x00B9") ], // superscript 1 as exponent
		[ "absolute-value",	VZomeCalculator.htmlDecode( "&#x23D0 &#x0023 &#x23D0" ) ],
		[ "ceiling",		VZomeCalculator.htmlDecode( "&#x2308 &#x0023 &#x2309" ) ],
		[ "floor",			VZomeCalculator.htmlDecode( "&#x230A &#x0023 &#x230B" ) ],
	]);
	// TODO: for each answer row, we'll have a similar action list 
	// including "copy to top operand" and "copy to bottom operand"
	// They may use the vertical ellipsis instead of the equal sign

	getRowPickList() {
		const { namedNumbers } = {... this.#store.getState()};
		const selectList = document.createElement("select");
		selectList.className = "menu";
		//
		for(const name in namedNumbers) {
			const option = document.createElement("option");
			option.value = name;
			option.label = name;
			option.title = "set value to " + name;
			option.setAttribute("data-action", "set-named-value");
			selectList.appendChild(option);
		}
		//
		VZomeCalculator.#unaryOperators.forEach((label, value) => {
			const option = document.createElement("option");
			option.value = value;
			option.label = label;
			if(value == "=") {
				option.selected = true;
			} else {
				option.title = value.replace("-", " ");
			}
			option.setAttribute("data-action", "unary-action");
			selectList.appendChild(option);
		});
		//
		selectList.addEventListener('change', function (event) {
			let name = event.target.value;
			if(name == "=") { 
				return; // noop
			}
			const pickList = event.target;
			const host = pickList.closest("div.calculator").parentNode.host;
			const action = pickList.selectedOptions[0].getAttribute("data-action");
			const id = pickList.closest("tr").getAttribute("data-row");
			host.doAction(action, {id, name});
		});
		return selectList;
	}

	static get observedAttributes() {
		return [ "field-name", "format", "operator" ];
	}

	attributeChangedCallback( attributeName, oldValue, newValue ) {
		if(this.#store) {
			switch (attributeName) {
			case "field-name":
				// The innerHTML doesn't get rendered while the table is loading unless we are at a breakpoint in the debugger
				// TODO: await a promise ???
				this.#container.innerHTML = "<div class='loading'>Loading " + newValue + "...</div>"; // with div wrapper
        this.#model.fieldName = newValue; // setter will trigger async init, render, evaluate
				return;
			case "operator":
				this.#store.dispatch( { type: 'operator-change', payload: newValue } );
				return;
			case "format":
				this.#store.dispatch( { type: 'format-change', payload: newValue } );
				return;
			default:
				console.dir({attributeName, oldValue, newValue });
				return;
			}
		} else {
			console.log("Attribute changed before #store was initialized:");
		}
		console.dir({attributeName, oldValue, newValue });
	}

	get fieldName() {
		return this.#model
		? this.#model.fieldName
		: (this.getAttribute("field-name") || "polygon5");
	}
	set fieldName(newValue) {
		this.#container.innerHTML = "Loading " + newValue + "..."; // no div wrapper
		this.setAttribute("field-name", newValue);
	}

	get format() {
		return this.#model
		? this.#model.format
		: (this.getAttribute("format") || "tdf");
	}
	set format(newValue) {
		this.setAttribute("format", newValue);
	}

	get operator() {
		return this.#model
		? this.#model.operator
		: (this.getAttribute("operator") || "multiply");
	}
	set operator(newValue) {
		this.setAttribute("operator", newValue);
	}

	get #store() {
		return this.#model == undefined ? null : this.#model.store;
	}

	// https://stackoverflow.com/questions/1912501/unescape-html-entities-in-javascript
	static htmlDecode(input) {
		return (new DOMParser().parseFromString(input, "text/html")).documentElement.textContent;
	}

	static operationMap = new Map([
		["add",              	VZomeCalculator.htmlDecode( "&plus;"  ) ],
		["subtract",         	VZomeCalculator.htmlDecode( "&minus;" ) ],
		["multiply",         	VZomeCalculator.htmlDecode( "&times;" ) ],
		["divide",           	VZomeCalculator.htmlDecode( "&div;"   ) ],
		["modulus",          	VZomeCalculator.htmlDecode( "&#xFF05;") ],
		["continued-fraction",	"///" ],
	]);

	// One or both of these ellipses may eventually be used by continuedFraction
	//static #HELLIPSIS = "&hellip;"; // horizontal
	//static #VELLIPSIS = "&#x22EE;"; // vertical
}

customElements.define( "vzome-calculator", VZomeCalculator );