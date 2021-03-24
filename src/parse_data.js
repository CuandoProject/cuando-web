const Parse = require('parse');
Parse.initialize("cuando", );

Parse.serverURL = 'https://parse.cuando.mone27.net/parse';

const Poll = Parse.Object.extend("Poll");

const Event = Parse.Object.extend("Event");


export {Parse, Poll, Event}