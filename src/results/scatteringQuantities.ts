import { Unit, divide, multiply } from "mathjs";

export const convertFromQTooS = (quantity: Unit): Unit => {
  const result = multiply(quantity, 2 * Math.PI);
  if (typeof result == "number" || !("units" in result)) {
    throw TypeError("name this error later ");
  }
  return result;
};

export const convertBetweenQAndD = (quantity: Unit): Unit => {
  const result = divide(2 * Math.PI, quantity);
  if (typeof result == "number" || !("units" in result)) {
    throw TypeError("name this error later ");
  }
  return result;
};

export const convertBetweenDandS = (quantity: Unit): Unit => {
  const result = divide(4* Math.pow(Math.PI,2),quantity);
  if (typeof result == "number" || !("units" in result)) {
    throw TypeError("");
  }
  return result;
};

export const convertFromSTooQ = (quantity: Unit): Unit => {
  const result = divide(quantity, 2 * Math.PI);
  if (typeof result == "number" || !("units" in result)) {
    throw TypeError("name this error later ");
  }
  return result;
}