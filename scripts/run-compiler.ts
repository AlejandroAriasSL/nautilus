import Compiler from "platform/Compiler"
import Node from "platform/core/Node";

const tsInput = {
    tsConfigPath: "./tsconfig.json",
    sourceGlob: "src/**/*.ts"
}

const result = Compiler.compile(tsInput);
if (result instanceof Node){
    const serialize = (node : Node): any => ({
        name: node.name,
        data: node.data,
        parent: node.parent?.name ?? null,
        children: [...node.children.values()].map(serialize)
    })
    
    console.log(JSON.stringify(serialize(result), null, 2))
}
