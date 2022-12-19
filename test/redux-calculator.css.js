export const reduxCalculatorCSS = `
body {
  padding-left: 5%;
  padding-right: 5%;
  text-align: center;
}

table, 
th, 
td {
  /*border: 1px solid lightblue;*/
  border-collapse: collapse;
}

tr.answer td {
	padding-top: 1.5%;
	padding-bottom: 1.5%;
}

td.equals {
	padding-left: 15px;
	padding-right: 15px;
}

th.tdf-num,
td.tdf-num,
td.tdf-den {
	text-align: right;
}

/* 
Draw the equals bar above the whole first answer line
and above non-empty cells in subsequent answer rows (e.g. modulus of continuedFraction operators)
*/
tfoot tr:first-child td,
tr.answer > td:not(:empty) {
	border-top: 2px solid black;
}

/* See https://www.w3schools.com/howto/howto_css_hide_arrow_number.asp to remove Arrows/Spinners from numeric inputs */

div.tdf-num,
input {
  font-size: 1em;
  text-align: right;
  width: 100px;
}

.menu {
  text-align: left;
}
.menu:hover {
//	border: 1px solid gray;
	padding-left: 3px;
	padding-right: 5px;

}

.operator {
  text-align: center;
}

.menu,
.operator {
  /* hide the down arrow of the pick lists */
  appearance: none;
  border: 0px solid black;
  font-size: 1em;
  padding-left: 5px;
  padding-right: 3px;
  width: 50px;
}

/* TODO: this was set up for input[type=number]. 
	Make a new one for input[type=text]. 
	Probably won't need this one any more but we'll see...
*/
input.exponent {
  appearance: none;
  border: 0px solid black;
  font-size: 0.5em;
  vertical-align: top;
  width: 25px;
}

input:invalid {
	border: red solid 3px;
}

.tdf-num {
}

.tdf-den {
}

.infinite {
	background-color: lightcyan;
}

.exponent {
}

.algebraic {
}

.decimal {
}

.error {
	color: red;
}

.inline {
  display: inline;
}
.inline-block {
  display: inline-block;
}
`;