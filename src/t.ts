import { model } from "./model";
import { StringPrimitive } from "./StringPrimitive";
import { NumberPrimitive } from "./NumberPrimitive";
import { BooleanPrimitive } from "./BooleanPrimitive";
import { DatePrimitive } from "./DatePrimitive";

const string: any = new StringPrimitive();

const number: any = new NumberPrimitive();

const boolean: any = new BooleanPrimitive();

const Date: any = new DatePrimitive();

export const getSnapshot = (target: any) => {
  return target.snapshot();
};

export const t = {
  model,
  string,
  Date,
  boolean,
  finite: null,
  float: null,
  identifier: null,
  identifierNumber: null,
  integer: null,
  null: null,
  number,
  undefined: null,
};
