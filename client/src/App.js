import React, { Component } from 'react';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import $ from "jquery";

// import DevTools from 'mobx-react-devtools';

let data = observable({message: "Hello World!"});
setInterval(() => {
  data.message += ".";
}, 1000)

@observer export default class App extends Component {
  render() {
    return (
      <div id="main">
        {data.message}
      </div>
    );
  }
}
