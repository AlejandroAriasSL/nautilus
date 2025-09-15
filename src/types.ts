export type Observer<T> = (value: T) => void;
export type Constructor<T = any> = new (...args: any[]) => T; 