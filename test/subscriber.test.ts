import DIContainer from "@src/DIContainer";
import { MockSubscriber } from "./mocks/MockSubscriber";

describe("@Subscriber decorator", () => {
    let container : DIContainer;
    let button : HTMLButtonElement;

    beforeEach(() => {
        DIContainer.resetInstance();
        container = DIContainer.getInstance();
        document.body.innerHTML = "";
        button = document.createElement("button")
        button.textContent = "Hola";
        document.body.appendChild(button);
    })

    it("should link the decorated method with an Observable from another class", async() => {

        const { MockSubscriber } = await import("./mocks/MockSubscriber");
        
        const suscriberInstance = container.get<MockSubscriber>(MockSubscriber); 
        
        const spy = vi.spyOn(suscriberInstance, "onNewProduct") 

        button.click();

        expect(spy).toBeCalledTimes(1);
        expect(spy).toBeCalledWith("Hola");
    })
})