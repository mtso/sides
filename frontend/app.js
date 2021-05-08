import React from 'react';
import ReactDOM from 'react-dom';

import AppContainer from './AppContainer'

document.addEventListener('DOMContentLoaded', (event) => {
  const testInfo = window.testInfo;
  ReactDOM.render(
    React.createElement(AppContainer, {testInfo: testInfo}, null),
    document.getElementById('app')
  );
});
