import React, { Component } from 'react';
import {observer} from 'mobx-react';
import $ from 'jquery';

export default @observer class GithubRepoForm extends Component {
  render() {
    return (
      <div id="github-repo-form">
        <form onSubmit={this.handleSubmit.bind(this)}>
          <input onBlur={this.handleBlur.bind(this)} placeholder="GitHub URL or user/repo"/>
        </form>
      </div>
    );
  }
  handleBlur(event) {
    this.props.onEntry(event.target.value);
  }
  handleSubmit(event) {
    event.preventDefault();
    this.props.onEntry($(event.target).find('input').val());
  }
}
