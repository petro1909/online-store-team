import ControllerFactory from "../controller/ControllerFactory";

export default class Router {
    public static routes = {
        404: "error",
        "/": "store",
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
        window.history.pushState({ path }, path, path);
        this.handleLocation();
    };

    private handleLocation = async () => {
        const fullPath: [string, string] = this.getWindowPathString();
        const route = Router.routes[fullPath[0] as keyof typeof Router.routes] || Router.routes[404];
        const controller = ControllerFactory.initController(route);
        controller.init(fullPath[1]);
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
        console.log(path);
        console.log(queryParams);
        return [path, queryParams];
    }
}
