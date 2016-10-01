var jsModuleDependecies = require('js-module-dependencies');
var layerizer = require('layerizer');
var graphlib = require('graphlib');

module.exports = function(app) {
  var bodyParser = require('body-parser');
  app.use(bodyParser.json());

  app.get('/projects/1.json', function (req, res) {
    jsModuleDependecies.getModuleDependenciesInProject('/Users/lev/tmp/react-dnd/src', function(dependencies) {
      var graph = convertDependenciesToGraph(dependencies);
      var layers = layerizer.layerize(graph);
      res.send(JSON.stringify(layers, null, 2));
    });

  });
}

function convertDependenciesToGraph(dependencies) {
  var g = new graphlib.Graph();
  for (var src in dependencies) {
    var dests = dependencies[src];
    for (var i = 0; i < dests.length; i++) {
      g.setEdge(src, dests[i]);
    }
  }
  return g;
}
