import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CallControls from "./CallControls";
import CallParticipantsList from "./CallParticipantsList";
import CallLayout from "./CallLayout";

export type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right';

const MeetingRoom = () => {
  const navigate = useNavigate();
  const [layout, setLayout] = useState<CallLayoutType>('speaker-left');
  const [showParticipants, setShowParticipants] = useState(false);
 
return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      <div className="relative flex size-full items-center justify-center">
        <div className=" flex size-full max-w-[1000px] items-center">
          <CallLayout layout={layout}/>
        </div>
        <div className={cn('h-[calc(100vh-86px)] hidden ml-2', {
            'show-block': showParticipants,
          })}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>
      
      <div className="fixed bottom-0 flex w-full items-center py-2 justify-center gap-5">
        <CallControls onLeave={() => navigate(`/`)} setLayout={setLayout} setShowParticipants={setShowParticipants}/>         
      </div>
    </section>
  )
}

export default MeetingRoom