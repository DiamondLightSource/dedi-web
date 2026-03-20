import { Unit, divide, multiply } from "mathjs";

// Enum for the scattering display quantity
export enum ScatteringOptions {
  q = "q",
  s = "s",
  d = "d",
}

export const convertFromQToS = (quantity: Unit): Unit => {
  const result = multiply(quantity, 2 * Math.PI);
  if (typeof result == "number" || !("units" in result)) {
    throw TypeError("name this error later ");
  }
  return result;
};

export const convertFromSToQ = (quantity: Unit): Unit => {
  const result = divide(quantity, 2 * Math.PI);
  if (typeof result == "number" || !("units" in result)) {
    throw TypeError("name this error later ");
  }
  return result;
};

export const convertFromQtoD = (quantity: Unit): Unit => {
  const result = divide(2 * Math.PI, quantity);
  if (typeof result == "number" || !("units" in result)) {
    throw TypeError("name this error later ");
  }
  return result;
};

export const convertFromDtoQ = convertFromQtoD;
