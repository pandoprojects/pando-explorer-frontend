import React, { Component } from "react";
import Header from './common/components/header';

export default class App extends Component {
  render() {
    return (
      <div id="app-container" className="body-color" >
        <Header />
        <div id="app-content">
          {this.props.children}
        </div>
      </div>
    );
  }
}