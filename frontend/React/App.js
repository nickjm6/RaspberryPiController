import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import Header from "./Header"
import CommandCenter from "./CommandCenter"

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            piAddress: "Unavailible",
            currentOS: "Unknown"
        }
    }

    render() {
        let piInfo = {
            piAddress: this.state.piAddress,
            currentOS: this.state.currentOS
        }
        return (
          <div>
            <Header piInfo={piInfo} />
            <CommandCenter />
          </div>
        );
    }
};

ReactDOM.render(<App />, document.getElementById("root"))