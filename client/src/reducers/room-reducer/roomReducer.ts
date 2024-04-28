// import Peer from "peerjs";
import { ROOM_ACTIONS } from "./roomActions";

export interface Message {
    content: string;
    author?: string;
    timestamp:number;
}

export type ChatState = {
    messages: Message[];
    isChatOpen:boolean;
};

interface InitialRoomState {
    chat: ChatState;
    peers: Record<string, { stream: MediaStream }>; // Change the type of peerId to string
}

export const INITIAL_ROOM_STATE: InitialRoomState = {
    peers: {}, // Initialize peerId as an empty string or with the correct structure
    chat: {
        messages: [],
        isChatOpen: false
    }
};

// // typecript type for our state
// export type PeerState = Record<string, { stream: MediaStream }>;

// Define the action types
export type RoomAction =
    | {
          type: typeof ROOM_ACTIONS.ADD_PEER_STREAM;
          payload: { peerId: string; stream: MediaStream };
      }
    | {
          type: typeof ROOM_ACTIONS.REMOVE_PEER;
          payload: { peerId: string }; 
      }
    | {
          type: typeof ROOM_ACTIONS.SET_PEER_NAME;
          payload: { peerId: string, username:string };
      }
    | { 
          type: typeof ROOM_ACTIONS.ADD_MESSAGE;
          payload: { message:Message };
      }
    | {
          type: typeof ROOM_ACTIONS.ADD_HISTORY;
          payload: { history: Message[] };
      } 
    | {
          type: typeof ROOM_ACTIONS.TOGGLE_CHAT_VISIBILITY;
          payload: { isOpen: boolean };
      }
// typecript type for our state
export type PeerState = Record<string, { stream: MediaStream }>;

// Define the reducer function for managing the state of peers
export const roomReducer = (state: InitialRoomState, action: RoomAction) => {
    switch (action.type) {
        case ROOM_ACTIONS.ADD_PEER_STREAM:
            return {
                ...state,
                [action.payload.peerId]: {
                    stream: action.payload.stream,
                },
            };
        case ROOM_ACTIONS.REMOVE_PEER:
            // Create a copy of the peers object without the peer to be removed
            const updatedPeers = { ...state.peers };
            delete updatedPeers[action.payload.peerId]; // Remove peer with given peerId
            // Return state with updated peers object
            return {
                 ...state,
                peers: updatedPeers
            };         
        case ROOM_ACTIONS.ADD_MESSAGE:
            return {
                ...state,
                chat: {
                    ...state.chat,
                    messages: [...state.chat.messages, action.payload.message]
                }
            };
        case ROOM_ACTIONS.ADD_HISTORY:
            return {
                ...state,
                chat: {
                    ...state.chat,
                    messages: action.payload.history
                }
            };
        case ROOM_ACTIONS.TOGGLE_CHAT_VISIBILITY:
            return {
                ...state,
                isChatOpen: action.payload.isOpen
            }
        default: 
            return { ... state };
    }
};
