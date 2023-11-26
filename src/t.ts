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

/** @hidden */
export interface ModelProperties {
  [key: string]: any;
}

/** @hidden */
export type ModelPrimitive = string | number | boolean | Date;

/** @hidden */
export interface ModelPropertiesDeclaration {
  [key: string]: ModelPrimitive | any;
}

function toPropertiesObject(
  declaredProps: ModelPropertiesDeclaration
): ModelProperties {
  const keysList = Object.keys(declaredProps);

  return keysList.reduce((props, key) => {
    // The user probably intended to use a view if they are calling a function `get ...`
    const descriptor = Object.getOwnPropertyDescriptor(declaredProps, key)!;
    if ("get" in descriptor) {
      throw fail(
        "Getters are not supported as properties. Please use views instead"
      );
    }

    return props;
  }, declaredProps as any);
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

  constructor(opts: IModelTypeArguments) {
    const { name, properties } = opts;
    this.name = name;
    this.properties = toPropertiesObject(properties);
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
