import { useEffect, useState} from 'react'
import React from 'react'
import { Calendar, momentLocalizer} from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'


import {BrowserRouter, Route, NavLink, Switch, Link, useHistory} from "react-router-dom";

import SignInScreen from "./account";
import CreatePoll from "./createPoll";
import VotePoll from "./votePoll";
import ViewPoll from "./viewPoll";
import Home from "./home"

const localizer = momentLocalizer(moment)

Array.prototype.uniqueEvents = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i].start.getTime() === a[j].start.getTime())
                a.splice(j--, 1);
        }
    }

    return a;
};

function App(props) {
        return (
        <BrowserRouter>
            <header className="header">
                <NavLink to="/">Home</NavLink>
                <div className='header-right'>
                    <NavLink to="/create">Create Poll</NavLink>
                    <NavLink to="/login">Account</NavLink>
                </div>
            </header>
            <Switch>
                <Route path="/create" component={CreatePoll} />
                <Route path="/vote/:pollId" component={VotePoll} />
                <Route path="/view/:pollId" component={ViewPoll} />
                <Route path="/login/:redirect?" component={SignInScreen}/>
                <Route path="/" component={<Home/>} />
                <Route render={() => <h1>404: page not found</h1>} />
            </Switch>
        </BrowserRouter>
        )
}

export default App
