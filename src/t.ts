import { model } from "./model";
import { NumberPrimitive } from "./NumberPrimitive";
import { BooleanPrimitive } from "./BooleanPrimitive";
import { DatePrimitive } from "./DatePrimitive";
import { PrimitiveType } from "./types/primitives";
import { TypeFlags } from "./utilities";

const string: any = new PrimitiveType(
  "string",
  TypeFlags.String,
  (v: any) => typeof v === "string",
  (v: any) => v
);

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
