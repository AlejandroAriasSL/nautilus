import Injectable from "@src/decorators/Injectable";
import Subscriber from "@src/decorators/Subscriber";
import Product from "./Product";

@Injectable
export default class Listener {
  
  @Subscriber(Product)
  onProductNameChange(newName: string) {
    console.log(`👂 Listener recibe nuevo nombre: ${newName}`);
  }
}