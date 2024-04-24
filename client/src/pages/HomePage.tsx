import MeetingTypeList from "@/components/MeetingTypeList";
import HomeLayout from "@/components/layouts/HomeLayout"
import { useEffect, useState } from "react";


const HomePage = () => {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  // Function to update time and date
  const updateTimeAndDate = () => {
    const now = new Date();
    const newTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newDate = (new Intl.DateTimeFormat('en-US', { dateStyle: 'full' })).format(now);
    setTime(newTime);
    setDate(newDate);
  };

  useEffect(() => {
    // Call updateTimeAndDate initially
    updateTimeAndDate();

    // Set up interval to call updateTimeAndDate every 1 seconds
    const intervalId = setInterval(updateTimeAndDate, 1000);

    // Clean up function to clear interval when component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this effect runs only once, on mount


 
  // max-md:px-5 max-md:py-8 lg:p-11
  return (
    <HomeLayout>
      <section className="text-white flex size-full flex-col gap-10">
      <div className="h-[303px] w-full rounded-[20px] bg-hero bg-cover">
        <div className="flex h-full flex-col justify-between p-6 ">
          <h2 className="glassmorphism max-w-[273px] rounded py-2 text-center text-base font-normal">
            Upcoming Meeting at: 12:30 PM
          </h2>
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-extrabold lg:text-7xl">{time}</h1>
            <p className="text-lg font-medium text-sky-1 lg:text-2xl">{date}</p>
          </div>
        </div>
      </div>
        <MeetingTypeList/>
      </section>
    </HomeLayout>
  )
}

export default HomePage