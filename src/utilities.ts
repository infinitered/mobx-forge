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
 * Freeze a value and return it (if not in production)
 */
export function freeze<T>(value: T): T {
  return value;
}
