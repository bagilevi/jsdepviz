import React, { Component } from 'react';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import $ from "jquery";

// import DevTools from 'mobx-react-devtools';

let data = observable({project: null});

$.ajax({
  url: "http://0.0.0.0:3001/projects/1.json",
  dataType: "json",
  success: (response) => {
    data.project = response;
  }
})

@observer export default class App extends Component {
  render() {
    return (
      <div id="main">
        {data.project !== null ? <Layers layers={data.project.layers.reverse()}/> : null}
        {/*<pre>{JSON.stringify(data.project, null, 2)}</pre>*/}
      </div>
    );
  }
}

class Layers extends Component {
  render() {
    return (
      <div id="layers">
        {
          this.props.layers.map((layer) => (
            <div className="layer">
              {
                layer.map((cluster) => (
                  <div className="cluster">
                    {
                      cluster.map((node) => (
                        <div className="node">
                          {node}
                        </div>
                      ))
                    }
                  </div>
                ))
              }
            </div>
          ))
        }
      </div>
    );
  }
}

// Components:
// * Layer
// * Cluster
// * Module (js file) - can hover
// * Edge (js file to js file) - can be highlighted
