import React, { Component } from "react";
import { withTranslation } from "react-i18next";



class NotExist extends Component {
  render() {
    const { msg, t } = this.props;
    return (
      <div className="th-not-exist">
        {msg ? msg : t(`THIS_OBJECT_DOES_NOT_EXIST`)}
      </div>
    );
  }
}
export default withTranslation()(NotExist)
