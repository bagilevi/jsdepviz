import React, { Component } from 'react';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import $ from 'jquery';

export default @observer class GithubRepoForm extends Component {
  @observable project;

  componentWillReceiveProps(nextProps) {
    this.project = undefined;
  }
  render() {
    return (
      <div id="github-repo-form">
        <form onSubmit={this.handleSubmit.bind(this)}>
          <input onBlur={this.handleBlur.bind(this)}
                 placeholder="GitHub URL or user/repo"
                 value={this.project || this.props.project}
                 onChange={this.handleChange.bind(this)}/>
        </form>
      </div>
    );
  }
  handleChange(ev) {
    this.project = ev.target.value;

  }
  handleBlur(event) {
    this.handleEntry(event.target.value);
  }
  handleSubmit(event) {
    event.preventDefault();
    this.handleEntry($(event.target).find('input').val());
  }
  handleEntry(value) {
    const regex = new RegExp('\\s*https:\/\/github.com/([^\/]+)/([^\/]+).*')
    var matches = value.match(regex);
    if (matches) {
      this.props.onProjectChange(`${matches[1]}/${matches[2]}`);
      return;
    }
    matches = value.match(new RegExp('\\s*([^\/\\s]+)\\s*/\\s*([^\/\\s]+)\\s*'));
    if (matches) {
      this.props.onProjectChange(`${matches[1]}/${matches[2]}`);
      return;
    }
  }
}
