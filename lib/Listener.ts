import Injectable from "@src/Injectable";
import Subscriber from "@src/Subscriber";
import Product from "./Product";

@Injectable
export default class Listener {
  
  @Subscriber(Product)
  onProductNameChange(newName: string) {
    console.log(`👂 Listener recibe nuevo nombre: ${newName}`);
  }
}