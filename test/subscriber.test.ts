import DIContainer from "@src/DIContainer";

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

        await import("@src/EventRegistry")
        await import("@src/SubscriberRegistry")
        const { MockSubscriber } = await import("./mocks/MockSubscriber");
        
        const subscriberInstance = container.get<any>(MockSubscriber);

        const spy = vi.spyOn(subscriberInstance, "onNewProduct") 
        
        container.bootstrap()
        button.click();

        expect(spy).toBeCalledTimes(1);
        expect(spy).toBeCalledWith("Hola");
    })
})