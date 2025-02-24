import React, { useState } from "react";
import classes from "./AuthContainer.module.css";
import FindPasswordInput from "./FindPasswordInput";
import VerifyCodeInput from "./VerifyCodeInput";

const FindPasswordContainer = (props) => {

    const [type,setType] = new useState(1);
    const [authMailToken, setAuthMailToken] = new useState('');

    const verifyTypeHandler = (type, authMailToken) => {
        setAuthMailToken(authMailToken);
        setType(type);
    };

    return (
        <React.Fragment>
            <div className={classes.auth_wrapper}>
                {type === 1 && <VerifyCodeInput verifyTypeHandler={verifyTypeHandler}/>}
                {type === 2 && <FindPasswordInput typeChangeHandler={props.typeChangeHandler} authMailToken={authMailToken}/>}
            </div>
        </React.Fragment>
    )

};

export default FindPasswordContainer;