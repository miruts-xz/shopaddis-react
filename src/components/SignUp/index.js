import React, {useReducer} from "react";
import {Link, withRouter} from "react-router-dom";
import * as ROUTES from '../../constants/routes'
import {withFirebase} from '../Firebase'
import {compose} from 'recompose'
import {SignInLink} from '../SignIn'
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
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Copyright from "../Copyright";

const SignUpPage = () => {
    return (
        <div>
            <SignUpForm/>
        </div>
    );
};
const INITIAL_STATE = {
    email: '',
    passwordOne: '',
    passwordTwo: '',
    lname: '',
    fname: '',
    error: null,
};
const signupStateReducer = (state, action) => {
    switch (action.type) {
        case 'SET_FIELD':
            return {
                ...state,
                [action.payload.name]: action.payload.value,
            };
        case 'RESET_STATE':
            return INITIAL_STATE;
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload
            };
        default:
    }
};
const SignUpFormFuncBase = ({firebase, history}) => {
    const [signupState, dispatchSignupState] = useReducer(signupStateReducer, INITIAL_STATE);
    const onSubmit = event => {

        const {fname, lname, email, passwordOne} = signupState;
        firebase
            .doCreateUserWithEmailAndPassword(email, passwordOne)
            .then(authUser => {
                return firebase
                    .user(authUser.user.uid)
                    .set({
                        fname,
                        lname,
                        email
                    })
            })
            .then(() => {
                dispatchSignupState({type: 'RESET_STATE'});
                history.push(ROUTES.HOME)
            })
            .catch(error => {
                dispatchSignupState({type: 'SET_ERROR', payload: error});
            });
        event.preventDefault();
    };
    const onChange = event => {
        dispatchSignupState({
            type: 'SET_FIELD', payload: {
                name: event.target.name,
                value: event.target.value,
            }
        })
    };
    const {
        username,
        email,
        passwordOne,
        passwordTwo,
        error,
        lname,
        fname
    } = signupState;

    const isInvalid = passwordTwo !== passwordOne || email === '' || username === '' || passwordOne === '';
    const classes = useStyles();
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <form className={classes.form} onSubmit={onSubmit} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="fname"
                                name="fname"
                                variant="outlined"
                                required
                                value={fname}
                                fullWidth
                                onChange={onChange}
                                id="fname"
                                label="First Name"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                onChange={onChange}
                                value={lname}
                                fullWidth
                                id="lname"
                                label="Last Name"
                                name="lname"
                                autoComplete="lname"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                value={email}
                                onChange={onChange}
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                onChange={onChange}
                                value={passwordOne}
                                fullWidth
                                name="passwordOne"
                                label="Password"
                                type="password"
                                id="passwordOne"
                                autoComplete="off"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                onChange={onChange}
                                value={passwordTwo}
                                name="passwordTwo"
                                label="Confirm Password"
                                type="password"
                                id="passwordTwo"
                                autoComplete="off"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Checkbox value="allowExtraEmails" color="primary"/>}
                                label="I want to receive inspiration, marketing promotions and updates via email."
                            />
                        </Grid>
                        <Button
                            disabled={isInvalid}
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Sign Up
                        </Button>
                        {error && <Typography color={"error"} variant={"body2"}>
                            {error.message}
                        </Typography>}
                        <Grid container justify="flex-end">
                            <Grid item>
                                <SignInLink/>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={5}>
                <Copyright/>
            </Box>
        </Container>
    );
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
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const SignUpForm = compose(
    withRouter,
    withFirebase,
)(SignUpFormFuncBase);

const SignUpLink = () => (
    <Grid item>
        <Link to={ROUTES.SIGN_UP}>
            <MuiLink href="#" variant="body2">
                {"Don't have an account? Sign Up"}
            </MuiLink>
        </Link>
    </Grid>
);
export default SignUpPage;
export {SignUpForm, SignUpLink};