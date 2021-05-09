import 'regenerator-runtime/runtime'

import React from 'react';
import ReactDOM from 'react-dom';

import AppContainer from './AppContainer'

document.addEventListener('DOMContentLoaded', (event) => {
  ReactDOM.render(
    React.createElement(AppContainer, window.appData, null),
    document.getElementById('app')
  );
});
