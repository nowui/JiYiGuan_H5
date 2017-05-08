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
app.model(require('./model/index'));
app.model(require('./model/category'));
app.model(require('./model/order'));
app.model(require('./model/delivery'));
app.model(require('./model/favor'));
app.model(require('./model/team'));
app.model(require('./model/bill'));
app.model(require('./model/my'));

// 4. Router
app.router(require('./router'));

document.getElementById('loading').remove();

// 5. Start
app.start('#root');
