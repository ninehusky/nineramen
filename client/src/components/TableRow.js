import React, { Component } from 'react';

class TableRow extends Component {
  render() {
    return(
      <tr>
        <td>{this.props.data.word}</td>
        <td>{this.props.data.emoji}</td>
        <td>{this.props.data.absurdity}</td>
        <td>{this.props.data.description}</td>
      </tr>
    );
  }
}

export default TableRow;