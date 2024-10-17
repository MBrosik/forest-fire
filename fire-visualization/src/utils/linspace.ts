export const linspace = (start: number, stop: number, num: number, endpoint: boolean = true) => {
  const div = endpoint ? num - 1 : num;
  const step = (stop - start) / div;
  return Array.from({ length: num }, (_, i) => start + step * i);
};
