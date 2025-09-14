export const SELECTOR_METADATA_KEY = Symbol("selector");

export default function Select(selector: string): any {
  return function (method: any, context: ClassMethodDecoratorContext) {
    Reflect.defineMetadata(
      SELECTOR_METADATA_KEY,
      selector,
      method,
      context?.kind
    );
  };
}
