const SELECTOR_METADATA_KEY = Symbol('selector');

export default function Select(selector : string){
    return function(target : any, propertyKey: string | symbol){
        Reflect.defineMetadata(SELECTOR_METADATA_KEY, selector, target, propertyKey);
    }
}