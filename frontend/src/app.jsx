import React, { Component } from "react";
import Header from './common/components/header';

export default class App extends Component {
  constructor(props) {
  super(props);
    this.state = {
      activeLink: true,
    };
  }
  render() {
    
    setTimeout(()=>{
      this.setState({ activeLink: false });  
      
  console.clear()
    },2000)
 
    
    return (
   
      <div id="app-container" className="body-color" >
        <div  className={
      this.state.activeLink
        ? " global-spinner "
        : "global-spinner active"
    }  >
           <img src="./../images/Pd-loader-1.gif" />
        </div>
        <Header />
        <div id="app-content">
          {this.props.children}
        </div>
      </div>
    );
  }
}