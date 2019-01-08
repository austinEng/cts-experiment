export class TestClass {
    constructor(log, params) {
        this.log = log;
        this.params = params;
    }
}
export class TestGroup {
    constructor() {
        this.tests = [];
    }
    test(name, options, fn) {
        const opt = Object.assign({}, options);
        opt.cases = opt.cases || [{}];
        for (const p of opt.cases) {
            this.tests.push({ name, params: p, run: (log) => {
                    const inst = opt.class ? new opt.class(log, p) : undefined;
                    return fn.call(inst, log, p);
                } });
        }
    }
    *iterate(log) {
        for (const t of this.tests) {
            const [res, rec] = log.record(t.name, t.params);
            yield { name: t.name, params: t.params, run: async () => {
                    rec.start();
                    await t.run(rec);
                    rec.finish();
                    return res;
                } };
        }
    }
}
//# sourceMappingURL=test_group.js.map