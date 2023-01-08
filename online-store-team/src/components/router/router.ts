import ControllerFactory from "../controller/controllerFactory";
import { CartOptions, StoreFilterOptions } from "../model/storeOptions";

export default class Router {
    public static routes = {
        404: "error",
        "/": "store",
        "/store": "store",
        "/order": "order",
        "/cart": "cart",
        "/product": "product",
    };
    public start(): void {
        window.onpopstate = this.handleLocation;
        this.handleLocation();
    }

    public anchorRoute = (event: Event) => {
        const targetElement = event.target;
        if (!targetElement || !(targetElement instanceof HTMLAnchorElement)) {
            return;
        }
        const targetAnchorElement = targetElement as HTMLAnchorElement;
        const anchorFullHref = targetAnchorElement.href;
        const anchorInnerHref = targetAnchorElement.getAttribute("href");
        if (!anchorInnerHref) {
            return;
        }
        const currentSourseHrefRegexp = /^\//;
        if (!currentSourseHrefRegexp.test(anchorInnerHref)) {
            return;
        }
        event.preventDefault();
        const { pathname: path } = new URL(anchorFullHref);
        window.history.pushState({ path }, path, path);
        this.handleLocation();
    };

    public route = (innerRoute: string) => {
        window.history.pushState({ innerRoute }, innerRoute, innerRoute);
        this.handleLocation();
    };

    public handleLocation = async () => {
        const fullPath: [string, string] = this.getWindowPathString();
        const route = Router.routes[fullPath[0] as keyof typeof Router.routes] || Router.routes[404];
        const controller = ControllerFactory.initController(route);
        await controller.init(fullPath[1]);
    };

    private getWindowPathString(): [string, string] {
        let path = window.location.pathname;
        let endpoint = "";
        const indexOfSecondSlash = path.indexOf("/", 1);
        if (indexOfSecondSlash !== -1) {
            endpoint = path.substring(indexOfSecondSlash + 1);
            path = path.substring(0, indexOfSecondSlash);
        }
        const queryParams = `${endpoint}${window.location.search}`;
        return [path, queryParams];
    }

    public parseQueryParameters(options: StoreFilterOptions | CartOptions): string {
        let queryString = window.location.pathname + "?";
        Object.keys(options).forEach((key: string) => {
            const value = options[key as keyof typeof options];
            let strValue = "";
            if (key && value) {
                if (Array.isArray(value)) {
                    if ((value as string[]).length > 0) {
                        strValue = (value as string[]).join("+");
                        queryString += `${key}=${strValue}&`;
                    }
                } else {
                    strValue = `${value}`;
                    queryString += `${key}=${strValue}&`;
                }
            }
        });
        queryString = queryString.slice(0, -1);
        return queryString;
    }
    public addQueryParameters(options: StoreFilterOptions | CartOptions): void {
        const queryString = this.parseQueryParameters(options);
        window.history.pushState({ queryString }, queryString, queryString);
    }

    public replaceQueryParameters(options: StoreFilterOptions | CartOptions): void {
        const queryString = this.parseQueryParameters(options);
        window.history.replaceState({ queryString }, queryString, queryString);
    }

    public copyQueryParametersToClipBoard() {
        navigator.clipboard.writeText(window.location.href);
    }
}
