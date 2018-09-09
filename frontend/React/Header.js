import React, { Component } from 'react'
import { Jumbotron} from 'reactstrap';

import Loader from 'react-loader'

const style = {
    marginTop: "25px",
    textAlign: "center"
}

function Header(props) {
    let {piAddress, currentOS} = props.piInfo;
    return (
        <Jumbotron style={style}>
            {props.loaded ? 
                piAddress == null ?
                    <h2>Could not find Raspberry Pi...Please reload to try again</h2> :
                    (<div>
                        <h2>Pi Address: {piAddress}</h2>
                        <h3>currentOS: {currentOS}</h3>
                    </div>) :
                (<div>
                    <h2>{props.loadingMessage}</h2>
                    <Loader loaded={props.loaded} />
                </div>)
            } 
        </Jumbotron>
    )
};

export default Header;