export const getIntegerValue = (id: string) => {
  const el = document.getElementById(id) as HTMLInputElement;
  if (!el) {
    throw Error("cannot find element");
  }

  try {
    const value = parseInt(el.value);
    return value;
  } catch {
    throw Error("cannot retrieve element value");
  }
}

export const getFloatValue = (id: string) => {
  const el = document.getElementById(id) as HTMLInputElement;
  if (!el) {
    throw Error("cannot find element");
  }

  try {
    const value = parseFloat(el.value);
    return value;
  } catch {
    throw Error("cannot retrieve element value");
  }
}
