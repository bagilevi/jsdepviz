var jsModuleDependecies = require('js-module-dependencies');
var layerizer = require('layerizer');

module.exports = function(app) {
  var bodyParser = require('body-parser');
  app.use(bodyParser.json());

  app.get('/projects/1.json', function (req, res) {
    jsModuleDependecies.getModuleDependenciesInProject('/Users/lev/tmp/react-dnd/src', function(dependencies) {
      res.send(JSON.stringify(dependencies, null, 2));
    });

  });
}
