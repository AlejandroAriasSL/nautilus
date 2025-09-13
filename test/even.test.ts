import Event, { EVENT_METADATA_KEY } from "@src/Event"
import Select from "@src/Select"


describe("@Event decorator", () => {

    it("It should define metadata on the decorated method", () => {

        const event = "click";

        class MockComponent{
            
            @Event(event)
            @Select("button")
            onEvent(event: MouseEvent){}
        }

        const metadata = Reflect.getMetadata(EVENT_METADATA_KEY, MockComponent.prototype.onEvent, "method");

        expect(metadata).toEqual(event)
    })
})