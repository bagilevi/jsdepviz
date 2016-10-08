import React, { Component } from 'react';
import {observable, computed, autorun} from 'mobx';
import {observer} from 'mobx-react';
import $ from "jquery";
import { browserHistory } from 'react-router'

import Arrows from './ui/Arrows';
import Layers from './ui/Layers';
import Status from './ui/Status';
import GithubRepoForm from './ui/GithubRepoForm';
import retrieveProject from './data/retrieveProject';

// import DevTools from 'mobx-react-devtools';

let data = observable({
  status: {
    message: 'Loading...',
    error: false,
    done: false
  },
  project: null,
  selectedNode: undefined,
  arrows: null,
});

export default @observer class App extends Component {
  componentWillMount() {
    this.repopulateProject(this.props);
  }
  componentWillReceiveProps(newProps) {
    this.repopulateProject(newProps);
  }
  repopulateProject(props) {
    data.status = {
      message: 'Loading...',
      error: false,
      done: false
    }
    data.project = null;
    data.selectedNode = undefined;
    data.arrows = null;
    retrieveProject(...props.project.split('/'), data);
  }
  render() {
    return (
      <div id="main">
        <header>
          <GithubRepoForm onEntry={this.handleEntry.bind(this)} />
        </header>
        <div id="content">
          {data.status.done
            ?
              <div>
                {data.project !== null ? <Layers layers={data.project.layers} data={data} onReRender={this.handleReRender}/> : null}
                {(data.arrows !== null && data.project !== null) ? <Arrows data={data}/> : null}
              </div>
            : <Status status={data.status} />
          }
        </div>
      </div>
    );
  }
  handleReRender() {
    updateArrows();
  }
  handleEntry(value) {
    const regex = new RegExp('\s*https:\/\/github.com/([^\/]+)/([^\/]+).*')
    var matches = value.match(regex);
    if (matches) {
      this.props.navigator.setProject(`${matches[1]}/${matches[2]}`);
      return;
    }
    matches = value.match(new RegExp('\s*([^\/]+)/([^\/]+)\s*'));
    if (matches) {
      this.props.navigator.setProject(`${matches[1]}/${matches[2]}`);
      return;
    }
  }
}


$(() => {
  $(window).resize(() => {
    updateArrows();
  })
})

function updateArrows() {
  const offset = $('.node:first').offset();
  data.arrows = offset;
}
