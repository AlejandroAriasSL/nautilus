import  ObservableClass  from "@src/Observer.js";
import { SubscriberRegistry } from "@src/Subscriber.js";
import { EVENT_METADATA_KEY } from "./Event";
import { SELECTOR_METADATA_KEY } from "./Select";

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

  static registerEvent(
    instance: any,
  ){ 
    console.log("me ejecuto y registro eventos a la instancia: ", instance)
    const prototype = Object.getPrototypeOf(instance);
    const methodNames = Object.getOwnPropertyNames(prototype);

    console.log(`Yo soy el prototipo:`, prototype, `yo soy los nombres de los métodos: ${methodNames}`)

    for (const methodName of methodNames) {
      // Excluimos explícitamente el constructor
      if (methodName === 'constructor') {
        continue;
      }

      console.log("Soy el nombre de método que tiene un evento: ", methodName)
      console.log("yo soy el método: ", prototype[methodName])
      const eventType = Reflect.getMetadata(EVENT_METADATA_KEY, prototype[methodName], "method");
      const selector = Reflect.getMetadata(SELECTOR_METADATA_KEY, prototype[methodName], "method");

      console.log(eventType, selector)

      if (eventType && selector) {
        const element = document.querySelector(selector);
        if (element) {
          const boundMethod = instance[methodName].bind(instance);
          element.addEventListener(eventType, boundMethod);
        }
      }
    }
  }

  static get<T>(cls: new () => T): T {
    if (!this.instances.has(cls)) {
      const instance = new cls();
      this.instances.set(cls, instance);

      this.registerEvent(instance)

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