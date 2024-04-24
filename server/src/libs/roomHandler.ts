import { Server, Socket } from "socket.io";
import { v4 as uuidV4 } from "uuid";


// Defining an interface for the parameters required to create or join a room
interface RoomParams {
    roomId: string,
    peerId: string,
}

interface JoinRoomParams extends RoomParams {
    username:string;
}

interface Message {
    content: string;
    author?: string;
    timestamp:number;
}

interface User {
    peerId:string;
    username: string;
}

// Defining a record to store room IDs as keys and arrays of participant IDs as values
const rooms: Record<string, Record<string, User>> = {}


const chats: Record<string, Message[]> = {}

// Defining the roomHandler function to handle socket events related to rooms
export const roomHandler = (socket: Socket, io:Server) => {
    // Defining a function to create a new room
    const createRoom = (username:string) => {
        // Generating a new UUID as the room ID
        const roomId = uuidV4();

        // Initializing an empty array for the participants of the new room
        rooms[roomId] = {}

        // Emitting a 'room-created' event with the room ID to the socket
        socket.emit("room-created", { roomId });
        console.log(`A user ${username}  created a new room with roomId: ${roomId}...`);
    };

    // Defining a function to join an existing room
    const joinRoom = ({ roomId, peerId, username }: JoinRoomParams) => {
        // Checking if the room exists
        if(!rooms[roomId]) rooms[roomId] = {};

        // Checking if the chat history exists
        if(!chats[roomId]) chats[roomId] = [];

        // Logging the joining of a new user to the room
        console.log(`A new user: ${username} with peerId: ${peerId} joined the room ${roomId}`);

        // Adding the new user's ID to the participants array of the room
        rooms[roomId][peerId] = {peerId, username};

        // Joining the specified room using the socket
        socket.join(roomId);

        socket.emit("get-messages", chats[roomId]);

        // Emitting a 'user-joined' event to all participants in the room
        socket.to(roomId).emit("user-joined", { peerId, username })

        // Emitting a 'get-roomies' event to provide information about participants in the room
        socket.emit('get-roomies', {
            roomId,
            participants: rooms[roomId]
        })

        // Listening for disconnection events to handle user leaving the room
        socket.on('disconnect', () => {
            console.log(`user: ${peerId} left the room ${roomId}`);
            leaveRoom({ roomId, peerId });
        })
    };

    // Defining a function to handle a user leaving the room
    const leaveRoom = ({ peerId, roomId }: RoomParams) => {
        console.log('fucked');
        // Filtering out the user's ID from the participants array of the room
        // rooms[roomId] = rooms[roomId].filter((id) => id !== peerId);

        // Emitting a 'user-disconnected' event to notify other participants in the room
        socket.to(roomId).emit("user-disconnected", peerId)
    }

    const startSharing = ({peerId, roomId}: RoomParams) => {
        socket.to(roomId).emit("user-started-sharing", peerId);
    }

    const stopSharing = (roomId : string) => {
        socket.to(roomId).emit("user-stopped-sharing");
    }

    const addMessage = (roomId:string, message: Message) => {
        console.log({message});
        console.log({roomId});
        if(chats[roomId]){
            chats[roomId].push(message);
        }else{
            chats[roomId] = [message]
        }

        io.to(roomId).emit("message-created", message);
        // io.to(roomId).emit('createdMessage', message)
    }

    // Listening for 'create-room' event to create a new room
    socket.on('create-room', createRoom);

    // Listening for 'join-room' event to join an existing room
    socket.on('join-room', joinRoom);

    // Listening for 'stop-sharing' event to start screen sharing
    socket.on('start-sharing', startSharing);

    // Listening for 'stop-sharing' event to stop screen sharing
    socket.on('stop-sharing', stopSharing);

    // Listening for 'send-message' event to stop send message
    socket.on('create-message', addMessage);
};
