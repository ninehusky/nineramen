import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TextView from './TextView';

function App() {
  return (
    <div className="app">
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
          <button type="button" className="btn btn-primary">Sign Up</button>
          <button type="button" className="btn btn-light">Login</button>
        </span>
      </nav>
      <TextView />
      <Footer />
    </div>
  );
}

export default App;
