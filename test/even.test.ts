import DIContainer from "@src/DIContainer";
import Event, { EVENT_METADATA_KEY } from "@src/Event"
import Select from "@src/Select"
import { Window } from "happy-dom";
import {beforeEach, describe, expect, it, vi} from "vitest"


describe("@Event decorator", () => {


    beforeEach(() => {
        DIContainer.resetInstance();
        document.body.innerHTML = ""
    })

    it("It should define metadata on the decorated method", () => {

        const event = "click";

        class MockComponent{
            
            @Select("#test-button")
            @Event(event)
            onEvent(event: MouseEvent){}
        }

        const metadata = Reflect.getMetadata(EVENT_METADATA_KEY, MockComponent.prototype.onEvent, "method");

        expect(metadata).toEqual(event)
    })

    it("It should wire a DOM event with the designated method", async () => {
    
        const button = document.createElement("button");
        button.id = "test-button";
        document.body.appendChild(button);

        const { MockComponent } = await import("./mocks/MockComponent");

        const container = DIContainer.getInstance();
        const mockInstance = container.get(MockComponent);
        
        mockInstance.onChange = vi.fn();

        container.registerEvent(mockInstance);

        button.click();

        expect(mockInstance.onChange).toHaveBeenCalledTimes(1);
        expect(mockInstance.onChange).toHaveBeenCalledWith(expect.any(MouseEvent));
    })
})