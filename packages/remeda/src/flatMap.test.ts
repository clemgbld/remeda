import { describe, expect, test } from "vitest";
import { createLazyInvocationCounter } from "../test/lazyInvocationCounter";
import { add } from "./add";
import { find } from "./find";
import { flatMap } from "./flatMap";
import { pipe } from "./pipe";

describe("dataFirst", () => {
  test("flatMap", () => {
    const result = flatMap([1, 2] as const, (x) => [x * 2, x * 3]);

    expect(result).toStrictEqual([2, 3, 4, 6]);
  });

  test("should accept fn returning a readonly array", () => {
    const result = flatMap([1, 2] as const, (x) => [x * 2, x * 3] as const);

    expect(result).toStrictEqual([2, 3, 4, 6]);
  });
});

describe("dataLast", () => {
  test("flatMap", () => {
    const result = flatMap((x: number) => [x * 2, x * 3])([1, 2]);

    expect(result).toStrictEqual([2, 3, 4, 6]);
  });

  test("should accept fn returning a readonly array", () => {
    const result = flatMap((x: number) => [x * 2, x * 3] as const)([
      1, 2,
    ] as const);

    expect(result).toStrictEqual([2, 3, 4, 6]);
  });

  test("works with non array outputs", () => {
    expect(pipe([1, 2, 3], flatMap(add(1)))).toStrictEqual([2, 3, 4]);
  });

  // eslint-disable-next-line vitest/valid-title -- This seems to be a bug in the rule, @see https://github.com/vitest-dev/eslint-plugin-vitest/issues/692
  describe(pipe, () => {
    test("with find", () => {
      const counter1 = createLazyInvocationCounter();
      const counter2 = createLazyInvocationCounter();
      const result = pipe(
        [10, 20, 30, 40] as const,
        counter1.fn(),
        flatMap((x) => [x, x + 1, x + 2, x + 3]),
        counter2.fn(),
        find((x) => x === 22),
      );

      expect(counter1.count).toHaveBeenCalledTimes(2);
      expect(counter2.count).toHaveBeenCalledTimes(7);
      expect(result).toBe(22);
    });
  });
});
