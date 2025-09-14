import Registry from "@src/Registry";

export type Constructor<T = any> = new () => T; 

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

  public hasClass(constructor : Constructor) : boolean {
    return this.classes.has(constructor);
  }

  public bootstrap() {
    this.classes.forEach(constructor => this.get(constructor));
    this.instances.forEach(instance => this.registers.forEach(register => register.register(instance)))
  }
}