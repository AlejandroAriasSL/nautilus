import Event from "@src/Event";
import Injectable from "@src/Injectable";
import ObservableClass from "@src/Observer";
import Select from "@src/Select";

@Injectable
export class MockObserver{
    productName: ObservableClass<string> = new ObservableClass<string>;

    @Select("button")
    @Event("click")
    onEvent(event: MouseEvent){
        this.productName.next((event.target as HTMLElement).textContent);
    }
}