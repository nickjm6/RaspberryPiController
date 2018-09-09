import React, { Component } from 'react'
import { Jumbotron, Input, Row, Button } from 'reactstrap';
import $ from 'jquery'

import Loader from 'react-loader'

function CommandCenter(props) {
    let command = props.command;
    return (
        <Jumbotron style={{ textAlign: "center" }}>
            <h3>Command Center</h3>
            <Input type="select" name="commandName" onChange={props.onChange}>
                <option value="">Select a Command</option>
                <option value="switchOS">Switch OS</option>
                <option value="reboot">Reboot</option>
                <option value="commandLine">Command Line</option>
            </Input><br />
            {command.commandName === "" || command.commandName === "reboot" ? null :
                command.commandName === "switchOS" ?
                    <Input type="select" name="commandData" onChange={props.onChange}>
                        <option value="">Select an OS to switch to</option>
                        <option value="raspbian">Raspbian</option>
                        <option value="retropie">Retropie</option>
                        <option value="rasplex">Rasplex</option>
                        <option value="kodi">Kodi</option>
                    </Input> :
                    <Input type="text" name="commandData" placeholder="Type in a command" onChange={props.handleInputChange} />
            }<br />
            {command.commandName === "" ? null : <Button color="info" onClick={props.onSubmit}>Submit</Button>}
        </Jumbotron>
    )
};

export default CommandCenter;