import {Avatar, Container, Typography} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import {makeStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import React, {useReducer} from "react";
import {withFirebase} from "../Firebase";

const INITIAL_STATE = {
    passwordOne: '',
    passwordTwo: '',
    error: null,
};
const pwchangeReducer = (state, action) => {
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
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));
const PasswordChangeForm = () => {
    const [pwchange, dispatchPwchange] = useReducer(pwchangeReducer, INITIAL_STATE);
    const classes = useStyles();
    const onSubmit = event => {
        const [passwordOne] = this.state;
        this.props.firebase
            .doPasswordUpdate(passwordOne)
            .then(() => {
                dispatchPwchange({type: 'RESET_STATE'})
            })
            .catch(error => {
                dispatchPwchange({type: 'SET_ERROR', payload: error})
            });
        event.preventDefault();
    };
    const onChange = event => {
        dispatchPwchange({
            type: 'SET_FIELD', payload: {
                name: event.target.name,
                value: event.target.value,
            }
        })
    };
    const {passwordOne, passwordTwo, error} = pwchange;
    const isInvalid = passwordOne !== passwordTwo || passwordOne === '';
    return (
        <Container component={"main"} maxWidth={"xs"}>
            <CssBaseline/>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Update Password
                </Typography>
                <form className={classes.form} onSubmit={onSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id={'passwordOne'}
                                name={"passwordOne"}
                                type="password"
                                variant={"outlined"}
                                value={passwordOne}
                                onChange={onChange}
                                label={"Password"}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                variant={"outlined"}
                                id={passwordTwo}
                                name={"passwordTwo"}
                                type="password"
                                value={passwordTwo}
                                onChange={onChange}
                                label={"Confirm Password"}
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
                            Update Password
                        </Button>
                        {error && <Typography color={"error"} variant={"body2"}>
                            {error.message}
                        </Typography>}
                    </Grid>
                    {error && <p>{error.message}</p>}
                </form>
            </div>
        </Container>
    );

};


export default withFirebase(PasswordChangeForm);