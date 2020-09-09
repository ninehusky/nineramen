import React, { Component } from 'react';
import Textbox from './components/Textbox';

export default class TextView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: null,
    };
  }

  componentDidMount() {
    fetch('http://localhost:5000/entries')
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          entries: data,
        });
      })
      .catch(console.error);
  }

  render() {
    return (
      <section>
        <div className="jumbotron">
          <Textbox entries={this.state.entries}/>
        </div>
        <article className="container">
          <h1>FAQ</h1>
          <hr/>
          <section>
            <h2>Is my data safe?</h2>
            <div className="alert alert-danger">
              <p>
                To put it shortly, <strong>no. </strong>
                I've been working with JavaScript for about a year, and this is my first project that involves any sort of
                user data protection. I've done my best with what I know to secure your passwords, but I would heavily advise against
                using a username/password combination with my website that you use for other websites as well.
              </p>
            </div>
            In other words, I try my hardest to protect the username/password pairs, but I don't think I know quite enough for you
            to put the same faith in me that you put into your banks and Facebook accounts.
          </section>
          <br />
          <section>
            <h2>What is this?</h2>
            <p>This website is a tool for creating emojipastas.</p>
          </section>
          <br />
          <section>
            <h2>What's an emojipasta?</h2>
            <p>Emojipastas are blocks of text with egregious amounts of emojis placed between words.</p>
          </section>
          <br />
          <section>
            <h2>How do I use it?</h2>
            <p>Put your desired input into the first text box, and watch as the emojified output magically populates itself! 🥰</p>
          </section>
        </article>
      </section>
    );
  }
}