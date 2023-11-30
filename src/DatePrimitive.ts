import { createScalarNode } from "./ScalarNode";
import { TypeFlags } from "./utilities";
import { getStateTreeNodeSafe } from "./state/state-utiltities";
import {
  getType,
  typeCheckSuccess,
  typeCheckFailure,
} from "./types/type-utilities";

export class DatePrimitive {
  readonly flags: TypeFlags = TypeFlags.Date;
  readonly isType = true;
  readonly name = "Date";

  describe() {
    return "Date";
  }
  create(snapshot?: any, environment?: any) {
    // Check if the snapshot is a Date or a unix milliseconds timestamp
    if (!(snapshot instanceof Date) && typeof snapshot !== "number") {
      throw new Error("Expected Date or unix milliseconds timestamp");
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
    const value = node.storedValue;
    return value instanceof Date ? value : new Date(value);
  }

  // If the node is a number, return it. If it's a Date, return its timestamp
  getSnapshot(node: any): any {
    const value = node.storedValue;
    return value instanceof Date ? value.getTime() : value;
  }

  getSubTypes(): null {
    return null;
  }

  checker(value: any): boolean {
    return value instanceof Date || typeof value === "number";
  }

  isValidSnapshot(value: any, context: any): any {
    if (this.checker(value as any)) {
      return typeCheckSuccess();
    }

    return typeCheckFailure(
      context,
      value,
      `Value is not a Date or a unix milliseconds timestamp`
    );
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
