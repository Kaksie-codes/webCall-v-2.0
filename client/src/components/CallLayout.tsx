import { CallLayoutType } from "./MeetingRoom";
import PaginatedGridLayout from "./PaginatedGridLayout";
import SpeakerLayout from "./SpeakerLayout";


const CallLayout = ({layout}: {layout:CallLayoutType}) => {
    switch (layout) {
        case 'grid':
          return <PaginatedGridLayout />;
        case 'speaker-right':
          return <SpeakerLayout participantsBarPosition="left" />;
        default:
          return <SpeakerLayout participantsBarPosition="right" />;
      }
}

export default CallLayout