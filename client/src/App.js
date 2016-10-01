import React, { Component } from 'react';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import $ from "jquery";

// import DevTools from 'mobx-react-devtools';

let data = observable({message: "Hello World!", project: null});

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
        {data.message}
        <pre>{JSON.stringify(data.project, null, 2)}</pre>
      </div>
    );
  }
}
