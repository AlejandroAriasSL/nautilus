export default abstract class Registry {
  public abstract register(instance: any): void;

  protected preserveThis<T extends object, K extends keyof T>(
    instance: T,
    methodName: K
  ): (...args: any[]) => any {
    return (...args: any[]) => {
      const method = instance[methodName];
      return (method as Function).apply(instance, args);
    };
  }
}
