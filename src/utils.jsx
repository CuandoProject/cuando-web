import {Event, Parse, Poll, userContext} from "./data";
import React, {createContext, useContext, useEffect, useState} from "react";
import {Paper, Snackbar} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import {v1 as uuid} from "uuid"


async function fetchEvents(poll) {
    let eventsQuery = new Parse.Query(Event);
    return await eventsQuery.equalTo("poll", poll).find();
}

async function fetchPoll(pollId){
    const pollQuery = new Parse.Query(Poll);
    const polls = await pollQuery.equalTo("objectId", pollId).find();
    return polls[0];
}

function toCalEvents(events){
    return events.map((ev) => {
        let nAvailable = ev.get("nAvailable") | 0
        return {
            start: ev.get("start"),
            end: ev.get("end"),
            title: "Available: " + nAvailable,
            nAvailable: nAvailable,
            event: ev // Parse event used of update. Maybe need to use the id instead?
        }
    })
}

export async function getUser(){
    let user = Parse.User.current();
    if (user === undefined){ // no users logged in so must be anonymous
        let authData = {
            "authData": {
                "id": uuid()
            }
        };
        user = new Parse.User();
        user = user.linkWith("anonymous", authData)
        user.set('name', "Anonymous User")
    }

    return(user)

}

export function ShowUserName(props){
    const {user, _} = useContext(userContext);
    const userName = user ? user.get("name"): "None"
    return(
        <footer>
            The current logged in user is:
            {userName}
        </footer>
    )
}

export const alertContext = createContext(function (){})

export function WipAlert(props){
    return(<Snackbar open={props.open} autoHideDuration={3000} onClose={() => props.setOpen(false)}>
        <MuiAlert elevation={6} variant="filled" severity="warning">
            The feature is not implemented yet!
        </MuiAlert>
    </Snackbar>)
}

export function useEventListTitle(pollId){
    let [title, setTitle] = useState("");
    let [events, setEvents] = useState([]);
    useEffect( () => { async function fetchData() {
        const poll = await fetchPoll(pollId);
        if (!poll) {//poll does not exist
            setTitle(null);
            setEvents(null); // signal that there is no data. consider to use a proper nullable type here.
            return;
        }
        const events = await fetchEvents(poll);
        setTitle(poll.get("title"));
        const calEvents = toCalEvents(events);
        setEvents(calEvents);
    }
    fetchData();
    }, [])

    return {title, setTitle, events, setEvents};
}


export function deserializeEvents(events) {
    return events.map(
        (ev) => {
            return {
                start: new Date(ev.start),
                end: new Date(ev.end),
                available: ev.available
            }
        }
    )
}