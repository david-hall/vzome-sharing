import { AlgNumUIElement } from "./alg-num-ui-module.js";

export class AlgExponentUIElement extends AlgNumUIElement {
	constructor() {
		super();
	}

	render() {
		super.render();
		return;
		this.container.innerHTML = "";
		if(!this.values) {
			this.container.innerHTML = "<B>No values are defined</B>";
			return;
		}
		console.log("render: ", this.values);
		return;
		
		
		const {alg, dec, tdf, infinite, readonly} = {... this.values};
		const INFINITY = '∞'; // &infin';
		const lastTdf = tdf.length - 1;
		
		super.appendDiv("TODO", "AlgExponentUI-TODO: arrange terms and denom as fraction with CSS & a media query.");
		
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

// override base class setter and getter
	get values() {
		const values = {... this.values, ... super.values};
		return this.values;
	}
	set values(newValues) {
		super.values = newValues;
		console.log("newValues: ", newValues);
		// extract only the new value properties that we will use;
		let {exponent} = {... newValues};
		// TODO: validate all of the new values
		if(isNaN(exponent)) {
			throw new Error("exponent must be an integer. '" + exponent + "' is invalid." );
		}
		const cleanValues = {exponent};
		console.log("Setting values to ", cleanValues);
		this.values = cleanValues;
	}
}

customElements.define( "alg-exponent-ui", AlgExponentUIElement);//, { extends: 'alg-num-ui' } );