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
        this.status = "valid";
    }
    destroy() {
        this.status = "invalid";
    }
    unmap() { }
    _getStatus() {
        return this.status;
    }
    // TODO: TBD
    mapReadAsync(offset, size, callback) {
        setTimeout(() => callback(new ArrayBuffer(size)), 0);
    }
    setSubData(offset, ab) { }
}
class CommandBuffer {
    beginComputePass() {
        return new ComputePassEncoder(this);
    }
    beginRenderPass(descriptor) {
        return new RenderPassEncoder(this);
    }
    blit() { }
    copyBufferToBuffer(src, srcOffset, dst, dstOffset, size) { }
    copyBufferToTexture(source, destination, copySize) { }
    copyTextureToBuffer(source, destination, copySize) { }
    copyTextureToTexture(source, destination, copySize) { }
}
class ProgrammablePassEncoder {
    constructor(commandBuffer) {
        this.commandBuffer = commandBuffer;
    }
    endPass() {
        return this.commandBuffer;
    }
    insertDebugMarker(markerLabel) { }
    popDebugGroup(groupLabel) { }
    pushDebugGroup(groupLabel) { }
    setBindGroup(index, bindGroup) { }
    setPipeline(pipeline) { }
}
class ComputePassEncoder extends ProgrammablePassEncoder {
    constructor(commandBuffer) {
        super(commandBuffer);
    }
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
    constructor() {
        this.status = "valid";
    }
    createDefaultTextureView() {
        return new TextureView();
    }
    createTextureView(desc) {
        return new TextureView();
    }
    destroy() {
        this.status = "invalid";
    }
    _getStatus() {
        return this.status;
    }
}
class TextureView {
    constructor() { }
}
class Queue {
    signal(fence, signalValue) { }
    submit(buffers) { }
    wait(fence, valueToWait) { }
}
class Device {
    constructor(adapter, descriptor) {
        this.limits = kDefaultLimits;
        this.queue = new Queue();
        this.adapter = adapter;
        this.extensions = descriptor.extensions || kNoExtensions;
    }
    createBindGroup(descriptor) {
        return new BindGroup();
    }
    createBindGroupLayout(descriptor) {
        return new BindGroupLayout();
    }
    createBuffer(descriptor) {
        return new Buffer();
    }
    createCommandBuffer(descriptor) {
        return new CommandBuffer();
    }
    createComputePipeline(descriptor) {
        return new ComputePipeline();
    }
    createFence(descriptor) {
        return new Fence();
    }
    createPipelineLayout(descriptor) {
        return new PipelineLayout();
    }
    createRenderPipeline(descriptor) {
        return new RenderPipeline();
    }
    createSampler(descriptor) {
        return new Sampler();
    }
    createShaderModule(descriptor) {
        return new ShaderModule();
    }
    createTexture(descriptor) {
        return new Texture();
    }
    getObjectStatus(statusableObject) {
        return Promise.resolve(statusableObject._getStatus());
    }
    getQueue() {
        return this.queue;
    }
    // TODO: temporary
    flush() { }
}
class Adapter {
    constructor() {
        this.extensions = kNoExtensions;
        this.name = "dummy";
    }
    createDevice(descriptor) {
        return new Device(this, descriptor);
    }
}
const gpu = {
    requestAdapter(options) {
        return Promise.resolve(new Adapter());
    },
    // TODO: temporary
    getDevice() {
        return new Device(new Adapter(), {});
    },
};
export default gpu;
//# sourceMappingURL=dummy.js.map