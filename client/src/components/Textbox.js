import React, { Component } from 'react';

export default class Textbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
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

  handleChange(event) {
    const text = event.target.value.split(' ');
    let emojifiedText = "";
    for (const word of text) {
      let updated = false;
      for (const entry of this.state.entries) {
        if (entry.word === word) {
          emojifiedText += word + entry.emoji + ' ';
          updated = true;
          break;
        }
      }
      if (!updated) {
        emojifiedText += word + ' ';
      }
    }
    this.setState({ emojifiedText });
  }

  render() {
    return (
      <div className="container text-center d-flex justify-content-around" id="play-area">
        <textarea placeholder="input goes here..." onChange={(e) => this.handleChange(e)} className="mx-auto w-50" />
        <textarea readOnly className="mx-auto w-50" placeholder="...and your output will go here!" value={this.state.emojifiedText} />
      </div>
    );
  }
}