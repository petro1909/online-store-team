import Cart from "../model/Cart";
import { Store } from "../model/Store";
import Router from "../router/router";
import HeaderView from "../view/Header/header";
import FooterView from "../view/Footer/footer";

export default class App {
    private readonly header: HeaderView;
    private readonly footer: FooterView;
    private readonly router: Router;
    public static readonly store: Store;
    public static readonly cart: Cart;
    constructor() {
        this.footer = new FooterView();
        this.header = new HeaderView();
        this.router = new Router();
    }

    public start() {
        this.router.start();
        this.header.drawHeader(App.cart);
        this.footer.drawFooter();

        document.querySelectorAll('[href^="/"]').forEach((a) => a.addEventListener("click", this.router.route));
    }
}
