import { error } from "happy-dom/lib/PropertySymbol";

export default class TemplateLoader{

    private static parser = new DOMParser();
    private static templates = new Map<string, string>;

    public static save(path: string, templateUrl: string) : void {
        this.templates.set(path, templateUrl);
    }

    public static async load(path: string) : Promise<void> {
        const url = this.templates.get(path);
        const root = document.body.querySelector<HTMLElement>("#root");
        
        if (!url || !root) return;
        
        root.innerHTML = ""

        const template = await this.getTemplate(url).catch(error => console.error(error));

        if(!template) return;

        const rootElement = template.querySelector<HTMLTemplateElement>("template");

        const clone = rootElement?.content.cloneNode(true);

        root.appendChild(clone!);

        console.log(root)
    } 

    private static async getTemplate(url : string) : Promise<Document> {
        const response = await fetch(url);

        if (!response.ok){
            throw new Error(`Template loader failed to fetch template: ${url} (status: ${response.status})`)
        }

        const rawText = await response.text();

        return this.parseToHtml(rawText);
    }

    private static parseToHtml(rawText: string) : Document {
        return this.parser.parseFromString(rawText, "text/html")
    }
}