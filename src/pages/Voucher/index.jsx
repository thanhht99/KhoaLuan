import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import { NotFound } from "../../_components/NotFound";

import { ListVoucher } from "./ListVoucher";
import { VoucherDetail } from "./VoucherDetail";

const Voucher = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/all`} component={ListVoucher} />
      <Route
        path={`${path}/detail/:id`}
        render={(props) => <VoucherDetail {...props} />}
      />
      <Route component={NotFound} />
    </Switch>
  );
};

export { Voucher };
