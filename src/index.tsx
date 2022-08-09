import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import AppRoutes from './app/routes';
import './index.css';

const el = document.getElementById('root');
if (el === null) throw new Error('Root container missing in index.html');

const root = ReactDOM.createRoot(el);
root.render(
  <React.StrictMode>
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  </React.StrictMode>,
);
