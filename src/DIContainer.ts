import  ObservableClass  from "@src/Observer.js";
import { SubscriberRegistry } from "@src/Subscriber.js";
import { EVENT_METADATA_KEY } from "./Event";
import { SELECTOR_METADATA_KEY } from "./Select";

type Constructor<T = any> = new () => T; 

export default class DIContainer {
  private static instance: DIContainer | null = null;
  private classes = new Set<Constructor>();
  private instances = new Map<Constructor, unknown>();

  register<T>(constructor: Constructor<T>) : void {
    this.classes.add(constructor);
  }

  static getInstance(): DIContainer {
    if (!this.instance) {
      this.instance = new DIContainer();
    }
    return DIContainer.instance!;
  }

  static resetInstance(): void {
    if (DIContainer.instance){
      DIContainer.instance.classes.clear();
      DIContainer.instance.instances.clear();
      DIContainer.instance = null;
    }
  }


  private createInstance<T>(constructor : Constructor<T>) : T {
    const instance = new constructor();
    this.instances.set(constructor, instance)
    return instance;
  }

  registerEvent(
    instance: any,
  ){ 
    const prototype = Object.getPrototypeOf(instance);
    const methodNames = Object.getOwnPropertyNames(prototype);

    for (const methodName of methodNames) {
      if (methodName === 'constructor') {
        continue;
      }

      const eventType = Reflect.getMetadata(EVENT_METADATA_KEY, prototype[methodName], "method");
      const selector = Reflect.getMetadata(SELECTOR_METADATA_KEY, prototype[methodName], "method");

      if (eventType && selector) {
        const element = document.querySelector(selector);
        if (element) {
          element.addEventListener(eventType, this.preserveThis(instance, methodName));
        }
      }
    }
  }

  get<T>(constructor: Constructor): T {
    if (!this.instances.has(constructor)) {
      const instance = this.createInstance(constructor);
      this.registerEvent(instance)
      this.initSubscribers(instance, constructor)
    }
    return this.instances.get(constructor) as T;
  }

  registerSubscriber(
    listenerInstance: any,
    sourceClass: Constructor,
    methodName: string
  ) {
    const sourceInstance = this.get<any>(sourceClass);
    Object.values(sourceInstance).forEach(value => {
      if (value instanceof ObservableClass) {
        value.subscribe(this.preserveThis(listenerInstance, methodName));
      }
    });
  }

  private initSubscribers(instance : any, constructor: Constructor) : void {
    if (!SubscriberRegistry.has(constructor)) return;

    for (const { method, observableKey } of SubscriberRegistry.get(constructor)!) {
      const observable = (instance as any)[observableKey] as ObservableClass<any>;
      if (observable instanceof ObservableClass) {
        observable.subscribe(this.preserveThis(instance, method))
      }
    }
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

  bootstrap() {
    this.classes.forEach(constructor => this.get(constructor));
  }
}