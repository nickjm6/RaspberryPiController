import React, { Component } from 'react'
// import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from 'react-dom'

import Header from "./Header"
import CommandCenter from "./CommandCenter"

import { Alert } from "reactstrap"

import io from "socket.io-client"


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentOS: null,
            otherOperatingSystems: [],
            loaded: false,
            message: {
                type: "info",
                text: "Waiting for info on Raspberry Pi..."
            },
            commandName: "",
            commandData: ""
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmitClick = this.handleSubmitClick.bind(this);
        this.getOtherOperatingSystems = this.getOtherOperatingSystems.bind(this)
        this.queryPi = this.queryPi.bind(this);
        this.requestPi = this.requestPi.bind(this);
    }

    async requestPi(route, config) {
        try {
            let res = await fetch(route, config)
            let jsonRes = await res.json()
            if (!jsonRes)
                jsonRes = {}
            if (res.status == 200) {
                this.setState({
                    message: null,
                    loaded: true
                })
                return await jsonRes
            } else {
                let message = jsonRes.message || "An error occured, please check logs"
                let errMessage = `The server responded with a status code of ${res.status} when calling '${route}': '${message}'`
                this.setState({
                    message: {
                        type: "danger",
                        text: errMessage
                    },
                    loaded: true
                })
                throw new Error(errMessage)
            }
        } catch (err) {
            this.setState({
                message: {
                    type: "danger",
                    text: err.message
                },
                loaded: true
            })
        }
    }

    queryPi() {
        this.requestPi("/operatingSystem/current").then(res => {
            this.setState({ currentOS: res.currentOS })
        }).catch(() => {
            this.setState({ currentOS: null })
        })
    }

    getOtherOperatingSystems() {
        this.requestPi("/operatingSystem/other").then(res => {
            this.setState({ otherOperatingSystems: res.otherOperatingSystems })
        }).catch(() => {
            this.setState({ otherOperatingSystems: [] })
        })
    }

    handleInputChange(event) {
        this.setState({ message: null })
        const target = event.target;
        const value = target.value;
        const name = target.name;
        if (name == "commandName")
            this.setState({ commandData: "" })
        this.setState({
            [name]: value
        });
    }

    handleSubmitClick() {
        this.setState({ message: null })
        let { commandName, commandData } = this.state;
        let endpoint = "/"
        let data = {};
        switch (commandName) {
            case "switchOS":
                endpoint = "/operatingSystem/switch"
                if (commandData == "") {
                    this.setState({
                        message: {
                            type: "danger",
                            text: "Please select an OS to switch to!"
                        }
                    })
                    return;
                }
                data.osName = this.state.commandData
                break;
            case "reboot":
                endpoint = "/power/reboot"
                break;
            case "poweroff":
                endpoint = "/power/off"
                break;
            case "":
            case undefined:
            case null:
                this.setState({
                    message: {
                        text: "Please select a command",
                        type: "danger"
                    }
                })
                return;
            default:
                this.setState({
                    message: {
                        text: "That functionality isn't implemented yet",
                        type: "danger"
                    }
                })
                return;
        }
        const opts = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
        this.requestPi(endpoint, opts).then(res => {
            let message = res.message || "rebooting..."
            this.setState({
                message: {
                    text: message,
                    type: "info"
                },
                loaded: false
            });
        })
    }

    componentDidMount() {
        this.queryPi()
        this.getOtherOperatingSystems()

        const socket = io(window.location.href)
        socket.on("ping", data => {console.log(data)})
        socket.emit("event", "Hi Server, how's it going?")
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
                {this.state.message ? <Alert color={this.state.message.type} style={{ marginTop: "15px" }}>{this.state.message.text}</Alert> : null}
                <Header piInfo={piInfo} loaded={this.state.loaded} />
                {this.state.loaded ? <CommandCenter onChange={this.handleInputChange} onSubmit={this.handleSubmitClick} command={command}
                    otherOperatingSystems={this.state.otherOperatingSystems} /> : null}
            </div>
        );
    }
};

ReactDOM.render(<App />, document.getElementById("root"))