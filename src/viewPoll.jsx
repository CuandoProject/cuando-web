import React, {useEffect, useState} from "react";
import {Calendar, momentLocalizer} from "react-big-calendar";
import {
    NavLink,
    useHistory,
    useParams
} from "react-router-dom";

import {Button} from "@material-ui/core";

import moment from "moment";
const localizer = momentLocalizer(moment);

import {Parse, Poll, Event} from "./parse_data";

import {useEventListTitle} from "./utils"

function viewPoll(props){

    let {pollId} = useParams();
    let res = useEventListTitle(pollId);
    let events = res.events;
    let title = res.title;

    let [message, setMessage] = useState('See where people have voted');

    return (
        <div className='demo-app-main'>
            <div className='demo-app-sidebar'>
                <div className='demo-app-sidebar-section'>
                    <h1>View Results for {title}</h1>
                </div>
                <div className='demo-app-sidebar-section'>
                    {message}
                </div>
            </div>
            <div>
                <Calendar
                    localizer={localizer}
                    events={events}
                    views={['week']}
                    defaultView='week'
                    step={60} //hardcoded for now TODO put in db
                    timeslots={1}
                    style={{height: "75vh"}}
                    eventPropGetter={viewEventProps}
                />
            </div>
        </div>
    )
}


function viewEventProps(event) {
    return {
        className: event.nAvailable > 0 ? "available": "not-available"
    }
}

export default viewPoll;