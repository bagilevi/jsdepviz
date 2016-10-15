var jsModuleDependecies = require('js-module-dependencies');
var layerizer = require('layerizer');
var graphlib = require('graphlib');
var gitRepoRetriever = require('./git-repo-retriever');

var repoDir = '../data/repos';

var redis = require("redis"),
    redisClient = redis.createClient();

function getDistances(graph) {
  return graphlib.alg.dijkstraAll(graph);
}

function getProjectJSON(user, repo, ref, callback) {
  gitRepoRetriever.getRepoFromGithub(user, repo, null, repoDir, (err, path) => {
    if (err) return callback(err);
    jsModuleDependecies.getModuleDependenciesInProject(path, function(dependencies) {
      var graph = convertDependenciesToGraph(dependencies);
      var layers = layerizer.layerize(graph);
      var project = {
        dependencies: dependencies,
        layers: layers,
        distances: getDistances(graph)
      }
      json = JSON.stringify(project, null, 2);
      callback(null, json);
    });
  })
}

function withCache(key, func, callback) {
  redisClient.get(key, function(err, reply) {
    if (err) return callback(`Redis: ${err}`);
    if (reply) return callback(null, reply);
    func((err, value) => {
      if (err) return callback(err);
      redisClient.set(key, value, function(err, reply) {
        if (err) return callback(`Redis: ${err}`);
        callback(null, value);
      })
    });
  });

}
function getProjectJSONWithCache(user, repo, ref, callback) {
  withCache(`jsdepviz:projectjson:${user}/${repo}/${ref || '@'}`, getProjectJSON.bind(this, user, repo, ref), callback);
}

module.exports = function(app) {
  app.get('/api/v1/repos/:user/:repo.json', function (req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    function respondWithError(err) {
      res.status(500).send(JSON.stringify({ error: err.message }));
    }
    try {
      var user = req.params.user;
      var repo = req.params.repo;

      getProjectJSONWithCache(user, repo, null, (err, json) => {
        if (err) return respondWithError(err);
        res.send(json);
      });

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
