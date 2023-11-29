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

export const NodeLifeCycle = {
  INITIALIZING: "INITIALIZING", // setting up
  CREATED: "CREATED", // afterCreate has run
  FINALIZED: "FINALIZED", // afterAttach has run
  DETACHING: "DETACHING", // being detached from the tree
  DEAD: "DEAD", // no coming back from this one
} as const;

/**
 * @internal
 * @hidden
 * Freeze a value and return it (if not in production)
 */
export function freeze<T>(value: T): T {
  return value;
}

/**
 * Simple simple check to check it is a number.
 */
function isNumber(x: string): boolean {
  return typeof x === "number";
}

/**
 * Escape slashes and backslashes.
 *
 * http://tools.ietf.org/html/rfc6901
 */
export function escapeJsonPath(path: string): string {
  if (isNumber(path) === true) {
    return "" + path;
  }
  if (path.indexOf("/") === -1 && path.indexOf("~") === -1) return path;
  return path.replace(/~/g, "~0").replace(/\//g, "~1");
}

/**
 * @internal
 * @hidden
 */
export enum TypeFlags {
  String = 1,
  Number = 1 << 1,
  Boolean = 1 << 2,
  Date = 1 << 3,
  Literal = 1 << 4,
  Array = 1 << 5,
  Map = 1 << 6,
  Object = 1 << 7,
  Frozen = 1 << 8,
  Optional = 1 << 9,
  Reference = 1 << 10,
  Identifier = 1 << 11,
  Late = 1 << 12,
  Refinement = 1 << 13,
  Union = 1 << 14,
  Null = 1 << 15,
  Undefined = 1 << 16,
  Integer = 1 << 17,
  Custom = 1 << 18,
  SnapshotProcessor = 1 << 19,
  Lazy = 1 << 20,
  Finite = 1 << 21,
  Float = 1 << 22,
}

/**
 * @internal
 * @hidden
 */
class EventHandler<F extends Function> {
  private handlers: F[] = [];

  get hasSubscribers(): boolean {
    return this.handlers.length > 0;
  }

  register(fn: F, atTheBeginning = false): any {
    if (atTheBeginning) {
      this.handlers.unshift(fn);
    } else {
      this.handlers.push(fn);
    }
    return () => {
      this.unregister(fn);
    };
  }

  has(fn: F): boolean {
    return this.handlers.indexOf(fn) >= 0;
  }

  unregister(fn: F) {
    const index = this.handlers.indexOf(fn);
    if (index >= 0) {
      this.handlers.splice(index, 1);
    }
  }

  clear() {
    this.handlers.length = 0;
  }

  emit(...args: any[]) {
    // make a copy just in case it changes
    const handlers = this.handlers.slice();
    handlers.forEach((f) => f(...args));
  }
}

/**
 * @internal
 * @hidden
 */
export class EventHandlers<E extends { [k: string]: Function }> {
  private eventHandlers?: { [k in keyof E]?: any };

  hasSubscribers(event: keyof E): boolean {
    const handler = this.eventHandlers && this.eventHandlers[event];
    return !!handler && handler!.hasSubscribers;
  }

  register<N extends keyof E>(event: N, fn: E[N], atTheBeginning = false): any {
    if (!this.eventHandlers) {
      this.eventHandlers = {};
    }
    let handler = this.eventHandlers[event];
    if (!handler) {
      handler = this.eventHandlers[event] = new EventHandler();
    }
    return handler.register(fn, atTheBeginning);
  }

  has<N extends keyof E>(event: N, fn: E[N]): boolean {
    const handler = this.eventHandlers && this.eventHandlers[event];
    return !!handler && handler!.has(fn);
  }

  unregister<N extends keyof E>(event: N, fn: E[N]) {
    const handler = this.eventHandlers && this.eventHandlers[event];
    if (handler) {
      handler!.unregister(fn);
    }
  }

  clear<N extends keyof E>(event: N) {
    if (this.eventHandlers) {
      delete this.eventHandlers[event];
    }
  }

  clearAll() {
    this.eventHandlers = undefined;
  }

  emit<N extends keyof E>(event: N, ...args: any[]) {
    const handler = this.eventHandlers && this.eventHandlers[event];
    if (handler) {
      (handler!.emit as any)(...args);
    }
  }
}
