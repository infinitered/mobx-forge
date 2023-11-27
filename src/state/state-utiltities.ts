/**
 * @internal
 * @hidden
 */
export function getStateTreeNodeSafe(value: any): any | null {
  return (value && value.$treenode) || null;
}
