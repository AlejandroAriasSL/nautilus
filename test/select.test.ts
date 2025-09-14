import Select, { SELECTOR_METADATA_KEY } from "@src/decorators/Select";

describe("@Select decorator", () => {
  it("It should define metadata on the decorated method", () => {
    const mockSelector = "mockSelector";

    class MockComponent {
      @Select(mockSelector)
      onSelect() {}
    }

    const metadata = Reflect.getMetadata(
      SELECTOR_METADATA_KEY,
      MockComponent.prototype.onSelect,
      "method"
    );

    expect(metadata).toEqual(mockSelector);
  });
});
