import Home from "../../UI/Pages/Home";
import Token from "../../UI/Pages/Token";
import ProductDetail from "../../UI/Pages/ProductDetail";
import Register from "../../UI/Pages/Register";
import Order from "../../UI/Pages/Order";
import AccountOrders from "../../UI/Pages/AccountOrders";
import ShopPanel from "../../UI/Pages/ShopPanel";

interface IRoutes{
    path: string,
    page: () => JSX.Element
}

export const Routes: IRoutes[] = [
    {
        path: "/Home",
        page: Home
    },
    {
        path: "/Token",
        page: Token
    },
    {
        path: "/Register",
        page: Register
    },
    {
        path: '/product/:id', 
        page: ProductDetail,
    },
    {
        path: '/order/:id', 
        page: Order,
    },
    {
        path: "/AccountOrders",
        page: AccountOrders
    },
    {
        path: "/ShopPanel",
        page: ShopPanel
    },

]