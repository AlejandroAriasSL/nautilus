import HtmlPreprocessor from "./html/HtmlPreprocessor";
import TsPreprocessor from "./ts/TsPreprocessor";

export default class Compiler{

    private static tsPreprocessor: TsPreprocessor = new TsPreprocessor();
    private static htmlPreprocesssor: HtmlPreprocessor = new HtmlPreprocessor();

    public static compile(input: any){
        const tsPreprocessorOutput = this.tsPreprocessor.process(input);
        const htmlPreprocessorOutput = this.htmlPreprocesssor.process(tsPreprocessorOutput);


        return htmlPreprocessorOutput;
    }
}