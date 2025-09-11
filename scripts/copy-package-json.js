import fs from 'fs';
import path from 'path';

const distPath = path.resolve('./dist');

const packageJson = {
  name: "nautilus",
  version: "1.0.0",
  main: "nautilus.cjs.js",
  module: "nautilus.es.js",
  types: "index.d.ts",
  dependencies:{
    "@types/reflect-metadata": "^0.0.5",
    "reflect-metadata": "^0.2.2"
  },
  exports: {
    ".": {
      "import": "./nautilus.es.js",
      "require": "./nautilus.cjs.js"
    }
  }
};

fs.writeFileSync(
  path.join(distPath, 'package.json'),
  JSON.stringify(packageJson, null, 2),
  'utf-8'
);