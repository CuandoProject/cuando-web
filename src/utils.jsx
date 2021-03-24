import {Event, Parse, Poll} from "./parse_data";
import {useEffect, useState} from "react";

async function fetchEvents(pollId) {
    let poll = await new Parse.Query(Poll).equalTo("id", pollId).find();
    let events = await new Parse.Query(Event).equalTo("poll", poll).find();
    return {poll: poll, events: events};
}

function toCalEvents(events){
    return events.map((ev) => {
        let nAvailable = ev.get("available") | 0
        return {
            start: ev.start,
            end: ev.end,
            title: "Available: " + nAvailable,
            nAvailable: nAvailable,
            event: ev // Parse event used of update. Maybe need to use the id instead?
        }
    })
}

export function useEventListTitle(pollId){
    let [events, setEvents] = useState([]);
    let [title, setTitle] = useState("");
    useEffect( () => { async function fetchData() {
        const [poll, events] = await fetchEvents(pollId);
        setTitle(poll.get("title"))
        const calEvents = toCalEvents(events)
        setEvents(calEvents);
    }
    fetchData();
    }, [])

    return {title:title, events:events}
}

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