import { Account } from "./../pages/Account/index";
import { User } from "./../pages/User/index";
import { Home } from "./../pages/Home/index";
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
    path: "/server-upgrade",
    exact: true,
    component: ServerUpgrade,
  },
  {
    component: NotFound,
  },
];
