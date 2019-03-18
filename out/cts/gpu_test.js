import { getGPU } from "../framework/gpu/implementation.js";
import { Fixture } from "../framework/index.js";
export class GPUTest extends Fixture {
    static async create(log, params) {
        const gpu = await getGPU();
        const adapter = await gpu.requestAdapter();
        const device = await adapter.requestDevice({});
        return new GPUTest(log, params, device);
    }
    constructor(log, params, device) {
        super(log, params);
        this.device = device;
        this.queue = this.device.getQueue();
    }
    async expectContents(src, expected) {
        const size = expected.length;
        const dst = this.device.createBuffer({
            size: expected.length,
            usage: 1 | 8,
        });
        const c = this.device.createCommandEncoder({});
        c.copyBufferToBuffer(src, 0, dst, 0, size);
        this.queue.submit([c.finish()]);
        const ab = await dst.mapReadAsync();
        const actual = new Uint8Array(ab);
        for (let i = 0; i < size; ++i) {
            if (actual[i] !== expected[i]) {
                this.rec.fail(`at [${i}], expected ${expected[i]}, got ${actual[i]}`);
                // TODO: limit number of fail logs for one expectContents?
            }
        }
        // TODO: log the actual and expected data
    }
}
//# sourceMappingURL=gpu_test.js.map