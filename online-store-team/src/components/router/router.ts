export default class Router {
    constructor() {
        window.onpopstate = this.handleLocation;
        window.route = this.route;
        this.handleLocation();
    }
    public readonly routes = {
        404: "./components/view/404.html",
        "/": "./components/view/index.html",
        "/about": "./components/view/about.html",
        "/lorem": "./components/view/lorem.html",
    };
    public route(event: Event) {
        event = event || window.event;
        event.preventDefault();
        window.history.pushState({}, "", event.target.href);
        handleLocation();
    }
    public handleLocation = async () => {
        const path = window.location.pathname;
        const route = routes[path] || routes[404];
        const html = await fetch(route).then((data) => data.text());
        document.getElementById("main-page").innerHTML = html;
    };
}
