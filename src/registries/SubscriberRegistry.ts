import RegisterClass from "@decorators/RegisterClass";
import Registry from "@registries/Registry";
import { SUBSCRIBER_METADATA_KEY } from "@decorators/Subscriber";
import DIContainer from "@src/DIContainer";
import ObservableClass from "@src/Observer";
import { Constructor } from "@src/types";

export interface SubscriberMetadata {
  listenerInstance: any;
  sourceClass: Constructor;
  methodName: string;
}

@RegisterClass
export default class SubscriberRegistry extends Registry {

  public register(instance: any): void {
    const metadata = this.lookForMetadata(instance);

    metadata.forEach(({sourceClass, listenerInstance, methodName}) => {
      const sourceInstance = DIContainer.getInstance().get<any>(sourceClass);
      Object.values(sourceInstance)
        .filter((observable) => observable instanceof ObservableClass)
        .forEach((observable) =>
          observable.subscribe(
            this.preserveThis(listenerInstance, methodName)
          )
        );
    });
  }

  private lookForMetadata(instance: any): SubscriberMetadata[] {
    const prototype = Object.getPrototypeOf(instance);

    return Object.getOwnPropertyNames(prototype)
      .filter((name) => name !== "constructor")
      .filter((name) => Reflect.hasMetadata(SUBSCRIBER_METADATA_KEY, prototype[name], name))
      .map((name) => Reflect.getMetadata(SUBSCRIBER_METADATA_KEY, prototype[name], name));
  }
}
