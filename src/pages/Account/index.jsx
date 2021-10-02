import React from "react";
import { Switch, Route, useRouteMatch, Redirect } from "react-router-dom";
import { NotFound } from "../../_components/NotFound";

import { SignIn } from "./SignIn";
import { SignUp } from "./SignUp";

const Account = () => {
  const { path } = useRouteMatch();
  //   console.log("🚀 ~ file: index.jsx ~ line 10 ~ Account ~ path", path)
  return (
    <Switch>
      <Route exact path={`${path}/sign-in`} component={SignIn} />
      <Redirect exact from={`${path}/sign-in/reload`} to={`${path}/sign-in`} />
      <Route path={`${path}/sign-up`} component={SignUp} />
      <Route component={NotFound} />
    </Switch>
  );
};

export { Account };
