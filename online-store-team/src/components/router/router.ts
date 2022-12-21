import ControllerFactory from "../controller/ControllerFactory";
import { IBaseOptions } from "../model/type/IFilterOptions";

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

    public route = (event: Event) => {
        event = event || window.event;
        event.preventDefault();
        const { pathname: path } = new URL((event!.target! as HTMLAnchorElement).href);
        console.log(path);
        window.history.pushState({ path }, path, path);
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

    public addQueryParameters(options: IBaseOptions) {
        if (!window.location.search) {
            window.location.search += "?";
        }
        for (const key in Object.keys(options)) {
            const value = options[key];
            if (key && value) {
                window.location.search += `${key}=${value}&`;
            }
        }
        window.location.search.slice(-1);
    }
}
