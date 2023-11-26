import { describe, expect, it } from "bun:test";
import { t } from "./t";

describe("t", () => {
  it("should be defined", () => {
    expect(t).toBeDefined();
  });
});
