import React, { FC } from 'react';
// import Button from '@mui/material/Button';
import { Button } from '@components/Button/Button';
import './LoginForm.css';

export type TLoginField = {
  name: string;
  error?: boolean;
  helper?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

type TProps = {
  className?: string;
  email: TLoginField;
  password: TLoginField;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export const LoginForm: FC<TProps> = ({ className, email, password, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} method="POST">
      <div className={className}>
        <div className="form-control">
          <label htmlFor="email" className="form-control__label">
            Email Address
          </label>
          <input
            id="email"
            type="text"
            name={email.name}
            value={email.value}
            onChange={email.onChange}
            className="form-control__input"
            placeholder="admin@admin.ru"
          />
          <span className="message-error">{email.helper}</span>
        </div>
        <div className="form-control">
          <label htmlFor="password" className="form-control__label">
            Password
          </label>
          <input
            id="password"
            type="password"
            name={password.name}
            value={password.value}
            onChange={password.onChange}
            className="form-control__input"
            placeholder="1234567"
          />

          <span className="message-error">{password.helper}</span>
        </div>
        <Button type="submit">Войти</Button>
      </div>
    </form>
  );
};
