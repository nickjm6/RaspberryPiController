import React from 'react'
import { Jumbotron, Spinner } from 'reactstrap';

const style = {
    marginTop: "25px",
    textAlign: "center"
}

function Header(props) {
    let { currentOS } = props.piInfo;
    let formattedOS = currentOS ? currentOS.substring(0, 1).toUpperCase() + currentOS.slice(1) : null
    return (
        <Jumbotron style={style}>
            {props.loaded ?
                <h3>Current OS: {formattedOS}</h3> :
                <div>
                    {props.loaded ? null : <Spinner color="primary" />}
                </div>
            }
        </Jumbotron>
    )
};

export default Header;