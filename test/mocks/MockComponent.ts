import Event from "@decorators/Event";
import Select from "@decorators/Select";

export class MockComponent {
    @Select("#test-button")
    @Event("click")
    onChange(event: MouseEvent) {
        console.log("¡El método onEvent se ha ejecutado!");
    }
}