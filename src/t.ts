import { model } from "./model";
import { StringPrimitive } from "./StringPrimitive";

export const string: any = new StringPrimitive();

export const getSnapshot = (target: any) => {
  return target.snapshot();
};

export const t = {
  model,
  string,
  Date: null,
  boolean: null,
  finite: null,
  float: null,
  identifier: null,
  identifierNumber: null,
  integer: null,
  null: null,
  number: null,
  undefined: null,
};
