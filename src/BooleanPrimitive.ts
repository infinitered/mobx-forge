import { createScalarNode } from "./ScalarNode";
import { TypeFlags } from "./utilities";
import { getStateTreeNodeSafe } from "./state/state-utiltities";
import {
  getType,
  typeCheckSuccess,
  typeCheckFailure,
} from "./types/type-utilities";

export class BooleanPrimitive {
  readonly flags: TypeFlags = TypeFlags.Boolean;
  readonly isType = true;
  readonly name = "boolean";

  describe() {
    return "boolean";
  }
  create(snapshot?: any, environment?: any) {
    // TODO: implement actual type checking. For now, we just assume we're looking for numbers
    if (typeof snapshot !== "boolean") {
      throw new Error("Expected boolean");
    }
    return this.instantiate(null, "", environment, snapshot).value;
  }

  createNewInstance(snapshot: any): any {
    return snapshot as any;
  }

  instantiate(
    parent: any | null,
    subpath: string,
    environment: any,
    initialValue: any
  ): any {
    return createScalarNode(this, parent, subpath, environment, initialValue);
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

  getSubTypes(): null {
    return null;
  }

  checker(value: any): boolean {
    return typeof value === "boolean";
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

  is(thing: any): thing is any {
    return this.validate(thing, [{ path: "", type: this }]).length === 0;
  }
}
