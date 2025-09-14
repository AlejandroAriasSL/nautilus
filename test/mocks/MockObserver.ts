import Event from "@decorators/Event";
import Injectable from "@decorators/Injectable";
import ObservableClass from "@src/Observer";
import Select from "@decorators/Select";

@Injectable
export class MockObserver{
    productName: ObservableClass<string> = new ObservableClass<string>;

    @Select("button")
    @Event("click")
    onEvent(event: MouseEvent){
        this.productName.next((event.target as HTMLElement).textContent);
    }
}