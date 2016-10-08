var bodyParser = require('body-parser');
// var jsModuleDependecies = require('js-module-dependencies');
var jsModuleDependecies = require('/Users/lev/Documents/code/personal/dependency-visualiser/js-module-dependencies/index.js');
var layerizer = require('layerizer');
var graphlib = require('graphlib');
var gitRepoRetriever = require('./git-repo-retriever');

var repoDir = '../data/repos';

function getDistances(graph) {
  return graphlib.alg.dijkstraAll(graph);
}

module.exports = function(app) {
  app.use(bodyParser.json());

  app.get('/projects/github/:user/:repo.json', function (req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    function respondWithError(err) {
      res.status(500).send(JSON.stringify({ error: err.message }));
    }
    try {
      var user = req.params.user;
      var repo = req.params.repo;
      gitRepoRetriever.getRepoFromGithub(user, repo, null, repoDir, (err, path) => {
        if (err) return respondWithError(err);
        jsModuleDependecies.getModuleDependenciesInProject(path, function(dependencies) {
          var graph = convertDependenciesToGraph(dependencies);
          var layers = layerizer.layerize(graph);
          var project = {
            dependencies: dependencies,
            layers: layers,
            distances: getDistances(graph)
          }
          res.send(JSON.stringify(project, null, 2));
        });
      })
    } catch (e) {
      respondWithError(e);
    }
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
