import DIContainer from "@src/DIContainer";
import Registry from "@src/Registry";

export default function RegisterClass<T extends { new (...args: any[]): Registry }>(constructor : T){
    console.log(constructor)
    DIContainer.getInstance().addRegistry(new constructor())
}