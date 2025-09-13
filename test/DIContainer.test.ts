import DIContainer from "@src/DIContainer"
import Injectable from "@src/Injectable"


describe("DIContainer test", () => {
    let container: DIContainer;

    beforeEach(() =>  {
        container = DIContainer.getInstance()
    })

    it("should register classes correctly", () => {

        @Injectable
        class Foo{}

        expect(container.hasClass(Foo)).toBe(true);
    })
})