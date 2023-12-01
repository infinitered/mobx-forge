import { fail } from "assert";
import { StateNode } from "./StateNode";
import { devMode, freeze } from "./utilities";
import { Hook, NodeLifeCycle } from "./state/state-utiltities";
import { action } from "mobx";

export class ScalarNode extends StateNode {
  // note about hooks:
  // - afterCreate is not emmited in scalar nodes, since it would be emitted in the
  //   constructor, before it can be subscribed by anybody
  // - afterCreationFinalization could be emitted, but there's no need for it right now
  // - beforeDetach is never emitted for scalar nodes, since they cannot be detached

  declare readonly type: any;

  constructor(
    simpleType: any,
    parent: any | null,
    subpath: string,
    environment: any,
    initialSnapshot: any
  ) {
    super(simpleType, parent, subpath, environment);
    try {
      this.storedValue = simpleType.createNewInstance(initialSnapshot);
    } catch (e) {
      // short-cut to die the instance, to avoid the snapshot computed starting to throw...
      this.state = NodeLifeCycle.DEAD;
      throw e;
    }

    this.state = NodeLifeCycle.CREATED;
    // for scalar nodes there's no point in firing this event since it would fire on the constructor, before
    // anybody can actually register for/listen to it
    // this.fireHook(Hook.AfterCreate)

    this.finalizeCreation();
  }

  get root(): any {
    // future optimization: store root ref in the node and maintain it
    if (!this.parent) throw fail(`This scalar node is not part of a tree`);
    return this.parent.root;
  }

  setParent(newParent: any, subpath: string): void {
    const parentChanged = this.parent !== newParent;
    const subpathChanged = this.subpath !== subpath;

    if (!parentChanged && !subpathChanged) {
      return;
    }

    if (devMode()) {
      if (!subpath) {
        // istanbul ignore next
        throw fail("assertion failed: subpath expected");
      }
      if (!newParent) {
        // istanbul ignore next
        throw fail("assertion failed: parent expected");
      }
      if (parentChanged) {
        // istanbul ignore next
        throw fail("assertion failed: scalar nodes cannot change their parent");
      }
    }

    this.environment = undefined; // use parent's
    this.baseSetParent(this.parent, subpath);
  }

  get snapshot(): any {
    return freeze(this.getSnapshot());
  }

  getSnapshot(): any {
    return this.type.getSnapshot(this);
  }

  toString(): string {
    const path = (this.isAlive ? this.path : this.pathUponDeath) || "<root>";
    return `${this.type.name}@${path}${this.isAlive ? "" : " [dead]"}`;
  }

  die(): void {
    if (!this.isAlive || this.state === NodeLifeCycle.DETACHING) return;
    this.aboutToDie();
    this.finalizeDeath();
  }

  finalizeCreation(): void {
    this.baseFinalizeCreation();
  }

  aboutToDie(): void {
    this.baseAboutToDie();
  }

  finalizeDeath(): void {
    this.baseFinalizeDeath();
  }

  protected fireHook(name: typeof Hook): void {
    this.fireInternalHook(name);
  }
}
ScalarNode.prototype.die = action(ScalarNode.prototype.die);

export function createScalarNode<C, S, T>(
  type: any,
  parent: any | null,
  subpath: string,
  environment: any,
  initialValue: C
): any {
  return new ScalarNode(type, parent, subpath, environment, initialValue);
}
