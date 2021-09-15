import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import { NotFound } from "../../_components/NotFound";

import { Info } from "./Info";

const User = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/info`} component={Info} />
      <Route component={NotFound} />
    </Switch>
  );
};

export { User };
