import React, {useState} from "react";
import {useHistory, useParams} from 'react-router-dom'
import {Button, makeStyles, TextField, Typography} from "@material-ui/core";
import {Link as RouterLink} from "react-router-dom"
import {Parse} from "./parse_data"

const useFormStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: 200,
        },
    },
}));

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export function Login(props){
    const [emailError, setEmailError] = useState(false)
    const [passwdError, setPasswdError] = useState(false)
    const [email, setEmail] = useState("")
    const [passwd, setPasswd] = useState("")

    const history = useHistory();

    function handleEmailChange(value){
        setEmail(value.target.value)
        setEmailError(!validateEmail(value.target.value))
    }
    function handlePasswdChange(value){
        setPasswd(value.target.value)
    }


    async function handleLogin(value) {
        const user = await Parse.User.logIn(email, passwd);
        console.log(user)
        history.push("/")
    }

    const classes = useFormStyles();

    return(
        <div>
            <Typography variant="h6">
                Login to Cuando
            </Typography>
            <form className={classes.root} noValidate autoComplete="off">
                <div>
                    <TextField
                        required
                        id="email"
                        error={emailError}
                        label="Email"
                        variant="outlined"
                        onChange={handleEmailChange}
                        value={email}
                    />
                </div>
                <div>
                    <TextField
                        required
                        id="password"
                        error={passwdError}
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        variant="outlined"
                        onChange={handlePasswdChange}
                        value={passwd}
                    />
                </div>
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleLogin}
                    >
                        Login
                    </Button>
                </div>

            </form>
            <Typography component={RouterLink} to="/register/">
                or Register
            </Typography>
        </div>
    )
}

export function Register(props){
    const [emailError, setEmailError] = useState(false)
    const [passwdError, setPasswdError] = useState(false)
    const [email, setEmail] = useState("")
    const [passwd, setPasswd] = useState("")
    const [name, setName] = useState("")

    const history = useHistory();
    const classes = useFormStyles();

    function handleRegister(value){
        console.log("Ciaooo")
        const user = new Parse.User();
        user.set("username", email);
        user.set("password", passwd);
        user.set("email", email);
        user.set("name", name);
        user.signUp()
            .then(
                history.push("/"))
            .catch( (error) =>
                alert("Error: " + error.code + " " + error.message)
            )
    }

    function handleEmailChange(value){
        setEmail(value.target.value)
        setEmailError(!validateEmail(value.target.value))
    }
    function handlePasswdChange(value){
        setPasswd(value.target.value)
    }
    function handleNameChange(value){
        setName(value.target.value)
    }

    return(
        <div>
            <Typography variant="h6">
                Register to Cuando
            </Typography>
            <form className={classes.root} noValidate autoComplete="off">
                <div>
                    <TextField
                        required
                        label="Name"
                        variant="outlined"
                        onChange={handleNameChange}
                        value={name}
                    />
                </div>
                <div>
                    <TextField
                        required
                        id="email"
                        error={emailError}
                        label="Email"
                        variant="outlined"
                        onChange={handleEmailChange}
                        value={email}
                    />
                </div>
                <div>
                    <TextField
                        required
                        id="password"
                        error={passwdError}
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        variant="outlined"
                        onChange={handlePasswdChange}
                        value={passwd}
                    />
                </div>
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleRegister}
                    >
                        Register
                    </Button>
                </div>

            </form>
            <Typography component={RouterLink} to="/login/">
                or Login
            </Typography>
        </div>
    )

}
