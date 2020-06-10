import {
    Avatar,
    Box,
    Button,
    Checkbox,
    Container,
    CssBaseline,
    FormControlLabel,
    Grid,
    TextField,
    Typography
} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import React, {useReducer} from "react";
import {withRouter} from "react-router";
import Product from "../../models/models";
import Copyright from "../Copyright";
import {withFirebase} from "../Firebase";
import {SignInLink} from "../SignIn";

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
const INITIAL_STATE = {
    pname: '',
    description: '',
    image: '',
    price: 0.0,
    quantity: 0,
    error: null
};
const productReducer = (state, action) => {
    switch (action.type) {
        case 'RESET_STATE':
            return INITIAL_STATE;
        case 'SET_FIELD':
            return {
                ...state,
                [action.payload.name]: action.payload.value
            };
        default:
            return state;
    }
};
const NewProduct = ({firebase, history}) => {
    const classes = useStyles();

    const [productState, dispatchProductState] = useReducer(productReducer, INITIAL_STATE);
    const {pname, description, image, price, quantity, error} = productState;
    const onSubmit = async (event) => {
        event.preventDefault();
        const imageUpload = firebase.doImageUpload(image);
        const imageUrl = "";
        imageUpload.on("state_changed", // or 'state_changed'
            function (snapshot) {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused': // or 'paused'
                        console.log('Upload is paused');
                        break;
                    case "running": // or 'running'
                        console.log('Upload is running');
                        break;
                    default:
                        break;
                }
            }, function (error) {

                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                    case 'storage/unauthorized':
                        console.log("storage/unauthorized");
                        // User doesn't have permission to access the object
                        break;

                    case 'storage/canceled':
                        console.log('storage/canceled');
                        // User canceled the upload
                        break;

                    case 'storage/unknown':
                        console.log('storage/unknown');
                        // Unknown error occurred, inspect error.serverResponse
                        break;
                    default:
                        break;
                }
            }, function () {
                // Upload completed successfully, now we can get the download URL
                imageUpload.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    const product = new Product(pname, description, downloadURL, parseFloat(price), parseInt(quantity, 10));
                    firebase.doAddProduct(product)
                        .then((docRef) =>{
                                history.push('/home')
                            }
                        )
                        .catch(error => dispatchProductState({type: 'SET_ERROR', payload: error}))
                })
                });
            };


    const onChange = (event) => {
        if(event.target.name==='image'){
            dispatchProductState({
                type: 'SET_FIELD', payload: {
                    name: event.target.name,
                    value: event.target.files[0]
                }
            })
        }else {
            dispatchProductState({
                type: 'SET_FIELD', payload: {
                    name: event.target.name,
                    value: event.target.value,
                }
            })
        }

    };
    const isInvalid = pname === '' || price === 0.0.toString() || image === '' || quantity === "0" || description === '';
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Add Product
                </Typography>
                <form className={classes.form} onSubmit={onSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="pname"
                                name="pname"
                                variant="outlined"
                                required
                                value={pname}
                                fullWidth
                                onChange={onChange}
                                id="pname"
                                label="Product Name"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                onChange={onChange}
                                value={price}
                                fullWidth
                                id="price"
                                type={"number"}
                                label="Product price"
                                name="price"
                                autoComplete="price"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                value={description}
                                onChange={onChange}
                                fullWidth
                                id="description"
                                label="Description"
                                name="description"
                                autoComplete="description"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                onChange={onChange}
                                value={quantity}
                                fullWidth
                                name="quantity"
                                label="Product quantity"
                                type={"number"}
                                id="quantity"
                                autoComplete="quantity"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                color={"secondary"}
                                variant="contained"
                                component="label"
                            >
                                Upload Image
                                <input
                                    onChange={onChange}
                                    name={"image"}
                                    id={"image"}
                                    required
                                    type="file"
                                    style={{display: "none"}}
                                />
                            </Button>
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
                            Add
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
export default withFirebase(withRouter(NewProduct));