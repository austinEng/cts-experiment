import { getGPU } from "../framework/gpu/implementation.js";
import { Fixture } from "../framework/index.js";
function wait() {
    return new Promise((resolve) => { setTimeout(resolve, 10); });
}
export class GPUTest extends Fixture {
    static async create(log, params) {
        const gpu = await getGPU();
        return new GPUTest(log, params, gpu);
    }
    constructor(log, params, gpu) {
        super(log, params);
        this.device = gpu.getDevice();
        this.queue = this.device.getQueue();
    }
    async expectContents(src, expected) {
        const size = expected.length;
        const dst = this.device.createBuffer({
            size: expected.length,
            usage: 1 | 8,
        });
        const c = this.device.createCommandBuffer({});
        c.copyBufferToBuffer(src, 0, dst, 0, size);
        this.queue.submit([c]);
        let done = false;
        dst.mapReadAsync(0, size, (ab) => {
            const actual = new Uint8Array(ab);
            for (let i = 0; i < size; ++i) {
                if (actual[i] !== expected[i]) {
                    this.rec.fail(`at [${i}], expected ${expected[i]}, got ${actual[i]}`);
                    // TODO: limit number of fail logs for one expectContents?
                }
            }
            // TODO: log the actual and expected data
            done = true;
        });
        this.log("waiting...");
        while (!done) {
            this.device.flush();
            await wait();
        }
        this.log("done!");
    }
}
//# sourceMappingURL=gpu_test.js.map