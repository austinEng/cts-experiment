import { GPUTest } from '../gpu_test.js';

export class ValidationTest extends GPUTest {
  async getErrorBuffer(): Promise<GPUBuffer> {
    this.device.pushErrorScope('validation');
    const errorBuffer = this.device.createBuffer({
      size: 1024,
      usage: 0xffff, // Invalid GPUBufferUsage
    });
    await this.device.popErrorScope();
    return errorBuffer;
  }

  expectValidationError(fn: Function, shouldError: boolean = true): void {
    // If no error is expected, we let the scope surrounding the test catch it.
    if (shouldError === false) {
      fn();
      return;
    }

    this.device.pushErrorScope('validation');
    fn();
    const promise = this.device.popErrorScope();

    this.eventualAsyncExpectation(async () => {
      const gpuValidationError = await promise;
      if (!gpuValidationError) {
        this.fail('Validation error was expected.');
      } else if (gpuValidationError instanceof GPUValidationError) {
        this.debug(`Captured validation error - ${gpuValidationError.message}`);
      }
    });
  }
}
