var Git = require("nodegit");
var fs = require("fs");

function fileExistsSync(path) {
  try {
    fs.accessSync(path, fs.F_OK);
    return true;
  } catch (e) {
    return false;
  }
}

function getRepoFromGithub(user, repo, ref, dataDir, callback) {
  var refOrTemp = ref || '_default';
  var localPath = `${dataDir}/github/${user}/${repo}/${refOrTemp}`;

  if (fileExistsSync(localPath)) {
    callback(null, localPath);
  }
  else {
    Git.Clone(`https://github.com/${user}/${repo}`, localPath)
      .then(function(repo) {
        callback(null, localPath)
      })
      .catch(function(err) { console.log(err); callback({message: "Could not retrieve repository."}) });
  }
}

// getRepoFromGithub('bagilevi', 'js-module-dependencies', null, './tmp/repos', console.log);

module.exports.getRepoFromGithub = getRepoFromGithub
