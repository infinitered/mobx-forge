import { model } from "./model";

export const getSnapshot = (target: any) => {
  return target.snapshot();
};

export const t = {
  model,
  string: "string",
};
