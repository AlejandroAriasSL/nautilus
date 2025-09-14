export const SELECTOR_METADATA_KEY = Symbol('selector');

export default function Select(selector : string) : any{
    return function(method: any, context: ClassMethodDecoratorContext){
        console.log(SELECTOR_METADATA_KEY, selector, method, context.kind)
        Reflect.defineMetadata(SELECTOR_METADATA_KEY, selector, method, context?.kind);
    }
}