import React from "react";
import {withAuthorization} from '../Session'
import ShoppingList from "../ShoppingList";

const HomePage = () => {
    return (<div>
            <ShoppingList/>
        </div>
    );
};
const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);