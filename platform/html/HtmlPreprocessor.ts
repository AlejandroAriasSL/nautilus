import { Preprocessor } from "platform/core/Preprocessor";
import Tree from "platform/core/Tree";
import fs from "fs";
import Node from "platform/core/Node";
import * as htmlparser2 from "htmlparser2";

export default class HtmlPreprocessor implements Preprocessor<any, any> {

    public process(tree: Tree) : 
    any 
    {
        const nodes = this.getFiles(tree);
        this.inspectHtml(nodes);
        return tree.root;
    }

    private parseHtml = (node: Node) : 
    void => {
        const doc = htmlparser2.parseDocument(node.data!.html)

        node.data!.html = doc;
    }   

    private inspectHtml = (nodes: Node[]) :
    void => 
        nodes.forEach((node) => 
        {
            const url = node.data?.templateUrl
            if (!url) return;
            const html = fs.readFileSync(url, {encoding: "utf-8"})
                           .replace(/[\r\n]+/g, "")
                           .replace(/\s+/g, " "); 
                           
            delete node.data!.templateUrl;

            node.data!.html = html;
            this.parseHtml(node);
        }            
        );
    

    private getFiles = (tree: Tree) :
    Node[] => 
        tree.root.filter<Node>((node) => node.data?.templateUrl ? node : undefined); 
}