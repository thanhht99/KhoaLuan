import React from 'react'
import { Switch,Route,useRouteMatch } from 'react-router-dom';
import { NotFound } from '../../_components/NotFound';

import {SignIn} from "./SignIn";
import {SignUp} from "./SignUp";

const Account = () => {
    const { path } = useRouteMatch();
    // console.log("🚀 ~ file: index.jsx ~ line 10 ~ Account ~ path", path)
    
    return (
        <Switch>
            <Route path={`${path}/sign-in`} component={SignIn} />
            <Route path={`${path}/sign-up`} component={SignUp} />
            <Route component={NotFound} />
      </Switch>  
    );
    
}

export { Account };