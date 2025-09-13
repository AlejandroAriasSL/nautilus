import DIContainer from "@src/DIContainer"
import Injectable from "@src/Injectable"


describe("DIContainer", () => {
    let container: DIContainer;

    @Injectable
    class Foo{}

    beforeEach(() =>  {
        container = DIContainer.getInstance()
    })

    it("should register classes correctly", () => {

        expect(container.hasClass(Foo)).toBe(true);
    })

    it("should clean previous instances", ()=> {

        expect(container.hasClass(Foo)).toBe(true)

        DIContainer.resetInstance();
        container = DIContainer.getInstance();

        expect(container.hasClass(Foo)).toBe(false)
    })
})