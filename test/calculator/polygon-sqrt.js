import { initialize as vZomeLegacyIsReady } from "https://www.vzome.com/modules/vzome-legacy.js";

export class SqrtCalculator extends HTMLElement {
    #root;
    #container;

    constructor() {
        super();
        this.#root = this.attachShadow({ mode: "open" });
        //this.#root.appendChild( document.createElement("style") ).textContent = SqrtCalculatorCSS;
        this.#container = document.createElement("div");
        this.#container.className = "sqrtcalculator";
        this.#root.appendChild( this.#container );
    }

    connectedCallback() {
        this.initialize(18);
    }

    initialize( radicand ) {
        vZomeLegacyIsReady() .then( core => {
            const field = core .getField( "polygon" + (2*radicand) );
            if ( field.unknown ) {
                console .dir( field );
                return; // don't change anything
            }
            console.log(field.getName());
            this.showSqrt(radicand, field);
        });
    }

    showSqrt(radicand, field) {
        const fmt = 4; // MATHML
        let den = field.one(); // same as getUnitDiagonal(0);
        let num = field.getUnitDiagonal(1);
        // diags 0 and 1 are the initial values, 
        // so start the loop with diags 2 & 3
        const diagLimit = radicand - 1;
        let sFractions = 
            `<mo>(</mo>
                <mfrac>
                    <mrow>${num.toString(fmt)}</mrow>
                    <mrow>${den.toString(fmt)}</mrow>
                </mfrac>
            <mo>)</mo>`
        let sFactors = 
            `<mtr>
                <mtd>
                    <mo>=</mo>
                    <mo>(</mo>
                </mtd><mtd>
                    <mrow>${num.toString(fmt)}</mrow>
                </mtd><mtd>
                    <mo>)</mo>
                </mtd>
            </mtr>`
        for(let diag = 2; diag < diagLimit; diag += 2) {
            // Multiply all diags with even indices to get the denominator
            const d = field.getUnitDiagonal(diag);
            // Multiply all diags with odd  indices to get the numerator
            const n = field.getUnitDiagonal(diag+1);
            den = den.times(d);
            num = num.times(n);
            sFractions += 
                `<mo>(</mo>
                    <mfrac>
                        <mrow>${n.toString(fmt)}</mrow>
                        <mrow>${d.toString(fmt)}</mrow>
                    </mfrac>
                <mo>)</mo>`
            sFactors += 
                `<mtr>
                    <mtd>
                        <mo>&times;</mo>
                        <mo>(</mo>
                    </mtd><mtd>
                        <mrow>${n.dividedBy(d).toString(fmt)}</mrow>
                    </mtd><mtd>
                        <mo>)</mo>
                    </mtd>
                </mtr>`
        }
        const result = num.dividedBy(den);
        let sRes = result.toString(fmt);
        const r = result.evaluate();
        this.#container.innerHTML = 
            `<math display="block">
                <mtext>Derive &nbsp;</mtext>
                <msqrt><mtext>${radicand}</mtext></msqrt>
                <mtext>
                    &nbsp; from the ${field.order-1} shortest diagonals 
                    of a regular ${(2*radicand)}-gon 
                    having an edge length of 1.
                </mtext>
            </math>
            <hr>
            <math display="block">
                <mrow>${sFractions}</mrow>
            </math>
            <br>
            <math display="block">
                <mtable>${sFactors}</mtable>
            </math>
            <br>
            <math display="block">
                <mrow>
                    <mo>=</mo>
                    <mn>${sRes}</mn>
                </mrow>
            </math>
            <br>
            <math display="block">
                <mrow>
                    <mo>=</mo>
                    <mn>${r}</mn>
                </mrow>
            </math>
            <br>
            <math display="block">
                <mrow>
                    <mo>=</mo>
                    <msqrt><mn>${radicand}</mn></msqrt>
                </mrow>
            </math>
            <hr>`
    }
}

customElements.define( "sqrt-calculator", SqrtCalculator );
