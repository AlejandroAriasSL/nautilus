import { AutowiredDep } from "platform/ts/TsPreprocessor";
import { ClassDeclaration, PropertyDeclaration } from "ts-morph";

export const createAutowiredEntry = (clazz: ClassDeclaration, prop: PropertyDeclaration) : 
AutowiredDep => 
(
    { 
        targetClass: clazz.getName() ?? undefined,
        propertyKey: prop.getName() ?? undefined,
        type: prop.getTypeNode()?.getText() ?? ""
     
    } 

);