import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import React from "react";
import Navigation from '../Navigation';

import {BrowserRouter as Router, Route} from 'react-router-dom'
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgotPage from '../PasswordForgot';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import * as ROUTES from '../../constants/routes';
import {withAuthentication} from "../Session";
import Divider from "@material-ui/core/Divider";
import "./styles.css"
const App = () => (
    <Router>
            <CssBaseline/>
            <Navigation/>
                <Container>
                    <Route exact path={ROUTES.LANDING} component={LandingPage}/>
                    <Route path={ROUTES.SIGN_UP} component={SignUpPage}/>
                    <Route path={ROUTES.SIGN_IN} component={SignInPage}/>
                    <Route path={ROUTES.PASSWORD_FORGOT} component={PasswordForgotPage}/>
                    <Route path={ROUTES.HOME} component={HomePage}/>
                    <Route path={ROUTES.ACCOUNT} component={AccountPage}/>
                    <Route path={ROUTES.ADMIN} component={AdminPage}/>
                </Container>
    </Router>
);


export default withAuthentication(App);