import Compiler from "platform/Compiler"
import Node from "platform/core/Node";

const tsInput = {
    tsConfigPath: "./tsconfig.json",
    sourceGlob: "src/**/*.ts"
}

const result = Compiler.compile(tsInput);
function serializeNode(node: Node): any {
  const serializeDomNode = (domNode: any): any => {
    if (!domNode) return null;
    if (domNode.type === "text") return { type: "text", data: domNode.data };
    if (domNode.type === "tag") return {
      type: "tag",
      name: domNode.name,
      attribs: domNode.attribs,
      children: (domNode.children || []).map(serializeDomNode)
    };
    if (domNode.type === "root") return {
      type: "root",
      children: (domNode.children || []).map(serializeDomNode)
    };
    return { type: domNode.type };
  };

  return {
    name: node.name,
    data: {
      ...node.data,
      html: node.data?.html ? serializeDomNode(node.data.html) : null
    },
    parent: node.parent?.name ?? null,
    children: [...node.children.values()].map(serializeNode)
  };
}

const snapshot = serializeNode(result);
console.log(JSON.stringify(snapshot, null, 2));