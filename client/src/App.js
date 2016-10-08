import React, { Component } from 'react';
import {observable, computed} from 'mobx';
import {observer} from 'mobx-react';
import $ from "jquery";

import Arrows from './ui/Arrows';
import Layers from './ui/Layers';
import Status from './ui/Status';
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

@observer export default class App extends Component {
  componentDidMount() {
    retrieveProject(this.props.params.user, this.props.params.repo, data);
  }
  render() {
    return (
      <div id="main">
        <Status status={data.status} />
        {data.project !== null ? <Layers layers={data.project.layers} data={data} onReRender={this.handleReRender}/> : null}
        {(data.arrows !== null && data.project !== null) ? <Arrows data={data}/> : null}
        {/*<pre>{JSON.stringify(data.project, null, 2)}</pre>*/}
      </div>
    );
  }
  handleReRender() {
    updateArrows();
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
