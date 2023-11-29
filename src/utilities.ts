/**
 * @internal
 * @hidden
 *
 * devMode is a function that returns true if the current environment is not production. Currently we only look for
 * the NODE_ENV environment variable to be set to "production", but writing this as a function allows us to change it to match
 * other runtime conventions.
 */
export function devMode() {
  return process.env.NODE_ENV !== "production";
}

/**
 * @internal
 * @hidden
 *
 * fail will construct an error message with the given message and prefix it with the mobx-forge prefix. This is useful
 * for keeping our error messages consistent and easy to find in the console.
 */
export function fail(message = "Illegal state"): Error {
  return new Error("[mobx-forge] " + message);
}

/**
 * @internal
 * @hidden
 *
 * Hook is an object that contains all of the lifecycle hooks that are available to be used in a model. We export it as const
 * so that it can be used as a type as well.
 */
export const Hook = {
  afterCreate: "afterCreate",
  afterAttach: "afterAttach",
  afterCreationFinalization: "afterCreationFinalization",
  beforeDetach: "beforeDetach",
  beforeDestroy: "beforeDestroy",
} as const;
