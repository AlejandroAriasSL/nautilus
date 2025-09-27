import path from "path";
import fs from "fs";

function copyFiles(
  folders: string[],
  destinationRoot: string = path.resolve(process.cwd(), "dist"),
  extensions: string[] = [".html", ".css"]
) {
  const recursiveCopy = (sourceDir: string, destinationDir: string) => {
    console.log(`Recursive copy from ${sourceDir} to ${destinationDir}`)
    if (!fs.existsSync(destinationDir)) {
      fs.mkdirSync(destinationDir, { recursive: true });
    }

    const items = fs.readdirSync(sourceDir, { withFileTypes: true });

    items.forEach((item) => {
      const sourcePath = path.join(sourceDir, item.name);
      const destinationPath = path.join(destinationDir, item.name);

      if (item.isDirectory()) {
        recursiveCopy(sourcePath, destinationPath);
      } else if (
        item.isFile() &&
        extensions.some((extension) => sourcePath.endsWith(extension))
      ) {
        console.log(`Copiando ${sourcePath} → ${destinationPath}`);
        fs.copyFileSync(sourcePath, destinationPath);
      }
    });
  };

  folders.forEach((folder) => {
    const sourcePath = path.resolve(process.cwd(), folder);
    const destinationPath = path.resolve(destinationRoot, folder);

    if (fs.existsSync(sourcePath)) {
      recursiveCopy(sourcePath, destinationPath);
    }
  });
}

copyFiles(["src"]);
