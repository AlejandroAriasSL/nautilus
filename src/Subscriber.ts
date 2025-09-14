export const SUBSCRIBER_METADATA_KEY = Symbol("SUBSCRIBER")

export default function Subscriber(sourceClass: new () => any) {
  return function (value: any, context: ClassMethodDecoratorContext) {
    context.addInitializer(function (this: any) {
      Reflect.defineMetadata(
        SUBSCRIBER_METADATA_KEY,
        { listenerInstance: this, sourceClass: sourceClass, methodName: String(context.name)},
        value,
        String(context.name)
      )
    });
  };
}