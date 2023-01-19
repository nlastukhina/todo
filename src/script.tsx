import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import { initializeAPI } from './api';
import { App } from '@components/App/App';
import { AuthContextProvider } from './features/auth/AuthContextProvider';
import './common.css';

const firebaseApp = initializeAPI();

ReactDOM.render(
  <AuthContextProvider firebaseApp={firebaseApp}>
    <Router>
      <App />
    </Router>
  </AuthContextProvider>,
  document.getElementById('root')
);
