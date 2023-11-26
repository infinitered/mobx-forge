import { devMode, fail, Hook } from "./utilities";

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
    // Make sure we don't use a property with the name of a lifecycle hook. Those should be reserved for MobX-Forge usage.
    if (key in Hook) {
      throw fail(
        `Hook '${key}' was defined as property. Hooks should be defined as part of the actions`
      );
    }
    // The user probably intended to use a view if they are calling a function `get ...`
    const descriptor = Object.getOwnPropertyDescriptor(declaredProps, key)!;
    if ("get" in descriptor) {
      throw fail(
        "Getters are not supported as properties. Please use views instead"
      );
    }

    // Properties objects may not use null or undefined as the default value. If a user wants to use null or undefined, they should use `types.maybe(someType)` or `types.maybeNull(someType)`
    const value = descriptor.value;
    if (value === null || value === undefined) {
      throw fail(
        "The default value of an attribute cannot be null or undefined as the type cannot be inferred. Did you mean `types.maybe(someType)`?"
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
  string: "string",
};
