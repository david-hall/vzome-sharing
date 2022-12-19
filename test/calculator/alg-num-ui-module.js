export class AlgNumUIElement extends HTMLElement {
	root;
	container;
	values;

	constructor() {
		super();
		this.root = this.attachShadow({ mode: "open" });
		// TODO: this.#style = ...
		this.container = document.createElement("div");
		this.container.className = "container";
		this.root.appendChild( this.container );
	}

	connectedCallback() {
		/* console.log("connected"); */
		this.render();
	}
	
	appendDiv(className, innerHTML, parentElement) {
		const parent = parentElement || this.container;
		const div = document.createElement("div");
		div.className = className;
		div.innerHTML = innerHTML;
		return parent.appendChild(div);
	}
	
	render() {
		this.container.innerHTML = "";
		if(!this.values) {
			this.container.innerHTML = "<B>No values are defined</B>";
			return;
		}
		console.log("render: ", this.values);
		const {alg, dec, tdf, infinite, readonly} = {... this.values};
		const INFINITY = '∞'; // &infin';
		const lastTdf = tdf.length - 1;
		
		this.appendDiv("TODO", "AlgNumUIElement-TODO: arrange terms and denom as fraction with CSS & a media query.");
		
		this.appendDiv("alg", infinite ? INFINITY : alg);
		this.appendDiv("dec", infinite ? INFINITY : dec);
		
		const tdfDiv = document.createElement("div");
		tdfDiv.className = 'tdf';
		this.container.appendChild(tdfDiv);
		//if(!infinite) { // numerators could be skipped when infinite
			for(let num = 0; num < tdf.length-1; num++) {
				if(readonly) {
					const term = tdf[num];
					// insert "+" before non-negative terms except the first
					const signum = (num > 0 && term >= 0) ? "&plus;" : "";
					this.appendDiv("num", signum + term, tdfDiv);
				} else {
					// TODO: may be unnecessary if the change event uses a closure
					const div = this.appendDiv("num", 
						"<input class='tdf num' type='text' placeholder='?' inputmode='numeric' required pattern='^ *-?[0-9]+ *$' value='" + tdf[num] + "'>",
						tdfDiv);
					div.setAttribute("data-term", num);
					// See https://stackoverflow.com/questions/10320343/dont-make-functions-within-a-loop
					// we're safe here because for all event listeners, event.srcElement is the "this" in the executing context;
					div.querySelector("input").addEventListener('change', 
					function (event) {
						event.srcElement.setCustomValidity("");
						if(event.srcElement.checkValidity()) {
							console.log("TODO: fire a change event");
						/* 	event.srcElement.closest("div.calculator").parentNode.host.setOperand(
								event.srcElement.closest("tr").getAttribute("data-row"), 
								event.srcElement.closest("td").getAttribute("data-term"),
								event.target.value); */
						} else {
							const msg = "Value must be an integer.";
							event.srcElement.setCustomValidity(msg);
							console.log(msg, "'" + event.target.value + "'");
							event.srcElement.reportValidity();
						}
					});
				}
			}
		//}
		
		const den = tdf[lastTdf];
		if(readonly) {
			this.appendDiv("den", infinite ? INFINITY : den, tdfDiv);
		} else {
			// TODO: may be unnecessary if the change event uses a closure
			const div = this.appendDiv("den", 
				"<input class='tdf den' type='text' placeholder='?' inputmode='numeric' required pattern='^ *0*[1-9]{1}[0-9]* *$' value='" + den + "' min='1'>",
				tdfDiv);
			div.setAttribute("data-term", lastTdf);
			div.querySelector("input").addEventListener('change', 
			function (event) {
				event.srcElement.setCustomValidity("");
				if(event.srcElement.checkValidity()) {
					console.log("TODO: fire a change event");
					/* 	event.srcElement.closest("div.calculator").parentNode.host.setOperand(
							event.srcElement.closest("tr").getAttribute("data-row"), 
							event.srcElement.closest("td").getAttribute("data-term"),
							event.target.value); */
				} else {
					const msg = "Value must be a non-zero integer.";
					event.srcElement.setCustomValidity(msg);
					console.log(msg, "'" + event.target.value + "'");
					event.srcElement.reportValidity();
				}
			});
		}
	}

	get values() {
		return this.values;
	}
	set values(newValues) {
		console.log("newValues: ", newValues);
		// extract only the new value properties that we will use;
		let {alg, dec, tdf, infinite, readonly} = {... newValues};
		// TODO: validate all of the new values
		if(!Array.isArray(tdf) || tdf.length < 3) {
			throw new Error("tdf must be an integer array with at least three elements.");
		}
		for(const num of tdf) {
			const test = parseInt(num);
			// don't overwrite and mutate the original
			if(isNaN(test)) {
				throw new Error("tdf elements must be integers. '" + num + "' is invalid." );
			}
		}
		infinite = (!!infinite) || (tdf[tdf.length-1] == 0); // force infinite to boolean and check for zero denominator
		readonly = !!readonly; // force readonly to boolean
		const cleanValues = {alg, dec, tdf, infinite, readonly};
		console.log("Setting values to ", cleanValues);
		this.values = cleanValues;
	}
}

customElements.define( "alg-num-ui", AlgNumUIElement );
//module.exports = AlgNumUIElement;
export default AlgNumUIElement;
