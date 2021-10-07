import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import { NotFound } from "../../_components/NotFound";

import { ListProduct } from "./ListProduct";
import { ProductDetail } from "./ProductDetail";

const Product = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/all`} component={ListProduct} />
      <Route path={`${path}/detail`} component={ProductDetail} />
      <Route
        path={`${path}/:id`}
        render={(props) => <ProductDetail {...props} />}
      />
      <Route component={NotFound} />
    </Switch>
  );
};

export { Product };
