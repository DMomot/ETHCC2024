import { MainPage, SingleCoinPage, NotFound } from "../Pages";

export let ROUTE_HOME = "/";
export const ROUTE_SINGLE_COIN = "/coin/:coinId";

const routes = [
  {
    path: ROUTE_HOME,
    exact: true,
    component: MainPage,
  },
  {
    path: ROUTE_SINGLE_COIN,
    component: SingleCoinPage,
  },
  {
    path: "/*",
    component: NotFound,
  },
];

export default routes;
