const Parse = require('parse');
Parse.initialize("cuando", );

Parse.serverURL = 'https://parse.cuando.mone27.net/parse';

class Poll extends Parse.Object{
    constructor(title) {
        super('Poll');
        this.title = title;
    }
}
Parse.Object.registerSubclass('Poll', Poll)

// can think to store events directly into the poll
class Event extends Parse.Object{
    constructor(start, end, poll) {
        super('Event');
        this.poll = Poll;
        this.start = start;
        this.end = end;
    }

    static fromCalendarEvent(ev, poll){
        console.log(ev)
        return new Event(ev.start, ev.end, poll)
    }
}
Parse.Object.registerSubclass('Event', Event)

export {Parse, Poll, Event}