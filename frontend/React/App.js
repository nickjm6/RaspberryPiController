import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import Header from "./Header"
import CommandCenter from "./CommandCenter"
import $ from "jquery"

const sig = "MyRazPi"

let hosts = [];

for(let i = 2; i < 256; i++){
    hosts.push("http://192.168.0." + i);
}

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            piAddress: "Unavailible",
            currentOS: "Unknown"
        }
    }

    componentDidMount(){
        hosts.forEach((host) => {
            $.get(host, (res) => {
                if (res === sig) {
                    this.setState({ piAddress: host.replace("http://", "")});
                    $.get(host + "/currentOS", (os) => this.setState({ currentOS: os }));
                }
            }).catch(() => {return})
        });
    }

    render() {
        let piInfo = {
            piAddress: this.state.piAddress,
            currentOS: this.state.currentOS
        }
        return (
          <div>
            <Header piInfo={piInfo} />
            {this.state.piAddress === "Unavailible" ? null : <CommandCenter />}
          </div>
        );
    }
};

ReactDOM.render(<App />, document.getElementById("root"))