const path = require('path');
const express = require('express');

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3001 : process.env.PORT;
const app = express();

// app.use(express.static(__dirname + '/../client/dist'));
// app.get('/', function response(req, res) {
//   res.sendFile(path.join(__dirname, '/../client/index.html'));
// });

require('./main')(app);

app.listen(port, '0.0.0.0', function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});
