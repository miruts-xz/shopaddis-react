import React from "react";
import {withFirebase} from "../Firebase";
import {Link, withRouter} from 'react-router-dom';
import {compose} from "recompose";
import {SignUpLink} from "../SignUp";
import {
    Avatar,
    Box,
    Button,
    Checkbox,
    Container,
    CssBaseline,
    FormControlLabel,
    Grid,
    Link as MuiLink,
    TextField,
    Typography
} from '@material-ui/core'
import * as ROUTES from '../../constants/routes'
import {makeStyles} from "@material-ui/core/styles";
import {PasswordForgotLink} from "../PasswordForgot";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined"
import Copyright from "../Copyright";

const SignInPage = () => {
    return (
        <div>
            <SignInForm/>
        </div>
    );
};
const INITIAL_STATE = {
    email: '',
    password: '',
    error: null,
};
const signinStateReducer = (state, action) => {
    switch (action.type) {
        case 'SET_FIELD':
            return {
                ...state,
                [action.payload.name]: action.payload.value,
            };
        case 'RESET_STATE':
            return {
                ...INITIAL_STATE,
            };
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload
            };
        default:
            return state;
    }
};


const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    }
}));
const SignInFormBase = ({firebase, history}) => {
    const classes = useStyles();

    const [signinState, dispatchSigninState] = React.useReducer(signinStateReducer, INITIAL_STATE);
    const onSubmit = event => {
        const {email, password} = signinState;
        firebase.doSignInWithEmailAndPassword(email, password)
            .then(() => {
                dispatchSigninState({type: 'RESET_STATE'});
                history.push(ROUTES.HOME)
            })
            .catch(error => {
                dispatchSigninState({type: 'SET_ERROR', payload: error})
            });
        event.preventDefault();
    };
    const onChange = event => {
        dispatchSigninState({
            type: "SET_FIELD", payload: {
                name: event.target.name,
                value: event.target.value,
            }
        })
    };
    const isInvalid = signinState.email === '' || signinState.password === '';
    return (
        <Container component={'main'} maxWidth={"xs"}>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component={'h1'} variant={'h5'}>
                    Sign In
                </Typography>
                <form className={classes.form} onSubmit={onSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        onChange={onChange}
                        label="Email Address"
                        name="email"
                        value={signinState.email}
                        autoComplete="off"
                        autoFocus
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        onChange={onChange}
                        name="password"
                        label="Password"
                        type="password"
                        value={signinState.password}
                        id="password"
                        autoComplete="off"
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary"/>}
                        label="Remember me"
                    />
                    <Button
                        disabled={isInvalid}
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign In
                    </Button>
                    {signinState.error && <Typography color={"error"} variant={"body2"}>
                        {signinState.error.message}
                    </Typography>}

                    <Grid container>
                        <PasswordForgotLink/>
                        <SignUpLink/>
                    </Grid>
                </form>
            </div>
            <Box mt={8}>
                <Copyright/>
            </Box>
        </Container>
    );
};
const SignInLink = () => {
    return (
        <Link to={ROUTES.SIGN_IN}>
            <MuiLink href="#" variant="body2">
                Already have an account? Sign in
            </MuiLink>
        </Link>
    );
};
const SignInForm = compose(
    withFirebase,
    withRouter,
)(SignInFormBase);

export default SignInPage;
export {SignInForm, SignInLink}
