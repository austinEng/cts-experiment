export const description = `
Unit tests for parameterization system.
`;
import { Fixture, TestGroup, } from "../framework/index.js";
export const group = new TestGroup();
// TODO: these tests should really create their own TestGroup and assert things about it
function print(t) {
    t.log(JSON.stringify(t.params));
}
group.test("test", (t) => { });
group.testp("testp", { a: 1 }, print);
class Printer extends Fixture {
    static create(log, params) {
        return new Printer(log, params);
    }
    print() {
        this.log(JSON.stringify(this.params));
    }
}
group.testf("testf", Printer, (t) => {
    t.print();
});
group.testpf("testpf", { a: 1 }, Printer, (t) => {
    t.print();
});
//# sourceMappingURL=test_group.spec.js.map