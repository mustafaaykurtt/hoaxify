import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './boostrap-override.scss';
import App from './container/App';
import './i18n';
import { Provider } from 'react-redux';
import { store } from './redux/app/store';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);


