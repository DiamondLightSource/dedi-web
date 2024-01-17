import { Unit, divide, multiply } from "mathjs";

export const convertBetweenQAndS = (quantity: Unit): Unit => {
  const result = divide(1, quantity);
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

export const convertFromDTooS = (quantity: Unit): Unit => {
  const result = divide(quantity, 2 * Math.PI);
  if (typeof result == "number" || !("units" in result)) {
    throw TypeError("");
  }
  return result;
};

export const convertFromStooD = (quantity: Unit): Unit => {
  const result = multiply(quantity, 2 * Math.PI);
  if (typeof result == "number" || !("units" in result)) {
    throw TypeError("");
  }
  return result;
};
