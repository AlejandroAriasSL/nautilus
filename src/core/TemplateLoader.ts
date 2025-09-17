import ComponentRegistry, {
  ChildMetadata,
} from "@src/registries/ComponentRegistry";

interface TemplateRecord {
  templateUrl: string;
  styleUrl?: string;
  componentClass: Function;
}

export default class TemplateLoader {
  private static parser = new DOMParser();
  private static templates = new Map<string, TemplateRecord>();

  public static save(path: string, templateRecord: TemplateRecord): void {
    this.templates.set(path, templateRecord);
  }

  public static async load(path: string): Promise<void> {
    const record = this.templates.get(path);
    const root = document.body.querySelector<HTMLElement>("#root");

    if (!record || !root) return;

    const { templateUrl, componentClass, styleUrl } = record;
    const template = await this.getTemplate(templateUrl).catch((error) =>
      console.error(error)
    );

    if (!template) return;
    
    const rootElement = template.querySelector<HTMLTemplateElement>("template");
    const clone = rootElement?.content.cloneNode(true);
    root.replaceChildren(clone!);

    this.loadStyles(styleUrl);

    console.log("main template loaded");

    const children = ComponentRegistry.getChildren(componentClass);
    console.log(children);

    this.renderChildren(root, children);

    console.log(root);
  }

  private static loadStyles(styleUrl: string | undefined): void {

    const head = document.head;
    
    head.querySelectorAll('link[data-style="true"]').forEach(link => link.remove());
    
    if (!styleUrl) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = styleUrl;
    link.setAttribute("data-style", "true");

    head.appendChild(link);
  }

  private static async renderChildren(
    root: HTMLElement,
    children: ChildMetadata[]
  ): Promise<void> {
    if (children.length === 0) return;

    for (const child of children) {
      const slot = root.querySelector(child.slot);
      if (!slot) continue;

      const childDocument = await this.getTemplate(child.templateUrl).catch(
        (err) => {
          console.error(err);
          return null;
        }
      );
      if (!childDocument) continue;

      const childTemplate =
        childDocument.querySelector<HTMLTemplateElement>("template");
      if (!childTemplate) continue;

      const childClone = childTemplate.content.cloneNode(true);
      slot.appendChild(childClone);
      console.log("children appended to slot");
    }
  }

  private static async getTemplate(url: string): Promise<Document> {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Template loader failed to fetch template: ${url} (status: ${response.status})`
      );
    }

    const rawText = await response.text();
    return this.parseToHtml(rawText);
  }

  private static parseToHtml(rawText: string): Document {
    return this.parser.parseFromString(rawText, "text/html");
  }
}
