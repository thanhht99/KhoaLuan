import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import { NotFound } from "../../_components/NotFound";
import { OrderSearch } from "./Search";

const Order = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/search`} component={OrderSearch} />
      <Route component={NotFound} />
    </Switch>
  );
};

export { Order };
