import { ReactNode, createContext, useEffect, useState, useReducer, useContext } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import SocketIOClient from 'socket.io-client'; 
import Peer from 'peerjs'; 
import { UserContext } from '../usercontext/UserContext';
import { INITIAL_ROOM_STATE, Message, roomReducer } from '@/reducers/room-reducer/roomReducer';
import { addHistoryAction, addMessageAction, addPeerNameAction, addPeerStreamAction, removePeerAction, toggleChatAction } from '@/reducers/room-reducer/roomActions';


const webSocketServer = 'http://localhost:8080'; 

interface RoomProviderProps {
    children: ReactNode; 
}

export const RoomContext = createContext<null | any>(null); 

const webSocketClient = SocketIOClient(webSocketServer); 

export const RoomProvider = ({ children }: RoomProviderProps) => {
    const { userState } = useContext(UserContext);    
    const {userInfo: {username, userId}} = userState
    const navigate = useNavigate();
    const [me, setMe] = useState<Peer | null>(null); 
    const [stream, setStream] = useState<MediaStream | null>(null);    
    const [roomState, roomDispatch] = useReducer(roomReducer, INITIAL_ROOM_STATE); 
    
    const [screenSharingId, setScreenSharingId] = useState<string>('');
    const [roomId, setRoomId] = useState<string>("")

    const enterRoom = ({ roomId }: { roomId: string }) => { 
        navigate(`/room/${roomId}`); 
    };

    const getRoomies = ({ participants }: { participants: string[] }) => {
        console.log({ participants });
    }

    const removePeer = (peerId:string) => {
        roomDispatch(removePeerAction(peerId));
    }   
    
    const shareScreen = () => {
        if(screenSharingId){
            navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(switchStream)
        }else{
            navigator.mediaDevices.getDisplayMedia({}) // Request only video for screen sharing
            .then(switchStream)
            .catch((error) => {
                console.error('Error accessing screen sharing stream:', error);                
            });
        }            
    };

    const switchStream = (stream: MediaStream) => {
        setStream(stream);
        setScreenSharingId(me?.id || "");         
        Object.values(me?.connections).forEach(((connection:any) => {
            const videoTrack = stream?.getTracks().find(track => track.kind === 'video');
            connection[0].peerConnection.getSenders()[1].replaceTrack(videoTrack)
            .catch((err:any) => console.log(err))
        }))
    }

    const sendMessage = (message:string) => {
        const messageData:Message = {
            content: message,
            author: me?.id,
            timestamp: new Date().getTime()
        }
        webSocketClient.emit('create-message', roomId, messageData);
    }

    const addMessage = (message:Message) => {
        console.log('message recieved')
        console.log({message})
        roomDispatch(addMessageAction(message))
    }

    const addHistory = (messages:Message[]) => {
        roomDispatch(addHistoryAction(messages));
    }
    
    const toggleChatVisibility = () => {
        roomDispatch(toggleChatAction(!roomState.chat.isChatOpen));        
    }

    

    useEffect(() => { 
        const peer = new Peer(userId);
        setMe(peer);
   }, [])

   useEffect(() => {   
    if(me !== null){
        try {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                setStream(stream);

                me.on("call", (call) => {
                    const {username} = call.metadata;
                    roomDispatch(addPeerNameAction(call.peer, username));
                    console.log(`receiving call from peer already in the room ------>>`, call)
                    call.answer(stream);
                    call.on('stream', (peerStream) => {
                        roomDispatch(addPeerStreamAction(call.peer, peerStream));
                    })
                })

                webSocketClient.on("user-joined", ({ peerId }) => {
                    console.log('new user joined ---->>', peerId);
                    const call = me.call(peerId, stream, {
                        metadata:{
                            username,
                        }
                    });
                    call.on("stream", (peerStream) => {
                        console.log('calling the new peer --->>', peerStream);
                        roomDispatch(addPeerStreamAction(peerId, peerStream)); 
                    })
                })                    
            })
        } catch(error) {
            console.log(error);
        }

    webSocketClient.on('room-created', enterRoom); 
    webSocketClient.on('get-roomies', getRoomies); 
    webSocketClient.on("user-disconnected", removePeer);         
    webSocketClient.on("user-started-sharing", (peerId) => setScreenSharingId(peerId)); 
    webSocketClient.on("user-stopped-sharing", () => setScreenSharingId("")); 
    webSocketClient.on("message-created", addMessage); 
    webSocketClient.on("get-messages", addHistory); 

    // me.on('open', (id) => {
    //     console.log('My peer ID is: ' + id);
    //     webSocketClient.emit('join-room', { roomId, peerId: id }); 
    // });

    // Cleanup function to disconnect WebSocket client and destroy PeerJS instance when component unmounts
    return () => {
        webSocketClient.disconnect();
        me.destroy();
    };
    } 
}, [me, webSocketClient, username]);    

useEffect(() => {
    if(screenSharingId){
        webSocketClient.emit("start-sharing", { peerId:screenSharingId, roomId});
    }else{
        webSocketClient.emit("stop-sharing");
    }        
}, [screenSharingId, roomId])    

    const contextValues = {
        me,
        stream,
        roomState,
        webSocketClient,
        setRoomId,
        sendMessage,
        shareScreen,        
        toggleChatVisibility,
    }

    return (
        <RoomContext.Provider value={contextValues}> 
            {children}
        </RoomContext.Provider>
    );
}
