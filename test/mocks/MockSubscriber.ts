import Subscriber from "@src/Subscriber";
import { MockObserver } from "./MockObserver";
import Injectable from "@src/Injectable";

@Injectable
export class MockSubscriber{

    @Subscriber(MockObserver)
    onNewProduct(produtName: string){
        console.log(produtName);
    }
}