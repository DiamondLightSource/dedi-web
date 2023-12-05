import * as mathjs from "mathjs";

export const convertBetweenQAndS = (quantity: mathjs.Unit): math.Unit => {
  return mathjs.divide(1, quantity);
};

export const convertBetweenQAndD = (quantity: mathjs.Unit): mathjs.Unit => {
  return mathjs.divide(2 * Math.PI, quantity);
};

export const convertFromDTooS = (quantity: mathjs.Unit): mathjs.Unit => {
  return mathjs.divide(quantity, 2 * Math.PI);
};

export const convertFromStooD = (quantity: mathjs.Unit): mathjs.Unit => {
  return mathjs.multiply(quantity, 2 * Math.PI);
};
