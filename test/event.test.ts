import DIContainer from "@src/DIContainer";
import Event, { EVENT_METADATA_KEY } from "@src/decorators/Event";
import Select from "@src/decorators/Select";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MockComponent } from "./mocks/MockComponent";

describe("@Event decorator", () => {
  beforeEach(() => {
    DIContainer.resetInstance();
    document.body.innerHTML = "";
  });

  it("It should define metadata on the decorated method", () => {
    const event = "click";

    class MockComponent {
      @Select("#test-button")
      @Event(event)
      onEvent(event: MouseEvent) {}
    }

    const metadata = Reflect.getMetadata(
      EVENT_METADATA_KEY,
      MockComponent.prototype.onEvent,
      "method"
    );

    expect(metadata).toEqual(event);
  });

  it("It should wire a DOM event with the designated method", async () => {
    const button = document.createElement("button");
    button.id = "test-button";
    document.body.appendChild(button);
    const container = DIContainer.getInstance();

    await import("@src/registries/EventRegistry");
    const { MockComponent } = await import("./mocks/MockComponent");
    const { default: EventRegistry } = await import("@src/registries/EventRegistry") 

    const mockInstance = container.get<MockComponent>(MockComponent);
    container.getRegistry(EventRegistry)?.attachEvent(mockInstance)
    const spy = vi.spyOn(mockInstance, "onChange");

    container.bootstrap();
    
    button.click();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(expect.any(MouseEvent));
  });
});
