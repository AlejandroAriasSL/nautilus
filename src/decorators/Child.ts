import ComponentRegistry from "@src/registries/ComponentRegistry";
import Injectable from "./Injectable";

interface ChildConfig{
    parent: Function;
    slot: string,
    templateUrl: string
}

export default function Child(childConfig : ChildConfig){
    return function(method : any, context: ClassDecoratorContext){
        ComponentRegistry.registerChild(childConfig.parent, {
            slot: childConfig.slot,
            templateUrl: childConfig.templateUrl,
            method: method
        })
        Injectable(method);
    }
}