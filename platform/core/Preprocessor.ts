export interface Preprocessor<TInput, TOutput>{
   
    init?() : Promise<void> | void;

    process(input : TInput) : Promise<TOutput[]> | TOutput[];

    cleanUp?(): Promise<void> | void;
}