export const EVENT_METADATA_KEY = Symbol("event");

export default function Event(eventType: string) {
  return function (method: any, context: ClassMethodDecoratorContext) {
    Reflect.defineMetadata(EVENT_METADATA_KEY, eventType, method, context.kind);
  };
}
