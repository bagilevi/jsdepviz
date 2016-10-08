import React, { Component } from 'react';

export default class Node extends Component {
  render() {
    const data = this.props.data;
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
    var path = this.props.node.split('/');
    var name = path.pop();
    path = path.join('/');
    if (path.length) path = path += '/';
    return (
      <div id={`node-${data.nodeIds[this.props.node]}`}
           className={classNames.join(' ')}
           onClick={this.props.onSelect.bind(this, this.props.node)}>
         <span className="distance-in">{distanceIn}</span>
         <span className="path-and-name">
           <span className="path">{path}</span>
           <span className="name">{name}</span>
         </span>
         <span className="distance-out">{distanceOut}</span>
      </div>
    )
  }
}
