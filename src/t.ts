import { model } from "./model";
import { StringPrimitive } from "./StringPrimitive";
import { NumberPrimitive } from "./NumberPrimitive";

const string: any = new StringPrimitive();

const number: any = new NumberPrimitive();

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
  number,
  undefined: null,
};
