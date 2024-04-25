import { MdOutlineScreenShare } from "react-icons/md";
import { FaMicrophone } from "react-icons/fa";
import { BsRecordCircle } from "react-icons/bs";
import { BiSolidMicrophoneOff } from "react-icons/bi";
import { IoVideocamOutline, IoVideocamOffOutline } from "react-icons/io5";
import { AiOutlineMessage } from "react-icons/ai";
import { useEffect, useState } from "react";
import EndCallButton from "./EndCallButton";
import ChangeOrientation from "./ChangeOrientation";
import { Users } from "lucide-react";

const CallControls = ({onLeave, setLayout, setShowParticipants}: {onLeave:() => void, setLayout:any, setShowParticipants:any}) => {
    const [audio, setAudio] = useState(false);
    const [video, setVideo] = useState(false);
    const [viewChats, setViewChats] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isSharingScreen, setIsSharingScreen] = useState(false);
    const [recordTime, setRecordTime] = useState<number>(0);

    // Function to format time to HH:MM:SS
    const formatTime = (timeInSeconds: number): string => {
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = timeInSeconds % 60;

        return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    };

    useEffect(() => {
        let timerId: NodeJS.Timeout | undefined = undefined;

        // Reset timer if recording stops
        if (!isRecording) {
            setRecordTime(0);
        }

        // Start or stop the timer based on isRecording state
        if (isRecording) {
            timerId = setInterval(() => {
                setRecordTime(prevTime => prevTime + 1);
            }, 1000);
        } else if (timerId) {
            clearInterval(timerId);
        }

        // Cleanup function to clear the interval when component unmounts or isRecording changes
        return () => {
            if (timerId) {
                clearInterval(timerId);
            }
        };
    }, [isRecording]);

  return (
    <div className="flex items-center justify-center  gap-2">  
        <div onClick={() => setIsRecording(!isRecording)} className="cursor-pointer">
            {
                isRecording ? (
                    <div className="text-red p-3 rounded-3xl flex items-center bg-dark-1  gap-3 justify-center">
                        <BsRecordCircle size={30} />
                        <p>{formatTime(recordTime)}</p>
                    </div>
                ) : (
                    <div className="text-white p-3 rounded-full flex items-center bg-dark-1  gap-1 justify-center">
                        <BsRecordCircle size={30}/>
                    </div>
                )
            }
        </div> 
        <div onClick={() => setAudio(!audio)}>
            {
                audio ? (
                    <div className="p-3 text-red rounded-full bg-dark-1 cursor-pointer">
                        <FaMicrophone size={25}/>
                    </div>
                ) : (
                    <div className="p-3 rounded-full bg-dark-1 cursor-pointer">
                        <BiSolidMicrophoneOff size={25}/>
                    </div>
                )
            }
        </div> 
        <div onClick={() => setVideo(!video)}>
            {
                video ? (
                    <div className="p-[10px] rounded-full bg-dark-1  cursor-pointer">
                        <IoVideocamOutline size={30}/>
                    </div>
                ) : (
                    <div className="p-[10px] text-red rounded-full bg-dark-1 cursor-pointer">
                        <IoVideocamOffOutline size={30}/>
                    </div>
                )
            }
        </div>
        <div onClick={() => setIsSharingScreen(!isSharingScreen)}>
            {
                isSharingScreen ? (
                    <div className="p-[10px] rounded-full bg-dark-1  cursor-pointer">
                        <MdOutlineScreenShare size={30}/>
                    </div>
                ) : (
                    <div className="p-[10px] text-red rounded-full bg-dark-1 cursor-pointer">
                        <MdOutlineScreenShare size={30}/>
                    </div>
                )
            }
        </div>
        <EndCallButton/>
        <ChangeOrientation setLayout={setLayout}/>
        <button onClick={() => setShowParticipants((prev:boolean) => !prev)}>
          <div className=" cursor-pointer rounded-full bg-[#19232d] p-[10px] hover:bg-[#4c535b]  ">
            <Users size={30} className="text-white" />
          </div>
        </button>  
        <div onClick={() => setViewChats(!viewChats)}>
            {
                viewChats ? (
                    <div className="p-3 text-red rounded-full bg-dark-1 cursor-pointer">
                        <AiOutlineMessage size={25}/>
                    </div>
                ) : (
                    <div className="p-3 rounded-full bg-dark-1 cursor-pointer">
                        <AiOutlineMessage size={25}/>
                    </div>
                )
            }
        </div> 
    </div>
  )
}

export default CallControls