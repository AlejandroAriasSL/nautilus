import  ObservableClass  from "@src/Observer.js";
import { SubscriberRegistry } from "@src/Subscriber.js";

export default class DIContainer {
  private static classes = new Map<Function, new () => any>();
  private static instances = new Map<Function, any>();

  static register(cls: new () => any) {
    this.classes.set(cls, cls);
  }

  static registerSubscriber(
    listenerInstance: any,
    sourceClass: new () => any,
    methodName: string
  ) {
    const sourceInstance = DIContainer.get(sourceClass);
    Object.values(sourceInstance).forEach(value => {
      if (value instanceof ObservableClass) {
        value.subscribe(listenerInstance[methodName].bind(listenerInstance));
      }
    });
  }

  static get<T>(cls: new () => T): T {
    if (!this.instances.has(cls)) {
      const instance = new cls();
      this.instances.set(cls, instance);

      if (SubscriberRegistry.has(cls)) {
        for (const { method, observableKey } of SubscriberRegistry.get(cls)!) {
          const fn = (instance as any)[method].bind(instance);
          const obs = (instance as any)[observableKey] as ObservableClass<any>;
          if (obs instanceof ObservableClass) {
            obs.subscribe(fn);
          }
        }
      }
    }
    return this.instances.get(cls);
  }

  static bootstrap() {
    this.classes.forEach(cls => this.get(cls));
  }
}