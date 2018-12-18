import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';
import "@babel/polyfill";
import indexRoutes from './routes/index';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { Provider } from "react-redux";
import store from './store/store';
import { IntlProvider } from 'react-intl';
import { addLocaleData } from "react-intl";
import locale_en from 'react-intl/locale-data/en';
import locale_ko from 'react-intl/locale-data/ko';
import messages_ko from "./assets/i18n/ko.json";
import messages_en from "./assets/i18n/en.json";

addLocaleData([...locale_en, ...locale_ko]);

const messages = {
  'ko': messages_ko,
  'en': messages_en
};
const language = navigator.language.split(/[-_]/)[0];  // language without region code

ReactDOM.render(
  <React.StrictMode>
    <IntlProvider locale={language} messages={messages[language]}>
      <Provider store={store}>
        <HashRouter>
          <Switch>
            {
              indexRoutes.map((prop, key) => {
                return <Route path={prop.path} component={prop.component} key={key} />
              })
            }
          </Switch>
        </HashRouter>
      </Provider>
    </IntlProvider>
  </React.StrictMode>,
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
