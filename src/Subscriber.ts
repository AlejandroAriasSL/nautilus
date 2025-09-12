import DIContainer from "@src/DIContainer";

interface SubscriberEntry {
  method: string;
  observableKey: string; 
}

export const SubscriberRegistry = new Map<new () => any, SubscriberEntry[]>();

export default function Subscriber(sourceClass: new () => any) {
  return function (value: any, context: ClassMethodDecoratorContext) {
    context.addInitializer(function (this: any) {
      DIContainer.getInstance().registerSubscriber(this, sourceClass, String(context.name));
    });
    return value;
  };
}