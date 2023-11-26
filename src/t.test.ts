import { describe, expect, it, test } from "bun:test";
import { t } from "./t";

describe("t", () => {
  it("should be defined", () => {
    expect(t).toBeDefined();
  });
  describe("Model instantiation", () => {
    describe("Model name", () => {
      test("Providing a string as the first argument should set it as the model's name.", () => {
        const Model = t.model("Name", {});

        expect(Model.name).toBe("Name");
      });
      test("Providing an empty string as the first argument should set it as the model's name.", () => {
        const Model = t.model("", {});

        expect(Model.name).toBe("");
      });
      describe("Providing a non-string argument as the first and only argument should set the model's name as 'AnonymousModel'.", () => {
        const testCases = [
          {},
          null,
          undefined,
          1,
          true,
          [],
          function () {},
          new Date(),
          /a/,
          new Map(),
          new Set(),
          Symbol(),
          new Error(),
          NaN,
          Infinity,
        ];

        testCases.forEach((testCase) => {
          test(`Providing ${JSON.stringify(
            testCase
          )} as the first argument should set the model's name as 'AnonymousModel'.`, () => {
            const Model = t.model(testCase as any);

            expect(Model.name).toBe("AnonymousModel");
          });
        });
      });

      if (process.env.NODE_ENV !== "production") {
        describe("Providing a non-string argument as the first argument, and any other argument as the second argument", () => {
          describe("should throw an error in development mode", () => {
            const testCases = [
              {},
              null,
              undefined,
              1,
              true,
              [],
              function () {},
              new Date(),
              /a/,
              new Map(),
              new Set(),
              Symbol(),
              new Error(),
              NaN,
              Infinity,
            ];

            testCases.forEach((testCase) => {
              test(`Providing ${JSON.stringify(
                testCase
              )} as the first argument should throw an error.`, () => {
                expect(() => {
                  t.model(testCase as any, {});
                }).toThrow();
              });
            });
          });
        });
      } else {
        describe("Providing a non-string argument as the first argument, and any other argument as the second argument", () => {
          describe("should not throw an error in production mode", () => {
            const testCases = [
              {},
              null,
              undefined,
              1,
              true,
              [],
              function () {},
              new Date(),
              /a/,
              new Map(),
              new Set(),
              Symbol(),
              new Error(),
              NaN,
              Infinity,
            ];

            testCases.forEach((testCase) => {
              test(`Providing ${JSON.stringify(
                testCase
              )} as the first argument should not throw an error.`, () => {
                expect(() => {
                  t.model(testCase as any, {});
                }).not.toThrow();
              });
            });
          });
        });
      }
    });
  });
});
