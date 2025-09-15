import DIContainer from "@src/DIContainer"
import InjectedFoo from "./mocks/InjectedFoo";
import Foo from "./mocks/Foo";


describe("@Autowired decorator", () => {
    let container: DIContainer;
    let spy;

    beforeEach(() => {
        DIContainer.resetInstance();
        container = DIContainer.getInstance();
    });
    
    it("should inject an instance of any other injectable class", async() => {

        const { default: Foo} = await import("./mocks/Foo")
        const { default: InjectedFoo} = await import("./mocks/InjectedFoo")

        const fooinstance = container.get<Foo>(Foo);
        const injectedFooInstance = container.get<InjectedFoo>(InjectedFoo)

        spy = vi.spyOn(injectedFooInstance, "doSomething");

        container.bootstrap();

        fooinstance.doSomething();

        expect(spy).toBeCalledTimes(1)
    })
})