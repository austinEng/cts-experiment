export * from "./combine.js";
export * from "./filter.js";
export * from "./options.js";
export * from "./exclude.js";
export function paramsEqual(x, y) {
    if (x === y) {
        return true;
    }
    for (const xk of Object.keys(x)) {
        if (!y.hasOwnProperty(xk)) {
            return false;
        }
        if (x[xk] !== y[xk]) {
            return false;
        }
    }
    for (const yk of Object.keys(y)) {
        if (!x.hasOwnProperty(yk)) {
            return false;
        }
    }
    return true;
}
//# sourceMappingURL=index.js.map