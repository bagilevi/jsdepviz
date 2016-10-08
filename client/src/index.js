import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import App from './App'
import {observer} from 'mobx-react';
import {observable} from 'mobx';

function projectFromPath(path) {
  let p = path.split('/');
  if (p.length == 4 && p[0] == '' && p[1] == 'repos') {
    return p[2] + '/' + p[3];
  }
}

let state = observable({ params: { project: projectFromPath(window.location.pathname) } });
window.state = state;


@observer class Router extends Component {

  navigator = {
    setProject(project) {
      window.history.pushState(null, null, `/repos/${project}`);
      state.params.project = project;
    }
  }

  render() {
    console.log('render', state.params);
    return (
      <div>
        {/*{state.params.project}*/}
        <App project={state.params.project} navigator={this.navigator}/>

      </div>
    );
  }
}




ReactDOM.render((
  <Router />
), document.getElementById('root'))
