import Event from "@src/Event";
import Injectable from "@src/Injectable";
import ObservableClass from "@src/Observer";
import Select from "@src/Select";

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