import { ReactNode } from "react"
import Navbar from "../Navbar"
import Sidebar from "../Sidebar"


const HomeLayout = ({children} : { children:ReactNode}) => {
  return (
    <main className="relative">
        <Navbar/>
        <div className="flex bg-dark-2 w-full">
            <Sidebar/>
            <section className="flex min-h-screen w-full  max-w-[1500px] mx-auto flex-col px-6 pb-6 pt-28 max-md:pb-14 sm:px-14">
                <div className="w-full">
                    {children}
                </div>
            </section>
        </div>        
    </main>
  )
}

export default HomeLayout