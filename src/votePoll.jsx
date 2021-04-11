import {useState} from "react";
import {Calendar, momentLocalizer} from "react-big-calendar";
import {useHistory, useParams} from "react-router-dom";

import {Button} from "@material-ui/core";

import moment from "moment";

import {toCalEvents, useEventListTitle} from "./utils";


const localizer = momentLocalizer(moment);

function updateEventSelection(ev){
    ev.selected = !ev.selected;
    return ev
}


function VotePoll(){
    let [message, setMessage] = useState('')
    let {pollId} = useParams();
    let history = useHistory();

    let {title, setTitle, events, setEvents} = useEventListTitle(pollId);

    // const notLoggedInMessage = <span style={{color: "red"}}>
    //     You need to be logged in to submit your vote <NavLink to="/login"> Login </NavLink></span>

    function onSelect(selection) {
        selection.slots.pop() // last slot in selection is not visually selected, so drop it
        setEvents((events) => {
            return events.map((ev) => {
                for (let slot of selection.slots) {
                    if (slot.getTime() === ev.start.getTime()) {
                        return updateEventSelection(ev)
                    }
                }
                return ev
            })
        })
    }

    function onSelectEvent(selEvent){
        setEvents((events) => {
            return events.map( (ev) => {
                if (selEvent.start.getTime() === ev.start.getTime()) {
                    return updateEventSelection(ev);
                }
                return ev
            })
        })
    }

    function submitPoll(){

        events.map((ev) =>{
            if (ev.selected){
                ev.event.increment("nAvailable");
                ev.event.save().catch(console.error);
            }
        })

        alert("Your vote has been successfully submitted");
        history.push('/view/'+pollId)

    }

    return (
            <div className='demo-app-main'>
                <div className='demo-app-sidebar'>
                    <div className='demo-app-sidebar-section'>
                        <h1>Vote for {title}</h1>
                    </div>
                    <div className='demo-app-sidebar-section'>
                        {message}
                    </div>
                    <div className='demo-app-sidebar-section'>
                        <Button onClick={submitPoll} variant="contained" color="primary" >Submit Your vote</Button>
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
                        selectable={true}
                        onSelectSlot={onSelect}
                        onSelectEvent={onSelectEvent}
                        titleAccessor={() => ""}
                        eventPropGetter={selectableEventProps}
                    />
                </div>
        </div>
    )
}


function selectableEventProps(event) {
    if (event.selected) {
        return {className: 'event-selected'}
    }
    else {
        return {}
    }
}

export default VotePoll;