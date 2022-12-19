export class ContinuedFraction {
    #field; //AlgebraicField
    #value; //AlgebraicNumber
    // value is broken up into these parts:
    #signum; // int
    // everything after this point must be positive
    #wholePart; // int
    #initialSeries; // List<Integer> initialSeries = new ArrayList<>();
    #periodicSeries; // List<Integer> periodicSeries = new ArrayList<>();
    #remainder; // AlgebraicNumber

	constructor(aNum, aDen) {
        this.#field = aNum.getField();
        this.#initialSeries = [];
        this.#periodicSeries = [];
        if(aNum.isInfinite || aDen.isInfinite || aDen.isZero()) {
			// isInfinite isn't normally a property of an AlgebraicNumber, 
			// but we can append it on the fly in JS
			aDen. isInfinite = true;
            // avoid divide by zero
            // initialize all member vars so that toString() works correctly
            this.#value = aDen;
            this.#signum = 0;
            this.#wholePart = 0;
            this.#remainder = aDen;
        } else {
            this.#value = aNum.dividedBy(aDen);
            this.#signum = this.#value.signum();
            // after recording the initial signum, 
            // value, aNum and aDen will always be kept positive
            if (this.#signum == -1) {
                this.#value = this.#value.negate();
            }
            if(aNum.signum() == -1) {
                aNum = aNum.negate();
            }
            if(aDen.signum() == -1) {
                aDen = aDen.negate();
            }
            if (this.#signum == 0) {
                this.#wholePart = 0;
                this.#remainder = this.#value.getField().zero();
            } else {
                // TODO: Deal with the case when we have BigInteger terms
                //    wholePart = Double.valueOf(n.evaluate()).intValue();
                //    if(wholePart != 0) {
                //        n = n.minus(n.create(wholePart));
                //    }
                const maxReps = this.#value.getField().getOrder() * 20; // TODO: seems like a reasonable number for now but I need a better plan
                const whole = [ 0 ];
                // TODO: return an object with wholePart and remainder 
                // instead of passing in an array as was needed in Java
                this.#remainder = this.#generateSeries(this.#value, aDen, maxReps, whole);
                this.#wholePart = whole[0];
            }
        }
    }

    //AlgebraicNumber generateSeries(AlgebraicNumber n, int maxReps, int[] whole) {
    #generateSeries(n, den, maxReps, whole) {
        // According to https://crypto.stanford.edu/pbc/notes/contfrac/periodic.html
        // Any periodic continued fraction 
        //    represents a root of a quadratic equation with integer coefficients.
        // The converse is also true:
        //    Theorem: An irrational root of ax^2 + bx + c = 0 where a, b and c are integers 
        //    has a periodic continued fraction expansion.
        // That means that an AlgebraicField of order > 2 will not be periodic; 
        //    that is, it will not repeat, and any AlgebraicField of order 2 will repeat.
        const remainders = [];
        const field = n.getField();
        while (!n.isZero() && (this.#periodicSeries.length==0) && (0 < maxReps--)) {
            // TODO: Deal with the case when we have BigInteger terms
            // and evaluate() returns NAN such as 2a in polygon17 field
            const dblValue = n.evaluate();
            if(isNaN(dblValue)) {
                //console.log("break early with " + n.toString(1) + " = " + dblValue + " @[" + this.#initialSeries.length + "]");
                break;
            }
            const intPart = parseInt(dblValue);
            if(isNaN(intPart)) {
                //console.log("break early with " + n.toString(1) + " = " + intPart + " @[" + this.#initialSeries.length + "]");
                break;
            }
            this.#initialSeries.push(intPart);
            n = n.minus(field.createRational(intPart)); // this is the remainder
            if (n.isZero()) {
                break; // no remainder
            }
            for(const i in remainders) {
                if(n.equals(remainders[i])) {
                    const repeats = this.#initialSeries.slice(i);
                    this.#periodicSeries = this.#periodicSeries.concat(repeats);
                    this.#initialSeries = this.#initialSeries.slice(0, i); // truncate #initialSeries
                    break;
                }
            }
            remainders.push(n);
            //n = n.reciprocal(); // or we could use a fixed numerator other than one.
            n = den.dividedBy(n); // or we could use a fixed numerator other than one.
        }
        if(this.#initialSeries.length > 0) {
            whole[0] = this.#initialSeries[0];
            this.#initialSeries = this.#initialSeries.slice(1);
        } else if(this.#periodicSeries.length > 0) {
            whole[0] = this.#periodicSeries[0];
            this.#periodicSeries = this.#periodicSeries.slice(1);
        } else {
            whole[0] = 0;
        }
        return n; // as remainder
    }

    isInfinite() {
        // TODO: need better logic for edge cases such as 0/0 inputs ...
        // TODO, just set #isInfinite = true for applicable cases instead of calculating it here
        return (this.#value.isInfinite || (!this.#remainder.isZero()));
    }

    toArray() {
        const field = this.#field;
        let negate = this.#signum == -1;
        let result = [field.createRational(this.#wholePart)];
        if(negate && (this.#wholePart != 0)) {
            negate = false;
            result[0] = result[0].negate();
        }
        for(const n of this.#initialSeries) {
            if(negate && (n != 0)) {
                negate = false;
                result.push(field.createRational(n * -1));
            } else {
                result.push(field.createRational(n));
            }
        }
        if(this.#periodicSeries.length > 0) {
            let appendFirst = null;
            result.push("{");
            for(const n of this.#periodicSeries) {
                if(negate && (n != 0)) {
                    negate = false;
                    result.push(field.createRational(n * -1));
                    // Since the first repeating element is negated, 
                    // we save it as appendage then append it 
                    // without negating it after the last element
                    appendFirst = n;
                } else {
                    result.push(field.createRational(n));
                }
            }
            if(appendFirst != null) {
                result.push(field.createRational(appendFirst));
            }
            result.push("}");
        }
        if(this.isInfinite()) {
            result.push("...");
        }
        return result;
    }
    
    toString() {
        // TODO: Use array.push and a final concat instead of += as shown at
        // https://stackoverflow.com/questions/2087522/does-javascript-have-a-built-in-stringbuilder-class
        // String.concat.apply(null, arrayOfStrings);
        let buf = ["["];
        buf[0] += (this.#signum == -1 ? "-" : " ");
        const padding = " "; // one space
        if (this.#wholePart < 10) {
            buf[0] += padding;
        }
        buf[0] += this.#wholePart;
        let delim = this.#appendSeries(buf, this.#initialSeries, "; ", padding);
        if(this.#periodicSeries.length > 0) {
            delim = this.#appendSeries(buf, this.#periodicSeries, delim + "{ ", padding);
            buf[0] += " },";
        }
        if(this.isInfinite()) {
            buf[0] += " ...";
        }
        buf[0] += " ]";
        return buf[0];
    }
    
    #appendSeries(buf, series, delim, padding) {
        for (const i in series) {
            buf[0] += delim;
            delim = ", ";
            if (i < 10) {
                buf[0] += padding;
            }
            buf[0] += series[i];
        }
        return delim;
    }

}
