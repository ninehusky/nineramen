import React, { Component } from 'react';

export default class extends Component {
  render() {
    return(
      <footer className="footer">
        <nav className="navbar bg-dark text-light">
          a short film by ninehusky
          <ul className="nav navbar-default justify-content-end">
            <li className="nav-item">
              <a className="nav-link" href="mailto:acheung8+oops@cs.washington.edu">my email</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="https://www.github.com/ninehusky">my github</a>
            </li>
          </ul>
        </nav>
      </footer>
    );
  }
}