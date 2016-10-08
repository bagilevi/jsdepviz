import $ from "jquery";

function apiRoot() {
  if (window.location.hostname == '0.0.0.0' ||
      window.location.hostname == '127.0.0.1' ||
      window.location.hostname == 'localhost') {
    return 'http://0.0.0.0:3001';
  } else {
    return window.location.origin;
  }
}

export default function retrieveProject(user, repo, data) {
  data.status.message = 'Retrieving project...';
  $.ajax({
    url: `${apiRoot()}/api/v1/repos/${user}/${repo}.json`,
    dataType: "json",
    success: (response) => {
      data.status.message = 'Preparing data...';
      data.nodeIds = {};
      var i = 1;
      for (var source in response.dependencies) {
        if (data.nodeIds[source] === undefined) {
          data.nodeIds[source] = i
          i++;
        }
        for (var j = 0; j < response.dependencies[source].length; j++) {
          const target = response.dependencies[source][j];
          if (data.nodeIds[target] === undefined) {
            data.nodeIds[target] = i
            i++;
          }
        }
      }
      data.project = response;
      data.status.message = 'Done.';
      data.status.done = true;
    },
    error: (response) => {
      data.status.message = (response.responseJSON ? response.responseJSON.error : JSON.stringify(response));
      data.status.error = true;
    }
  })
}
