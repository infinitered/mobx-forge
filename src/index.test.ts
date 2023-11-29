import { describe, expect, test } from "bun:test";
import { t } from "./index.ts";

describe("top level exports", () => {
  test("should include t", () => {
    expect(t).toBeDefined();
  });
});
