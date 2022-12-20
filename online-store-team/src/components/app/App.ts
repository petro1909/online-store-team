import Cart from "../model/Cart";
import { Store } from "../model/Store";
import Router from "../router/router";
import FooterView from "../view/Footer/footer";
import HeaderView from "../view/Header/header";

export default class App {
    private readonly header: HeaderView;
    private readonly footer: FooterView;
    public readonly router: Router;
    public readonly store: Store;
    public readonly cart: Cart;
    constructor() {
        this.header = new HeaderView();
        this.footer = new FooterView();
        this.router = new Router();
        this.store = new Store();
        this.cart = new Cart();
    }

    public start() {
        this.router.start();
        this.store.initStore();
        this.header.drawHeader(this.cart);
        this.footer.drawFooter();
        document.querySelectorAll('[href^="/"]').forEach((a) => a.addEventListener("click", this.router.route));
    }
}
