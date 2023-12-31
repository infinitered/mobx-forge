import { describe, expect, test } from "bun:test";
import { t, getSnapshot } from "./t";
import { Hook } from "./state/state-utiltities";

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
describe("Model properties objects", () => {
  describe("when a user names a property the same as a lifecycle hook", () => {
    test("it throws an error", () => {
      const hookValues = Object.values(Hook);
      hookValues.forEach((hook) => {
        expect(() => {
          t.model({
            [hook]: t.string,
          });
        }).toThrow(
          `[mobx-forge] Hook '${hook}' was defined as property. Hooks should be defined as part of the actions`
        );
      });
    });
  });
  describe("when a user attempts to define a property with the get keyword", () => {
    test("it throws an error", () => {
      expect(() => {
        t.model({
          get foo() {
            return "bar";
          },
        });
      }).toThrow(
        "[mobx-forge] Getters are not supported as properties. Please use views instead"
      );
    });
  });
  describe("when a user attempts to define a property with null as the value", () => {
    test("it throws an error", () => {
      expect(() => {
        t.model({
          foo: null as any,
        });
      }).toThrow(
        "[mobx-forge] The default value of an attribute cannot be null or undefined as the type cannot be inferred. Did you mean `types.maybe(someType)`?"
      );
    });
  });
  describe("when a user attempts to define a property with undefined as the value", () => {
    test("it throws an error", () => {
      expect(() => {
        t.model({
          foo: undefined as any,
        });
      }).toThrow(
        "[mobx-forge] The default value of an attribute cannot be null or undefined as the type cannot be inferred. Did you mean `types.maybe(someType)`?"
      );
    });
  });
  describe("when a user defines a property using a primitive value (not null or undefined)", () => {
    describe("and the primitive value is a string", () => {
      test("it converts a string to an optional string", () => {
        const Model = t.model({
          foo: "bar",
        });

        const modelDescription = Model.describe();
        expect(modelDescription).toBe("{ foo: string? }");
      });
      test("it uses the primitive value as the default value", () => {
        const Model = t.model({
          foo: "bar",
        });

        const modelSnapshot = getSnapshot(Model.create());
        expect(modelSnapshot).toEqual({
          foo: "bar",
        });
      });
    });
    describe("and the primitive value is a number", () => {
      test("it converts a number to an optional number", () => {
        const Model = t.model({
          foo: 1,
        });

        const modelDescription = Model.describe();
        expect(modelDescription).toBe("{ foo: number? }");
      });
      test("it uses the primitive value as the default value", () => {
        const Model = t.model({
          foo: 1,
        });

        const modelSnapshot = getSnapshot(Model.create());
        expect(modelSnapshot).toEqual({
          foo: 1,
        });
      });
    });
    describe("and the primitive value is a boolean", () => {
      test("it converts a boolean to an optional boolean", () => {
        const Model = t.model({
          foo: true,
        });

        const modelDescription = Model.describe();
        expect(modelDescription).toBe("{ foo: boolean? }");
      });
      test("it uses the primitive value as the default value", () => {
        const Model = t.model({
          foo: true,
        });

        const modelSnapshot = getSnapshot(Model.create());
        expect(modelSnapshot).toEqual({
          foo: true,
        });
      });
    });
    describe("when a user defines a property using a function", () => {
      if (process.env.NODE_ENV !== "production") {
        test("it throws an error when not in production", () => {
          expect(() => {
            // @ts-ignore
            t.model({
              foo: () => "bar",
            });
          }).toThrow(
            "[mobx-forge] Invalid type definition for property 'foo', it looks like you passed a function. Did you forget to invoke it, or did you intend to declare a view / action?"
          );
        });
      }
    });
    describe("when a user defines a property using a plain JavaScript object", () => {
      if (process.env.NODE_ENV !== "production") {
        test("it throws an error when not in production", () => {
          expect(() => {
            // @ts-ignore
            t.model({
              foo: {},
            });
          }).toThrow(
            "[mobx-forge] Invalid type definition for property 'foo', it looks like you passed an object. Try passing another model type or a types.frozen."
          );
        });
      }
    });
  });
});
