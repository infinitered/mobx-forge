import { describe, expect, test } from "bun:test";
import { t, types } from "./index.ts";

describe("top level exports", () => {
  test("should include t", () => {
    expect(t).toBeDefined();
  });
  // This is for compatibility with MST before 5.4.0, which most people and documentation use as of November 2023.
  test("should alias `t` as `types`", () => {
    expect(types).toBeDefined();
  });
});
