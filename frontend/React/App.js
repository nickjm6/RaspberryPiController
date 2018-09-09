import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import Header from "./Header"
import CommandCenter from "./CommandCenter"
import $ from "jquery"

const sig = "MyRazPi"
const maxRetry = 5

let hosts = [];

let delay = d => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, d)
    })
}

for(let i = 2; i < 256; i++){
    hosts.push("http://192.168.0." + i);
}

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            piAddress: null,
            currentOS: null,
            loaded: false,
            loadingMessage: "",
            commandName: "",
            commandData: ""
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmitClick = this.handleSubmitClick.bind(this);
        this.piSearch = this.piSearch.bind(this);
        this.queryPi = this.queryPi.bind(this);
    }

    queryPi(retryCount){
        if(retryCount >= maxRetry || !piAddress){
            this.piSearch()
            return;
        }
        let hostname = "http://" + piAddress
        $.get(hostname, (response) => {
            if(response == sig){
                $.get(hostname + "/currentOS", (os) => {
                    this.setState({ 
                        currentOS: os,
                        loaded: true,
                        loadingMessage: ""
                    })
                }).catch((err) => {
                    console.log(err.statusText)
                    this.piSearch()
                    return;
                })
            } else{
                this.piSearch();
                return;
            }
        }).catch((err) => {
            delay(5000).then(() => this.queryPi(retryCount + 1))
        })
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        if(name == "commandName")
            this.setState({commandData: ""})
        this.setState({
          [name]: value
        });
    }

    handleSubmitClick(){
        if(this.state.piAddress == null){
            alert("Raspberry Pi not availible");
            return;
        }
        let endpoint = "http://" + this.state.piAddress + "/" + this.state.commandName;
        let data = {};
        let validCommands = ["switchOS", "reboot"]
        if(this.state.commandName == "switchOS"){
            if(this.state.commandData  == ""){
                alert("Please select and OS to switch to!");
                return;
            }
            data.osName = this.state.commandData
        }
        if(validCommands.includes(this.state.commandName)){
            $.post(endpoint, data, (response) => {
                this.setState({
                    loadingMessage: response,
                    loaded: false
                });
                this.queryPi(0)
            }).catch((err) => {
                alert(err.responseText)
            });
        }else if(endpoint == "")
            alert("Please select a command")
        else
            alert("That functionality isn't implemented yet")
    }

    piSearch(){
        this.setState({loadingMessage: "Looking for Raspberry Pi..."})
        hosts.forEach((host) => {
            $.get(host, (res) => {
                if (res === sig) {
                    $.get(host + "/currentOS", (os) => this.setState({ 
                        currentOS: os,
                        piAddress: host.replace("http://", ""),
                        loaded: true,
                        loadingMessage: ""
                    }));
                }
            }).catch(() => {
                if(host.match(/[0-9]*$/) == "255")
                    this.setState({loaded: true});
            })
        });
    }

    componentDidMount(){
        this.piSearch()
    }

    render() {
        let piInfo = {
            piAddress: this.state.piAddress,
            currentOS: this.state.currentOS
        }
        let command = {
            commandName: this.state.commandName,
            commandData: this.state.commandData
        }
        return (
          <div>
            <Header piInfo={piInfo} loaded={this.state.loaded} loadingMessage={this.state.loadingMessage}/>
            {this.state.loaded && this.state.piAddress ? <CommandCenter onChange={this.handleInputChange} onSubmit={this.handleSubmitClick} command={command} /> : null}
          </div>
        );
    }
};

ReactDOM.render(<App />, document.getElementById("root"))