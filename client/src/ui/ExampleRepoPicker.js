import React, { Component } from 'react';
import {observer} from 'mobx-react';
import $ from 'jquery';

const repos = [
  'bagilevi/jsdepviz',
  'gaearon/react-dnd',
  'gaearon/dnd-core',
  'jiahaog/nativefier',
  'reactjs/redux',
  'webpack/webpack',
  'web-pal/DBGlass'
]

export default @observer class ExampleRepoPicker extends Component {
  render() {
    return (
      <div id="example-repo-picker">
        <div className="title">Examples:</div>
        <ul>
        {
          repos.map((name) => (
            <li key={name}>
              <a href="#" onClick={this.handleRepoClick.bind(this, name)}>{name}</a>
            </li>
          ))
        }
        </ul>
      </div>
    );
  }
  handleRepoClick(name, ev) {
    ev.preventDefault();
    this.props.onProjectChange(name);
  }
}
