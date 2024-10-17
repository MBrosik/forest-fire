// TODO fix no-explicit-any
/* eslint-disable @typescript-eslint/no-explicit-any */

export const camelize = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((item) => camelize(item));
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc: any, key: string) => {
      const newKey = key.replace(/(_\w)/g, (m) => m[1].toUpperCase());
      acc[newKey] = camelize(obj[key]);
      return acc;
    }, {});
  }
  return obj;
};
