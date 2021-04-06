import React, {useEffect, useState} from "react";
import {Calendar, momentLocalizer} from "react-big-calendar";
import {
    NavLink,
    useHistory,
    useParams
} from "react-router-dom";

import {Button} from "@material-ui/core";

import moment from "moment";
import {Parse, Poll, Event} from "./data";
import {useEventListTitle} from "./utils";

const localizer = momentLocalizer(moment);

function ViewPoll(props){

    let {pollId} = useParams();

    let {title, setTitle, events, setEvents} = useEventListTitle(pollId);

    let [message, setMessage] = useState('See where people have voted');

    if (title == null){
        return <div> Error 404 no poll found </div>
    }
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

export default ViewPoll;