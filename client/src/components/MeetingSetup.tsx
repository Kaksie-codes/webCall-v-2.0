import { useContext, useState } from "react";
import { Button } from "./ui/button";
import Alert from "./Alert";

import VideoPreview from "./VideoPreview";


const MeetingSetup = () => {
  
  const [isMicCamToggled, setIsMicCamToggled] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const callHasEnded = false;
  const callTimeNotArrived = false;
  const callStartsAt = "12:30:AM";  


  if (callTimeNotArrived)
    return (
      <Alert
        title={`Your Meeting has not started yet. It is scheduled for ${callStartsAt.toLocaleString()}`}
      />
    );

  if (callHasEnded)
    return (
      <Alert
        title="The call has been ended by the host"
        iconUrl="/icons/call-ended.svg"
      />
    );

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-white ">       
      <div className="flex items-center flex-col justify-center gap-4 ">
        <h1 className="text-center text-2xl font-bold">Call Setup</h1> 
        <VideoPreview/>                 
        <Button
            className="rounded-md bg-green-500 px-4 py-2.5 lg:px-8 mt-2"
            onClick={() => {
              // call.join();
              setIsSetupComplete(true);
            }}
        >
            Join meeting
        </Button>
      </div>
    </div>
  )
}

export default MeetingSetup