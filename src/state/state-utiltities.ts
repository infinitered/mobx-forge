/**
 * @internal
 * @hidden
 */
export function getStateTreeNodeSafe(value: any): any | null {
  return (value && value.$treenode) || null;
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
 * Simple check to check it is a number.
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
