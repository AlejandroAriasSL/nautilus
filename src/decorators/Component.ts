import TemplateLoader from "@src/core/TemplateLoader";
import Injectable from "./Injectable";

interface ComponentConfig{
    templateUrl: string,
    styleUrl?: string
    path: string,
}

export default function Component(componentConfig: ComponentConfig){
    return function(target : any, context: ClassDecoratorContext){
        const {templateUrl, styleUrl, path} = componentConfig
        
        const templateLoader = {
            templateUrl: templateUrl,
            styleUrl: styleUrl,
            componentClass: target  
        }

        TemplateLoader.save(path, templateLoader);
        Injectable(target)
    }
}