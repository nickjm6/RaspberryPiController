import React from 'react'
import { Jumbotron, Input, Button } from 'reactstrap';

function CommandCenter(props) {
    let command = props.command;
    let submitDisabled = command.commandName === "" ? true : command.commandName === "switchOS" && command.commandData == ""
    return (
        <Jumbotron style={{ textAlign: "center" }}>
            <h3>Command Center</h3>
            <Input type="select" name="commandName" onChange={props.onChange}>
                <option value="">&lt;Select a Command&gt;</option>
                <option value="switchOS">Switch OS</option>
                <option value="reboot">Reboot</option>
                <option value="poweroff">Poweroff</option>
                <option value="commandLine">Command Line</option>
            </Input><br />
            {command.commandName === "" || command.commandName === "reboot" || command.commandName === "poweroff" ? null :
                command.commandName === "switchOS" ?
                    <Input type="select" name="commandData" onChange={props.onChange}>
                        <option value="">&lt;Select an OS to switch to&gt;</option>
                        {props.otherOperatingSystems.map(os => 
                            <option value={os}>{`${os.substr(0,1).toUpperCase()}${os.substr(1)}`}</option>
                        )}
                    </Input> :
                    <Input type="text" name="commandData" placeholder="Type in a command" onChange={props.handleInputChange} />
            }<br />
            {<Button color="info" onClick={props.onSubmit} disabled={submitDisabled}>Submit</Button>}
        </Jumbotron>
    )
};

export default CommandCenter;