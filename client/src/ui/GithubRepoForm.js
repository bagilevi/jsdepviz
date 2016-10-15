import React, { Component } from 'react';
import {observer} from 'mobx-react';
import $ from 'jquery';

export default @observer class GithubRepoForm extends Component {
  render() {
    return (
      <div id="github-repo-form">
        <form onSubmit={this.handleSubmit.bind(this)}>
          <input onBlur={this.handleBlur.bind(this)} placeholder="GitHub URL or user/repo" defaultValue={this.props.project}/>
        </form>
      </div>
    );
  }
  handleBlur(event) {
    this.handleEntry(event.target.value);
  }
  handleSubmit(event) {
    event.preventDefault();
    this.handleEntry($(event.target).find('input').val());
  }
  handleEntry(value) {
    const regex = new RegExp('\s*https:\/\/github.com/([^\/]+)/([^\/]+).*')
    var matches = value.match(regex);
    if (matches) {
      this.props.onProjectChange(`${matches[1]}/${matches[2]}`);
      return;
    }
    matches = value.match(new RegExp('\s*([^\/]+)/([^\/]+)\s*'));
    if (matches) {
      this.props.onProjectChange(`${matches[1]}/${matches[2]}`);
      return;
    }
  }
}
