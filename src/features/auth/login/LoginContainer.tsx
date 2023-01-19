import { LoginForm, TLoginField } from '@components/LoginForm/LoginForm';
import React, { FC, Reducer, useReducer, useState } from 'react';
import './LoginContainer.css';
import { validateEmail } from './utils';
import { useAuthContext } from '../AuthContextProvider';
import { useHistory, useLocation } from 'react-router-dom';
import { GoogleAuthProvider } from 'firebase/auth';
import { TLoginWithEmailAndPasswordResult } from '../types';
import { Title } from '@components/Title/Title';

type TLoginFormFieldState = Omit<TLoginField, 'onChange'>;

type Action = { type: 'change' | 'error'; value: string };

function reducer(state: TLoginFormFieldState, action: Action): TLoginFormFieldState {
  switch (action.type) {
    case 'change':
      return {
        ...state,
        error: false,
        helper: '',
        value: action.value,
      };
    case 'error':
      return {
        ...state,
        error: true,
        helper: action.value,
      };
    default:
      throw new Error();
  }
}

//
// const getOAuthProviderIcon = (provider: string) => {
//   switch (provider) {
//     case ProviderId.GOOGLE:
//       return <GoogleIcon fontSize="inherit" />;
//     case ProviderId.GITHUB:
//       return <GitHubIcon fontSize="inherit" />;
//     default:
//       return <LoginIcon fontSize="inherit" />;
//   }
// };

export const LoginContainer: FC = () => {
  const history = useHistory();
  const { state: locationState } = useLocation<{ from: string }>();
  const { loginWithEmailAndPassword, loginWithOauthPopup } = useAuthContext();
  const [authError, setAuthError] = useState('');
  const [emailState, dispatchEmail] = useReducer<Reducer<TLoginFormFieldState, Action>>(reducer, {
    name: 'email',
    value: '',
  });

  const [passwordState, dispatchPassword] = useReducer<Reducer<TLoginFormFieldState, Action>>(reducer, {
    name: 'password',
    value: '',
  });

  const processLogin = (loginPromise: Promise<TLoginWithEmailAndPasswordResult>) => {
    return loginPromise
      .then(() => {
        history.push(locationState?.from || '/');
      })
      .catch((error) => {
        setAuthError(error?.message || 'error');
      });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let valid = true;
    if (!validateEmail(emailState.value)) {
      dispatchEmail({
        type: 'error',
        value: 'Введите корректный email',
      });
      valid = false;
    }

    if (passwordState.value.length <= 6) {
      dispatchPassword({
        type: 'error',
        value: 'Длинна пароля меньше 6-ти символов',
      });
      valid = false;
    }

    if (valid) {
      processLogin(loginWithEmailAndPassword(emailState.value, passwordState.value));
    }
  };

  const onOauthLogin = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const dataset = (e.target as HTMLElement)?.dataset;
    if (dataset?.provider) {
      processLogin(loginWithOauthPopup(dataset?.provider));
    }
  };

  return (
    <div className="login-container-wrap">
      <div className="login-container">
        <Title>Log in</Title>

        {authError && <div className="login-container__error">{authError}</div>}

        <p className="login-form__intro">Enter your credentials to access you account.</p>

        <button className="button-oauth-login" data-provider={new GoogleAuthProvider()} onClick={onOauthLogin}>
          <img className="x" src={require('./../../../images/google-logo.svg')} alt="Google" />
          Login with Google Account
        </button>

        <div className="login-divider">or</div>

        <div className="login-form-container">
          <LoginForm
            className="login-form"
            email={{
              ...emailState,
              onChange: (e) => dispatchEmail({ type: 'change', value: e.target.value }),
            }}
            password={{
              ...passwordState,
              onChange: (e) => dispatchPassword({ type: 'change', value: e.target.value }),
            }}
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </div>
  );
};
