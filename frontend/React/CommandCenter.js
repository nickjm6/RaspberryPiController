import React, { Component } from 'react'
import { Jumbotron, Input, Row, Button} from 'reactstrap';
import $ from 'jquery'

import Loader from 'react-loader'

const style = {
    textAlign: "center"
}

export default class CommandCenter extends Component {
    constructor(props){
        super(props);
        this.state = {
            command: "",
            newOS: "",
            commandLineText: "",
            searching: false,
            loadingMessage: null
        }
        
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmitClick = this.handleSubmitClick.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
          [name]: value
        });
    }

    handleSubmitClick(){
        let endpoint = "http://" + this.props.piAddress + "/" + this.state.command;
        let data = {};
        let validCommands = ["switchOS", "reboot"]
        if(this.state.command == "switchOS"){
            if(this.state.newOS  == ""){
                alert("Please select and OS to switch to!");
                return;
            }
            data.osName = this.state.newOS
        }
        if(validCommands.includes(this.state.command)){
            $.post(endpoint, data, (response) => {
                console.log(response)
                this.setState({
                    loadingMessage: response,
                    searching: true
                })
            }).catch((err) => {
                alert(err.responseText)
            });
        }else if(endpoint == "")
            alert("Please select a command")
        else
            alert("That functionality isn't implemented yet")
    }

    render() {
        return (
            <Jumbotron style={style}> 
              {this.state.loadingMessage ? <div><h3>{this.state.loadingMessage}</h3><br /><br /></div> : null}
              <Loader loaded={!this.state.searching}>
                <h3>Command Center</h3>
                <Input type="select" name="command" onChange={this.handleInputChange}>
                    <option value="">Select a Command</option>
                    <option value="switchOS">Switch OS</option>
                    <option value="reboot">Reboot</option>
                    <option value="commandLine">Command Line</option>
                </Input><br />
                {this.state.command === "" || this.state.command ==="reboot" ? null :
                    this.state.command === "switchOS" ?
                        <Input type="select" name="newOS" onChange={this.handleInputChange}>
                            <option value="">Select an OS to switch to</option>
                            <option value="raspbian">Raspbian</option>
                            <option value="retropie">Retropie</option>
                            <option value="rasplex">Rasplex</option>
                            <option value="kodi">Kodi</option>
                        </Input> :
                        <Input type="text" name="commandLineText" placeholder="Type in a command" onChange={this.handleInputChange} />
                }<br />
                {this.state.command === "" ? null : <Button color="info" onClick={this.handleSubmitClick}>Submit</Button>}
              </Loader>
            </Jumbotron>
        )
    }
};