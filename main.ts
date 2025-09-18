import { DIContainer } from "@src/index"
import "@src/index"
import "@lib/index"
import Router from "@src/core/Router";

DIContainer.getInstance().bootstrap();
await Router.init();