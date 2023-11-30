import { describe, expect, it, test } from "bun:test";
import { t } from "./t";
import { Hook, NodeLifeCycle } from "./utilities";

describe("t", () => {
  it("should be defined", () => {
    expect(t).toBeDefined();
  });

  describe("t.string", () => {
    describe("methods", () => {
      describe("create", () => {
        if (process.env.NODE_ENV !== "production") {
          describe("with no arguments", () => {
            it("should throw an error in development", () => {
              expect(() => {
                t.string.create();
              }).toThrow();
            });
          });
        }
        describe("with a string argument", () => {
          it("should return a string", () => {
            const s = t.string.create("foo");
            expect(typeof s).toBe("string");
          });
        });
        describe("with argument of different types", () => {
          const testCases = [
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

          if (process.env.NODE_ENV !== "production") {
            testCases.forEach((testCase) => {
              it(`should throw an error when passed ${JSON.stringify(
                testCase
              )}`, () => {
                expect(() => {
                  t.string.create(testCase as any);
                }).toThrow();
              });
            });
          }
        });
      });
      describe("describe", () => {
        it("should return the value 'string'", () => {
          const description = t.string.describe();
          expect(description).toBe("string");
        });
      });
      describe("getSnapshot", () => {
        it("should return the value passed in", () => {
          const s = t.string.instantiate(null, "", {}, "foo");
          const snapshot = t.string.getSnapshot(s);
          expect(snapshot).toBe("foo");
        });
      });
      describe("getSubtype", () => {
        it("should return null", () => {
          const subtype = t.string.getSubTypes();
          expect(subtype).toBe(null);
        });
      });
      describe("instantiate", () => {
        if (process.env.NODE_ENV !== "production") {
          describe("with invalid arguments", () => {
            it("should not throw an error", () => {
              expect(() => {
                // @ts-ignore
                t.string.instantiate();
              }).not.toThrow();
            });
          });
        }
        describe("with a string argument", () => {
          it("should return an object", () => {
            const s = t.string.instantiate(null, "", {}, "foo");
            expect(typeof s).toBe("object");
          });
        });
      });
      describe("is", () => {
        describe("with a string argument", () => {
          it("should return true", () => {
            const result = t.string.is("foo");
            expect(result).toBe(true);
          });
        });
        describe("with argument of different types", () => {
          const testCases = [
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
            it(`should return false when passed ${JSON.stringify(
              testCase
            )}`, () => {
              const result = t.string.is(testCase as any);
              expect(result).toBe(false);
            });
          });
        });
      });
      describe("isAssignableFrom", () => {
        describe("with a string argument", () => {
          it("should return true", () => {
            const result = t.string.isAssignableFrom(t.string);
            expect(result).toBe(true);
          });
        });
        describe("with argument of different types", () => {
          const testCases = [
            t.Date,
            t.boolean,
            t.finite,
            t.float,
            t.identifier,
            t.identifierNumber,
            t.integer,
            t.null,
            t.number,
            t.undefined,
          ];

          testCases.forEach((testCase) => {
            it(`should return false when passed ${JSON.stringify(
              testCase
            )}`, () => {
              const result = t.string.isAssignableFrom(testCase as any);
              expect(result).toBe(false);
            });
          });
        });
      });
      // TODO: we need to test this, but to be honest I'm not sure what the expected behavior is on single string nodes.
      describe.skip("reconcile", () => {});
      describe("validate", () => {
        describe("with a string argument", () => {
          it("should return with no validation errors", () => {
            const result = t.string.validate("foo", []);
            expect(result).toEqual([]);
          });
        });
        describe("with argument of different types", () => {
          const testCases = [
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
            it(`should return with a validation error when passed ${JSON.stringify(
              testCase
            )}`, () => {
              const result = t.string.validate(testCase as any, []);
              expect(result).toEqual([
                {
                  context: [],
                  message: "Value is not a string",
                  value: testCase,
                },
              ]);
            });
          });
        });
      });
    });
    describe("properties", () => {
      describe("flags", () => {
        test("return the correct value", () => {
          const flags = t.string.flags;
          expect(flags).toBe(1);
        });
      });
      describe("identifierAttribute", () => {
        // We don't have a way to set the identifierAttribute on a primitive type, so this should return undefined.
        test("returns undefined", () => {
          const identifierAttribute = t.string.identifierAttribute;
          expect(identifierAttribute).toBe(undefined);
        });
      });
      describe("isType", () => {
        test("returns true", () => {
          const isType = t.string.isType;
          expect(isType).toBe(true);
        });
      });
      describe("name", () => {
        test('returns "string"', () => {
          const name = t.string.name;
          expect(name).toBe("string");
        });
      });
    });
    describe("instance", () => {
      describe("methods", () => {
        describe("aboutToDie", () => {
          it("calls the beforeDetach hook", () => {
            const s = t.string.instantiate(null, "", {}, "foo");
            let called = false;
            s.registerHook(Hook.beforeDestroy, () => {
              called = true;
            });
            s.aboutToDie();
            expect(called).toBe(true);
          });
        });
        describe("die", () => {
          it("kills the node", () => {
            const s = t.string.instantiate(null, "", {}, "foo");
            s.die();
            expect(s.isAlive).toBe(false);
          });
          it("should mark the node as dead", () => {
            const s = t.string.instantiate(null, "", {}, "foo");
            s.die();
            expect(s.state).toBe(NodeLifeCycle.DEAD);
          });
        });
        describe("finalizeCreation", () => {
          it("should mark the node as finalized", () => {
            const s = t.string.instantiate(null, "", {}, "foo");
            s.finalizeCreation();
            expect(s.state).toBe(NodeLifeCycle.FINALIZED);
          });
        });
        describe("finalizeDeath", () => {
          it("should mark the node as dead", () => {
            const s = t.string.instantiate(null, "", {}, "foo");
            s.finalizeDeath();
            expect(s.state).toBe(NodeLifeCycle.DEAD);
          });
        });
        describe("getReconciliationType", () => {
          it("should return the correct type", () => {
            const s = t.string.instantiate(null, "", {}, "foo");
            const type = s.getReconciliationType();
            expect(type).toBe(t.string);
          });
        });
        describe("getSnapshot", () => {
          it("should return the value passed in", () => {
            const s = t.string.instantiate(null, "", {}, "foo");
            const snapshot = s.getSnapshot();
            expect(snapshot).toBe("foo");
          });
        });
        describe("registerHook", () => {
          it("should register a hook and call it", () => {
            const s = t.string.instantiate(null, "", {}, "foo");
            let called = false;
            s.registerHook(Hook.beforeDestroy, () => {
              called = true;
            });

            s.die();

            expect(called).toBe(true);
          });
        });
        describe("setParent", () => {
          if (process.env.NODE_ENV !== "production") {
            describe("with null", () => {
              it("should throw an error", () => {
                const s = t.string.instantiate(null, "", {}, "foo");
                expect(() => {
                  s.setParent(null, "foo");
                }).toThrow();
              });
            });
            // Skip this until we have fully-working t.model definitions
            describe.skip("with a parent object", () => {
              it("should throw an error", () => {
                const Parent = t.model({
                  child: t.string,
                });

                // @ts-ignore
                const parent = Parent.create({ child: "foo" });

                const s = t.string.instantiate(null, "", {}, "bar");

                expect(() => {
                  // @ts-ignore
                  s.setParent(parent, "bar");
                }).toThrow(
                  "[mobx-state-tree] assertion failed: scalar nodes cannot change their parent"
                );
              });
            });
          }
        });
      });
    });
  });

  describe("t.number", () => {
    describe("methods", () => {
      describe("create", () => {
        describe("with no arguments", () => {
          if (process.env.NODE_ENV !== "production") {
            it("should throw an error in development", () => {
              expect(() => {
                t.number.create();
              }).toThrow();
            });
          }
        });
        describe("with a number argument", () => {
          it("should return a number", () => {
            const n = t.number.create(1);
            expect(typeof n).toBe("number");
          });
        });
        describe("with argument of different types", () => {
          // Keep in mind, Infinity and NaN are treated as numbers in JavaScript, so we won't test for them here.
          const testCases = [
            null,
            undefined,
            "string",
            true,
            [],
            function () {},
            new Date(),
            /a/,
            new Map(),
            new Set(),
            Symbol(),
            new Error(),
          ];

          if (process.env.NODE_ENV !== "production") {
            testCases.forEach((testCase) => {
              it(`should throw an error when passed ${JSON.stringify(
                testCase
              )}`, () => {
                expect(() => {
                  t.number.create(testCase as any);
                }).toThrow();
              });
            });
          }
        });
      });
      describe("describe", () => {
        it("should return the value 'number'", () => {
          const description = t.number.describe();
          expect(description).toBe("number");
        });
      });
      describe("getSnapshot", () => {
        it("should return the value passed in", () => {
          const n = t.number.instantiate(null, "", {}, 1);
          const snapshot = t.number.getSnapshot(n);
          expect(snapshot).toBe(1);
        });
      });
      describe("getSubtype", () => {
        it("should return null", () => {
          const subtype = t.number.getSubTypes();
          expect(subtype).toBe(null);
        });
      });
      describe("instantiate", () => {
        if (process.env.NODE_ENV !== "production") {
          describe("with invalid arguments", () => {
            it("should not throw an error", () => {
              expect(() => {
                // @ts-ignore
                t.number.instantiate();
              }).not.toThrow();
            });
          });
        }
        describe("with a string argument", () => {
          it("should return an object", () => {
            const n = t.number.instantiate(null, "", {}, 1);
            expect(typeof n).toBe("object");
          });
        });
      });
      describe("is", () => {
        describe("with a number argument", () => {
          it("should return true", () => {
            const result = t.number.is(1);
            expect(result).toBe(true);
          });
        });
        describe("with argument of different types", () => {
          // Keep in mind, Infinity and NaN are treated as numbers in JavaScript, so we won't test for them here.
          const testCases = [
            null,
            undefined,
            "string",
            true,
            [],
            function () {},
            new Date(),
            /a/,
            new Map(),
            new Set(),
            Symbol(),
            new Error(),
          ];

          testCases.forEach((testCase) => {
            it(`should return false when passed ${JSON.stringify(
              testCase
            )}`, () => {
              const result = t.number.is(testCase as any);
              expect(result).toBe(false);
            });
          });
        });
      });
      describe("isAssignableFrom", () => {
        describe("with a number argument", () => {
          it("should return true", () => {
            const result = t.number.isAssignableFrom(t.number);
            expect(result).toBe(true);
          });
        });
        describe("with argument of different types", () => {
          const testCases = [
            t.Date,
            t.boolean,
            t.finite,
            t.float,
            t.identifier,
            t.identifierNumber,
            t.integer,
            t.null,
            t.string,
            t.undefined,
          ];

          testCases.forEach((testCase) => {
            it(`should return false when passed ${JSON.stringify(
              testCase
            )}`, () => {
              const result = t.number.isAssignableFrom(testCase as any);
              expect(result).toBe(false);
            });
          });
        });
      });
      // TODO: we need to test this, but to be honest I'm not sure what the expected behavior is on single string noden.
      describe.skip("reconcile", () => {});
      describe("validate", () => {
        describe("with a string argument", () => {
          it("should return with no validation errors", () => {
            const result = t.number.validate(1, []);
            expect(result).toEqual([]);
          });
        });
        describe("with argument of different types", () => {
          // Keep in mind, Infinity and NaN are treated as numbers in JavaScript, so we won't test for them here.
          const testCases = [
            null,
            undefined,
            "string",
            true,
            [],
            function () {},
            new Date(),
            /a/,
            new Map(),
            new Set(),
            Symbol(),
            new Error(),
          ];

          testCases.forEach((testCase) => {
            it(`should return with a validation error when passed ${JSON.stringify(
              testCase
            )}`, () => {
              const result = t.number.validate(testCase as any, []);
              expect(result).toEqual([
                {
                  context: [],
                  message: "Value is not a number",
                  value: testCase,
                },
              ]);
            });
          });
        });
      });
    });
    describe("properties", () => {
      describe("flags", () => {
        test("return the correct value", () => {
          const flags = t.number.flags;
          expect(flags).toBe(2);
        });
      });
      describe("identifierAttribute", () => {
        // We don't have a way to set the identifierAttribute on a primitive type, so this should return undefined.
        test("returns undefined", () => {
          const identifierAttribute = t.number.identifierAttribute;
          expect(identifierAttribute).toBe(undefined);
        });
      });
      describe("isType", () => {
        test("returns true", () => {
          const isType = t.number.isType;
          expect(isType).toBe(true);
        });
      });
      describe("name", () => {
        test('returns "number"', () => {
          const name = t.number.name;
          expect(name).toBe("number");
        });
      });
    });
    describe("instance", () => {
      describe("methods", () => {
        describe("aboutToDie", () => {
          it("calls the beforeDetach hook", () => {
            const n = t.number.instantiate(null, "", {}, 1);
            let called = false;
            n.registerHook(Hook.beforeDestroy, () => {
              called = true;
            });
            n.aboutToDie();
            expect(called).toBe(true);
          });
        });
        describe("die", () => {
          it("kills the node", () => {
            const n = t.number.instantiate(null, "", {}, 1);
            n.die();
            expect(n.isAlive).toBe(false);
          });
          it("should mark the node as dead", () => {
            const n = t.number.instantiate(null, "", {}, 1);
            n.die();
            expect(n.state).toBe(NodeLifeCycle.DEAD);
          });
        });
        describe("finalizeCreation", () => {
          it("should mark the node as finalized", () => {
            const n = t.number.instantiate(null, "", {}, 1);
            n.finalizeCreation();
            expect(n.state).toBe(NodeLifeCycle.FINALIZED);
          });
        });
        describe("finalizeDeath", () => {
          it("should mark the node as dead", () => {
            const n = t.number.instantiate(null, "", {}, 1);
            n.finalizeDeath();
            expect(n.state).toBe(NodeLifeCycle.DEAD);
          });
        });
        describe("getReconciliationType", () => {
          it("should return the correct type", () => {
            const n = t.number.instantiate(null, "", {}, 1);
            const type = n.getReconciliationType();
            expect(type).toBe(t.number);
          });
        });
        describe("getSnapshot", () => {
          it("should return the value passed in", () => {
            const n = t.number.instantiate(null, "", {}, 1);
            const snapshot = n.getSnapshot();
            expect(snapshot).toBe(1);
          });
        });
        describe("registerHook", () => {
          it("should register a hook and call it", () => {
            const n = t.number.instantiate(null, "", {}, 1);
            let called = false;
            n.registerHook(Hook.beforeDestroy, () => {
              called = true;
            });

            n.die();

            expect(called).toBe(true);
          });
        });
        describe("setParent", () => {
          if (process.env.NODE_ENV !== "production") {
            describe("with null", () => {
              it("should throw an error", () => {
                const n = t.number.instantiate(null, "", {}, 1);
                expect(() => {
                  n.setParent(null, "foo");
                }).toThrow();
              });
            });
            describe.skip("with a parent object", () => {
              it("should throw an error", () => {
                const Parent = t.model({
                  child: t.number,
                });

                // @ts-ignore
                const parent = Parent.create({ child: 1 });

                const n = t.number.instantiate(null, "", {}, 1);

                expect(() => {
                  // @ts-ignore
                  n.setParent(parent, "bar");
                }).toThrow(
                  "[mobx-state-tree] assertion failed: scalar nodes cannot change their parent"
                );
              });
            });
          }
        });
      });
    });
  });

  describe("t.boolean", () => {
    describe("methods", () => {
      describe("create", () => {
        describe("with no arguments", () => {
          if (process.env.NODE_ENV !== "production") {
            it("should throw an error in development", () => {
              expect(() => {
                t.boolean.create();
              }).toThrow();
            });
          }
        });
        describe("with a boolean argument", () => {
          it("should return a boolean", () => {
            const n = t.boolean.create(true);
            expect(typeof n).toBe("boolean");
          });
        });
        describe("with argument of different types", () => {
          const testCases = [
            null,
            undefined,
            "string",
            1,
            [],
            function () {},
            new Date(),
            /a/,
            new Map(),
            new Set(),
            Symbol(),
            new Error(),
            Infinity,
            NaN,
          ];

          if (process.env.NODE_ENV !== "production") {
            testCases.forEach((testCase) => {
              it(`should throw an error when passed ${JSON.stringify(
                testCase
              )}`, () => {
                expect(() => {
                  t.boolean.create(testCase as any);
                }).toThrow();
              });
            });
          }
        });
      });
      describe("describe", () => {
        it("should return the value 'boolean'", () => {
          const description = t.boolean.describe();
          expect(description).toBe("boolean");
        });
      });
      describe("getSnapshot", () => {
        it("should return the value passed in", () => {
          const b = t.boolean.instantiate(null, "", {}, true);
          const snapshot = t.boolean.getSnapshot(b);
          expect(snapshot).toBe(true);
        });
      });
      describe("getSubtype", () => {
        it("should return null", () => {
          const subtype = t.boolean.getSubTypes();
          expect(subtype).toBe(null);
        });
      });
      describe("instantiate", () => {
        if (process.env.NODE_ENV !== "production") {
          describe("with invalid arguments", () => {
            it("should not throw an error", () => {
              expect(() => {
                // @ts-ignore
                t.boolean.instantiate();
              }).not.toThrow();
            });
          });
        }
        describe("with a boolean argument", () => {
          it("should return an object", () => {
            const b = t.boolean.instantiate(null, "", {}, true);
            expect(typeof b).toBe("object");
          });
        });
      });
      describe("is", () => {
        describe("with a boolean argument", () => {
          it("should return true", () => {
            const result = t.boolean.is(true);
            expect(result).toBe(true);
          });
        });
        describe("with argument of different types", () => {
          const testCases = [
            null,
            undefined,
            "string",
            1,
            [],
            function () {},
            new Date(),
            /a/,
            new Map(),
            new Set(),
            Symbol(),
            new Error(),
            Infinity,
            NaN,
          ];

          testCases.forEach((testCase) => {
            it(`should return false when passed ${JSON.stringify(
              testCase
            )}`, () => {
              const result = t.boolean.is(testCase as any);
              expect(result).toBe(false);
            });
          });
        });
      });
      describe("isAssignableFrom", () => {
        describe("with a boolean argument", () => {
          it("should return true", () => {
            const result = t.boolean.isAssignableFrom(t.boolean);
            expect(result).toBe(true);
          });
        });
        describe("with argument of different types", () => {
          const testCases = [
            t.Date,
            t.number,
            t.finite,
            t.float,
            t.identifier,
            t.identifierNumber,
            t.integer,
            t.null,
            t.string,
            t.undefined,
          ];

          testCases.forEach((testCase) => {
            it(`should return false when passed ${JSON.stringify(
              testCase
            )}`, () => {
              const result = t.boolean.isAssignableFrom(testCase as any);
              expect(result).toBe(false);
            });
          });
        });
      });
      // TODO: we need to test this, but to be honest I'm not sure what the expected behavior is on single string noden.
      describe.skip("reconcile", () => {});
      describe("validate", () => {
        describe("with a boolean argument", () => {
          it("should return with no validation errors", () => {
            const result = t.boolean.validate(true, []);
            expect(result).toEqual([]);
          });
        });
        describe("with argument of different types", () => {
          const testCases = [
            null,
            undefined,
            "string",
            1,
            [],
            function () {},
            new Date(),
            /a/,
            new Map(),
            new Set(),
            Symbol(),
            new Error(),
            Infinity,
            NaN,
          ];

          testCases.forEach((testCase) => {
            it(`should return with a validation error when passed ${JSON.stringify(
              testCase
            )}`, () => {
              const result = t.boolean.validate(testCase as any, []);
              expect(result).toEqual([
                {
                  context: [],
                  message: "Value is not a boolean",
                  value: testCase,
                },
              ]);
            });
          });
        });
      });
    });
    describe("properties", () => {
      describe("flags", () => {
        test("return the correct value", () => {
          const flags = t.boolean.flags;
          expect(flags).toBe(4);
        });
      });
      describe("identifierAttribute", () => {
        // We don't have a way to set the identifierAttribute on a primitive type, so this should return undefined.
        test("returns undefined", () => {
          const identifierAttribute = t.boolean.identifierAttribute;
          expect(identifierAttribute).toBe(undefined);
        });
      });
      describe("isType", () => {
        test("returns true", () => {
          const isType = t.boolean.isType;
          expect(isType).toBe(true);
        });
      });
      describe("name", () => {
        test('returns "boolean"', () => {
          const name = t.boolean.name;
          expect(name).toBe("boolean");
        });
      });
    });
    describe("instance", () => {
      describe("methods", () => {
        describe("aboutToDie", () => {
          it("calls the beforeDetach hook", () => {
            const b = t.boolean.instantiate(null, "", {}, true);
            let called = false;
            b.registerHook(Hook.beforeDestroy, () => {
              called = true;
            });
            b.aboutToDie();
            expect(called).toBe(true);
          });
        });
        describe("die", () => {
          it("kills the node", () => {
            const b = t.boolean.instantiate(null, "", {}, true);
            b.die();
            expect(b.isAlive).toBe(false);
          });
          it("should mark the node as dead", () => {
            const b = t.boolean.instantiate(null, "", {}, true);
            b.die();
            expect(b.state).toBe(NodeLifeCycle.DEAD);
          });
        });
        describe("finalizeCreation", () => {
          it("should mark the node as finalized", () => {
            const b = t.boolean.instantiate(null, "", {}, true);
            b.finalizeCreation();
            expect(b.state).toBe(NodeLifeCycle.FINALIZED);
          });
        });
        describe("finalizeDeath", () => {
          it("should mark the node as dead", () => {
            const b = t.boolean.instantiate(null, "", {}, true);
            b.finalizeDeath();
            expect(b.state).toBe(NodeLifeCycle.DEAD);
          });
        });
        describe("getReconciliationType", () => {
          it("should return the correct type", () => {
            const b = t.boolean.instantiate(null, "", {}, true);
            const type = b.getReconciliationType();
            expect(type).toBe(t.boolean);
          });
        });
        describe("getSnapshot", () => {
          it("should return the value passed in", () => {
            const b = t.boolean.instantiate(null, "", {}, true);
            const snapshot = b.getSnapshot();
            expect(snapshot).toBe(true);
          });
        });
        describe("registerHook", () => {
          it("should register a hook and call it", () => {
            const b = t.boolean.instantiate(null, "", {}, true);
            let called = false;
            b.registerHook(Hook.beforeDestroy, () => {
              called = true;
            });

            b.die();

            expect(called).toBe(true);
          });
        });
        describe("setParent", () => {
          if (process.env.NODE_ENV !== "production") {
            describe("with null", () => {
              it("should throw an error", () => {
                const b = t.boolean.instantiate(null, "", {}, true);
                expect(() => {
                  b.setParent(null, "foo");
                }).toThrow();
              });
            });
            describe.skip("with a parent object", () => {
              it("should throw an error", () => {
                const Parent = t.model({
                  child: t.boolean,
                });

                // @ts-ignore
                const parent = Parent.create({ child: true });

                const b = t.boolean.instantiate(null, "", {}, true);

                expect(() => {
                  // @ts-ignore
                  b.setParent(parent, "bar");
                }).toThrow(
                  "[mobx-state-tree] assertion failed: scalar nodes cannot change their parent"
                );
              });
            });
          }
        });
      });
    });
  });
});
