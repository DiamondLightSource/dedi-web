import * as mathjs from "mathjs";

export const convertBetweenQAndS = (quantity: mathjs.Unit): math.Unit => {
  const result = mathjs.divide(1, quantity);
  if (typeof result == "number" || !("units" in result)) {
    throw TypeError("name this error later ");
  }
  return result;
};

export const convertBetweenQAndD = (quantity: mathjs.Unit): mathjs.Unit => {
  const result = mathjs.divide(2 * Math.PI, quantity);
  if (typeof result == "number" || !("units" in result)) {
    throw TypeError("name this error later ");
  }
  return result;
};

export const convertFromDTooS = (quantity: mathjs.Unit): mathjs.Unit => {
  const result = mathjs.divide(quantity, 2 * Math.PI);
  if (typeof result == "number" || !("units" in result)) {
    throw TypeError("");
  }
  return result;
};

export const convertFromStooD = (quantity: mathjs.Unit): mathjs.Unit => {
  const result = mathjs.multiply(quantity, 2 * Math.PI);
  if (typeof result == "number" || !("units" in result)) {
    throw TypeError("");
  }
  return result;
};
