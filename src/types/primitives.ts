import { createScalarNode } from "../ScalarNode";
import { TypeFlags } from "../utilities";
import { getStateTreeNodeSafe } from "../state/state-utiltities";
import {
  getType,
  typeCheckSuccess,
  typeCheckFailure,
} from "../types/type-utilities";

export class PrimitiveType {
  readonly flags;
  readonly isType = true;

  name;
  checker;
  initializer;

  constructor(
    name: string,
    flags: TypeFlags,
    checker: Function,
    initializer: Function
  ) {
    this.name = name;
    this.flags = flags;
    this.checker = checker;
    this.initializer = initializer;
  }

  describe() {
    return this.name;
  }

  instantiate(
    parent: any | null,
    subpath: string,
    environment: any,
    initialValue: any
  ): any {
    return createScalarNode(this, parent, subpath, environment, initialValue);
  }

  create(snapshot?: any, environment?: any) {
    if (typeof snapshot !== this.name) {
      throw new Error(`Expected ${this.name}`);
    }
    return this.instantiate(null, "", environment, snapshot!).value;
  }

  createNewInstance(snapshot: any) {
    return this.initializer(snapshot);
  }

  isValidSnapshot(value: any, context: any): any {
    if (this.checker(value as any)) {
      return typeCheckSuccess();
    }

    return typeCheckFailure(context, value, `Value is not a ${this.name}`);
  }

  isAssignableFrom(type: any): boolean {
    return type === this;
  }

  validate(value: any, context: any): any {
    const node = getStateTreeNodeSafe(value);
    if (node) {
      const valueType = getType(value);
      return this.isAssignableFrom(valueType)
        ? typeCheckSuccess()
        : typeCheckFailure(context, value);
      // it is tempting to compare snapshots, but in that case we should always clone on assignments...
    }
    return this.isValidSnapshot(value, context);
  }

  getValue(node: any): any {
    // if we ever find a case where scalar nodes can be accessed without iterating through its parent
    // uncomment this to make sure the parent chain is created when this is accessed
    // if (node.parent) {
    //     node.parent.createObservableInstanceIfNeeded()
    // }
    return node.storedValue;
  }

  getSnapshot(node: any): any {
    return node.storedValue;
  }

  getSubTypes() {
    return null;
  }

  is(thing: any): thing is any {
    return this.validate(thing, [{ path: "", type: this }]).length === 0;
  }
}
