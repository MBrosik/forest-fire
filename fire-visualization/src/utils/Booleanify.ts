export type Booleanify<T> = {
  [P in keyof T]: T[P] extends object ? Booleanify<T[P]> : boolean;
};
