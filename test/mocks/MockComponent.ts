import Event from "@src/Event";
import Select from "@src/Select";

export class MockComponent {
    @Select("#test-button")
    @Event("click")
    onChange(event: MouseEvent) {
        console.log("¡El método onEvent se ha ejecutado!");
    }
}