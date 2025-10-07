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
        vZomeLegacyIsReady()
            .then( core => {
                const field = core .getField( "polygon" + (2*radicand) );
                if ( field.unknown ) {
                    console .dir( field );
                    return; // don't change anything
                }
                console.log(field.getName());
                let den = field.one(); // same as getUnitDiagonal(0);
                let num = field.getUnitDiagonal(1);
                // diags 0 and 1 are the initial values, 
                // so start the loop with diags 2 & 3
                const diagLimit = radicand - 1;
                const fmt = 4; // MATHML
                let sFractions = `<mo>(</mo>
                                <mfrac>
                                    <mrow>${num.toString(fmt)}</mrow>
                                    <mrow>${den.toString(fmt)}</mrow>
                                </mfrac>
                            <mo>)</mo>`
                let sFactors = `<mo>(</mo>
                                <mrow>${num.toString(fmt)}</mrow>
                            <mo>)</mo>`
                for(let diag = 2; diag < diagLimit; diag += 2) {
                    // Multiply all diags with even indices to get the denominator
                    let d = field.getUnitDiagonal(diag);
                    // Multiply all diags with odd  indices to get the numerator
                    let n = field.getUnitDiagonal(diag+1);
                    den = den.times(d);
                    num = num.times(n);
                    sFractions += `<mo>(</mo>
                                <mfrac>
                                    <mrow>${n.toString(fmt)}</mrow>
                                    <mrow>${d.toString(fmt)}</mrow>
                                </mfrac>
                            <mo>)</mo>`
                    sFactors += `<mo>(</mo>
                                <mrow>${n.dividedBy(d).toString(fmt)}</mrow>
                            <mo>)</mo>`
                }
                const result = num.dividedBy(den);
                let sRes = result.toString(fmt);
                const r = result.evaluate();
                this.#container.innerHTML = 
                    `<math display="block">
                        <mtext>
                            Derive &nbsp;
                        </mtext>
                        <msqrt><mtext>${radicand}</mtext></msqrt>
                        <mtext>
                            &nbsp; from the ${field.order-1} shortest diagonals 
                            of a regular (2*${(radicand)})=${(2*radicand)}-gon with an edge length of 1.
                        </mtext>
                     </math>
                     <hr>
                     <math display="block">
                        <mrow>
                            <mi>r</mi><mo>≥</mo><mn>2</mn><mtext>,&nbsp;</mtext>
                            <mi>r</mi><mo>∈</mo><mtext>&Nopf;&nbsp;</mtext>
                            <!--mo stretchy="false" lspace="0em" rspace="0em">⇒</mo-->
                        <mrow>
                    </math>
                     <br>
                     <math display="block">
    <mrow>
      <msqrt><mi>r</mi></msqrt><mo>=</mo>
      <munderover>
        <mo movablelimits="false">∏</mo>
        <mrow>
          <mi>k</mi>
          <mo>=</mo>
          <mn>1</mn>
        </mrow>
        <mrow>
          <mo fence="true" form="prefix">⌊</mo>
          <mfrac>
            <mi>r</mi>
            <mn>2</mn>
          </mfrac>
          <mo fence="true" form="postfix">⌋</mo>
        </mrow>
      </munderover>
    </mrow>
    <mfrac>
      <mrow>
        <mi>s</mi>
        <mi>i</mi>
        <mi>n</mi>
        <mo>(</mo>
        <mfrac>
          <mrow>
            <mn>2</mn>
            <mi>k</mi>
            <mi>π</mi>
          </mrow>
          <mrow>
            <mn>2</mn>
            <mi>r</mi>
          </mrow>
        </mfrac>
        <mo>)</mo>
      </mrow>
      <mrow>
        <mi>s</mi>
        <mi>i</mi>
        <mi>n</mi>k
        <mo>(</mo>
        <mfrac>
          <mrow>
            <mo>(</mo>
            <mn>2</mn>
            <mi>k</mi>
            <mo>-</mo>
            <mn>1</mn>
            <mo>)</mo>
            <mi>π</mi>
          </mrow>
          <mrow>
            <mn>2</mn>
            <mi>r</mi>
          </mrow>
        </mfrac>
        <mo>)</mo>
      </mrow>
    </mfrac>
  </mrow>
                        </mrow>
                     </math>
                     <hr>
                     <math display="block">
                        <mrow>
                            <mrow>${sFractions}</mrow>
                        </mrow>
                     </math>
                     <br>
                     <math display="block">
                        <mrow>
                            <mo>=</mo>
                            <mrow>${sFactors}</mrow>
                        </mrow>
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
                     <hr>
                     `;
            })
	}
}

customElements.define( "sqrt-calculator", SqrtCalculator );
