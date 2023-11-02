export const convertBetweenQAndS = (quantity: number): number => {
  return 1 / quantity;
};

export const convertBetweenQAndD = (quantity: number): number => {
  return (2 * Math.PI) / quantity;
};

export const convertFromDTooS = (quantity: number): number => {
  return quantity / (2 * Math.PI);
};

export const convertFromStooD = (quantity: number): number => {
  return quantity * (2 * Math.PI);
};
