import React, {createContext, useContext, useEffect, useState} from "react";
import { Link as RouterLink } from 'react-router-dom';
import {Parse, Poll} from "./parse_data";
import {Button, Card, CardActions, CardContent, Grid, Snackbar, Typography} from "@material-ui/core";
import * as PropTypes from "prop-types";
import IconButton from "@material-ui/core/IconButton";
import {Delete, Edit} from "@material-ui/icons";


import {WipAlert} from "./utils";

function PollCard(props){

    const [wip, setWip] = useState(false)

    return(
        <Card>
            <CardContent>
                <Typography variant="h5">
                    {props.title}
                </Typography>
            </CardContent>
            <CardActions>
                <Button component={RouterLink} to={'/vote/' + props.pollId}>
                    Vote
                </Button>
                <Button component={RouterLink} to={'/view/' + props.pollId}>
                    View
                </Button>
                <IconButton edge="end" onClick={() => setWip(true)}>
                    <Delete/>
                </IconButton>

            </CardActions>
            <WipAlert open={wip} setOpen={setWip}/>
        </Card>
    )
}


function Home(props){

    let [polls, setPolls] = useState([])

    useEffect(()=> {
        let pollsList = [];
        const pollQuery = new Parse.Query(Poll).ascending("updatedAt");
        pollQuery.find().then( (res) =>{
            for (let i = 0; i < res.length; i++){
                const poll = res[i];
                pollsList.push({id: poll.id, title: poll.get("title")})
            }
            setPolls(pollsList);
            }
        ).catch(console.error)
    }, [])
    return(
        <Grid container spacing={2}>
            {polls.map(poll =>
                <Grid key={poll.id} item spacing={2}>
                    <PollCard title={poll.title} pollId={poll.id}/>
                </Grid>)}
        </Grid>)
}


export default Home;