import React, { Suspense, useCallback } from "react";
import "./App.css";
import "antd/dist/antd.css";
import { Spin } from "antd";
import { Route, Switch } from "react-router-dom";
import { routes } from "./routes/index";

const PageHeader = React.lazy(() => import("./_components/Header/index"));
const PageFooter = React.lazy(() => import("./_components/Footer/index"));

const App = () => {
  const renderRoutes = useCallback((routes) => {
    let result = null;
    if (routes.length > 0) {
      result = routes.map((route, index) => {
        const { path, exact, component } = route;
        return (
          <Route key={index} path={path} exact={exact} component={component} />
        );
      });
    }
    return <Switch>{result}</Switch>;
  }, []);
  return (
      <Suspense
        fallback={
          <div className="example">
            <Spin tip="Loading..." />
          </div>
        }
      >
        <PageHeader />
        {renderRoutes(routes)}
        <PageFooter />
      </Suspense>
  );
};

export default App;
