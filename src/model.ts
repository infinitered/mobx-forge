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

class PrimitiveType<T> {
  name: string;
  value: T;
  optional: boolean = true;

  constructor(name: string, value: T) {
    this.name = name;
    this.value = value;
  }
  /**
   * Returns a string representation of the primitive type. It will be suffixed with a `?` if the type is optional.
   * @returns {string} A string representation of the primitive type.
   */
  describe() {
    return this.optional ? `${this.name}?` : this.name;
  }
}

/**
 * A node should take a set of properties and return a new object with those properties. It should also have a snapshot
 * method that returns the current state of the node.
 */
class Node {
  properties: any = {};

  // We'll be given a set of properties, and we want to unbox them into the properties object.
  constructor(properties: ModelProperties) {
    const keys = Object.keys(properties);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const property = properties[key];
      this.properties[key] = property.value;
    }
  }

  // We want to return the current state of the node.
  snapshot() {
    return this.properties;
  }
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

    if (devMode() && typeof value === "function") {
      throw fail(
        `Invalid type definition for property '${key}', it looks like you passed a function. Did you forget to invoke it, or did you intend to declare a view / action?`
      );
    }

    if (devMode() && typeof value === "object") {
      throw fail(
        `Invalid type definition for property '${key}', it looks like you passed an object. Try passing another model type or a types.frozen.`
      );
    }

    // Otherwise, create a primitive type. We have not build support for complex types yet.
    props[key] = new PrimitiveType(
      typeof value,
      value
    ) as unknown as ModelPrimitive;

    return props;
  }, declaredProps as any);
}

export interface IModelType {
  name?: string;
  properties: any;
  description?: string;
  describe(): string;
  create(): any;
}

interface IModelTypeArguments {
  name?: string;
  properties: any;
}

class ModelType implements IModelType {
  name?: string | undefined;
  properties: any;
  description?: string | undefined;
  private readonly propertyNames: string[];

  constructor(opts: IModelTypeArguments) {
    const { name, properties } = opts;
    this.name = name;
    this.properties = toPropertiesObject(properties);
    this.propertyNames = Object.keys(this.properties);
  }

  /**
   * Returns a string representation of the model's properties. This can be used to understand
   * the "shape" of a model. For example, `types.model({ foo: types.string })` will return
   * `{foo: string}`.
   * @returns {string}
   */
  describe() {
    if (this.description) {
      return this.description;
    } else {
      this.description =
        "{ " +
        this.propertyNames
          .map((key) => key + ": " + this.properties[key].describe())
          .join("; ") +
        " }";
      return this.description;
    }
  }

  create() {
    return new Node(this.properties);
  }
}

export const model = (...args: any[]): IModelType => {
  if (devMode() && typeof args[0] !== "string" && args[1]) {
    throw fail(
      "Model creation failed. First argument must be a string when two arguments are provided"
    );
  }

  const name = typeof args[0] === "string" ? args.shift() : "AnonymousModel";
  const properties = args.shift() || {};
  return new ModelType({ name, properties });
};
