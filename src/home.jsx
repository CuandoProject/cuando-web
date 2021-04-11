import React, {useContext, useEffect, useState} from "react";
import {Link as RouterLink} from 'react-router-dom';
import {Parse, Poll, userContext} from "./data";
import {Button, Card, CardActions, CardContent, Grid, Typography} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import {Delete} from "@material-ui/icons";


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

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}


function Home(props){
    const {user, setUser} = useContext(userContext);
    let [polls, setPolls] = useState([])

    useEffect(() => {
        if (!user) return; // stop running if the user is not available yet
        ( async function getPolls() {try{
            const ownedPolls = user.get("ownedPolls")
            const pollsList = await Promise.all(ownedPolls.map(async (pollId) => {
                // This needs to be redifined for each query otherwise it doesn't change on new get calls
                const pollQuery = new Parse.Query(Poll)
                const title = (await pollQuery.get(pollId)).get("title")
                return {id: pollId, title: title};
            }))
            setPolls(pollsList)
        }
        catch (err) {console.error(err)}
    }) () }, [user])
    return(
        <Grid container spacing={2}>
            {polls.map(poll =>
                <Grid key={poll.id} item>
                    <PollCard title={poll.title} pollId={poll.id}/>
                </Grid>)}
        </Grid>)
}


export default Home;