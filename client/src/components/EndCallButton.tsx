import { MdCallEnd } from "react-icons/md";

const EndCallButton = () => {
  return (
    <div className="p-3 rounded-full bg-red cursor-pointer">
      <MdCallEnd size={40}/>
    </div>
  )
}

export default EndCallButton