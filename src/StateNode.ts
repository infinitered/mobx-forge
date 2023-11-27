import {
  EventHandlers,
  Hook,
  NodeLifeCycle,
  devMode,
  escapeJsonPath,
  fail,
} from "./utilities";
import { createAtom } from "mobx";

/**
 * There are two basic building blocks in MobX-Forge:
 *
 * 1. Nodes (these are backed by MobX, and represent living, runtime state)
 * 2. Types (these are not backed by MobX, and represent the schema of the state)
 *
 * This abstract class, StateNode, is heavily adapted from MobX-State-Tree's BaseNode class. It is the base class for all
 * nodes in MobX-Forge. It is responsible for managing the lifecycle of the node, as well as the lifecycle of the underlying
 * MobX atom.
 *
 * It implements some concrete methods, and leaves others abstract.
 *
 * If you're looking for where MobX really enters the picture in MobX-Forge, this is it.
 *
 * We leave this internal so that we can change it without breaking the API, and most users
 * should not need to interact with it directly or even know much about it.
 * @internal
 * @hidden
 */
export abstract class StateNode {
  /**
   * We use the definite assignment assertion here to tell TypeScript that we'll be assigning this property
   * at some point, but we don't do it in the constructor of this abstract class.
   *
   * `storedValue` will usually be set by the concrete class.
   */
  storedValue!: any; // usually the same type as the value, but not always (such as with references)
  get value(): any {
    return (this.type as any).getValue(this);
  }

  private aliveAtom?: any;
  private _state = NodeLifeCycle.INITIALIZING;
  get state() {
    return this._state;
  }
  set state(val: any) {
    const wasAlive = this.isAlive;
    this._state = val;
    const isAlive = this.isAlive;

    if (this.aliveAtom && wasAlive !== isAlive) {
      this.aliveAtom.reportChanged();
    }
  }

  get isAlive() {
    return this.state !== NodeLifeCycle.DEAD;
  }

  private _parent!: any | null;
  get parent() {
    return this._parent;
  }

  private _subpath!: string;
  get subpath() {
    return this._subpath;
  }

  private _escapedSubpath?: string;

  private _subpathUponDeath?: string;
  get subpathUponDeath() {
    return this._subpathUponDeath;
  }

  private _pathUponDeath?: string;
  protected get pathUponDeath() {
    return this._pathUponDeath;
  }

  private _hookSubscribers?: any;

  /**
   * @param type - The MobX-Forge type that this node represents. The constructor will always be called with this.
   * @param parent - The parent node, if there is one. If there is no parent, this will be `null`.
   * @param subpath - The subpath of this node. If this is the root node, this will be an empty string, otherwise it will be a string representing the path from the root node to this node.
   * @param environment - The environment that this node lives in. This is an object that can be used to store arbitrary data.
   */
  constructor(
    readonly type: any,
    parent: any | null,
    subpath: string,
    public environment: any
  ) {
    this.environment = environment;
  }

  private pathAtom?: any;
  protected baseSetParent(parent: any | null, subpath: string) {
    this._parent = parent;
    this._subpath = subpath;
    this._escapedSubpath = undefined; // regenerate when needed
    if (this.pathAtom) {
      this.pathAtom.reportChanged();
    }
  }

  /*
   * Returns (escaped) path representation as string
   */
  get path(): string {
    return this.getEscapedPath(true);
  }

  protected getEscapedPath(reportObserved: boolean): string {
    if (reportObserved) {
      if (!this.pathAtom) {
        this.pathAtom = createAtom(`path`);
      }
      this.pathAtom.reportObserved();
    }
    if (!this.parent) return "";
    // regenerate escaped subpath if needed
    if (this._escapedSubpath === undefined) {
      this._escapedSubpath = !this._subpath
        ? ""
        : escapeJsonPath(this._subpath);
    }
    return (
      this.parent.getEscapedPath(reportObserved) + "/" + this._escapedSubpath
    );
  }

  protected baseFinalizeCreation(whenFinalized?: () => void) {
    if (devMode()) {
      if (!this.isAlive) {
        // istanbul ignore next
        throw fail(
          "assertion failed: cannot finalize the creation of a node that is already dead"
        );
      }
    }

    // goal: afterCreate hooks runs depth-first. After attach runs parent first, so on afterAttach the parent has completed already
    if (this.state === NodeLifeCycle.CREATED) {
      if (this.parent) {
        if (this.parent.state !== NodeLifeCycle.FINALIZED) {
          // parent not ready yet, postpone
          return;
        }
        this.fireHook(Hook.afterAttach as any);
      }

      this.state = NodeLifeCycle.FINALIZED;

      if (whenFinalized) {
        whenFinalized();
      }
    }
  }

  protected baseFinalizeDeath() {
    if (this._hookSubscribers) {
      this._hookSubscribers.clearAll();
    }

    this._subpathUponDeath = this._subpath;
    this._pathUponDeath = this.getEscapedPath(false);
    this.baseSetParent(null, "");
    this.state = NodeLifeCycle.DEAD;
  }

  protected baseAboutToDie() {
    this.fireHook(Hook.beforeDestroy as any);
  }

  protected abstract fireHook(name: typeof Hook): void;

  protected fireInternalHook(name: typeof Hook) {
    if (this._hookSubscribers) {
      this._hookSubscribers.emit(name, this, name);
    }
  }

  registerHook(hook: any, hookHandler: any[]): any {
    if (!this._hookSubscribers) {
      this._hookSubscribers = new EventHandlers();
    }
    return this._hookSubscribers.register(hook, hookHandler);
  }

  getReconciliationType() {
    return this.type;
  }
}
