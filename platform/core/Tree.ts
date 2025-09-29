import Node from "./Node";

export default class Tree {
    root: Node;
    recentLookUps: Map<string, Node> = new Map();

    constructor()
    {
        this.root = new Node("Batman")
    }

    public insert = (node : Node) : 
    void => 
    {
        const parent = node.parent ?? this.root; 
        parent.insert(node)
    }

    public delete = (name : string) : 
    void => 
    {
        const found = this.find(name);

        if(!found) return; 

        found.traverse((node) => this.recentLookUps.delete(node.name))
        found.parent?.children.delete(found.name)
        found.parent = null;
    }

    public find = (name: string) : 
    Node | undefined => 
    {
        if (name === this.root.name) return this.root;

        const cached = this.recentLookUps.get(name);
        if (cached) return cached;

        const foundRecursive = this.root.traverse<Node>(this.recursiveSearchCb(name))
        if (foundRecursive)
        {
            this.recentLookUps.set(name, foundRecursive);
            return foundRecursive;
        } 
    }

    private recursiveSearchCb = (name: string) => (node: Node): 
    Node | undefined =>
        node.find(name)

}