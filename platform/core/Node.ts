export default class Node {
    name : string;
    data?: Record<string, any>;
    parent: Node | null = null;
    children: Map<string, Node> = new Map();

    constructor(name: string, data?: Record<string, any>)
    {
        this.name = name;
        this.data = data;
    }


    public insert = (child : Node) : 
    void => 
    {
        this.children.set(child.name, child);
        child.parent = this;
    }


    public delete = (name : string) :
    void =>
    {
        const child = this.find(name);
        if (child) child.parent = null;

        this.children.delete(name);
    }

    public find = (name : string): 
    Node | undefined => 
        this.children.get(name);


    public hasChildren = () : 
    boolean =>
        this.children.size > 0; 


    public traverse = 
    <T>(
        callback: (node: Node) => T | undefined, 
        found?: {value: boolean}
    ) :
    T | undefined => 
    { 
        if (!found) found = {value: false}

        if(found.value) return undefined;

        const result = callback(this);
        if (result !== undefined) 
        {
            found.value = true;
            return result;
        }

        for (const child of this.children.values())
        {
            const result = child.traverse(callback, found);
            if (result !== undefined) return result;
        }

        return undefined;
    }
}