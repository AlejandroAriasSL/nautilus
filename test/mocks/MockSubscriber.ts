import Subscriber from "@decorators/Subscriber";
import { MockObserver } from "./MockObserver";
import Injectable from "@decorators/Injectable";

@Injectable
export class MockSubscriber{

    @Subscriber(MockObserver)
    onNewProduct(produtName: string){
        console.log(produtName);
    }
}