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
            piAddress: null,
            currentOS: null,
            loaded: false
        }
    }

    componentDidMount(){
        hosts.forEach((host) => {
            $.get(host, (res) => {
                if (res === sig) {
                    $.get(host + "/currentOS", (os) => this.setState({ 
                        currentOS: os,
                        piAddress: host.replace("http://", ""),
                        loaded: true
                    }));
                }
            }).catch(() => {
                if(host.match(/[0-9]*$/) == "255")
                    this.setState({loaded: true});
            })
        });
    }

    render() {
        let piInfo = {
            piAddress: this.state.piAddress,
            currentOS: this.state.currentOS
        }
        return (
          <div>
            <Header piInfo={piInfo} loaded={this.state.loaded}/>
            {piInfo.piAddress ? <CommandCenter piAddress={piInfo.piAddress} /> : null}
          </div>
        );
    }
};

ReactDOM.render(<App />, document.getElementById("root"))