export function checkInt(n: number, errorTarget?: string) {
  const errorMsg = `${errorTarget || "Number"} ${n} is not an integer.`;

  if (n > Math.floor(n)) {
    throw new TypeError(errorMsg);
  }
  return true;
}
