import React, { Component } from 'react'
import { Jumbotron, Input, Row, Button} from 'reactstrap';

const style = {
    textAlign: "center"
}

export default class CommandCenter extends Component {
    constructor(props){
        super(props);
        this.state = {
            command: "",
            newOS: "",
            commandLineText: ""
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
        let message;
        switch(this.state.command){
            case "switchOS":
                message = "Switching OS to: " + this.state.newOS;
                break;
            case "reboot":
                message = "Rebooting..."
                break;
            case "commandLine":
                message = "Excecuting in Command Line: " + this.state.commandLineText
                break;
            default:
                message = "Please enter a command!"
        }
        alert(message);
    }

    render() {

        return (
            <Jumbotron style={style}> 
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
            </Jumbotron>
        )
    }
};