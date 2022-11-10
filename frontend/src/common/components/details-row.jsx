import React from "react";


let DetailsRow = props => {
  return (
    <tr>
      <th>{props.label}</th>
      <td>{props.data} <span style={{ fontSize: '14px', color: 'gray' }}> {props.text ? props.text : null} </span> </td>
    </tr>)
}
export default DetailsRow;