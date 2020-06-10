import {Card, CardActions, CardContent, CircularProgress, Grid, Typography} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import Container from "@material-ui/core/Container";
import {makeStyles} from "@material-ui/styles";
import React, {useEffect, useReducer} from "react";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import shoe from '../../images/shoe.jpeg';
import {productConverter} from "../../models/models";

import {withFirebase} from "../Firebase";

const sample_products = [
    {
        id: 1,
        name: 'purse',
        price: '45'
    }, {
        id: 2,
        name: 'jacket',
        price: '425'
    }, {
        id: 3,
        name: 'sweater',
        price: '155'
    }, {
        id: 4,
        name: 'trouser',
        price: '55'
    }, {
        id: 5,
        name: 'hat',
        price: '5'
    }, {
        id: 6,
        name: 'watch',
        price: '450'
    },
];
const fetchProductsMock = () => {
    return new Promise(resolve => setTimeout(() => resolve({data: {products: sample_products}}), 2000))
};

const productsReducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_ITEMS_INIT':
            return {
                ...state,
                isLoading: true
            };
        case 'FETCH_ITEMS_SUCCESS':
            return {
                ...state,
                isLoading: false,
                products: action.payload,
            };
        case 'FETCH_ITEMS_FAILURE':
            return {
                ...state,
                error: action.payload
            };
        default:
            return state;
    }
};
const selectedProductsReducer = (state, action) => {
    switch (action.type) {
        case 'ADD':
            return {
                ...state,
                products: state.products.concat({product: action.payload.product, quantity: action.payload.quantity}),
            };
        case 'REMOVE':
            return {
                ...state,
                products: state.products.filter(product => product.id !== action.payload.id)
            };
        default:
            return state;
    }
};
const INITIAL_SELECTED_STATE = {
    products: [],
    error: null
};
const INITIAL_PRODUCT_STATE = {
    isLoading: false,
    error: null,
    products: [],
};
const useStyles = makeStyles(({
    root: {
        maxWidth: 345,
        minWidth: 345,
        minHeight: 300,
        maxheight: 300
    },
    media: {
        height: 140,
    }

}));
const ShoppingList = ({firebase}) => {

    const classes = useStyles();
    const [selectedProductsState, dispatchSelectedProductsState] = useReducer(selectedProductsReducer, INITIAL_SELECTED_STATE);
    const [productsState, dispatchProductsState] = useReducer(productsReducer, INITIAL_PRODUCT_STATE);

    const handleProductClick = product => {
        if (selectedProductsState.products.includes(product)) {
            dispatchSelectedProductsState({
                type: 'REMOVE',
                payload: product
            })
        } else {
            dispatchSelectedProductsState({
                type: 'ADD',
                payload: {product: product, quantity: 1},
            })
        }
    };
    useEffect(() => {
        dispatchProductsState({type: 'FETCH_ITEMS_INIT'});
        const unsubscribe = firebase.products().withConverter(productConverter).onSnapshot(querySnapshot => {
            const products = [];
            querySnapshot.forEach(doc => {
                products.push(doc.data());
            });
            console.log(products);
            dispatchProductsState({type: 'FETCH_ITEMS_SUCCESS', payload: products})
        });
        return () => {unsubscribe();}
    }, []);


    return (
        <Container>
            <h2>Products</h2>
            <Container>
                <Grid container justify={"center"}>
                    {productsState.isLoading && <CircularProgress/>}
                </Grid>
            </Container>
            <Grid container spacing={2}>
                {productsState.products.map(product => {
                    console.log(product.name, product.price);
                    return (
                        <Grid key={product.pid} item>
                            <Card className={classes.root}>
                                <CardActionArea>
                                    <CardMedia className={classes.media}
                                               component={"img"}
                                               image={product.image}
                                               title={product.name}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant={"h5"} component={"h2"}>
                                            {product.name.toUpperCase()}
                                        </Typography>
                                        <Typography variant={"body2"} color={"textSecondary"} component={"p"}>
                                            {product.description}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                                <CardActions>
                                    <Button size={"small"} color={"primary"}>
                                        <AddShoppingCartIcon color={"primary"}/>
                                    </Button>
                                    <Button size={"small"} color={"primary"}>
                                        More
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </Container>

    );
};
const ShoppingItem = ({item, onClick}) => {
    return (
        <li onClick={() => onClick(item)}>
            <span><strong>Name: </strong> {item.name}</span>
            <span><strong>Price: </strong> {item.price}</span>
        </li>
    );
};
export default withFirebase(ShoppingList)