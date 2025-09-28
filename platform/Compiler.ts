import { Preprocessor } from "./core/Preprocessor";
import TsPreprocessor from "./ts/TsPreprocessor";

export default class Compiler{
    
    private static preprocessors: Preprocessor<any, any>[] = 
    [
        new TsPreprocessor()
    ] 

    public static compile(input: any){
        return this.preprocessors.flatMap((preprocessor) => preprocessor.process(input));
    }
}