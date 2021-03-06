import {createContext, useContext, useEffect, useState} from 'react'
import React from 'react'
import {BrowserRouter, Route, Switch, Link as RouterLink, } from "react-router-dom";

import 'react-big-calendar/lib/css/react-big-calendar.css'

import {fade, makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import {Login, Register} from "./account";
import CreatePoll from "./createPoll";
import VotePoll from "./votePoll";
import ViewPoll from "./viewPoll";
import Home from "./home"
import {createMuiTheme, MuiThemeProvider, Snackbar} from "@material-ui/core";
import {orange} from "@material-ui/core/colors";
import {Add, Refresh} from "@material-ui/icons";

import {Parse, userContext} from "./data"
import {getUser, ShowUserName, WipAlert, alertContext} from "./utils";



const theme = createMuiTheme({
    palette: {
        primary: orange,
    }
})

const useStyles = makeStyles((theme) => ({
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
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
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
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
}));

const LinkBehavior = React.forwardRef((props, ref) => (
    <RouterLink ref={ref} {...props}/>
));

function PrimarySearchAppBar() {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const isMenuOpen = Boolean(anchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const logout = () =>{
        Parse.User.logOut()
        handleMenuClose()
    }

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            id={menuId}
            keepMounted
            transformOrigin={{vertical: 'top', horizontal: 'right'}}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose} component={RouterLink} to="/login">Login</MenuItem>
            <MenuItem onClick={handleMenuClose} component={RouterLink} to="/register">Register</MenuItem>
            <MenuItem onClick={logout} >Logout</MenuItem>
        </Menu>
    );

    return (
        <div className={classes.grow}>
            <AppBar position="static">
                <Toolbar>
                    <Typography className={classes.title}
                                variant="h6"
                                noWrap
                                component={LinkBehavior}
                                to="/"
                    >
                        Cuando
                    </Typography>
                    {/*<div className={classes.search}>*/}
                    {/*    <div className={classes.searchIcon}>*/}
                    {/*        <SearchIcon/>*/}
                    {/*    </div>*/}
                    {/*    <InputBase*/}
                    {/*        placeholder="Search???"*/}
                    {/*        classes={{*/}
                    {/*            root: classes.inputRoot,*/}
                    {/*            input: classes.inputInput,*/}
                    {/*        }}*/}
                    {/*        inputProps={{'aria-label': 'search'}}*/}
                    {/*    />*/}
                    {/*</div>*/}
                    <div className={classes.grow}/>

                    <div>
                        <IconButton
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            component={RouterLink}
                            color="inherit"
                            to="/create"
                        >
                            <Add/>
                        </IconButton>
                    </div>
                    <div>
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
                </Toolbar>
            </AppBar>
            {renderMenu}
        </div>
    );
}



function App() {
    const [wip, setWip] = useState(false);
    const [user, setUser] = useState()
    useEffect(() => {
        async function updateUser() {
            const user = await getUser()
            setUser(user)
        }
        updateUser();
    }, [])

    return(
        <BrowserRouter>
            <MuiThemeProvider theme={theme}>
                <userContext.Provider value={{user, setUser}} >
                    <alertContext.Provider value={setWip} >
                        <PrimarySearchAppBar/>
                        <div className="main-content">
                            <Switch>
                                <Route path="/create" component={CreatePoll}/>
                                <Route path="/vote/:pollId" component={VotePoll}/>
                                <Route path="/view/:pollId" component={ViewPoll}/>
                                <Route path="/login/:redirect?" component={Login}/>
                                <Route path="/register" component={Register}/>
                                <Route path="/" component={Home}/>
                                <Route render={() => <h1>404: page not found</h1>}/>
                            </Switch>
                        </div>
                        <ShowUserName />
                        <WipAlert open={wip} setOpen={setWip} />
                    </alertContext.Provider>


                </userContext.Provider>
            </MuiThemeProvider>
        </BrowserRouter>
    )
}

export default App
