import { CallLayoutType } from "./MeetingRoom";
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger, } from "./ui/dropdown-menu";
import { LayoutList } from "lucide-react";

const ChangeOrientation = ({setLayout}: {setLayout:any}) => {
  return (
    <DropdownMenu>
    <div className="flex items-center">
      <DropdownMenuTrigger className="cursor-pointer rounded-full bg-[#19232d] p-[10px] hover:bg-[#4c535b]  ">
        <LayoutList size={30} className="text-white" />
      </DropdownMenuTrigger>
    </div>
    <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
      {['Grid', 'Speaker-Left', 'Speaker-Right'].map((item, index) => (
        <div key={index}>
          <DropdownMenuItem
            onClick={() =>
              setLayout(item.toLowerCase() as CallLayoutType)
            }
          >
            {item}
          </DropdownMenuItem>
          <DropdownMenuSeparator className="border-dark-1" />
        </div>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
  )
}

export default ChangeOrientation