import TemplateLoader from "@src/core/TemplateLoader";
import Injectable from "./Injectable";

interface ComponentConfig{
    templateUrl: string,
    path: string,
}

export default function Component(componentConfig: ComponentConfig){
    return function(method : any, context: ClassDecoratorContext){
        TemplateLoader.save(componentConfig.path, componentConfig.templateUrl, method);
        Injectable(method)
    }
}