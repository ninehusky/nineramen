import React, { Component } from 'react';

export default class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">nineramen!</a>
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <a className="nav-link" href="#">textbox</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">about</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">dictionary</a>
          </li>
        </ul>
        <span className="navbar-text">
          <button type="button" className="btn btn-primary" disabled>Sign Up</button>
          <button type="button" className="btn btn-light" disabled>Login</button>
        </span>
      </nav>
    );
  }
}