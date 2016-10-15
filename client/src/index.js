import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import App from './App'
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import GithubRepoForm from './ui/GithubRepoForm';
import ExampleRepoPicker from './ui/ExampleRepoPicker';

function projectFromPath(path) {
  if (path === undefined) return;
  let p = path.split('/');
  if (p.length == 4 && p[0] == '' && p[1] == 'repos') {
    return p[2] + '/' + p[3];
  }
}

let state = observable({ project: projectFromPath(window.location.pathname) });

window.onpopstate = () => {
  state.project = projectFromPath(window.location.pathname);
}

@observer class Router extends Component {

  navigator = {
    setProject(project) {
      window.history.pushState(null, null, `/repos/${project}`);
      state.project = project;
    }
  }

  render() {
    return (
      <div>
        <header>
          <div id="logo">
            <div className="title">JsDepViz</div>
            <div className="explanation">JavaScript Dependency Visualizer</div>
          </div>
          <GithubRepoForm project={state.project} onProjectChange={this.handleProjectChange.bind(this)} />
          <ExampleRepoPicker onProjectChange={this.handleProjectChange.bind(this)} />
          <div id="about">
            <ul className="menu">
              <li><a href="https://github.com/bagilevi/jsdepviz">Source Code</a></li>
              <li><a href="http://levente.bagi.name">Author</a></li>
            </ul>
          </div>
        </header>
        <div className="contents">
          {
            state.project
              ? <App project={state.project} navigator={this.navigator}/>
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
