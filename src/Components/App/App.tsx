import React, { FC, useEffect } from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';

import { HomePage } from '../HomePage/HomePage';
import { Page } from '../Page/Page';
import { PrivateRoute } from '../PrivateRoute/PrivateRoute';
import { LoginContainer } from '../../features/auth/login/LoginContainer';

export const App: FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Switch>
      <Route path="/login">
        <LoginContainer />
      </Route>
      <PrivateRoute path="/">
        <Page>
          <HomePage />
        </Page>
      </PrivateRoute>
    </Switch>
  );
};
