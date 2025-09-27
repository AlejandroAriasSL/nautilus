export interface ChildMetadata {
    slot: string;
    templateUrl: string;
    method?: Function;
}

export default class ComponentRegistry{

    private static components =  new Map<Function, ChildMetadata[]>();

    public static registerChild(parent:Function, child: ChildMetadata) : void {
        const existing = this.components.get(parent) || [];
        existing?.push(child)
        this.components.set(parent, existing)
    }

    public static getChildren(parent: Function) : ChildMetadata[] {
        return this.components.get(parent) || [];
    }
}