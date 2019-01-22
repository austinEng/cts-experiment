export function pfilter(cases, pred) {
    return new PFilter(cases, pred);
}
class PFilter {
    constructor(cases, pred) {
        this.cases = cases;
        this.pred = pred;
    }
    *[Symbol.iterator]() {
        for (const p of this.cases) {
            if (this.pred(p)) {
                yield p;
            }
        }
    }
}
//# sourceMappingURL=filter.js.map