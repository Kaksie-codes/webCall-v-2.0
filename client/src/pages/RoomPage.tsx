import MeetingRoom from "@/components/MeetingRoom";
import MeetingSetup from "@/components/MeetingSetup";
import { RoomContext } from "@/context/roomcontext/RoomContext";
import { UserContext } from "@/context/usercontext/UserContext";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";


const RoomPage = () => {
  const { roomId } = useParams(); 
  const [isSetUpComplete, setIsSetupComplete] = useState<boolean>(false);
  const { 
    webSocketClient, 
    me, 
    stream, 
    peers, 
    shareScreen, 
    screenSharingId, 
    chat,    
    setRoomId, 
    toggleChatVisibility 
} = useContext(RoomContext); 

const { userState } = useContext(UserContext);    
const {userInfo: {username, userId}} = userState;


  useEffect(() => { 
    // Emitting a 'join-room' event with the roomId and current user's ID to the WebSocket client
    if(me){  
        // console.log('me on roompage ---->>', me)
        // me.on('open', (id:string) => {
        //     console.log('My peer ID is: ' + id);
        //     webSocketClient.emit('join-room', { roomId, peerId: me._id, username }); 
        // });          
        webSocketClient.emit('join-room', { roomId, peerId: me._id, username }); 
    }
    
}, [roomId, me, webSocketClient]); // Specifying roomId, me, and webSocketClient as dependencies to re-run the effect when they change

  return (
    <main className="h-screen w-full flex items-center justify-center gap-4">
      {
        isSetUpComplete ? (
          <MeetingSetup/>
        ) : (
          <MeetingRoom/>
        )
      }
    </main>
  )
}

export default RoomPage