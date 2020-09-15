import React, { Component } from 'react';

import ErrorMessage from './ErrorMessage';
import SuccessMessage from './SuccessMessage';


export default class MessageBox extends Component {
  render() {
    if (this.props.errorMessage) {
      return <ErrorMessage errorMessage={this.props.errorMessage} />
    } else if (this.props.successMessage) {
      return <SuccessMessage successMessage={this.props.successMessage} />
    }
    return null;
  }
}