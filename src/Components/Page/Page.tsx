import React, { FC, Fragment } from 'react';
import './Page.css';
import { Logo } from '../Logo/Logo';
import { IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuthContext } from '../../features/auth/AuthContextProvider';
import { useHistory } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

export const Page: FC = ({ children }) => {
  const { isAuthenticated, logOut } = useAuthContext();
  const history = useHistory();
  const onLogOut = () => {
    logOut();
    history.push('/');
  };

  const auth = getAuth();
  const user = auth.currentUser;

  return (
    <Fragment>
      <header className="header">
        <div className="container header__container">
          <Logo />
          <div className="header__controls" style={{ transform: 'translateX(0)' }}>
            {isAuthenticated && (
              <>
                {user?.email}
                <IconButton color="inherit" onClick={onLogOut}>
                  <LogoutIcon />
                </IconButton>
              </>
            )}
          </div>
        </div>
      </header>

      <main>{children}</main>
    </Fragment>
  );
};
