import React, { Component } from 'react'
import { Jumbotron} from 'reactstrap';

const style = {
    marginTop: "25px",
    textAlign: "center"
}

function Header(props) {
    return (
        <Jumbotron style={style}> 
            <h2>Pi Address: {props.piAddress}</h2>
            <h3>Current OS: {props.currentOS}</h3>
        </Jumbotron>
    )
};

export default Header;