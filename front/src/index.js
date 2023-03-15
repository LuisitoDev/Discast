import React from 'react';
import ReactDOM from 'react-dom';
import './main-bootstrap.css';
import './index.css';
import App from './App';
import {AuthContextProvider} from './components/Utils/auth-context';
import { SearchContextProvider } from './components/Utils/search-context';
import {GlobalAudioContextProvider} from './components/Utils/global-audio-context'

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <GlobalAudioContextProvider>
        <SearchContextProvider>
          <App />
        </SearchContextProvider>
      </GlobalAudioContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

