import { Preprocessor } from "platform/core/Preprocessor";
import { createAutowiredEntry } from "platform/factories/AutowiredFactory";
import { createComponent } from "platform/factories/ComponentFactory";
import { ClassDeclaration, Project, PropertyDeclaration, SourceFile } from "ts-morph";

type TsPreProcessorInput = {
    tsConfigPath: string;
    sourceGlob: string;
}

type TsPreProcessorOutput = {
    component?: string | undefined;
    parent?: Function;
    slot?: string
    templateUrl?: string;
    path?: string;
    stylesUrl?: string;
    observables?: string | string[];
    autowiredDeps?: AutowiredDep[];
}

type Analyzer<T = InspectionResult> = (clazz: ClassDeclaration) =>  T[];

export type InspectionResult = Partial<TsPreProcessorOutput>;

export type AutowiredDep = {
    targetClass?: string;
    propertyKey: string;
    type: string;
}

export default class TsPreprocessor implements Preprocessor<TsPreProcessorInput, TsPreProcessorOutput> {

    private project : Project
    private sourceFiles : SourceFile[];

    public process(input : TsPreProcessorInput) : 
    TsPreProcessorOutput[] 
    {
        const {tsConfigPath, sourceGlob} = input;

        this.project = new Project({tsConfigFilePath: tsConfigPath});
        this.sourceFiles = this.project.getSourceFiles(sourceGlob);

        const classDeclarations: ClassDeclaration[] = this.sourceFiles.flatMap(file => file.getClasses());
        return classDeclarations.flatMap(clazz => this.inspect(clazz));
    } 


    private inspect = (clazz: ClassDeclaration) : 
    TsPreProcessorOutput => 
    (
        {
            component: this.isComponent(clazz) ? clazz.getName() : undefined,
            ...this.inspectComponent(clazz),
            autowiredDeps: this.inspectAutowired(clazz),
            observables: [],
        } 
    )


    private inspectAutowired : 
    Analyzer<AutowiredDep> = 
    (clazz) => 
      clazz.getProperties()
        .filter(this.hasType)
        .filter((prop) => this.isDecorator(prop, "Autowired"))
        .map((prop) => createAutowiredEntry(clazz, prop))


    private inspectComponent = (clazz: ClassDeclaration) : 
    InspectionResult => 
    {
        if (!this.isComponent(clazz)) return {}

        const decorator = clazz.getDecorators()
            .find(decorator => ["Child", "Component"].includes(decorator.getName()));

        return decorator 
               ? createComponent(decorator) 
               : {}
    }


    private isComponent = (clazz: ClassDeclaration) : 
    boolean => 
        clazz.getDecorators().some((decorator) => 
            ["Child", "Component"].includes(decorator.getName()));

    
    private isDecorator = (prop: PropertyDeclaration, decoratorName: string) : 
    boolean => 
        prop.getDecorators()
            .some((decorator) => decoratorName === decorator.getName());


    private hasType = (prop: PropertyDeclaration) : 
    boolean =>
        prop.getTypeNode()?.getText() !== null;


    private getTemplateUrl = (clazz: ClassDeclaration): 
    string => 
        "default-template.html"; // temporal

}