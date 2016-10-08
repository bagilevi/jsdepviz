import React, { Component } from 'react';
import {observer} from 'mobx-react';
import $ from "jquery";

export default @observer class Arrows extends Component {
  render() {
    const $container = $('#layers');
    const containerOffset = $container.offset();
    const data = this.props.data;
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
                        y2={$node2.offset().top - containerOffset.top + $node2.outerHeight()/2}
                        stroke="rgba(0,0,0,0.5)" fill="transparent" strokeWidth="1"/>

                )
              }
            })
          ))
        }

      </svg>
    )
  }
}
