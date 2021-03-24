import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {Parse, Poll} from "./parse_data";

function Home(props){

    let [polls, setPolls] = useState([])

    useEffect(()=> {
        let pollsList = [];
        const pollQuery = new Parse.Query(Poll).ascending("updatedAt");
        pollQuery.find().then( (res) =>{
            for (let i = 0; i < res.length; i++){
                const poll = res[i];
                pollsList.push({key: poll.id, title: poll.get("title")})
            }
            setPolls(pollsList);
            }
        ).catch(console.error)
    }, [])

    console.log(polls)
    return(
        <div className='home'>
            Select a poll
            <ul>
                {polls.map(poll =>
                    <li key={poll.key}>{poll.title}&nbsp;
                        <Link to={'/vote/' + poll.key}>Vote</Link>&nbsp;
                        <Link to={'/view/' + poll.key}>View Results</Link></li>)}
            </ul>
        </div>)
}


export default Home;