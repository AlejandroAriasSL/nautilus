import Injectable from "@src/decorators/Injectable";
import Subscriber from "@src/decorators/Subscriber";
import Product from "./Product";


@Injectable
export default class StupidListener {
  
  @Subscriber(Product)
  onProductNameChange(newName: string) {
    console.log(`👂 StupidListener recibe nuevo nombre: ${newName}`);
  }
}