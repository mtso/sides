import React from 'react';
import ReactDOM from 'react-dom';

import AppContainer from './AppContainer'

document.addEventListener('DOMContentLoaded', (event) => {
  const testInfo = window.testInfo;
  ReactDOM.render(
    React.createElement(AppContainer, {testInfo: testInfo}, null),
    document.getElementById('app')
  );

  // let ws = null;

  // function connectWs() {
  //   return new Promise((resolve, reject) => {
  //     if (ws) {
  //       ws.onerror = ws.onopen = ws.onclose = null;
  //       ws.close();
  //     }

  //     ws = new WebSocket(`ws://${location.host}`);
  //     ws.onerror = function (e) {
  //       console.error('WebSocket error', e);
  //     };
  //     ws.onopen = function () {
  //       console.log('WebSocket connection established');
  //       resolve(ws)
  //     };
  //     ws.onclose = function () {
  //       console.log('WebSocket connection closed');
  //       ws = null;
  //     };
  //   })
  // }

  // setInterval(() => {
  //   if (!ws) {
  //     return connectWs().then(
  //       (ws) => ws.send(
  //         JSON.stringify({room: window.testInfo, message:'hello', event: 'join'}))
  //     ).catch((err) => console.error(err));
  //   }
  //   ws.send(JSON.stringify({room: window.testInfo, message:'hello', event: 'join'}))
  // }, 5000)
});
