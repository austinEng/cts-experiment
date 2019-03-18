export class Fixture {
    constructor(log, params) {
        this.rec = log;
        this.params = params;
    }
    log(msg) {
        this.rec.log(msg);
    }
}
export class DefaultFixture extends Fixture {
    static create(log, params) {
        return new DefaultFixture(log, params);
    }
    warn(msg) {
        this.rec.warn(msg);
    }
    fail(msg) {
        this.rec.fail(msg);
    }
    ok(msg) {
        if (msg) {
            this.log("OK: " + msg);
        }
        else {
            this.log("OK");
        }
    }
    expect(cond, msg) {
        if (cond) {
            this.ok(msg);
        }
        else {
            this.rec.fail(msg);
        }
    }
}
export class TestGroup {
    constructor() {
        this.tests = [];
    }
    testpf(name, params, fixture, fn) {
        return this.testImpl(name, params, fixture, fn);
    }
    testf(name, fixture, fn) {
        return this.testImpl(name, undefined, fixture, fn);
    }
    testp(name, params, fn) {
        return this.testImpl(name, params, DefaultFixture, fn);
    }
    test(name, fn) {
        return this.testImpl(name, undefined, DefaultFixture, fn);
    }
    *iterate(log) {
        for (const t of this.tests) {
            const [res, rec] = log.record(t.name, t.params);
            yield { name: t.name, params: t.params, run: async () => {
                    rec.start();
                    try {
                        await t.run(rec);
                    }
                    catch (e) {
                        console.warn(e);
                        rec.threw(e);
                    }
                    rec.finish();
                    return res;
                } };
        }
    }
    testImpl(name, params, fixture, fn) {
        const n = params ? (name + "/" + JSON.stringify(params)) : name;
        const p = params ? params : {};
        this.tests.push({ name: n, run: async (log) => {
                const inst = await fixture.create(log, p);
                return fn(inst);
            } });
    }
}
//# sourceMappingURL=test_group.js.map