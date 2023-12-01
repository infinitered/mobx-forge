import { isObservableArray } from "mobx";
import { devMode, fail } from "../utilities";

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
export const EMPTY_ARRAY: ReadonlyArray<any> = Object.freeze([]);

/**
 * @internal
 * @hidden
 */
export function typeCheckSuccess(): any {
  return EMPTY_ARRAY as any;
}

/**
 * @internal
 * @hidden
 */
export function typeCheckFailure(
  context: any,
  value: any,
  message?: string
): any {
  return [{ context, value, message }];
}

/**
 * @internal
 * @hidden
 */
export function isArray(val: any): val is any[] {
  return Array.isArray(val) || isObservableArray(val);
}

/**
 * @internal
 * @hidden
 */
export function asArray<T>(
  val: undefined | null | T | T[] | ReadonlyArray<T>
): T[] {
  if (!val) return EMPTY_ARRAY as any as T[];
  if (isArray(val)) return val as T[];
  return [val] as T[];
}

/**
 * @internal
 * @hidden
 */
export function assertArg<T>(
  value: T,
  fn: (value: T) => boolean,
  typeName: string,
  argNumber: number | number[]
) {
  if (devMode()) {
    if (!fn(value)) {
      // istanbul ignore next
      throw fail(
        `expected ${typeName} as argument ${asArray(argNumber).join(
          " or "
        )}, got ${value} instead`
      );
    }
  }
}

/**
 * Returns true if the given value is a node in a state tree.
 * More precisely, that is, if the value is an instance of a
 * `types.model`, `types.array` or `types.map`.
 *
 * @param value
 * @returns true if the value is a state tree node.
 */
export function isStateTreeNode(value: any) {
  return !!(value && value.$treenode);
}

/**
 * @internal
 * @hidden
 */
export function assertIsStateTreeNode(
  value: any,
  argNumber: number | number[]
): void {
  assertArg(value, isStateTreeNode, "mobx-state-tree node", argNumber);
}

/**
 * @internal
 * @hidden
 */
export function getStateTreeNode(value: any): any {
  if (!isStateTreeNode(value)) {
    // istanbul ignore next
    throw fail(`Value ${value} is no MST Node`);
  }
  return value.$treenode!;
}

/**
 * Returns the _actual_ type of the given tree node. (Or throws)
 *
 * @param object
 * @returns
 */
export function getType(object: any): any {
  assertIsStateTreeNode(object, 1);

  return getStateTreeNode(object).type;
}
