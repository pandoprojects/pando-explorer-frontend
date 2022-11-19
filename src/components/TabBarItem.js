import React from "react";
import "./TabBarItem.css";
import { NavLink } from "react-router-dom";


// This is all abput the condition based on the button onclick method and its image and title according to the select
class TabBarItem extends React.Component {
  render() {
    let content = null;

    if (this.props.href) {
      content = (
        /*Added Class Dropdown-item   for Mobile View*/
        <NavLink
          to={this.props.href}
          className={`TabBarItem ${this.props.isMobile ? "dropdown-item" : ""}`}
          activeClassName="TabBarItem--is-active1"
          onClick={this.props.onClick}
        >
          {this.props.normalIconUrl && (
            <img
              className="TabBarItem__icon"
              alt={this.props.title}
              src={this.props.normalIconUrl}
            />
          )}

          {this.props.activeIconUrl && (
            <img
              className="TabBarItem__icon-active"
              alt={this.props.title}
              src={this.props.activeIconUrl}
            />
          )}

          <div className={"TabBarItem__title"}>{this.props.title}</div>
        </NavLink>
      );
    } else {
      content = (
        <a
          className={`TabBarItem ${this.props.isMobile ? "dropdown-item" : ""}`}
          href={this.props.href}
          target={this.props.target}
          onClick={this.props.onClick}
        >
          <img
            className="TabBarItem__icon"
            alt={this.props.title}
            src={this.props.normalIconUrl}
          />
          <div className={"TabBarItem__title"}>{this.props.title}</div>
        </a>
      );
    }

    return content;
  }
}

export default TabBarItem;
