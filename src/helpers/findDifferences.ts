const isEmptyString = (value: any) => {
  return typeof value === "string" && value.trim() === "";
};

export function findDifferences(
  obj1: any,
  obj2: any,
  keysToConsider: string[] = []
) {
  const differences: any = {};

  if (keysToConsider.length == 0) {
    for (const key in obj2) {
      if (obj2.hasOwnProperty(key)) {
        if (
          !isEmptyString(obj1[key]) &&
          !isEmptyString(obj2[key]) &&
          obj1[key] != obj2[key]
        ) {
          differences[key] = { obj1: obj1[key], obj2: obj2[key] };
        }
      }
    }
  } else {
    keysToConsider.forEach((key) => {
      if (
        !isEmptyString(obj1[key]) &&
        !isEmptyString(obj2[key]) &&
        obj1[key] != obj2[key]
      ) {
        differences[key] = { obj1: obj1[key], obj2: obj2[key] };
      }
    });
  }

  return differences;
}
