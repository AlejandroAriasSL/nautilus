import Registry from "@src/registries/Registry";
import { Constructor } from "@src/types";

export default class DIContainer {
  private static instance: DIContainer | null = null;

  private classes = new Set<Constructor>();
  private instances = new Map<Constructor, unknown>();
  private registers: Set<Registry> = new Set<Registry>();

  private constructorNameMappings = new Map<string, Constructor>();

  public register<T>(constructor: Constructor<T>) : void {
    this.classes.add(constructor);
    this.constructorNameMappings.set(constructor.name, constructor);
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

  private createInstance<T>(constructor : Constructor<T>, ...deps: any[]) : T {
    const instance = new constructor(...deps);
    this.instances.set(constructor, instance);
    return instance;
  }

  public get<T>(constructor: Constructor, ...deps: any[]): T {
    if (!this.instances.has(constructor)) {
      this.createInstance(constructor, ...deps);
    }
    return this.instances.get(constructor) as T;
  }

  public getByTypeName<T>(typeName: string): T {
    console.log(typeName)
    const baseName = typeName.split("<")[0].trim();
    const ctor = this.constructorNameMappings.get(baseName);
    console.log(ctor)
    return this.get(ctor!) as T;
  }

  public hasClass(constructor : Constructor) : boolean {
    return this.classes.has(constructor);
  }

  public bootstrap() {
    this.classes.forEach(constructor => this.get(constructor));
    this.instances.forEach(instance => this.registers.forEach(register => register.register(instance)))
  }
}