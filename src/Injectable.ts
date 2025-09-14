import DIContainer from "@src/DIContainer.js";

export default function Injectable<T extends { new (...args: any[]): {} }>(constructor: T) {
  console.log(constructor)
  DIContainer.getInstance().register(constructor);
}