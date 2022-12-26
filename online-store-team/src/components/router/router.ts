import { stringify } from "json5";
import { BaseOptions } from "vm";
import ControllerFactory from "../controller/ControllerFactory";
import { CartOptions, StoreFilterOptions } from "../model/type/IFilterOptions";
//import { CartOptions, StoreFilterOptions } from "../model/type/IFilterOptions";

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

    public addQueryParameters(options: StoreFilterOptions | CartOptions) {
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
        window.history.pushState({ queryString }, queryString, queryString);
    }
}
