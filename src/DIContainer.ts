import  ObservableClass  from "@src/Observer.js";
import { SubscriberRegistry } from "@src/Subscriber.js";
import { EVENT_METADATA_KEY } from "./Event";
import { SELECTOR_METADATA_KEY } from "./Select";

type Constructor<T = any> = new () => T; 

interface EventMetaData {
  methodName: string;
  eventType: string;
  selector: string;
}

export default class DIContainer {
  private static instance: DIContainer | null = null;
  private classes = new Set<Constructor>();
  private instances = new Map<Constructor, unknown>();

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

  private createInstance<T>(constructor : Constructor<T>) : T {
    const instance = new constructor();
    this.instances.set(constructor, instance);
    return instance;
  }

  private lookForEvents(instance: any) : EventMetaData[] { 
    const prototype = Object.getPrototypeOf(instance);

    return Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== "constructor")
      .map(name => ({
        methodName : name,
        eventType: Reflect.getMetadata(EVENT_METADATA_KEY, prototype[name], "method"),
        selector: Reflect.getMetadata(SELECTOR_METADATA_KEY, prototype[name], "method")
      }))
      .filter((meta) => Boolean(meta.eventType && meta.selector));
  }

  private registerEvents(instance: any){
    this.lookForEvents(instance)
      .forEach(({methodName, eventType, selector}) => {
        const element = document.querySelector(selector)
        element?.addEventListener(eventType, this.preserveThis(instance, methodName))
      });
  }

  public get<T>(constructor: Constructor): T {
    if (!this.instances.has(constructor)) {
      const instance = this.createInstance(constructor);
      this.registerEvents(instance);
      this.initSubscribers(instance, constructor);
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

  public bootstrap() {
    this.classes.forEach(constructor => this.get(constructor));
  }
}