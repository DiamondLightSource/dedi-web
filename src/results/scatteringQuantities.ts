import { Unit, divide, multiply } from "mathjs";
import { asUnit } from "../utils/units";

// Enum for the scattering display quantity
export enum ScatteringOptions {
  q = "q",
  s = "s",
  d = "d",
}

// s = q / 2π = 1 / d
export const convertFromQToS = (quantity: Unit): Unit =>
  asUnit(divide(quantity, 2 * Math.PI), "convertFromQToS");

// q = 2π · s
export const convertFromSToQ = (quantity: Unit): Unit =>
  asUnit(multiply(quantity, 2 * Math.PI), "convertFromSToQ");

// d = 2π / q (and q = 2π / d)
export const convertFromQtoD = (quantity: Unit): Unit =>
  asUnit(divide(2 * Math.PI, quantity), "convertFromQtoD");

export const convertFromDtoQ = convertFromQtoD;
