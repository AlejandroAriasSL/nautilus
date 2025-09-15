import { ClassDeclaration, Project, PropertyDeclaration } from "ts-morph";
import fs from "fs";
import path from "path";
import { loadConfig } from "./load-config";

interface AutowiredEntry {
  targetClass: string;
  propertyKey: string;
  type: string;
}

const {
    sourceGlob
} = await loadConfig();


const project = new Project({
  tsConfigFilePath: "./tsconfig.json"
});


const sourceFiles = project.getSourceFiles(sourceGlob!);

function getAutowiredProperties(clazz : ClassDeclaration) : AutowiredEntry[] {
    const className = clazz.getName();

    if (!className) return [];

    return clazz.getProperties()
        .filter(prop => prop.getDecorators().some(decorator => isAutowired(decorator.getName())))
        .filter(prop => prop.getTypeNode()?.getText !== null)
        .map(prop => ({
            targetClass: className,
            propertyKey: prop.getName(),
            type: prop.getTypeNode()?.getText()
        }))
        .filter(Boolean) as AutowiredEntry[];
}

const isAutowired = (decoratorName: string) => decoratorName === "Autowired";

const metadataEntries = sourceFiles.flatMap(file => 
    file.getClasses()
        .flatMap(clazz => getAutowiredProperties(clazz)))

const metadata: string[] = metadataEntries.map(({targetClass, propertyKey, type}) =>
  `{ targetClass: "${targetClass}", propertyKey: "${propertyKey}", type: "${type}" }`
);

const output = 
    `// GENERATED FILE - DO NOT EDIT
    export const AUTOWIRED_METADATA = [
    ${metadata.join(",\n  ")}
    ];
`;

const outputDir = path.join("build", "generated"); 
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

fs.writeFileSync(path.join(outputDir, "autowired-metadata.ts"), output, "utf-8");
console.log("✔ Generated autowired-metadata.ts in build/generated/");
