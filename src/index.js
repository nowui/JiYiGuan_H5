import './index.html';
import './index.css';
import dva from 'dva';

const FastClick = require('fastclick');
FastClick.attach(document.body, {});

// 1. Initialize
const app = dva({});

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./model/main'));
app.model(require('./model/index'));
app.model(require('./model/category'));
app.model(require('./model/order'));
app.model(require('./model/delivery'));
app.model(require('./model/favor'));
app.model(require('./model/team'));
app.model(require('./model/bill'));
app.model(require('./model/my'));
app.model(require('./model/story'));
app.model(require('./model/science'));

// 4. Router
app.router(require('./router'));

var url = location.href;

if (url.indexOf('from=timeline&isappinstalled=0') > -1) {
  url = url.replace('from=timeline&isappinstalled=0', '');
  window.location.href = url;
}

if (url.indexOf('from=groupmessage&isappinstalled=0') > -1) {
  url = url.replace('from=groupmessage&isappinstalled=0', '');
  window.location.href = url;
}

if (url.indexOf('?from=singlemessage&isappinstalled=0') > -1) {
  url = url.replace('?from=singlemessage&isappinstalled=0', '');
  window.location.href = url;
}

setTimeout(() => {
  document.getElementById("loading").remove();

  app.start('#root');
}, 300);
