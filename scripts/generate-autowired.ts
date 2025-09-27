import { ClassDeclaration, Project } from "ts-morph";
import fs from "fs";
import path from "path";
import { loadConfig } from "./load-config";

interface AutowiredEntry {
  targetClass: string;
  propertyKey: string;
  type: string;
}

const CLIENT_CWD = process.cwd();
const NAUTILUS_DIR = path.join(
  CLIENT_CWD,
  ".nautilus",
  "generated"
);

const {
  sourceGlob,
  outputDir = NAUTILUS_DIR,
  test: { testSourceGlob, outputDir: testOutputDir } = {},
} = await loadConfig();

const isTest = process.env?.TEST === "test";

const actualSourceGlob = isTest ? testSourceGlob : sourceGlob;

const actualOutputDir = isTest ? testOutputDir : outputDir;

const project = new Project({
  tsConfigFilePath: path.join(process.cwd(), "tsconfig.json"),
});

const sourceFiles = project.getSourceFiles(actualSourceGlob!);

function getAutowiredProperties(clazz: ClassDeclaration): AutowiredEntry[] {
  const className = clazz.getName();

  if (!className) return [];

  return clazz
    .getProperties()
    .filter((prop) =>
      prop.getDecorators().some((decorator) => isAutowired(decorator.getName()))
    )
    .filter((prop) => prop.getTypeNode()?.getText !== null)
    .map((prop) => ({
      targetClass: className,
      propertyKey: prop.getName(),
      type: prop.getTypeNode()?.getText(),
    }))
    .filter(Boolean) as AutowiredEntry[];
}

const isAutowired = (decoratorName: string) => decoratorName === "Autowired";

const metadataEntries = sourceFiles.flatMap((file) =>
  file.getClasses().flatMap((clazz) => getAutowiredProperties(clazz))
);

const metadata: string[] = metadataEntries.map(
  ({ targetClass, propertyKey, type }) =>
    `{ targetClass: "${targetClass}", propertyKey: "${propertyKey}", type: "${type}" }`
);

const output = `
// GENERATED FILE - DO NOT EDIT
  export const AUTOWIRED_METADATA = [
  ${metadata.join(",\n  ")}
  ];
`;

if (!fs.existsSync(actualOutputDir!))
  fs.mkdirSync(actualOutputDir!, { recursive: true });

fs.writeFileSync(
  path.join(actualOutputDir!, "autowired-metadata.ts"),
  output,
  "utf-8"
);
console.log(`✔ Generated autowired-metadata.ts in ${actualOutputDir}`);
