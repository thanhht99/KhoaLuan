import React, { Suspense } from "react";
import "./App.css";
import "antd/dist/antd.css";
import { Spin } from "antd";
import { Route, Switch } from "react-router-dom";

import { Account } from "./pages/Account/index";
import { User } from "./pages/User/index";
import { Home } from "./pages/Home/index";
import {NotFound} from "./_components/NotFound/index";
import {ServerUpgrade} from "./_components/ServerUpgrade/index";
const PageHeader = React.lazy(() => import("./_components/Header/index"));
const PageFooter = React.lazy(() => import("./_components/Footer/index"));

const App = () => {
  return (
    //   document.getElementById("container")
    <Suspense fallback={<div className="example">
                          <Spin tip="Loading..." />
                        </div>}>
      <PageHeader />
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/home" component={Home}/>
        <Route path="/account" component={Account}/>
        <Route path="/user" component={User}/>
        <Route path="/server-upgrade" component={ServerUpgrade}/>
        <Route component={NotFound} />
      </Switch>
      <PageFooter />
    </Suspense>
  );
};

export default App;
