import Router from "../router/router";
import HeaderView from "../view/Header/header";

export default class App {
    private readonly header: HeaderView;
    private readonly router: Router;
    constructor() {
        this.header = new HeaderView();
        this.router = new Router();
    }

    public start() {
        this.router.start();
        this.header.drawHeader();

        document.querySelectorAll('[href^="/"]').forEach((a) => a.addEventListener("click", this.router.route));
    }
}
