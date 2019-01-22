export function pcombine(params) { return new PCombine(params); }
class PCombine {
    static merge(a, b) {
        for (const key of Object.keys(a)) {
            if (b.hasOwnProperty(key)) {
                throw new Error("Duplicate key: " + key);
            }
        }
        return { ...a, ...b };
    }
    static *cartesian(iters) {
        if (iters.length === 0) {
            return;
        }
        if (iters.length === 1) {
            yield* iters[0];
            return;
        }
        const [as, ...rest] = iters;
        for (const a of as) {
            for (const b of PCombine.cartesian(rest)) {
                yield PCombine.merge(a, b);
            }
        }
    }
    constructor(params) {
        this.params = params;
    }
    [Symbol.iterator]() {
        return PCombine.cartesian(this.params);
    }
}
//# sourceMappingURL=combine.js.map