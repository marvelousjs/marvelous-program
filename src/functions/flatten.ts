export const flatten = (list: any[]): any[] => {
  return list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);
};
