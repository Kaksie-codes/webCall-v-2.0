import MeetingRoom from "@/components/MeetingRoom";
import MeetingSetup from "@/components/MeetingSetup";
import { useState } from "react";
import { useParams } from "react-router-dom";


const RoomPage = () => {
  const { roomId } = useParams(); 
  const [isSetUpComplete, setIsSetupComplete] = useState<boolean>(false);

  return (
    <main className="h-screen w-full">
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