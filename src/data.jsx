import {createContext} from "react";

export const Parse = require('parse');
Parse.initialize("cuando", );

Parse.serverURL = 'https://parse.cuando.mone27.net/parse';


export const Poll = Parse.Object.extend("Poll");

export const Event = Parse.Object.extend("Event");

export const userContext = createContext({
    user: undefined,
    setUser: undefined,
})




