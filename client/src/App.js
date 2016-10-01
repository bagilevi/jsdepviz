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
                              selectedNode={this.selectedNode}
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
    let classNames = ["node"];
    let distance, distanceIn, distanceOut;
    if (this.props.selected) {
      classNames.push('selected');
    }
    else if (this.props.selectedNode !== undefined) {
      distanceOut = data.project.distances[this.props.node][this.props.selectedNode].distance;
      distanceIn = data.project.distances[this.props.selectedNode][this.props.node].distance;
      distance = distanceIn === null ? distanceOut : distanceIn
      if (distance !== null) {
        classNames.push('connected');
        classNames.push("connected-" + distance);
      }
    }
    return (
      <div className={classNames.join(' ')}
           onClick={this.props.onSelect.bind(this, this.props.node)}>
         <span className="distance-in">{distanceIn}</span>
         <span className="name">{this.props.node}</span>
         <span className="distance-out">{distanceOut}</span>
      </div>
    )
  }
}

// Components:
// * Layer
// * Cluster
// * Module (js file) - can hover
// * Edge (js file to js file) - can be highlighted
