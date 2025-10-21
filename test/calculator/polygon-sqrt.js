import { initialize as vZomeLegacyIsReady } from "https://www.vzome.com/modules/vzome-legacy.js";

const MATHML=4;
export class SqrtCalculator extends HTMLElement {
    #root;
    #container;
    #radicand;
    
    constructor() {
        super();
        this.#radicand = 2;
        this.#root = this.attachShadow({ mode: "open" });
        //this.#root.appendChild( document.createElement("style") ).textContent = SqrtCalculatorCSS;
        this.#container = document.createElement("div");
        this.#container.className = "sqrtcalculator";
        this.#root.appendChild( this.#container );
    }

    connectedCallback() {
        this.initialize();
    }

    initialize() {
        vZomeLegacyIsReady() .then( core => {
            const field = core .getField( "polygon" + (2 * this.radicand) );
            if(field.unknown) {
                console .dir( field );
                return; // don't change anything
            }
            // TODO: Can we cache core in a local variable when vZomeLegacyIsReady 
            // is first called and avoid subsequent async calls to vZomeLegacyIsReady
            // whenever we want a new field?
            this.showSqrt(field);
        });
    }

    showSqrt(field) {
        const lhs = `<msqrt><mn>${this.radicand}</mn></msqrt><mo>=</mo>`; // lhs = lefthand side (of equation)
        let den = field.one(); // same as getUnitDiagonal(0);
        let num = field.getUnitDiagonal(1);
        // diags 0 and 1 are the initial values, 
        // so start the loop with diags 2 & 3
        const diagLimit = this.radicand - 1;
        let sNums = 
            `<mo>(</mo>
                <mrow>${num.toString(MATHML)}</mrow>
            <mo>)</mo>`
        let sDens = 
            `<mo>(</mo>
                <mrow>${den.toString(MATHML)}</mrow>
            <mo>)</mo>`
        let sFractions = 
            `<mo>(</mo>
                <mfrac>
                    <mrow>${num.toString(MATHML)}</mrow>
                    <mrow>${den.toString(MATHML)}</mrow>
                </mfrac>
            <mo>)</mo>`
        for(let diag = 2; diag < diagLimit; diag += 2) {
            // Multiply all diags with even indices to get the denominator
            const d = field.getUnitDiagonal(diag);
            // Multiply all diags with odd  indices to get the numerator
            const n = field.getUnitDiagonal(diag+1);
            den = den.times(d);
            num = num.times(n);
            sNums += 
                `<mo>&InvisibleTimes;</mo>
                <mo>(</mo>
                    <mrow>${n.toString(MATHML)}</mrow>
                <mo>)</mo>`
            sDens += 
                `<mo>&InvisibleTimes;</mo>
                <mo>(</mo>
                    <mrow>${d.toString(MATHML)}</mrow>
                <mo>)</mo>`
            sFractions += 
                `<mo>&InvisibleTimes;</mo>
                <mo>(</mo>
                    <mfrac>
                        <mrow>${n.toString(MATHML)}</mrow>
                        <mrow>${d.toString(MATHML)}</mrow>
                    </mfrac>
                <mo>)</mo>`
        }
        const result = num.dividedBy(den);
        const sRes = result.toString(MATHML);
        this.#container.innerHTML = 
            `<math display="block">
                <mtext>To solve for&nbsp;</mtext>
                <msqrt><mn>${this.radicand}</mn></msqrt>
                <mtext>
                    , use the ${field.order-1} shortest diagonals 
                    of a regular ${(2*this.radicand)}-gon 
                    having an edge length of 1.
                </mtext>
            </math>

            <hr>
            <math display="block">
                ${lhs}
                <mrow>${sFractions}</mrow>
            </math>

            <br>
            <math display="block">
                ${lhs}
                <mfrac>
                    <mrow>${sNums}</mrow>
                    <mrow>${sDens}</mrow>
                </mfrac>
            </math>
            
            <br>
            <math display="block">
                ${lhs}
                <mfrac>
                    <mrow>${num.toString(MATHML)}</mrow>
                    <mrow>${den.toString(MATHML)}</mrow>
                </mfrac>
            </math>

            <br>
            <math display="block" class="solution">
                ${lhs}
                <mrow>
                    <mn>${sRes}</mn>
                </mrow>
            </math>

            <br>
            <math display="block">
                <mtext>Verify the results by squaring the fractional representation from the prior step:</mtext>
            </math>

            <br>
            <math display="block">
                <msup>
                    <msqrt>
                        <mn>${this.radicand}</mn>
                    </msqrt>
                    <mn>2</mn>
                </msup>
                <mo>=</mo>
                <msup>
                    <mrow>
                        <mo>(</mo>
                        <mfrac>
                            <mrow>${num.toString(MATHML)}</mrow>
                            <mrow>${den.toString(MATHML)}</mrow>
                        </mfrac>
                        <mo>)</mo>
                    </mrow>
                    <mn>2</mn>
                </msup>
            </math>

            <br>
            <math display="block">
                <mn>${this.radicand}</mn>
                <mo>=</mo>
                <mrow>
                    <mfrac>
                        <msup>
                            <mrow>
                                <mo>(</mo>
                                <mrow>${num.toString(MATHML)}</mrow>
                                <mo>)</mo>
                            </mrow>
                            <mn>2</mn>
                        </msup>
                        <msup>
                            <mrow>
                                <mo>(</mo>
                                <mrow>${den.toString(MATHML)}</mrow>s
                                <mo>)</mo>
                            </mrow>
                            <mn>2</mn>
                        </msup>
                    </mfrac>
                <mrow>
            </math>

            <br>
            <math display="block">
                <mi>R</mi>
                <mo>=</mo>
                <mrow>
                    <mfrac>
                        <mrow>${num.times(num).toString(MATHML)}</mrow>
                        <mrow>${den.times(den).toString(MATHML)}</mrow>
                    </mfrac>
                </mrow>
            </math>

            <br>
            <math display="block">
                <mtext>Note that the numerator is R times the denominator:</mtext>
            </math>

            <br>
            <math display="block">
                <mi>R</mi>
                <mo>=</mo>
                <mfrac>
                    <mrow>
                        <mn>${this.radicand}</mn>
                        <mn>&InvisibleTimes;</mn>
                        <mo>(</mo>
                        ${num.times(num)
                            .dividedBy(field.createRational(this.radicand))
                            .toString(MATHML)
                        }
                        <mo>)</mo>
                    </mrow>
                    <mrow>
                        <mn>1</mn>
                        <mn>&InvisibleTimes;</mn>
                        <mo>(</mo>
                        ${den.times(den).toString(MATHML)}
                        <mo>)</mo>
                    </mrow>
                </mfrac>
            </math>

            <br>
            <math display="block">
                <mtext>Cancel like terms leaving the original radicand:</mtext>
            </math>

            <br>
            <math display="block">
                <mi>R</mi>
                <mo>=</mo>
                <mfrac>
                    <mrow>
                        <mn>${this.radicand}</mn>
                        <mn>&InvisibleTimes;</mn>
                        <mstyle style="text-decoration: line-through;">
                        <mo>(</mo>
                        ${num.times(num)
                            .dividedBy(field.createRational(this.radicand))
                            .toString(MATHML)
                        }
                        <mo>)</mo>
                        </mstyle>
                    </mrow>
                    <mrow>
                        <mn>1</mn>
                        <mn>&InvisibleTimes;</mn>
                        <mstyle style="text-decoration: line-through;">
                            <mo>(</mo>
                            ${den.times(den).toString(MATHML)}
                            <mo>)</mo>
                        </mstyle>
                    </mrow>
                </mfrac>
            </math>
            
            <br>
            <math display="block">
                <mrow>
                    <mi>R</mi>
                    <mo>=</mo>
                    <mn>${this.radicand}</mn>
                </mrow>
            </math>

           <br>
            <math display="block">
                <mtext>QED!</mtext>
            </math>


            <hr>
            <h3 class="footnote">Named diagonals of the ${this.radicand * 2}-gon</h3>
            <math display="block">
                ${this.showDiagonalsList(field)} <!-- -->
            </math>

            <br>
            <div display="block" class="footnote">
                *&nbsp;The scalar &mu; produces a unit edge length.
                Since each of the diagonals are scaled by this same amount, 
                it has no effect on the algebra which depends only on 
                the ratios of edge lengths, rather than any absolute lengths.
                Therefore the algebra holds true for polygons of any scale. 
                Scaling the edge to a length of 1 makes it possible 
                to adjoin the scaled polygons' edge lengths 
                to the set of rationals (&Qopf;) to generate the polygon fields.
            </div>
            
<style>
.footnote {
    padding-left: 25%;
    padding-right: 25%;
}
</style>
            `;

        // The SVG code is not complete yet.
        //this.showSvgDiagram(field)
    }

    showSvgDiagram(field) {
        const xmlns = 'http://www.w3.org/2000/svg';
        const svgGroup = document.getElementById("svgGroup");
        svgGroup.innerHTML = "";
        const svg = svgGroup.closest("svg");
        // TODO: svg.onresize = rescale without redrawing ???
        const width = svg.getBoundingClientRect().width;
        const ctr = width / 2;
        const scale = ctr * 0.90;
        const transform = "translate(" + ctr + " " + ctr + ")	scale(" + scale + " " + -scale + ")";
        // no embedding because fields are all EVEN-gons
        svgGroup.setAttribute("transform", transform);

        const axisStrokeWidth = 0.015; // TODO: Move to CSS
        const axisLength = 1.2;
        const xAxis = document.createElementNS(xmlns, 'line');
        xAxis.setAttribute('x1', axisLength);
        xAxis.setAttribute('y1', 0);
        xAxis.setAttribute('x2', -axisLength);
        xAxis.setAttribute('y2', 0);
        xAxis.setAttribute('stroke', 'red'); // TODO: Move to CSS
        xAxis.setAttribute('stroke-width', axisStrokeWidth); // TODO: Move to CSS
        svgGroup.appendChild(xAxis);
        
        const yAxis = document.createElementNS(xmlns, 'line');
        yAxis.setAttribute('x1', 0);
        yAxis.setAttribute('y1', axisLength);
        yAxis.setAttribute('x2', 0);
        yAxis.setAttribute('y2', -axisLength);
        yAxis.setAttribute('stroke', 'darkgreen'); // TODO: Move to CSS
        yAxis.setAttribute('stroke-width', axisStrokeWidth); // TODO: Move to CSS
        svgGroup.appendChild(yAxis);

        const originDot = document.createElementNS(xmlns, 'circle');
        originDot.setAttribute('r', axisStrokeWidth);
        originDot.setAttribute('fill', 'black'); // TODO: Move to CSS
        svgGroup.appendChild(originDot);

        const order = field.order;
        //const diagonalCount = field.diagonalCount();
        let delim = "";
        let pts = "";
        //let parity = true;
        const theta = Math.PI / this.radicand;
        const limit = this.radicand * 2;
        for(let diag = 0; diag <= limit; diag++) {
            const angle = diag * theta;
            //if(parity) {
                const x = Math.cos(angle);
                const y = Math.sin(angle);
                pts += (delim + x + "," + y);
                delim = " ";
                // if(!(x == 1 && y == 0)) {
                //     if(y >= 0) {
                //         // use createElementNS instead of createElement
                //         // to allow the diagonals to be drawn first but not obscured
                //         // by the polygon which is rendered later
                //         const line = document.createElementNS(xmlns, 'line');
                //         line.setAttribute('x1', '1');
                //         line.setAttribute('y1', '0');
                //         line.setAttribute('x2', x);
                //         line.setAttribute('y2', y);
                //         const independent = ((1/2)-1) < order;
                //         // TODO: Move to CSS
                //         const stroke = independent ? "rgb(0, 118, 149)" : "orange";
                //         line.setAttribute('stroke', stroke); // TODO: Move to CSS
                //         svgGroup.appendChild(line);
                //     }
                // }
            //}
            //parity = !parity;
        }
        if(pts != "") {
            // use createElementNS instead of createElement so things render as desired
            const polygon = document.createElementNS(xmlns, 'polygon');
            polygon.setAttribute('points', pts);
            svgGroup.appendChild(polygon);
        }

        // console.log( `TODO: Show an SVG image of the polygon diagonals
        // similar to the one on the math table web page
        // but arrange the odd and even numbered diagonals
        // perpendicular to one another with corresponding names as dimensions.
        // Note that the 4N-gons will have one axis parallel to an edge and
        // the other parallel or perpendicular to a long diagonal (aka a diameter)
        // whereas the (4N+2)-gons will have 2 orthogonal axes.`);
    }

    showDiagonalsList(field) {
        const nSides = field.polygonSides();
        let list = 
            `<mtable>
            <!--
                <mtr>
                    <mtd>
                        <msqrt><mi>R</mi></msqrt>
                    </mtd><mtd>
                        <mo>=</mo>
                    </mtd><mtd>
                        <msqrt><mn>${this.radicand}</mn></msqrt>
                    </mtd><mtd>
                    </mtd><mtd>
                    </mtd><mtd>
                        <mo>=</mo>
                    </mtd><mtd>
                        <mn>${Math.sqrt(this.radicand)}</mn>
                    </mtd>
                </mtr>
            -->
                <mtr>
                    <mtd>
                        <mi>edge</mi>
                    </mtd><mtd>
                        <mo>=</mo>
                    </mtd><mtd>
                        <mn>1</mn>
                    </mtd><mtd>
                        <mo>=</mo>
                    </mtd><mtd>
                        <mi>&mu;</mi>
                        <mo>&times;</mo>
                        <mi>s</mi>
                        <mi>i</mi>
                        <mi>n</mi>
                        <mo>(</mo>
                        <mfrac>
                            <mrow><mn>1</mn><mi>π</mi></mrow>
                            <mn>${nSides}</mn>
                        </mfrac>
                        <mo>)</mo>
                    </mtd><mtd>
                        <mo>=</mo>
                    </mtd><mtd>
                        <mn>1.0000000000000000</mn>
                    </mtd>
                </mtr>
                `;
        for(let diag = 1; diag < field.diagonalCount(); diag ++) {
            const d = field.getUnitDiagonal(diag);
            list += 
                `<mtr>
                    <mtd>
                        <mi>diag</mi>&nbsp;<mi>${diag}</mi>
                    </mtd><mtd>
                        <mo>=</mo>
                    </mtd><mtd>
                        <mrow>${d.toString(MATHML)}</mrow>
                    </mtd><mtd>
                        <mo>=</mo>
                    </mtd><mtd>
                        <mi>&mu;</mi>
                        <mo>&times;</mo>
                        <mi>s</mi>
                        <mi>i</mi>
                        <mi>n</mi>
                        <mo>(</mo>
                        <mfrac>
                            <mrow><mn>${diag+1}</mn><mi>π</mi></mrow>
                            <mn>${nSides}</mn>
                        </mfrac>
                        <mo>)</mo>
                    </mtd><mtd>
                        <mo>=</mo>
                    </mtd><mtd>
                        <mn>${d.evaluate()}</mn>
                    </mtd>
                </mtr>
            `;
        }
        list += `<mtr>
                    <mtd>
                        <mo>*</mo>
                        <mtext>scalar</mtext>
                    </mtd><mtd>
                        <mo>=</mo>
                    </mtd><mtd>
                        <mi>&mu;</mi>
                    </mtd><mtd>
                        <mo>=</mo>
                    </mtd><mtd>
                        <mrow>
                            <mn>1</mn>
                            <mo>/</mo>
                            <mrow>
                                <mi>s</mi>
                                <mi>i</mi>
                                <mi>n</mi>
                                <mo>(</mo>
                                <mfrac>
                                    <mi>π</mi>
                                    <mn>${nSides}</mn>
                                </mfrac>
                                <mo>)</mo>
                            </mrow>
                        </mrow>
                    </mtd><mtd>
                        <mo>=</mo>
                    </mtd><mtd>
                        <mn>${Math.sin(Math.PI/nSides)}</mn>
                    </mtd>
                </mtr>
            </mtable>`;
        return list;
    }

    // Called when HTML attributes are initialized or changed
    // which is different from directly calling corresponding setters on this object
	attributeChangedCallback( attributeName, oldValue, newValue ) {
        console.dir({attributeName, oldValue, newValue });
        switch (attributeName) {
        case "radicand":
            // call the setter so all validation is in one place.
            this.radicand = newValue;
            break;
        default:
            console.dir({attributeName, oldValue, newValue });
        }
	}

    get radicand() {
		return this.#radicand;
	}
	set radicand(newValue) {
        if(newValue>=2 && newValue<=40) {
            if(this.#radicand != newValue) {
    		    this.#radicand = newValue;
                this.initialize();
            }
        } else {
            console.log(`radicand ${newValue} is out of range.`);
        }
	}

    static get observedAttributes() {
        // Initial priority is 
        // 1) URL queryString 
        // 2) HTML attribute 
        // 3) default value = 2
		return [ "radicand" ];
	}
}

customElements.define( "sqrt-calculator", SqrtCalculator );
