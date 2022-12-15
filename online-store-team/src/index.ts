const route = (event) => {
    console.log('dwd')
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    handleLocation();
};
console.log('dwd')
const routes = {
    404: "./components/view/404.html",
    "/": "./components/view/index.html",
    "/about": "./components/view/about.html",
    "/lorem": "./components/view/lorem.html",
};

const handleLocation = async () => {
    console.log('dwd')
    const path = window.location.pathname;
    const route = routes[path] || routes[404];
    const html = await fetch(route).then((data) => data.text());
    document.getElementById("main-page").innerHTML = html;
};

window.onpopstate = handleLocation;
window.route = route;

handleLocation();