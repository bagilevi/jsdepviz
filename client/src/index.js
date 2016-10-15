import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import App from './App'
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import GithubRepoForm from './ui/GithubRepoForm';

function projectFromPath(path) {
  if (path === undefined) return;
  let p = path.split('/');
  if (p.length == 4 && p[0] == '' && p[1] == 'repos') {
    return p[2] + '/' + p[3];
  }
}

let state = observable({ params: { project: projectFromPath(window.location.pathname) } });

window.onpopstate = () => {
  state.params.project = projectFromPath(window.location.pathname);
}

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
        <header>
          <div id="logo">
            <div className="title">JsDepViz</div>
            <div className="explanation">JavaScript Dependency Vizualizer</div>
          </div>
          <GithubRepoForm project={state.params.project} onProjectChange={this.handleProjectChange.bind(this)} />
        </header>
        <div className="contents">
          {
            state.params.project
              ? <App project={state.params.project} navigator={this.navigator}/>
              : null
          }
        </div>
      </div>
    );
  }
  handleProjectChange(value) {
    this.navigator.setProject(value);
  }
}

ReactDOM.render((
  <Router />
), document.getElementById('root'))
