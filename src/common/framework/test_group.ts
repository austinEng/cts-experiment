import { Fixture, SkipTestCase, UnexpectedPassError } from './fixture.js';
import { TestCaseRecorder } from './logging/test_case_recorder.js';
import {
  CaseParams,
  extractPublicParams,
  Merged,
  mergeParams,
  publicParamsEquals,
} from './params_utils.js';
import { comparePublicParamsPaths, Ordering } from './query/compare.js';
import {
  TestQueryMultiCase,
  TestQuerySingleCase,
  TestQueryWithExpectation,
} from './query/query.js';
import { kPathSeparator } from './query/separators.js';
import { stringifyPublicParams, stringifyPublicParamsUniquely } from './query/stringify_params.js';
import { validQueryPart } from './query/validQueryPart.js';
import { assert, unreachable } from './util/util.js';

export type RunFn = (rec: TestCaseRecorder) => Promise<void>;

export interface TestCaseID {
  readonly test: readonly string[];
  readonly params: CaseParams;
}

export interface RunCase {
  readonly id: TestCaseID;
  run: RunFn;
  setExpectations(expectations: TestQueryWithExpectation[]): void;
}

// Interface for defining tests
export interface TestGroupBuilder<F extends Fixture> {
  test(name: string): TestBuilderWithName<F>;
}
export function makeTestGroup<F extends Fixture>(fixture: FixtureClass<F>): TestGroupBuilder<F> {
  return new TestGroup(fixture);
}

// Interfaces for running tests
export interface IterableTestGroup {
  iterate(): Iterable<IterableTest>;
  validate(): void;
}
export interface IterableTest {
  testPath: string[];
  description: string | undefined;
  readonly testCreationStack: Error;
  iterate(): Iterable<RunCase>;
}

export function makeTestGroupForUnitTesting<F extends Fixture>(
  fixture: FixtureClass<F>
): TestGroup<F> {
  return new TestGroup(fixture);
}

type FixtureClass<F extends Fixture> = new <P extends {}>(log: TestCaseRecorder, params: P) => F;
type TestFn<F extends Fixture, P extends {}, SubP extends {}> = (
  t: F & { params: Merged<P, SubP> }
) => Promise<void> | void;

class TestGroup<F extends Fixture> implements TestGroupBuilder<F> {
  private fixture: FixtureClass<F>;
  private seen: Set<string> = new Set();
  private tests: Array<TestBuilder<F, {}, {}>> = [];

  constructor(fixture: FixtureClass<F>) {
    this.fixture = fixture;
  }

  iterate(): Iterable<IterableTest> {
    return this.tests;
  }

  private checkName(name: string): void {
    assert(
      // Shouldn't happen due to the rule above. Just makes sure that treated
      // unencoded strings as encoded strings is OK.
      name === decodeURIComponent(name),
      `Not decodeURIComponent-idempotent: ${name} !== ${decodeURIComponent(name)}`
    );
    assert(!this.seen.has(name), `Duplicate test name: ${name}`);

    this.seen.add(name);
  }

  // TODO: This could take a fixture, too, to override the one for the group.
  test(name: string): TestBuilderWithName<F> {
    const testCreationStack = new Error(`Test created: ${name}`);

    this.checkName(name);

    const parts = name.split(kPathSeparator);
    for (const p of parts) {
      assert(validQueryPart.test(p), `Invalid test name part ${p}; must match ${validQueryPart}`);
    }

    const test = new TestBuilder<F, {}, {}>(parts, this.fixture, testCreationStack);
    this.tests.push(test);
    return test;
  }

  validate(): void {
    for (const test of this.tests) {
      test.validate();
    }
  }
}

interface TestBuilderWithName<F extends Fixture> extends TestBuilderWithParams<F, {}> {
  desc(description: string): this;
  /** @deprecated use cases() and/or subcases() instead */
  params<NewP extends {}>(specs: Iterable<NewP>): TestBuilderWithParams<F, NewP>;
  cases<NewP extends {}>(specs: Iterable<NewP>): TestBuilderWithParams<F, NewP>;
}

interface TestBuilderWithParams<F extends Fixture, P extends {}>
  extends TestBuilderWithSubParams<F, P, {}> {
  subcases<NewSubP extends {}>(
    specs: (_: P) => Iterable<NewSubP>
  ): TestBuilderWithSubParams<F, P, NewSubP>;
}

interface TestBuilderWithSubParams<F extends Fixture, P extends {}, SubP extends {}> {
  fn(fn: TestFn<F, P, SubP>): void;
  unimplemented(): void;
}

class TestBuilder<F extends Fixture, P extends {}, SubP extends {}> {
  readonly testPath: string[];
  description: string | undefined;
  readonly testCreationStack: Error;

  private readonly fixture: FixtureClass<F>;
  private testFn: TestFn<F, P, SubP> | undefined;
  private caseParams?: Iterable<P> = undefined;
  private subcaseParams?: (_: P) => Iterable<SubP> = undefined;

  constructor(testPath: string[], fixture: FixtureClass<F>, testCreationStack: Error) {
    this.testPath = testPath;
    this.fixture = fixture;
    this.testCreationStack = testCreationStack;
  }

  desc(description: string): this {
    this.description = description.trim();
    return this;
  }

  fn(fn: TestFn<F, P, SubP>): void {
    // TODO: add TODO if there's no description? (and make sure it only ends up on actual tests,
    // not on test parents in the tree, which is what happens if you do it here, not sure why)
    assert(this.testFn === undefined);
    this.testFn = fn;
  }

  unimplemented(): void {
    assert(this.testFn === undefined);

    this.description =
      (this.description ? this.description + '\n\n' : '') + 'TODO: .unimplemented()';

    this.testFn = () => {
      throw new SkipTestCase('test unimplemented');
    };
  }

  validate(): void {
    const testPathString = this.testPath.join(kPathSeparator);
    assert(this.testFn !== undefined, () => {
      let s = `Test is missing .fn(): ${testPathString}`;
      if (this.testCreationStack.stack) {
        s += `\n-> test created at:\n${this.testCreationStack.stack}`;
      }
      return s;
    });

    if (this.caseParams === undefined) {
      return;
    }

    const seen = new Set<string>();
    for (const testcase of this.caseParams) {
      // stringifyPublicParams also checks for invalid params values
      const testcaseString = stringifyPublicParams(testcase);

      // A (hopefully) unique representation of a params value.
      const testcaseStringUnique = stringifyPublicParamsUniquely(testcase);
      assert(
        !seen.has(testcaseStringUnique),
        `Duplicate public test case params for test ${testPathString}: ${testcaseString}`
      );
      seen.add(testcaseStringUnique);
    }
  }

  params<NewP extends {}>(casesIterable: Iterable<NewP>): TestBuilder<F, NewP, SubP> {
    return this.cases(casesIterable);
  }

  cases<NewP extends {}>(casesIterable: Iterable<NewP>): TestBuilder<F, NewP, SubP> {
    assert(this.caseParams === undefined, 'test case is already parameterized');
    const newSelf = (this as unknown) as TestBuilder<F, NewP, SubP>;
    newSelf.caseParams = Array.from(casesIterable);

    return newSelf;
  }

  subcases<NewSubP extends {}>(specs: (_: P) => Iterable<NewSubP>): TestBuilder<F, P, NewSubP> {
    assert(this.subcaseParams === undefined, 'test subcases are already parameterized');
    const newSelf = (this as unknown) as TestBuilder<F, P, NewSubP>;
    newSelf.subcaseParams = specs;

    return newSelf;
  }

  *iterate(): IterableIterator<RunCase> {
    assert(this.testFn !== undefined, 'No test function (.fn()) for test');
    for (const params of this.caseParams || [<P>{}]) {
      yield new RunCaseSpecific(
        this.testPath,
        params,
        this.subcaseParams,
        this.fixture,
        this.testFn,
        this.testCreationStack
      );
    }
  }
}

class RunCaseSpecific<
  F extends Fixture,
  P extends CaseParams,
  SubP extends CaseParams,
  FN extends TestFn<F, P, SubP>
> implements RunCase {
  readonly id: TestCaseID;

  private readonly params: P;
  private readonly subParamGen?: (_: P) => Iterable<SubP>;
  private readonly fixture: FixtureClass<F>;
  private readonly fn: FN;
  private readonly testCreationStack: Error;
  private expectations: TestQueryWithExpectation[] = [];

  constructor(
    testPath: string[],
    params: P,
    subParamGen: ((_: P) => Iterable<SubP>) | undefined,
    fixture: FixtureClass<F>,
    fn: FN,
    testCreationStack: Error
  ) {
    this.id = { test: testPath, params: extractPublicParams(params) };
    this.params = params;
    this.subParamGen = subParamGen;
    this.fixture = fixture;
    this.fn = fn;
    this.testCreationStack = testCreationStack;
  }

  async runTest(
    rec: TestCaseRecorder,
    params: P | Merged<P, SubP>,
    throwSkip: boolean,
    expectedStatus: 'pass' | 'fail' | 'skip'
  ): Promise<void> {
    try {
      rec.beginSubCase();
      if (expectedStatus === 'skip') {
        throw new SkipTestCase(`Skipped by expecations`);
      }
      const inst = new this.fixture(rec, params);

      try {
        await inst.init();
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        await this.fn(inst as any);
      } finally {
        // Runs as long as constructor succeeded, even if initialization or the test failed.
        await inst.finalize();
      }
    } catch (ex) {
      // There was an exception from constructor, init, test, or finalize.
      // An error from init or test may have been a SkipTestCase.
      // An error from finalize may have been an eventualAsyncExpectation failure
      // or unexpected validation/OOM error from the GPUDevice.
      if (throwSkip && ex instanceof SkipTestCase) {
        throw ex;
      }
      rec.threw(ex);
    } finally {
      try {
        rec.endSubCase(expectedStatus);
      } catch (ex) {
        assert(ex instanceof UnexpectedPassError);
        ex.message = `Testcase passed unexpectedly.`;
        ex.stack = this.testCreationStack.stack;
        rec.warn(ex);
      }
    }
  }

  setExpectations(expectations: TestQueryWithExpectation[]): void {
    this.expectations = expectations;
  }

  async run(rec: TestCaseRecorder): Promise<void> {
    const getExpectedStatus = (params: CaseParams) => {
      let didSeeFail = false;
      for (const exp of this.expectations) {
        if (exp.query instanceof TestQueryMultiCase) {
          const compare = comparePublicParamsPaths(exp.query.params, params);
          if (compare === Ordering.Unordered || compare === Ordering.StrictSubset) {
            continue;
          }
        } else if (exp.query instanceof TestQuerySingleCase) {
          if (!publicParamsEquals(exp.query.params, params)) {
            continue;
          }
        }

        switch (exp.expectation) {
          // Skip takes precendence. If there is any expecation indicating a skip,
          // signal it immediately.
          case 'skip':
            return 'skip';
          case 'fail':
            // Otherwise, indicate that we might expect a failure.
            didSeeFail = true;
            break;
          default:
            unreachable();
        }
      }
      return didSeeFail ? 'fail' : 'pass';
    };

    rec.start();
    if (this.subParamGen) {
      let totalCount = 0;
      let skipCount = 0;
      for (const subParams of this.subParamGen(this.params)) {
        rec.info(new Error('subcase: ' + stringifyPublicParams(subParams)));
        try {
          const params = mergeParams(this.params, subParams);
          await this.runTest(rec, params, true, getExpectedStatus(params as CaseParams));
        } catch (ex) {
          if (ex instanceof SkipTestCase) {
            // Convert SkipTestCase to info messages
            ex.message = 'subcase skipped: ' + ex.message;
            rec.info(ex);
            ++skipCount;
          } else {
            // Since we are catching all error inside runTest(), this should never happen
            rec.threw(ex);
          }
        }
        ++totalCount;
      }
      if (skipCount === totalCount) {
        rec.skipped(new SkipTestCase('all subcases were skipped'));
      }
    } else {
      await this.runTest(rec, this.params, false, getExpectedStatus(this.params));
    }
    rec.finish();
  }
}
