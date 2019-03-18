/* tslint:disable:max-line-length */
const kNoExtensions = {
    anisotropicFiltering: false,
};
const kDefaultLimits = {
    maxBindGroups: 4,
};
class BindGroup {
}
class BindGroupLayout {
}
class Buffer {
    constructor() {
        this.mapping = null;
    }
    destroy() { }
    unmap() { }
    async mapReadAsync() {
        return new ArrayBuffer(0);
    }
    setSubData(offset, ab) { }
}
class CommandEncoder {
    beginComputePass() {
        return new ComputePassEncoder();
    }
    beginRenderPass(descriptor) {
        return new RenderPassEncoder();
    }
    blit() { }
    copyBufferToBuffer(src, srcOffset, dst, dstOffset, size) { }
    copyBufferToTexture(source, destination, copySize) { }
    copyTextureToBuffer(source, destination, copySize) { }
    copyTextureToTexture(source, destination, copySize) { }
    finish() {
        return new CommandBuffer();
    }
}
class CommandBuffer {
}
class ProgrammablePassEncoder {
    constructor() { }
    endPass() { }
    insertDebugMarker(markerLabel) { }
    popDebugGroup(groupLabel) { }
    pushDebugGroup(groupLabel) { }
    setBindGroup(index, bindGroup) { }
    setPipeline(pipeline) { }
}
class ComputePassEncoder extends ProgrammablePassEncoder {
    dispatch(x, y, z) { }
}
class RenderPassEncoder extends ProgrammablePassEncoder {
    draw(vertexCount, instanceCount, firstVertex, firstInstance) { }
    drawIndexed(indexCount, instanceCount, firstIndex, baseVertex, firstInstance) { }
    setBlendColor(r, g, b, a) { }
    setIndexBuffer(buffer, offset) { }
    setScissorRect(x, y, width, height) { }
    setStencilReference(reference) { }
    setVertexBuffers(startSlot, buffers, offsets) { }
    setViewport(x, y, width, height, minDepth, maxDepth) { }
}
class ComputePipeline {
}
class Fence {
    getCompletedValue() {
        return 0;
    }
    onCompletion(completionValue) {
        return Promise.resolve();
    }
}
class PipelineLayout {
}
class RenderPipeline {
}
class Sampler {
}
class ShaderModule {
}
class Texture {
    constructor() { }
    createDefaultTextureView() {
        return new TextureView();
    }
    createTextureView(desc) {
        return new TextureView();
    }
    destroy() { }
}
class TextureView {
    constructor() { }
}
class Queue {
    signal(fence, signalValue) { }
    submit(buffers) { }
    wait(fence, valueToWait) { }
}
class Device extends EventTarget {
    constructor(adapter, descriptor) {
        super();
        this.limits = kDefaultLimits;
        this.queue = new Queue();
        this.adapter = adapter;
        this.extensions = descriptor.extensions || kNoExtensions;
    }
    createBindGroup(descriptor) { return new BindGroup(); }
    createBindGroupLayout(descriptor) { return new BindGroupLayout(); }
    createBuffer(descriptor) { return new Buffer(); }
    createCommandEncoder(descriptor) { return new CommandEncoder(); }
    createComputePipeline(descriptor) { return new ComputePipeline(); }
    createFence(descriptor) { return new Fence(); }
    createPipelineLayout(descriptor) { return new PipelineLayout(); }
    createRenderPipeline(descriptor) { return new RenderPipeline(); }
    createSampler(descriptor) { return new Sampler(); }
    createShaderModule(descriptor) { return new ShaderModule(); }
    createTexture(descriptor) { return new Texture(); }
    getQueue() { return this.queue; }
    // TODO: temporary
    flush() { }
}
class Adapter {
    constructor() {
        this.extensions = kNoExtensions;
        this.name = "dummy";
    }
    async requestDevice(descriptor) {
        return new Device(this, descriptor);
    }
    // TODO: remove.
    createDevice(descriptor) {
        return new Device(this, descriptor);
    }
}
const gpu = {
    async requestAdapter(options) {
        return new Adapter();
    },
};
export default gpu;
//# sourceMappingURL=dummy.js.map