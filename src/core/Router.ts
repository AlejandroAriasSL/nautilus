import TemplateLoader from "./TemplateLoader";

export default class Router{

    public static navigateTo(path: string){
        TemplateLoader.load(path);
    }
}