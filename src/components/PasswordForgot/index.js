import {Button, Container, Grid, Link as MuiLink, Typography} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import {makeStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import React, {useReducer, useState} from "react";
import {Link} from "react-router-dom";
import * as ROUTES from '../../constants/routes'
import {withFirebase} from "../Firebase";

const INITIAL_STATE = {
    email: '',
    error: null,
};

const PasswordForgotPage = () => {
    return (
        <div>
            <PasswordForgotForm/>
        </div>
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
const forgotReducer = (state, action) => {
    switch (action.type) {
        case 'RESET_STATE':
            return INITIAL_STATE;
        case 'SET_FIELD':
            return {
                ...state,
                [action.payload.name]: action.payload.value
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
const PasswordForgotFormBase = () => {
    const [forgot, dispatchForgot] = useReducer(forgotReducer, INITIAL_STATE);
    const [further, setFurther] = useState(false);
    const classes = useStyles();
    const onSubmit = event => {
        const {email} = forgot;
        this.props.firebase.doPasswordReset(email)
            .then(() => {
                dispatchForgot({type: 'RESET_STATE'});
                setFurther(true)
            })
            .catch(error => {
                this.setState({error});
                setFurther(false)
            });
        event.preventDefault();
    };
    const onChange = event => {
        dispatchForgot({
            type: 'SET_FIELD', payload: {
                name: event.target.name,
                value: event.target.value
            }
        })
    };
    const {email, error} = forgot;
    const isInvalid = email === '';
    return (
        <Container component={"main"} maxWidth={"xs"}>
            <CssBaseline/>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Reset Password
                </Typography>
                <form className={classes.form} onSubmit={onSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                variant={"outlined"}
                                type="email"
                                required
                                fullWidth
                                id={'email'}
                                name={"email"}
                                value={email}
                                onChange={onChange}
                                label={"Email address"}
                            />
                        </Grid>
                        {further ?
                            <Typography color={"info"} variant={"body2"}>
                                Check your email to complete steps
                            </Typography>
                            :
                            <Button
                                disabled={isInvalid}
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                Reset Password
                            </Button>
                        }
                        {error && <Typography color={"error"} variant={"body2"}>
                            {error.message}
                        </Typography>}
                    </Grid>
                </form>
            </div>
        </Container>
    );
};

const PasswordForgotForm = withFirebase(PasswordForgotFormBase);

const PasswordForgotLink = () => (
    <Grid item xs>
        <Link to={ROUTES.PASSWORD_FORGOT}>
            <MuiLink variant="body2">
                Forgot password?
            </MuiLink>
        </Link>
    </Grid>
);

export default PasswordForgotPage;

export {PasswordForgotLink, PasswordForgotForm}