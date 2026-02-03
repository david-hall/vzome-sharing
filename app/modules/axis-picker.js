export class AxisPicker extends HTMLElement {
static metadata = {
    blue: {
        len: "2 4",
        strutLabel:"B1",
        indices: [
            [ 0,15, 30,45], // x
            [ 1,46, 16,31], // y
            [ 2,32, 17,47], // z
            [ 3,23, 41,42],
            [ 4,51, 24,28],
            [ 5,37, 55,59],
            [ 6,49, 39,43],
            [ 7,35, 25,29],
            [ 8,18, 56,57],
            [ 9,13, 19,36],
            [10,14, 22,50],
            [11,12, 33,53],
            [20,52, 40,44],
            [21,34, 54,58],
            [26,27, 38,48]
        ],
        zomic: [9, 11, 0, 23, 6, 1, 10, 8, 26, 52, 54, 51, 7, 2, 37]
    },
    red: {
        len: "1 2",
        strutLabel:"R1",
        indices: [
            [ 0, 3, 6, 9,12, 30,33,36,39,42],
            [ 1, 4, 7,10,13, 16,19,22,25,28],
            [ 2, 5, 8,11,14, 47,50,53,56,59],
            [15,18,21,24,27, 45,48,51,54,57],
            [17,20,23,26,29, 32,35,38,41,44],
            [31,34,37,40,43, 46,49,52,55,58]
        ],
        zomic: [0, 1, 2, 15, 17, 46]
    },
    yellow: {
        len: "1 1",
        strutLabel:"Y1",
        indices: [
            [ 0,23,27, 38,42,45],
            [ 1,51,58, 21,28,31],
            [ 2,37,44, 17,52,59],
            [ 3,20,49, 39,40,41],
            [ 4,35,48, 24,25,26],
            [ 5,18,34, 54,55,56],
            [ 6,13,46, 16,36,43],
            [ 7,14,32, 22,29,47],
            [ 8,12,15, 30,53,57],
            [ 9,10,11, 19,33,50]
        ],
        zomic: [6, 9, 8, 0, 3, 1, 7, 5, 24, 17]
    },
    green: {
        len: "2 2",
        strutLabel:"G0",
        indices: [
            [  0, 42],
            [  1, 28],
            [  2, 59],
            [  3, 39],
            [  4, 25],
            [  5, 56],
            [  6, 36],
            [  7, 22],
            [  8, 53],
            [  9, 33],
            [ 10, 19],
            [ 11, 50],
            [ 12, 30],
            [ 13, 16],
            [ 14, 47],
            [ 15, 57],
            [ 17, 44],
            [ 18, 54],
            [ 20, 41],
            [ 21, 51],
            [ 23, 38],
            [ 24, 48],
            [ 26, 35],
            [ 27, 45],
            [ 29, 32],
            [ 31, 58],
            [ 34, 55],
            [ 37, 52],
            [ 40, 49],
            [ 43, 46],
        ],
        zomic: [6, 9, 12, 0, 3, 13, 10, 1, 7, 4, 11, 8, 14, 5, 2, 15, 27, 21, 18, 24, 23, 20, 29, 26, 17, 46, 49, 58, 55, 52]
    }
}
   htmlContent() {
    // TODO: use attributes to set the initial selected rb and slider values
        return `
<style>
:host {
  justify-content: center;
  align-items: center;
  position: relative;
  box-sizing: border-box;
  width: 100%;

  --color-blu-strut: rgb(0, 118, 149);
  --color-yel-strut: rgb(240, 160, 0);
  --color-red-strut: rgb(175, 0, 0);
  --color-grn-strut: rgb(0, 141, 54);
  --color-blu-panel: rgb(127, 186, 202);
  --color-yel-panel: rgb(247, 207, 127);
  --color-red-panel: rgb(215, 127, 127);
  --color-grn-panel: rgb(127, 198, 154);
}

.container {
  display: grid;
  grid-template-columns: 3ch 3ch 3ch 3ch 1fr 3ch;
  place-items: center;
  /* gap: 0.1em; */
  /* padding: 0.5ch; */
  /* margin: 0.25ch;*/
  xheight: 4ch;
  background-color: whitesmoke;
}
label {
  /* margin: 1ch; */
}
input[type="radio"] {
  height: 2.5ch;
  width: 2.5ch;
}
input[type="range"] {
  padding: 0.4ch;
  width: 100%;
}
output {
  text-align: right;
  width: 2ch;
  display: inline-block;
  white-space: nowrap;
}
input,
output,
label {
  height: 2ch;s
  width: 2ch;
  padding: 0.5ch;
  /* margin: 0.2ch; */
}
label.slider {
  width: 98%;
  min-width: 15ch;
  text-align: right;
}
.blue {
  accent-color: var(--color-blu-strut);
  background-color: var(--color-blu-panel);
}
.red {
  accent-color: var(--color-red-strut);
  background-color: var(--color-red-panel);
}
.yellow {
  accent-color: var(--color-yel-strut);
  background-color: var(--color-yel-panel);
}
.green {
  /* display:none; */ /* TODO: can be unchecked in dev console */
  accent-color: var(--color-grn-strut);
  background-color: var(--color-grn-panel);
}
</style>
<!--
    Put the radio buttons INSIDE their labels
    so we can set their background color indirectly.
    This also means we don't need the 'for' and 'id' attributes.
-->
<div class="container">
    <label class="blue">   <input type="radio" name="axes" class="blue"   value="blue"    ></label>
    <label class="red">    <input type="radio" name="axes" class="red"    value="red"     ></label>
    <label class="yellow"> <input type="radio" name="axes" class="yellow" value="yellow"  ></label>
    <label class="green">  <input type="radio" name="axes" class="green"  value="green"   ></label>
    <label class="slider blue">
        <input type="range" min="0" max="14" value="0" list="ticks">
    </label>
    <output>0</output>
</div>
<datalist id="ticks"></datalist>
`}
    #shadowRoot
    #slider
    #output
    #orbit
    #index
    #hashString

    constructor() {
        super()
        this.#orbit = "blue"
        this.#index = 0
        this.#hashString = ""
        this.#shadowRoot = this.attachShadow({ mode: 'open' })
        this.#shadowRoot.innerHTML = this.htmlContent()
        this.#slider = this.#shadowRoot.querySelector('input[type="range"]')
        this.#output = this.#shadowRoot.querySelector('output')
        const ticks = this.#shadowRoot.querySelector('datalist#ticks')
        //  30 tick marks is enough for every slider
        for(let i=0; i < 30; i++) {
            const opt = document.createElement("option")
            opt.setAttribute("value", i)
            // opt.setAttribute("label", i)
            ticks.appendChild(opt)
        }
    }

    connectedCallback() {
        this.#sync()
        this.#shadowRoot.querySelectorAll('input[type="radio"]').forEach(rb => {
            rb.addEventListener("change", async event => {
                const color = event.target.value
                this.orbit = color
                this.#setSliderColor(color)
                this.#refresh()
            })
        })

        this.#slider.addEventListener("change", async event => {
           this.index = event.target.value
            this.#refresh()
        })
        this.#refresh()
    }

    #sync() {
       this.#shadowRoot.querySelectorAll('input[type="radio"]').forEach(rb => {
            rb.checked = rb.value == this.#orbit
        })
        this.#slider.value = this.#index
        this.#setSliderColor(this.#orbit)
    }
    #setSliderColor(color) {
        this.#slider.className = color
        this.#slider.labels.forEach(label => {
            label.className = `slider ${color}`
        })
        this.#slider.max = this.maxOrbit(color)
        this.#index = this.#slider.value // in case the previous value is out of the new range
        this.#output.value = this.#index
        this.#output.setAttribute("class", color)
    }

    #refresh() {
        this.#sync()
        // This hash prevents firing the change event twice in some situations such as when
        // changing color radio buttons affects the slider max and may cascade changes.
        const newHash = `${this.#orbit} ${this.#index}`
        if(this.#hashString != newHash) {
            // console.log(`'${this.#hashString}' => '${newHash}'`)
            this.dispatchEvent(new Event('change', { bubbles: true }))
            this.#hashString = newHash
        }
    }

    get orbit() {
        return this.#orbit
    }
    set orbit(newValue) {
        if(this.validOrbit(newValue)) {
            if(this.#orbit != newValue) {
                this.#orbit = newValue
                this.#refresh()
            }
        }
    }
    validOrbit(orbit) {
        if(Object.keys(AxisPicker.metadata).includes(orbit)) {
           return true;
        }
        console.warn(`Ignoring invalid orbit: ${orbit}`)
        return false
    }

    get index() {
        return this.#index
    }
    set index(newValue) {
        const index = +newValue
        if(this.validIndex(newValue)) {
            if(this.#index != newValue) {
                this.#index = newValue
                this.#refresh()
            }
        }
    }
    validIndex(index) {
        index = +index
        const max = this.maxOrbit(this.#orbit)
        if (!isNaN(index) && index >= 0 && index <= max) {
            return true
        }
        console.warn(`Index ${index} is out of range for a ${this.#orbit} orbit.\nPlease provide a value between 0 and ${max}.`);
        return false
    }

    maxOrbit(orbit) {
        return this.validOrbit(orbit)
            ? AxisPicker.metadata[orbit].indices.length - 1
            : 0
    }

    get zomic() {
        return AxisPicker.metadata[this.#orbit].zomic[this.#index]
    }

    get axes() {
        // structuredClone is probably unnecessary, but it keeps the arrays from being acccessed directly
        return structuredClone(AxisPicker.metadata[this.#orbit].indices[this.#index])
    }

    get axis() {
        return this.axes[0]
    }

    get len() {
        return AxisPicker.metadata[this.orbit].len
    }

    get strutLabel() {
        return AxisPicker.metadata[this.orbit].strutLabel
    }

    // Called when HTML attributes are initialized or changed
    // which is different from directly calling the corresponding setters on this object
    // Generally, the setters will do all of the validation in one place.
    // Note that attribs in the HTML are set here before connectedCallback() is called
    // so we can't persist these directly to the html elements, but rather to local variables
    attributeChangedCallback( attributeName, oldValue, newValue ) {
        switch (attributeName) {
        case "orbit":
            this.orbit = newValue
            break
        case "index":
            this.index = newValue
            break
        default:
            console.dir({attributeName, oldValue, newValue })
        }
    }

    static get observedAttributes() {
        return [ "orbit", "index" ]
    }
}

customElements.define( "axis-picker", AxisPicker )