import Event from "@src/decorators/Event";
import Injectable from "@src/decorators/Injectable";
import ObservableClass from "@src/Observer";
import Select from "@src/decorators/Select";

@Injectable
export default class Product {
  name = new ObservableClass<string>();

  @Select("button")
  @Event("click")
  onChange(event: MouseEvent){
    console.log(event.target)
    this.name.next((event.target as HTMLButtonElement).textContent)
  }
}