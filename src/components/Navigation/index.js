import {fade, Menu} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Badge from "@material-ui/core/Badge";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import MenuItem from "@material-ui/core/MenuItem";
import Toolbar from "@material-ui/core/Toolbar";
import {Link} from "react-router-dom"
import Typography from "@material-ui/core/Typography";
import {AccountCircle} from "@material-ui/icons";
import MailIcon from "@material-ui/icons/Mail"
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart"
import MenuIcon from "@material-ui/icons/Menu"
import MoreIcon from "@material-ui/icons/More"
import NotificationsIcon from "@material-ui/icons/Notifications"
import SearchIcon from "@material-ui/icons/Search"
import {makeStyles} from "@material-ui/styles";
import clsx from "clsx";
import React, {useState} from "react";
import {withRouter} from "react-router";
import * as ROUTES from '../../constants/routes'
import {withFirebase} from "../Firebase";
import {AuthUserContext} from "../Session"
import './styles.css'

const Navigation = ({firebase, history}) => (
    <div>
        <AuthUserContext.Consumer>
            {authUser => authUser ? <NavigationAuth history={history} firebase={firebase} authUser={authUser}/> : <NavigationNonAuth history={history} />}
        </AuthUserContext.Consumer>
    </div>
);
const useStyles = makeStyles(theme => ({
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        }
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25)
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: "100%",
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: "100%",
        position: 'absolute',
        pointerEffects: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    customBadge: {
        backgroundColor: 'orange',
        color: 'white',
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    }
}));
const NavigationAuth = ({authUser, firebase, history}) => {
    const classes = useStyles();
    const [anchorEl, setAnchorE1] = useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const handleProfileMenuOpen = event => {
        setAnchorE1(event.currentTarget);
    };
    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };
    const handleMenuClose = () => {
        setAnchorE1(null);
        handleMobileMenuClose();
    };
    const handleMobileMenuOpen = event => {
        setMobileMoreAnchorEl(event.currentTarget);
    };
    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu anchorEl={anchorEl}
              anchorOrigin={{vertical: "top", horizontal: "right"}}
              id={menuId}
              keepMounted
              transformOrigin={{vertical: "top", horizontal: "right"}}
              open={isMenuOpen}
              onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>My account</MenuItem>
            <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
        </Menu>
    );
    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{vertical: "top", horizontal: "right"}}
            id={mobileMenuId}
            transformOrigin={{vertical: "top", horizontal: "right"}}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <IconButton aria-label="show 4 new mails" color="inherit">
                    <Badge badgeContent={4} color="secondary">
                        <MailIcon/>
                    </Badge>
                </IconButton>
                <p>Messages</p>
            </MenuItem>
            <MenuItem>
                <IconButton aria-label="show 11 new notifications" color="inherit">
                    <Badge badgeContent={11} color="white">
                        <NotificationsIcon/>
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle/>
                </IconButton>
                <p>Profile</p>
            </MenuItem>
        </Menu>
    );
    return (
        <div className={classes.grow}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="open drawer">
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        SHOPADDIS
                    </Typography>
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon/>
                        </div>
                        <InputBase inputProps={{'aria-label': 'search'}} placeholder={"Search..."}
                                   classes={{
                                       root: classes.inputRoot,
                                       input: classes.inputInput,
                                   }}/>
                    </div>
                    <div className={classes.grow}/>
                    <div className={classes.sectionDesktop}>
                        <Button onClick={() => {history.push('/home')}} color={"inherit"}>Products</Button>
                        <Button onClick={() => {history.push('/admin')}} color={"inherit"}>Admin</Button>
                        <Button onClick={() => {history.push('/about')}} color={"inherit"}>About</Button>
                        <Button onClick={() => {history.push('/contact')}} color={"inherit"}>Contact</Button>
                        <IconButton aria-label="show 17 new notifications" color="inherit">
                            <Badge badgeContent={17} classes={{badge: classes.customBadge}}>
                                <ShoppingCartIcon/>
                            </Badge>
                        </IconButton>
                        <IconButton
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <AccountCircle/>
                        </IconButton>
                    </div>
                    <div className={classes.sectionMobile}>
                        <IconButton
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon/>
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
        </div>
    );
};
const NavigationNonAuth = ({history}) => {
    return (
        <nav>
            <ul>
                <li>
                    <Link to={ROUTES.LANDING}>Landing</Link>
                </li>
                <li>
                    <Link to={ROUTES.SIGN_IN}>Sign In</Link>
                </li>
            </ul>
        </nav>
    );
};
export default withFirebase(withRouter((Navigation)));