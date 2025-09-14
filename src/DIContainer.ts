import  ObservableClass  from "@src/Observer.js";
import Registry from "@src/Registry";

type Constructor<T = any> = new () => T; 

export default class DIContainer {
  private static instance: DIContainer | null = null;

  private classes = new Set<Constructor>();
  private instances = new Map<Constructor, unknown>();
  private registers: Set<Registry> = new Set<Registry>();

  public register<T>(constructor: Constructor<T>) : void {
    this.classes.add(constructor);
  }

  public static getInstance(): DIContainer {
    if (!this.instance) {
      this.instance = new DIContainer();
    }
    return DIContainer.instance!;
  }

  public static resetInstance(): void {
    if (DIContainer.instance){
      DIContainer.instance.classes.clear();
      DIContainer.instance.instances.clear();
      DIContainer.instance = null;
    }
  }

  public addRegistry(registry: Registry){
    this.registers.add(registry);
  }

  private createInstance<T>(constructor : Constructor<T>) : T {
    const instance = new constructor();
    this.instances.set(constructor, instance);
    return instance;
  }

  public get<T>(constructor: Constructor): T {
    if (!this.instances.has(constructor)) {
      this.createInstance(constructor);
    }
    return this.instances.get(constructor) as T;
  }

  registerSubscriber(
    listenerInstance: any,
    sourceClass: Constructor,
    methodName: string
  ) {
    const sourceInstance = this.get<any>(sourceClass);

    console.log("registering observable")

    Object.values(sourceInstance)
      .filter(observable => observable instanceof ObservableClass)
      .forEach(observable => observable.subscribe(this.preserveThis(listenerInstance, methodName)));
  }

  private preserveThis<T extends object, K extends keyof T>(
    instance: T, 
    methodName: K
  ) : (...args: any[]) => any 
  {
    return (...args: any[]) => {
      const method = instance[methodName];
      return (method as Function).apply(instance, args);
    } 
  }

  public hasClass(constructor : Constructor) : boolean {
    return this.classes.has(constructor);
  }

  public bootstrap() {
    this.classes.forEach(constructor => this.get(constructor));
    this.instances.forEach(instance => this.registers.forEach(register => register.register(instance)))
  }
}