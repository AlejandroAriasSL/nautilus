import Node from "platform/core/Node";
import Tree from "platform/core/Tree";
import { Preprocessor } from "platform/core/Preprocessor";
import { createAutowiredEntry } from "platform/factories/AutowiredFactory";
import { createComponent } from "platform/factories/ComponentFactory";
import { ClassDeclaration, Decorator, Project, PropertyDeclaration, SourceFile } from "ts-morph";

type TsPreProcessorInput = {
    tsConfigPath: string;
    sourceGlob: string;
}

type TsPreProcessorOutput = {
    component?: string | undefined;
    parent?: string;
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
    propertyKey: string;
    type: string;
}

export default class TsPreprocessor implements Preprocessor<TsPreProcessorInput, Node> {

    private project : Project
    private sourceFiles : SourceFile[];
    private tree : Tree;


    constructor()
    {
        this.tree = new Tree();
    }


    public process(input : TsPreProcessorInput) : 
    Node
    {
        const {tsConfigPath, sourceGlob} = input;

        this.project = new Project({tsConfigFilePath: tsConfigPath});
        this.sourceFiles = this.project.getSourceFiles(sourceGlob);

        const classDeclarations: ClassDeclaration[] = this.sourceFiles.flatMap(file => file.getClasses());
        const nodes = classDeclarations.map(clazz => this.inspect(clazz)).filter(Boolean) as Node[];
        this.insertNodes(nodes)
    
        return this.tree.root;
    } 

    private insertNodes = (nodes: Node[] | undefined) : 
    void => 
    {
        nodes?.forEach(
        node => 
        {
           node.parent = this.tree.find(node.data?.parent) ?? null;
           if (node.data?.parent) delete node.data.parent;
           this.tree.insert(node)
        } 
    );
    }


    private inspect = (clazz: ClassDeclaration) : 
    Node | undefined => 
    {
        const className = clazz.getName();
        if (!className) return;

        const componentData = this.inspectComponent(clazz);
        const autowiredDeps = this.inspectAutowired(clazz);

        if (!componentData?.parent)
        {
            const nodeData = {...componentData, autowiredDeps, observables: []};
            const node = new Node(className, nodeData);
    
            this.tree.insert(node)
            return;

        }

        const nodeData = {...componentData, autowiredDeps, observables: []};
        const node = new Node(className, nodeData)

        return node;
    }


    private inspectAutowired : 
    Analyzer<AutowiredDep> = 
    (clazz) => 
      clazz.getProperties()
        .filter(this.hasType)
        .filter((prop) => this.isDecorator(prop, "Autowired"))
        .map((prop) => createAutowiredEntry(clazz, prop))


    private inspectComponent = (clazz: ClassDeclaration) : 
    InspectionResult | undefined => 
    {
        const decorator = this.findDecoratorIfAny(clazz, ["Component", "Child"])

        if (!decorator) return;

        return createComponent(decorator);  
    }


    private findDecoratorIfAny = (clazz: ClassDeclaration, candidates: Array<string>):
    Decorator | undefined =>
        clazz.getDecorators()
            .find(decorator => candidates.includes(decorator.getName()));


    private isDecorator = (prop: PropertyDeclaration, decoratorName: string) : 
    boolean => 
        prop.getDecorators()
            .some((decorator) => decoratorName === decorator.getName());


    private hasType = (prop: PropertyDeclaration) : 
    boolean =>
        prop.getTypeNode()?.getText() !== null;
}