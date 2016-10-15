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
          <GithubRepoForm onEntry={this.handleEntry.bind(this)} />
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
  handleEntry(value) {
    const regex = new RegExp('\s*https:\/\/github.com/([^\/]+)/([^\/]+).*')
    var matches = value.match(regex);
    if (matches) {
      this.navigator.setProject(`${matches[1]}/${matches[2]}`);
      return;
    }
    matches = value.match(new RegExp('\s*([^\/]+)/([^\/]+)\s*'));
    if (matches) {
      this.navigator.setProject(`${matches[1]}/${matches[2]}`);
      return;
    }
  }
}

ReactDOM.render((
  <Router />
), document.getElementById('root'))
