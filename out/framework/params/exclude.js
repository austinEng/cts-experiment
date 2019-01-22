import { paramsEqual, } from "./index.js";
export function pexclude(params, exclude) {
    return new PExclude(params, exclude);
}
class PExclude {
    constructor(cases, exclude) {
        this.cases = cases;
        this.exclude = Array.from(exclude);
    }
    *[Symbol.iterator]() {
        for (const p of this.cases) {
            if (this.exclude.every((e) => !paramsEqual(p, e))) {
                yield p;
            }
        }
    }
}
//# sourceMappingURL=exclude.js.map