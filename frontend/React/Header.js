import React, { Component } from 'react'
import { Jumbotron} from 'reactstrap';

import Loader from 'react-loader'

const style = {
    marginTop: "25px",
    textAlign: "center"
}

function Header(props) {
    let {currentOS} = props.piInfo;
    let formattedOS = currentOS ? currentOS.substring(0, 1).toUpperCase() + currentOS.slice(1) : null
    return (
        <Jumbotron style={style}>
            {props.loaded ? 
                        <h3>Current OS: {formattedOS}</h3> :
                <div>
                    <h2>{props.loadingMessage}</h2>
                    <Loader loaded={props.loaded} />
                </div>
            } 
        </Jumbotron>
    )
};

export default Header;