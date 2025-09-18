import config from "virtual:nautilus"
import { Nautilus } from "@lib/defineConfig";
import TemplateLoader from "./TemplateLoader";

interface NavigationEvent extends Event {
  canIntercept: boolean;
  destination: { url: string };
  intercept(options: { handler: () => void }): void;
}

interface NavigationWindow extends Window {
  navigation: {
    addEventListener(
      type: "navigate",
      listener: (event: NavigationEvent) => void
    ): void;
  };
}

declare const window: NavigationWindow;

export default class Router {
  private static currentPath: string = window.location.pathname;
  private static basePath: string = "/";

  public static async init() : Promise<void> {
    const userConfig: Pick<Nautilus.UserConfig, "basePath"> = config;
    Router.basePath = userConfig?.basePath || "/";

    if (!this.navigationExists()) {
      this.useFallback();
      Router.navigateTo(Router.basePath);
      return;
    }

    const navigation = window.navigation;
    navigation.addEventListener("navigate", this.useNavigation);
    Router.navigateTo(Router.basePath)
  }

  private static useNavigation(event: NavigationEvent) {
    if (!event.canIntercept) return;

    const url = new URL(event.destination.url);

    event.intercept({
      handler() {
        Router.navigateTo(url.pathname);
      },
    });
  }

  private static useFallback() {
    document.body.addEventListener("click", this.handleLinkClick);
    window.addEventListener("popstate", this.handlePopState);
  }

  private static handleLinkClick(event: Event): void {
    const link = (event.target as HTMLElement).closest("a");
    if (!link) return;

    event.preventDefault();
    Router.navigateTo((link as HTMLAnchorElement).pathname);
  }

  private static handlePopState() {
    const path = window.location.pathname;

    if (path !== this.currentPath) {
      Router.currentPath = path;
      TemplateLoader.load(path);
    }
  }

  public static navigateTo(path: string) {
    if (!this.navigationExists()) {
      history.pushState(null, "", path);
    }

    TemplateLoader.load(path);
  }

  private static navigationExists(): boolean {
    return "navigation" in window;
  }
}
