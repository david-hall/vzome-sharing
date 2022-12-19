export const vZomeCalculatorCSS = `
table, th, td {
  //border: 1px solid black;
  border-collapse: collapse;
  padding-left: 5px;
  padding-right: 5px;
}

/* See https://www.w3schools.com/howto/howto_css_hide_arrow_number.asp to remove Arrows/Spinners from numeric inputs */

input[type=number] {
  width: 40px;
}

#pickMathOp {
  /* hide the down arrow of the pick list */
  appearance: none;
  border: 0px solid black;
  padding-left: 5px;
  padding-right: 5px;
  text-align: center;
}

.tdf-num {
}

.tdf-den {
}

.tdf-exp {
}

.error {
	color: red;
}
`;
