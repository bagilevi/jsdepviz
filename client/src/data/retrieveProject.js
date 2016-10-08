import $ from "jquery";

export default function retrieveProject(user, repo, data) {
  data.status.message = 'Retrieving project...';
  $.ajax({
    url: `http://0.0.0.0:3001/projects/github/${user}/${repo}.json`,
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
      data.status.message = response.responseJSON.error;
      data.status.error = true;
    }
  })
}
