import React, { Component } from 'react';

import TableRow from './TableRow';

class Dictionary extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
    if (this.props.table) {
      const entries = this.props.table.map((entry) => {
        return <TableRow data={entry} />
      });
      this.setState({ entries });
    }
  }

  render() {
    return(
      <table className="table">
        <thead>
          <th scope="col">word</th>
          <th scope="col">emoji</th>
          <th scope="col">absurdity</th>
          <th scope="col">description</th>
        </thead>
        <tbody>
          { this.state.entries }
        </tbody>
      </table>
    );
  }

}

export default Dictionary;