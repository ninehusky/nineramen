import React, { Component } from 'react';
import MessageBox from './messages/MessageBox';
import ErrorMessage from './messages/ErrorMessage';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: null,
      successMessage: null,
    };
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ name, value });
  }

  handleSignup(e) {
    e.preventDefault();
    if (this.state.password !== this.state.confirmPassword) {
      this.setState({errorMessage: 'Your passwords do not match.'});
    }
    const body = {
      name: this.state.name,
      password: this.state.password
    };

    fetch('http://localhost:5000/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then(console.log);
  }

  render() {
    return (
      <section>
        <h1>Signup</h1>
        <MessageBox errorMessage={this.state.errorMessage} successMessage={this.state.successMessage}/>
        <form onChange={(e) => this.handleChange(e)} >
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input name="username" type="text" className="form-control" aria-describedby="usernameHelp" placeholder="Enter username" />
            <small className="form-text text-muted">Usernames can contain alphanumerics and underscores between 5-30 characters.</small>
          </div>
          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="password">Password</label>
              <input name="password" type="password" className="form-control" aria-describedby="passwordHelp" placeholder="Enter password" />
              <small className="form-text text-muted">Passwords must be longer than 8 characters.</small>
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input name="confirmPassword" type="password" className="form-control" aria-describedby="passwordHelp" placeholder="Confirm password" />
            </div>
          </div>
          <button type="submit" onClick={(e) => this.handleSignup(e)} className="btn btn-primary">Submit</button>
        </form>
      </section>
    );
  }
};

export default Signup;
