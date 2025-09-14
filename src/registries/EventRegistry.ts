import { EVENT_METADATA_KEY } from "@decorators/Event";
import RegisterClass from "@decorators/RegisterClass";
import Registry from "@registries/Registry";
import { SELECTOR_METADATA_KEY } from "@decorators/Select";

interface EventMetaData {
  methodName: string;
  eventType: string;
  selector: string;
}

@RegisterClass
export default class EventRegistry extends Registry {
  public register(instance: any): void {
    console.log("estoy registrando un evento en: ", instance)
    this.lookForEvents(instance).forEach(
      ({ methodName, eventType, selector }) => {
        const element = document.querySelector(selector);
        element?.addEventListener(
          eventType,
          this.preserveThis(instance, methodName)
        );
      }
    );
  }

  private lookForEvents(instance: any): EventMetaData[] {
    const prototype = Object.getPrototypeOf(instance);

    return Object.getOwnPropertyNames(prototype)
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
      }))
      .filter((meta) => Boolean(meta.eventType && meta.selector));
  }
}
