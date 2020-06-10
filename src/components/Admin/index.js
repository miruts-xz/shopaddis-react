import React from "react";
import * as ROLES from '../../constants/roles'
import {withFirebase} from "../Firebase";
import {CircularProgress} from "@material-ui/core";
import NewProduct from "../NewProduct"
class AdminPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            users: [],
        }
    }

    componentDidMount() {
        this.setState({loading: true});
        this.props.firebase.users().on('value', snapshot => {
            const usersObject = snapshot.val();

            const usersList = Object.keys(usersObject).map(key => ({
                ...usersObject[key],
                uid: key
            }));
            this.setState({
                users: usersList,
                loading: false,
            });
        });
    }

    componentWillUnmount() {
        this.props.firebase.users().off();
    }

    render() {
        const {users, loading} = this.state;
        return (
            <div>
                <h1>Admin</h1>
                {loading &&
                <div>
                    <CircularProgress />
                </div>}
                <NewProduct/>
            </div>
        );
    }
}

const UsersList = ({users}) => {
    return (
        <ul>
            {users.map(user => (
                <li key={user.uid}>
                  <span>
                      <strong>ID: </strong> {user.uid}
                  </span>
                    <span>
                      <strong>First name: </strong> {user.fname}
                  </span>
                    <span>
                      <strong>Last name: </strong> {user.lname}
                  </span>
                    <span>
                      <strong>Email: </strong> {user.email}
                  </span>
                </li>
            ))}
        </ul>
    );
};

const condition = authUser =>
    authUser && authUser.role.includes(ROLES.ADMIN);

export default withFirebase(AdminPage);