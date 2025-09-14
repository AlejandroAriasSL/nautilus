import Injectable from "@src/Injectable";
import Subscriber from "@src/Subscriber";
import Product from "./Product";


@Injectable
export default class StupidListener {
  
  @Subscriber(Product)
  onProductNameChange(newName: string) {
    console.log(`👂 StupidListener recibe nuevo nombre: ${newName}`);
  }
}