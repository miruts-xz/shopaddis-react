import React from "react";
import PasswordChangeForm from "../PasswordChange";
import PasswordForgotPage from "../PasswordForgot";
import {withAuthorization} from '../Session'
import AuthUserContext from "../Session/context";
const AccountPage = () => {
    return (
        <AuthUserContext.Consumer>
            {authUser => (
                <div>
                    <h1>Account: {authUser.email}</h1>
                    <PasswordForgotPage/>
                    <PasswordChangeForm/>
                </div>
            )}
        </AuthUserContext.Consumer>
    );
};
const condition = authUser => !!authUser;
export default withAuthorization(condition)(AccountPage);