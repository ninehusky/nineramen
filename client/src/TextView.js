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
        <div className="jumbotron h-50">
          <Textbox entries={this.state.entries}/>
        </div>
        <article className="container" id="about">
          <h1>FAQ</h1>
          <hr/>
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