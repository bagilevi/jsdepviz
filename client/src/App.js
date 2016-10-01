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

@observer class Layers extends Component {
  @observable selectedNode;
  render() {
    return (
      <div id="layers">
        {
          this.props.layers.map((layer, layerIndex) => (
            <div className="layer" key={layerIndex}>
              {
                layer.map((cluster, clusterIndex) => (
                  <div className="cluster" key={clusterIndex}>
                    {
                      cluster.map((node, nodeIndex) => (
                        <Node node={node}
                              selected={node == this.selectedNode}
                              key={nodeIndex}
                              onSelect={this.handleSelect.bind(this)}/>
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
  handleSelect(node) {
    this.selectedNode = node
  }
}

class Node extends Component {
  render() {
    let style = {};
    if (this.props.selected) {
      style.color = '#FFF';
      style.backgroundColor = '#249';
    }
    return (
      <div className="node"
           style={style}
           onClick={this.props.onSelect.bind(this, this.props.node)}>
        {this.props.node}
      </div>
    )
  }
}

// Components:
// * Layer
// * Cluster
// * Module (js file) - can hover
// * Edge (js file to js file) - can be highlighted
