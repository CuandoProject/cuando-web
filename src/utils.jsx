import {Event, Parse, Poll} from "./parse_data";
import React, {useEffect, useState} from "react";
import {Snackbar} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

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
            setEvents(null); // signal that there is no data. Think to use a proper nullable type here.
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
//
// export usePoll(pollId){
//     let [title, setTitle] = useState("");
//     useEffect( () => { async function fetchData() {
//         const poll = await fetchPoll(pollId);
//         if (!poll) {//poll does not exist
//             return
//         }
//         const events = await fetchEvents(poll);
//         setTitle(poll.get("title"));
//         const calEvents = toCalEvents(events);
//         setEvents(calEvents);
//     }
//         fetchData();
//     }, [])
//
//     return [title, events];
// }
//
// export function useEventList(poll){
//     let [events, setEvents] = useState([]);
//     useEffect( () => { async function fetchData() {
//         const events = await fetchEvents(poll);
//         const calEvents = toCalEvents(events);
//         setEvents(calEvents);
//     }
//     fetchData();
//     }, [])
//
//     return [events,setEvents];
// }
// functions to serialize to intenger instead of date object
export  function serializeNewEvents(events) {
    return events.map(
        (ev) => {
            return {
                start: ev.start.getTime(),
                end: ev.end.getTime(),
                available: [] //initalize to empty
            }
        }
    )
}

export  function serializeSelectableEvents(events) {
    return events.map(
        (ev) => {
            return {
                start: ev.start.getTime(),
                end: ev.end.getTime(),
                available: ev.available,
                selected: ev.selected,
            }
        }
    )
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