import React, { Component } from 'react';
import {observable, computed} from 'mobx';
import {observer} from 'mobx-react';
import $ from "jquery";

// import DevTools from 'mobx-react-devtools';

let data = observable({
  project: null,
  selectedNode: undefined,
  arrows: null,
});

$.ajax({
  url: "http://0.0.0.0:3001/projects/1.json",
  dataType: "json",
  success: (response) => {
    data.nodeIds = {};
    var i = 1;
    for (var source in response.dependencies) {
      for (var j = 0; j < response.dependencies[source].length; j++) {
        const target = response.dependencies[source][j];
        if (data.nodeIds[target] === undefined) {
          data.nodeIds[target] = i
          i++;
        }
      }
    }
    data.project = response;
  }
})

@observer export default class App extends Component {
  render() {
    return (
      <div id="main">
        {data.project !== null ? <Layers layers={data.project.layers}/> : null}
        {(data.arrows !== null && data.project !== null) ? <Arrows arrows={data.arrows}/> : null}
        {/*<pre>{JSON.stringify(data.project, null, 2)}</pre>*/}
      </div>
    );
  }
}

@observer class Layers extends Component {
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
                              selected={node == data.selectedNode}
                              selectedNode={data.selectedNode}
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
    data.selectedNode = node
  }
  componentDidMount() {
    updateArrows();
  }
  componentDidUpdate() {
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
  console.log(offset);
  data.arrows = offset;
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
      <div id={`node-${data.nodeIds[this.props.node]}`}
           className={classNames.join(' ')}
           onClick={this.props.onSelect.bind(this, this.props.node)}>
         <span className="distance-in">{distanceIn}</span>
         <span className="name">{this.props.node}</span>
         <span className="distance-out">{distanceOut}</span>
      </div>
    )
  }
}

@observer class Arrows extends Component {
  render() {
    const $container = $('#layers');
    const containerOffset = $container.offset();
    return (
      <svg version="1.1"
           baseProfile="full"
           style={{
             position: 'absolute',
             top: containerOffset.top,
             left: containerOffset.left,
             pointerEvents: 'none'
           }}
           width={$container.width()}
           height={$container.height()}
           xmlns="http://www.w3.org/2000/svg">
        {
          Object.keys(data.project.dependencies).map((source) => (
            data.project.dependencies[source].map((target) => {
              const $node1 = $(`#node-${data.nodeIds[source]}`);
              const $node2 = $(`#node-${data.nodeIds[target]}`);
              const visible = data.selectedNode == source || data.selectedNode == target;

              if (visible) {
                return (
                  <line x1={$node1.offset().left - containerOffset.left + $node1.outerWidth()}
                        x2={$node2.offset().left - containerOffset.left}
                        y1={$node1.offset().top - containerOffset.top + $node1.outerHeight()/2}
                        y2={$node2.offset().top - containerOffset.top + $node1.outerHeight()/2}
                        stroke="rgba(0,0,0,0.5)" fill="transparent" strokeWidth="1"/>

                )
              }
            })
          ))
        }

      </svg>
    )
    return (
      <div style={{position: 'absolute', top: `${this.props.arrows.top}px`, left: `${this.props.arrows.left}px`}}>
        Arrows
      </div>
    )
  }
}
