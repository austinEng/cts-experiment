import { getGPU } from "../framework/gpu/implementation.js";
import { Fixture } from "../framework/index.js";
export class GPUTest extends Fixture {
    // TODO: Need to get rid of this so test fixtures can be created more easily.
    static async create(log, params) {
        const gpu = await getGPU();
        const adapter = await gpu.requestAdapter();
        const device = adapter.createDevice({}); // TODO: await adapter.requestDevice()
        return new GPUTest(log, params, device);
    }
    constructor(log, params, device) {
        super(log, params);
        this.device = device;
        this.queue = this.device.getQueue();
    }
    compile(type, source) {
        // TODO: integrate this less hackily (and make it work without index.html)
        // @ts-ignore TS2339
        const Shaderc = window.Module;
        const compiler = new Shaderc.Compiler();
        const opts = new Shaderc.CompileOptions();
        const result = compiler.CompileGlslToSpv(source, type === "f" ? Shaderc.shader_kind.fragment :
            type === "v" ? Shaderc.shader_kind.vertex :
                type === "c" ? Shaderc.shader_kind.compute : null, "a.glsl", "main", opts);
        console.warn(result.GetErrorMessage());
        return result.GetBinary();
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