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
            {piAddress == null ? null :
              <div>
                <h2>Pi Address: {piAddress}</h2>
                <h3>Current OS: {currentOS}</h3>
              </div>
            }
        </Jumbotron>
    )
};

export default Header;