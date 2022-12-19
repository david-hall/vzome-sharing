import { vZomeCalculatorCSS } from "./vzome-calculator.css.js";
import { getField } from "https://www.vzome.com/modules/vzome-legacy.js";

export class VZomeCalculator extends HTMLElement {
  #root;
  #container;

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: "open" });
    this.#root.appendChild( document.createElement("style") ).textContent = vZomeCalculatorCSS;
    this.#container = document.createElement("div");
    this.#root.appendChild( this.#container );
  }

  connectedCallback() {
	if(this.fieldName != null) {
		this._updateRendering();
	} else {
		this.logError("No initial field-name was set for calculator#" + this.id);
	}
  }
  
  _updateRendering() {
	const fieldName = this.fieldName;
  	this.#container.innerHTML = "Loading " + fieldName + "...";
	// TODO: this.#container.refresh() ???
	// TODO: this.#container.cursor = waitcursor
    const field = getField( fieldName );
	// TODO: this.#container.cursor = defaultcursor
	if(field.unknown) {
		this.logError("Unknown field-name '" + field.name + "'");
		return;
	}
	this.#container.innerHTML = ""; // clear out any previous content
	const table = document.createElement("table");
	table.className = "calculator";
	this.#container.appendChild(table);
	
	const rowH = table.createTHead().insertRow(); // header row
	const hdrClassName = "algNumParts"; // TODO: should this be applied to the row or each th element?
	const tbody = table.createTBody(); // body
	const row1 = tbody.insertRow();
	const row2 = tbody.insertRow();
	const rowQ = tbody.insertRow(); // to be filled with a horizontal bar after we know the total colSpan
	const rowA = tbody.insertRow();

	let th = document.createElement("th");
	th.innerHTML = fieldName;
	th.className= hdrClassName
	th.setAttribute("colSpan", "2"); // spans the first 2 header columns
	rowH.appendChild(th);
	row1.insertCell().innerHTML = "";
	row2.insertCell().innerHTML = this.getOpsPickList();
	// TODO: add change event listener for mathOpOnChange() 
	rowA.insertCell().innerHTML = "";

	// make colSpan= on the prior th and then skip this part
	//th = document.createElement("th");
	//th.innerHTML = "";
	//th.className= hdrClassName
	//rowH.appendChild(th);
	row1.insertCell().innerHTML = "((";
	row2.insertCell().innerHTML = "((";
	rowA.insertCell().innerHTML = "&nbsp;(";

	for(let i=0; i < field.getOrder(); i++) {
		th = document.createElement("th");
		th.innerHTML = field.getIrrational(i); // TODO: this is not implemented in legacy js fields
		th.className= hdrClassName
		rowH.appendChild(th);
		row1.insertCell().innerHTML = "<input type='number' class='tdf-num' id='op1-term-" + i + "'>";
		row2.insertCell().innerHTML = "<input type='number' class='tdf-num' id='op2-term-" + i + "'>";
		rowA.insertCell().innerHTML = "";
	}

	th = document.createElement("th");
	th.innerHTML = "";
	th.className= hdrClassName
	rowH.appendChild(th);
	row1.insertCell().innerHTML = ") /";
	row2.insertCell().innerHTML = ") /";
	rowA.insertCell().innerHTML = ") /";
	
	th = document.createElement("th");
	th.innerHTML = "";
	th.className= hdrClassName
	rowH.appendChild(th);
	row1.insertCell().innerHTML = "<input type='number' class='tdf-den' id='op1-denominator' min='1' value='1'>";
	row2.insertCell().innerHTML = "<input type='number' class='tdf-den' id='op2-denominator' min='1' value='1'>";
	rowA.insertCell().innerHTML = "";

	th = document.createElement("th");
	th.innerHTML = "";
	th.className= hdrClassName
	rowH.appendChild(th);
	row1.insertCell().innerHTML = ")";
	row2.insertCell().innerHTML = ")";
	rowA.insertCell().innerHTML = "";

	th = document.createElement("th");
	th.innerHTML = "";
	th.className= hdrClassName
	rowH.appendChild(th);
	row1.insertCell().innerHTML = "<input type='number' class='tdf-exp' id='op1-exponent' step='1' value='1'>";
	row2.insertCell().innerHTML = "<input type='number' class='tdf-exp' id='op2-exponent' step='1' value='1'>";
	rowA.insertCell().innerHTML = "";

	th = document.createElement("th");
	th.innerHTML = "";
	th.className= hdrClassName
	rowH.appendChild(th);
	// TODO: make these equal signs into buttons that solve their corresponding row
	row1.insertCell().innerHTML = "="; // TODO: add a click, focus or context menu with named values and simple math ops
	row2.insertCell().innerHTML = "="; // TODO: add a click, focus or context menu with named values and simple math ops
	rowA.insertCell().innerHTML = "="; // TODO: add a click, focus or context menu with copyTo(op1) and copyTo(op2) as actions

	th = document.createElement("th");
	th.innerHTML = "value";
	th.className= hdrClassName
	rowH.appendChild(th);
	row1.insertCell().innerHTML = "";
	row2.insertCell().innerHTML = "";
	rowA.insertCell().innerHTML = "";

	const td = rowQ.insertCell();
	td.setAttribute("colSpan", rowA.childElementCount);
	td.innerHTML = "<hr />";
  }

  refreshFormat() {
	  console.log("TODO: refresh format: " + this.format);
  }
  
  mathOpOnChange() {
	  console.log("argh!");
  }

  getOpsPickList() {
	// &nbsp; padding is needed because we can't reliably control the centering and margins of option elements with pure css
	// the optgroup affects the layout as well
	return `
	  <select id='pickMathOp' onchange='console.dir(this.options[this.selectedIndex].value)'>
	   <optgroup label="action">
		<option value='add'              >&nbsp;&plus;&nbsp;</option>
		<option value='subtract'         >&nbsp;&minus;&nbsp;</option>
		<option value='multiply' selected>&nbsp;&times;&nbsp;</option>
		<option value='divide'           >&nbsp;&div;&nbsp;</option>
		<!-- // need to define modulus operator such that it's always a non-negative integer
		<option value='modulus'          >&nbsp;&#xFF05;&nbsp;</option> 
		<option value='repeated-fraction'>&nbsp;././...&nbsp;</option>
		-->
	   </optgroup>
	  </select>
`;
  }

  logError(msg){
	console.log(msg);
	this.#container.innerHTML = "<div class='error'>" + msg + "</div>";
  }

  static get observedAttributes() {
    return [ "field-name", "format", "operator" ];
  }

  attributeChangedCallback( attributeName, _oldValue, _newValue ) {
	if(_oldValue == _newValue) {
	  return;
	}
    switch (attributeName) {
    case "field-name":
      this._updateRendering();
	  break;
    case "format":
      this.refreshFormat();
	  break;
    default:
	  console.dir({attributeName, _oldValue, _newValue });
      break;
    }
  }

  set fieldName(newFieldName) {
    if (newFieldName === null) {
      this.removeAttribute("field-name");
    } else {
      this.setAttribute("field-name", newFieldName);
    }
  }

  get fieldName() {
    return this.getAttribute("field-name");
  }

  set format(newFormat) {
	switch(newFormat) {
		case "alg":
		case "dec":
		case "tdf":
		this.setAttribute("format", newFormat);
		break;
	default:
		logError("ignoring unknown format: " + newFormat);
		break;
	}
  }

  get format() {
    const format = this.getAttribute("format");
	switch(format) {
		case "alg":
		case "dec":
		case "tdf":
		return format;
	default:
		logError("substituting 'tdf' for unknown format: " + format);
		return "tdf";
	}
  }

  set operator(newOperator) {
	switch(newOperator) {
		case "add":
		case "subtract":
		case "multiply":
		case "divide":
		//case "modulus":
		//case "repeated-fraction":
		this.setAttribute("operator", newOperator);
		break;
	default:
		logError("ignoring unknown operator: " + newOperator);
		break;
	}
  }

  get operator() {
	  // Seems like I should be using this.#container or this.shadowRoot
	  // instead of document.getElementById("pickMathOp")
	  // to allow multiple calculators to coexist in the same DOM without globally unique ids conflicting
	  // TODO: this isn't working... pick is always null
	let pick = this.shadowRoot.getElementById("pickMathOp");
	console.dir(pick);
	pick = document.getElementById("pickMathOp");
	console.dir(pick);
	if(pick) {
	const value = pick.options[pick.selectedIndex].value;
	return value;
	}
	return null;
  }
}

customElements.define( "vzome-calculator", VZomeCalculator );
