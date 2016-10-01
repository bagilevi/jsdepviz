module.exports = function(app) {
  var bodyParser = require('body-parser');
  app.use(bodyParser.json());

  app.get('/', function (req, res) {
    res.send('dependency-visualizer');
  });
}
