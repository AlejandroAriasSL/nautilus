import { EVENT_METADATA_KEY } from "@decorators/Event";
import RegisterClass from "@decorators/RegisterClass";
import Registry from "@registries/Registry";
import { SELECTOR_METADATA_KEY } from "@decorators/Select";

interface EventMetaData {
  methodName: string;
  eventType: string;
  selector: string;
  instance: any;
}

@RegisterClass
export default class EventRegistry extends Registry {

  private attached = new WeakMap<Function, Set<EventMetaData>>();

  public register(instance: any): void {

    if(this.attached.has(instance)) return;
    const events = this.lookForEvents(instance);

    if (events.size === 0) return;
    this.attached.set(instance, events);
  }

  public attachEvent(instance : any) : void {
    const events = this.attached.get(instance); 
    
    if (!events) return;

    events.forEach(event => {
      const {methodName, eventType, selector, instance} = event;
      const element = document.querySelector(selector);
  
      if (!element) return;
      element?.addEventListener(
        eventType,
        this.preserveThis(instance, methodName)
      );
    })
  }

  private lookForEvents(instance: any): Set<EventMetaData> {
    const prototype = Object.getPrototypeOf(instance);
    const events = new Set<EventMetaData>();

    Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== "constructor")
      .filter((name) => Reflect.hasMetadata(EVENT_METADATA_KEY, prototype[name], "method"))
      .map((name) => ({
        methodName: name,
        eventType: Reflect.getMetadata(
          EVENT_METADATA_KEY,
          prototype[name],
          "method"
        ),
        selector: Reflect.getMetadata(
          SELECTOR_METADATA_KEY,
          prototype[name],
          "method"
        ),
        instance: instance
      }))
      .filter((meta) => Boolean(meta.eventType && meta.selector))
      .forEach((meta) => events.add(meta))

      return events
  }
}
