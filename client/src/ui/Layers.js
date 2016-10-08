import React, { Component } from 'react';
import {observer} from 'mobx-react';
import $ from "jquery";

import Node from './Node';

export default @observer class Layers extends Component {
  render() {
    const data = this.props.data;
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
                              data={data}
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
    this.props.data.selectedNode = node
  }
  componentDidMount() {
    this.props.onReRender();
  }
  componentDidUpdate() {
    this.props.onReRender();
  }
}
