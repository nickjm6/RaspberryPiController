import React, { Component } from 'react'
import { Jumbotron} from 'reactstrap';

const style = {
    marginTop: "25px",
    textAlign: "center"
}

function Header(props) {
    let {piAddress, currentOS} = props.piInfo;
    return (
        <Jumbotron style={style}> 
            <h2>Pi Address: {piAddress}</h2>
            <h3>Current OS: {currentOS}</h3>
        </Jumbotron>
    )
};

export default Header;