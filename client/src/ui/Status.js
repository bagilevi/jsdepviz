import React, { Component } from 'react';
import {observer} from 'mobx-react';

export default @observer class Status extends Component {
  render() {
    const status = this.props.status;
    if (status.done) return null;
    return (
      <div id="status" className={status.error ? "error" : null}>
        {this.props.status.message}
      </div>
    )
  }
}
