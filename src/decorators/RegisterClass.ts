import DIContainer from "@src/DIContainer";
import Registry from "@registries/Registry";

export default function RegisterClass<T extends { new (...args: any[]): Registry }>(constructor : T){
    DIContainer.getInstance().addRegistry(new constructor)
}