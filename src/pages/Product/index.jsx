import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import { NotFound } from "../../_components/NotFound"

import { ListProduct } from "./ListProduct";

const Product = () => {
    const { path } = useRouteMatch();
    return (
      <Switch>
        <Route path={`${path}/all`} component={ListProduct} />
        <Route component={NotFound} />
      </Switch>
    );
  };
  
  export { Product };