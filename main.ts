import { DIContainer } from "@src/index"
import "@src/index"
import "@lib/index"
import Router from "@src/core/Router";

const navigation = window.navigation;

navigation.addEventListener("navigate", (event: Event) => {

    if(!event.canIntercept) return;

    const url = new URL(event.destination.url);

    event.intercept({
        handler(){
            Router.navigateTo(url.pathname);
        }
    })
})

DIContainer.getInstance().bootstrap();
Router.navigateTo("/")