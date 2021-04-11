import React, {useContext, useEffect, useState} from "react";
import {Link as RouterLink} from 'react-router-dom';
import {Parse, Poll, userContext} from "./data";
import {Button, Card, CardActions, CardContent, Grid, Tooltip, Typography} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import {Delete, Link} from "@material-ui/icons";


import {alertContext} from "./utils";

function PollCard(props){

    const setWip = useContext(alertContext)

    return(
        <Card>
            <CardContent>
                <Typography variant="h5">
                    {props.title}
                </Typography>
            </CardContent>
            <CardActions>
                <Tooltip title="View poll results" placement="bottom">
                    <Button component={RouterLink} to={'/view/' + props.pollId}>
                        View
                    </Button>
                </Tooltip>

                <Tooltip title="Copy link to clipboard" placement="bottom" >
                    <IconButton onClick={() =>
                        navigator.clipboard.writeText("https://cuando.mone27.net/vote/" + props.pollId)}>
                        <Link />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Delete Poll" placement="bottom">
                    <IconButton edge="end" onClick={() => setWip(true)}>
                        <Delete/>
                    </IconButton>
                </Tooltip>
            </CardActions>
        </Card>
    )
}

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}


function Home(props){
    const {user, setUser} = useContext(userContext);
    let [polls, setPolls] = useState([])

    useEffect(() => {
        if (!user) return; // stop running if the user is not available yet
        try{
            const pollsList = []
            const pollQuery = new Parse.Query(Poll)
                .equalTo("owner", user)
                .ascending("updatedAt");
            pollQuery.find().then( (res) =>{
                for (let i = 0; i < res.length; i++){
                    const poll = res[i];
                    pollsList.push({id: poll.id, title: poll.get("title")})
                }
                setPolls(pollsList);
            })
        }
        catch (err) {console.error(err)}
    }, [user])
    return(
        <Grid container spacing={2}>
            {polls.map(poll =>
                <Grid key={poll.id} item>
                    <PollCard title={poll.title} pollId={poll.id}/>
                </Grid>)}
        </Grid>)
}


export default Home;