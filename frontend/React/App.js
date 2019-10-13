import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import Header from "./Header"
import CommandCenter from "./CommandCenter"
import $ from "jquery"

import {Alert} from "reactstrap"

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            currentOS: null,
            loaded: false,
            errMessage: null,
            loadingMessage: "Waiting for info on Raspberry Pi...",
            commandName: "",
            commandData: ""
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmitClick = this.handleSubmitClick.bind(this);
        this.queryPi = this.queryPi.bind(this);
    }

    queryPi(){
        fetch("/currentOS").then(res => res.json()).then(jsonRes => {
            this.setState({currentOS: jsonRes.currentOS, loaded: true, loadingMessage: ""})
        }).catch(err => {
            this.setState({errMessage: err.statusText})
        })
    }

    handleInputChange(event) {
        this.setState({errMessage: null})
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
        this.setState({errMessage: null})
        let endpoint = `/${this.state.commandName}`;
        let data = {};
        let validCommands = ["switchOS", "reboot"]
        if(this.state.commandName == "switchOS"){
            if(this.state.commandData  == ""){
                this.setState({errMessage: "Please select and OS to switch to!"});
                return;
            }
            data.osName = this.state.commandData
        }
        if(validCommands.includes(this.state.commandName)){
            $.post(endpoint, data, response => response.json()).then(response => {
                let message = response && response.message ? response.message : "rebooting..."
                this.setState({
                    loadingMessage: message,
                    loaded: false
                });
            }).catch((err) => {
                this.setState({errMessage: err.responseText})
            });
        }else if(endpoint == "")
            this.setState({errMessage: "Please select a command"})
        else
            this.setState({errMessage: "That functionality isn't implemented yet"})
    }

    componentDidMount(){
        this.queryPi()
    }

    render() {
        let piInfo = {
            currentOS: this.state.currentOS
        }
        let command = {
            commandName: this.state.commandName,
            commandData: this.state.commandData
        }
        return (
          <div>
            {this.state.errMessage ? <Alert color="danger">{this.state.errMessage}</Alert> : null}
            <Header piInfo={piInfo} loaded={this.state.loaded} loadingMessage={this.state.loadingMessage}/>
            {this.state.loaded ? <CommandCenter onChange={this.handleInputChange} onSubmit={this.handleSubmitClick} command={command} /> : null}
          </div>
        );
    }
};

ReactDOM.render(<App />, document.getElementById("root"))