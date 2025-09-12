import DIContainer from "@src/DIContainer"
import {beforeEach, describe, expect, it, vi} from "vitest"

describe("@Injectable decorator", () => {
  let spy: any;
  let container : DIContainer;

  beforeEach(() => {
    DIContainer.resetInstance();
    container = DIContainer.getInstance();
    spy = vi.spyOn(container, "register")
  })
  
  it("It should inject the class within the container upon module import", async() => {

    const { MockInjection } = await import("./mocks/MockInjection")
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(MockInjection)
  })
})