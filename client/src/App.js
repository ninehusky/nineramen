import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

import Footer from './components/Footer';
import Dictionary from './components/Dictionary';
import TextView from './TextView';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      table: null,
    };
  }

  componentDidMount() {
    fetch('http://localhost:5000/entries')
      .then((response) => response.json())
      .then((table) => {
        this.setState({ table });
      })
      .catch(console.error);
  }

  render() {
    return (
      <div className="app">
        <Router>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link className="navbar-brand" to="/">nineramen!</Link>
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" to="#about">about</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/dictionary">dictionary</Link>
              </li>
            </ul>
            <span className="navbar-text">
              <Link to="/signup">
                <button type="button" className="btn btn-primary" disabled>Sign Up</button>
              </Link>
              <Link to="/login">
                <button type="button" className="btn btn-light" disabled>Login</button>
              </Link>
            </span>
          </nav>
          <div className="container">
            <Switch>
              <Route path="/dictionary">
                <Dictionary table={this.state.table}/>
              </Route>
              <Route path="/">
                <TextView table={this.state.table}/>
              </Route>
            </Switch>
          </div>
        </Router>
        <Footer />
      </div>
    );
  }
}

export default App;
