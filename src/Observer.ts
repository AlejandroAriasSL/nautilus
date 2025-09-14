import { Observer } from "@src/types";

export default class ObservableClass<T> {
  private subscribers: Observer<T>[] = [];

  subscribe(fn: Observer<T>) {
    this.subscribers.push(fn);
  }

  next(value: T) {
    this.subscribers.forEach(fn => fn(value));
  }
}