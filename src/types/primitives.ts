import { createScalarNode } from "../ScalarNode";
import { getStateTreeNodeSafe } from "../state/state-utiltities";
import {
  getType,
  typeCheckSuccess,
  typeCheckFailure,
  TypeFlags,
} from "../types/type-utilities";
import { devMode } from "../utilities";

class PrimitiveType {
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
    if (devMode() && !this.checker(snapshot)) {
      throw new Error(`Value is not a ${this.name}`);
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

    // We offer a slightly more specific error message for dates.
    const typeName =
      this.name === "Date"
        ? "Date or a unix milliseconds timestamp"
        : this.name;
    return typeCheckFailure(context, value, `Value is not a ${typeName}`);
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
    }
    return this.isValidSnapshot(value, context);
  }

  getValue(node: any): any {
    return node.storedValue;
  }

  getSnapshot(node: any): any {
    // We serialize date values to their Unix timestamp in milliseconds in snapshots. All other primitive types can use their stored value as-is.
    if (node.storedValue instanceof Date) {
      return node.storedValue.getTime();
    }
    return node.storedValue;
  }

  getSubTypes() {
    return null;
  }

  is(thing: any): thing is any {
    return this.validate(thing, [{ path: "", type: this }]).length === 0;
  }
}

export const string: any = new PrimitiveType(
  "string",
  TypeFlags.String,
  (v: any) => typeof v === "string",
  (v: any) => v
);

export const number: any = new PrimitiveType(
  "number",
  TypeFlags.Number,
  (v: any) => typeof v === "number",
  (v: any) => v
);

export const boolean: any = new PrimitiveType(
  "boolean",
  TypeFlags.Boolean,
  (v: any) => typeof v === "boolean",
  (v: any) => v
);

export const date: any = new PrimitiveType(
  "Date",
  TypeFlags.Date,
  (v: any) => v instanceof Date || typeof v === "number",
  (v: any) => (v instanceof Date ? v : new Date(v))
);
