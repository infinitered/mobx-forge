/**
 * @internal
 * @hidden
 */
export function devMode() {
  return process.env.NODE_ENV !== "production";
}

/**
 * @internal
 * @hidden
 */
export function fail(message = "Illegal state"): Error {
  return new Error("[mobx-forge] " + message);
}

interface IModelType {
  name?: string;
  properties: any;
}

interface IModelTypeArguments {
  name?: string;
  properties: any;
}

class ModelType implements IModelType {
  name?: string | undefined;
  properties: any;

  constructor(args: IModelTypeArguments) {
    const { name, properties } = args;
    this.name = name;
    this.properties = properties;
  }
}

const model = (...args: any[]): IModelType => {
  if (devMode() && typeof args[0] !== "string" && args[1]) {
    throw fail(
      "Model creation failed. First argument must be a string when two arguments are provided"
    );
  }

  const name = typeof args[0] === "string" ? args.shift() : "AnonymousModel";
  const properties = args.shift() || {};
  return new ModelType({ name, properties });
};

export const t = {
  model,
};
