import { Account } from "./../pages/Account/index";
import { Dashboard } from "./../pages/Dashboard/index";
import { Staff } from "./../pages/Staff/index";
import { User } from "./../pages/User/index";
import { Home } from "./../pages/Home/index";
import { Cart } from "./../pages/Cart/index";
import { Product } from "./../pages/Product/index";
import { Voucher } from "./../pages/Voucher/index";
import { Order } from "../pages/Order/index";

import { NotFound } from "./../_components/NotFound/index";
import { ServerUpgrade } from "./../_components/ServerUpgrade/index";

export const routes = [
  {
    path: "/",
    exact: true,
    component: Home,
  },
  {
    path: "/home",
    exact: true,
    component: Home,
  },
  {
    path: "/account",
    component: Account,
  },
  {
    path: "/user",
    component: User,
  },
  {
    path: "/product",
    component: Product,
  },
  {
    path: "/voucher",
    component: Voucher,
  },
  {
    path: "/dashboard",
    component: Dashboard,
  },
  {
    path: "/staff",
    component: Staff,
  },
  {
    path: "/order",
    component: Order,
  },
  {
    path: "/cart",
    component: Cart,
    // component: (props) => <Cart {...props} />,
  },
  {
    path: "/server-upgrade",
    exact: true,
    component: ServerUpgrade,
  },
  {
    component: NotFound,
  },
];
