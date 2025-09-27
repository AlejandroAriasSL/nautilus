import path from "path";
import { pathToFileURL } from "url";
import fs from "fs";

const CWD = process.cwd();

export async function getAutowiredMetadata() {
  try {
    const generatedFile = path.join(CWD, ".nautilus", "generated", "autowired-metadata.js");

    if (!fs.existsSync(generatedFile)) {
      console.warn("[nautilus] No se encontró autowired-metadata.js. Ejecuta el plugin antes de correr la app.");
      return [];
    }

    const moduleUrl = pathToFileURL(generatedFile).href;
    const metadataModule = await import(moduleUrl);

    return metadataModule.AUTOWIRED_METADATA || [];
  } catch (err) {
    console.error("[nautilus] Error cargando los metadatos de autowired:", err);
    return [];
  }
}