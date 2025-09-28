import Compiler from "platform/Compiler"

const tsInput = {
    tsConfigPath: "./tsconfig.json",
    sourceGlob: "src/**/*.ts"
}

const result = Compiler.compile(tsInput);

console.log(JSON.stringify(result, null, 2));