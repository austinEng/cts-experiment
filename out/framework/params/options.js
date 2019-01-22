export function poptions(name, values) {
    return new POptions(name, values);
}
class POptions {
    constructor(name, values) {
        this.name = name;
        this.values = values;
    }
    *[Symbol.iterator]() {
        for (const value of this.values) {
            yield { [this.name]: value };
        }
    }
}
//# sourceMappingURL=options.js.map