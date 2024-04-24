import { Message } from "./roomReducer";

export const ROOM_ACTIONS = {
    SET_PEER_NAME: "SET_PEER_NAME",
    REMOVE_PEER: "REMOVE_PEER",
    ADD_PEER_STREAM: "ADD_PEER_STREAM",
    ADD_MESSAGE : "ADD_MESSAGE",
    ADD_HISTORY: "ADD_HISTORY",
    TOGGLE_CHAT_VISIBILITY: "TOGGLE_CHAT_VISIBILITY"
} as const; 


// Define an action creator function for adding a peer
export const addPeerStreamAction = (peerId: string, stream:MediaStream) => ({
    type: ROOM_ACTIONS.ADD_PEER_STREAM, 
    payload:{ peerId, stream }
})

// Define an action creator function for adding a peer
export const addPeerNameAction = (peerId: string, username:string) => ({
    type: ROOM_ACTIONS.SET_PEER_NAME,
    payload:{ peerId, username } 
})

// Define an action creator function for removing a peer
export const removePeerAction = (peerId: string) => ({
    type: ROOM_ACTIONS.REMOVE_PEER,
    payload:{ peerId }
})  

export const addMessageAction = (message:Message) => ({
    type: ROOM_ACTIONS.ADD_MESSAGE, // Action type for adding a message
    payload:{ message } // Payload containing the message
})

export const addHistoryAction = (history: Message[]) => ({
    type: ROOM_ACTIONS.ADD_HISTORY,
    payload: { history } // Payload contains the array of messages
});


export const toggleChatAction = (isOpen:boolean) => ({
    type: ROOM_ACTIONS.TOGGLE_CHAT_VISIBILITY,
    payload:{ isOpen }
})