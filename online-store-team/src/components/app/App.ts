import Cart from "../model/Cart";
import { Store } from "../model/Store";
import Router from "../router/router";
import HeaderView from "../view/Header/header";
import FooterView from "../view/Footer/footer";

export default class App {
    public readonly header: HeaderView;
    private readonly footer: FooterView;
    public readonly router: Router;
    public readonly store: Store;
    public readonly cart: Cart;
    constructor() {
        this.footer = new FooterView();
        this.header = new HeaderView();
        this.footer = new FooterView();
        this.router = new Router();
        this.store = new Store();
        this.cart = new Cart();
    }

    public async start() {
        await this.store.initStore();
        this.router.start();
        this.header.drawHeader(this.cart);
        this.footer.drawFooter();
        document.addEventListener("click", this.router.anchorRoute);
        //document.querySelectorAll('[href^="/"]').forEach((a) => a.addEventListener("click", this.router.route));
    }
}
