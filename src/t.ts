import { model } from "./model";
import { string, number, boolean, date } from "./types/primitives";

export const getSnapshot = (target: any) => {
  return target.snapshot();
};

export const t = {
  model,
  string,
  Date: date,
  boolean,
  finite: "to be implemented",
  float: "to be implemented",
  identifier: "to be implemented",
  identifierNumber: "to be implemented",
  integer: "to be implemented",
  null: "to be implemented",
  number,
  undefined: "to be implemented",
};
