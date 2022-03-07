require('dotenv').config();
const debug = require('debug')('index');
const app = require('./app/app');

const port = process.env.PORT || 3000;

app.listen(port, () => {
  debug(`Server: http://localhost:${port}`);
});
