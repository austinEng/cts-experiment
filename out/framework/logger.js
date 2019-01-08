import { getStackTrace, now } from "./util.js";
export class Logger {
    constructor() {
        this.results = [];
    }
    record(path) {
        const cases = [];
        const test = { path, cases };
        this.results.push(test);
        return [test, new GroupRecorder(test)];
    }
}
export class GroupRecorder {
    constructor(test) {
        this.test = test;
    }
    record(name, params) {
        const result = { name, status: "running", timems: -1 };
        if (params) {
            result.params = params;
        }
        this.test.cases.push(result);
        return [result, new CaseRecorder(result)];
    }
}
export class CaseRecorder {
    constructor(result) {
        this.failed = false;
        this.warned = false;
        this.startTime = -1;
        this.logs = [];
        this.result = result;
    }
    start() {
        this.startTime = now();
        this.logs = [];
        this.failed = false;
        this.warned = false;
    }
    finish() {
        if (this.startTime < 0) {
            throw new Error("finish() before start()");
        }
        const endTime = now();
        this.result.timems = endTime - this.startTime;
        this.result.status = this.failed ? "fail" :
            this.warned ? "warn" : "pass";
        this.result.logs = this.logs;
    }
    log(msg) {
        this.logs.push(msg);
    }
    fail(msg) {
        this.failImpl(msg);
    }
    warn(msg) {
        this.warnImpl(msg);
    }
    ok(msg) {
        if (msg) {
            this.log("PASS: " + msg);
        }
        else {
            this.log("PASS");
        }
    }
    expect(cond, msg) {
        if (cond) {
            this.ok(msg);
        }
        else {
            this.failImpl(msg);
        }
    }
    warnImpl(msg) {
        this.warned = true;
        let m = "WARN";
        if (msg) {
            m += ": " + msg;
        }
        m += " " + getStackTrace();
        this.log(m);
    }
    failImpl(msg) {
        this.failed = true;
        let m = "FAIL";
        if (msg) {
            m += ": " + msg;
        }
        m += " " + getStackTrace();
        this.log(m);
    }
}
//# sourceMappingURL=logger.js.map