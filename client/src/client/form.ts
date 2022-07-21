export const getIntegerValue = (value: string, defaultValue = 0) => {
  try {
    const v = parseInt(value);
    return v;
  } catch {
    return defaultValue;
  }
}

export const getFloatValue = (value: string, defaultValue = 0) => {
  try {
    const val = parseFloat(value);
    return val;
  } catch {
    return defaultValue;
  }
}
