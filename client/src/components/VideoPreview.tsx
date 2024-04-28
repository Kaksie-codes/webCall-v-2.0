import { RoomContext } from "@/context/roomcontext/RoomContext";
import { UserContext } from "@/context/usercontext/UserContext";
import { useContext, useEffect, useRef, useState } from "react";
import { BiSolidMicrophoneOff } from "react-icons/bi";
import { FaMicrophone } from "react-icons/fa";
import { IoVideocamOffOutline, IoVideocamOutline } from "react-icons/io5";

const VideoPreview  = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { stream,toggleAudio, toggleVideo,  audioEnabled, videoEnabled, } = useContext(RoomContext);
  const { userState: { userInfo: {profileImg}} } = useContext(UserContext);
  

  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream;   
  }, [stream, audioEnabled, videoEnabled]);


 return (
    <div className="w-full">
      <div className="h-[270px] lg:h-[300px] lg:w-[500px] w-[90%] relative rounded-lg overflow-hidden  mx-auto">        
        <video  ref={videoRef} autoPlay className="w-full h-full object-cover rounded-lg"/>          
        <div className={`w-full h-full absolute top-0 left-0 border border-blue-1 rounded-lg object-cover  place-items-center ${!videoEnabled ? 'grid' : 'hidden'}`}>
          <img src={profileImg} alt="" className="w-20 h-20 rounded-full" />
        </div> 
        <div className="w-full flex items-center justify-center gap-4 absolute bottom-3 rounded-lg">
          <button onClick={toggleVideo}>
          {
            videoEnabled ? (
              <div className="p-[10px] rounded-full text-red bg-transparent border border-red cursor-pointer">
                <IoVideocamOutline size={30}/>
              </div>
              ) : (
                <div className="p-[10px] text-white rounded-full bg-transparent border border-white cursor-pointer">
                  <IoVideocamOffOutline size={30}/>
                </div>
              )
          }
          </button>
          <button onClick={toggleAudio}>
          {
            audioEnabled ? (
              <div className="p-3 text-red rounded-full border border-red cursor-pointer">
                <FaMicrophone size={25}/>
              </div>
              ) : (
              <div className="p-3 rounded-full border border-white  cursor-pointer">
                <BiSolidMicrophoneOff size={25}/>
              </div>
              )
            }
          </button>
        </div>
      </div>      
    </div>
  )
}

export default VideoPreview