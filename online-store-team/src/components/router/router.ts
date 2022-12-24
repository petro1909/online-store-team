import ControllerFactory from "../controller/ControllerFactory";
import { ICartOptions, IStoreFilterOptions } from "../model/type/IFilterOptions";

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
        event.preventDefault();
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

    public addQueryParameters(options: ICartOptions | IStoreFilterOptions) {
        let path = window.location.pathname + "?";
        for (const key in options) {
            let value = options[key as keyof typeof options];
            if (Array.isArray(value)) {
                value = value.join("+");
            }
            if (key && value) {
                path += `${key}=${value}&`;
            }
        }
        path = path.slice(0, -1);
        window.history.pushState({ path }, path, path);
    }
}
